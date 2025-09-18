import React, { useEffect, useState } from "react";
import { FaTimes, FaCrown, FaLock } from "react-icons/fa";
import SuccessPopupModel from "./SuccessPopupModel";
import { createPayment, getPlanShow } from "../Hooks/useSeller";
import { useTranslation } from "../contexts/LanguageProvider";

const PurchasePopupModel = ({ isOpen, onClose, planId, country, countryId }) => {
  const { t } = useTranslation();

  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState({
    email: "",
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    card_number: "",
    expiry_date: "", // format MM/YY
    cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [planDetails, setPlanDetails] = useState(null);
  const [loadingPlanDetails, setLoadingPlanDetails] = useState(false);
  const [planDetailsError, setPlanDetailsError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // reset when modal closed
  useEffect(() => {
    if (!isOpen) {
      setPlanDetails(null);
      setPlanDetailsError(null);
      setLoadingPlanDetails(false);
      setForm({
        email: "",
        name: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        card_number: "",
        expiry_date: "",
        cvv: "",
      });
      setErrors({});
      setShowSuccess(false);
      setSubmitError(null);
      setSubmitting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !planId) return;

    let cancelled = false;
    const fetchDetails = async () => {
      setLoadingPlanDetails(true);
      setPlanDetailsError(null);
      try {
        const res = await getPlanShow(planId, { location: country });
        let payload = res;
        if (res?.data && res.data?.data) payload = res.data.data;
        else if (res?.data && typeof res.data === "object") payload = res.data;
        if (!cancelled) setPlanDetails(payload);
      } catch (err) {
        if (!cancelled) {
          const msg = err?.message || err?.response?.data?.message || t("purchase.errors.load_plan");
          setPlanDetailsError(msg);
        }
      } finally {
        if (!cancelled) setLoadingPlanDetails(false);
      }
    };

    fetchDetails();
    return () => {
      cancelled = true;
    };
  }, [isOpen, planId, country, t]);

  if (!isOpen) return null;

  const validate = () => {
    let newErrors = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = t("purchase.errors.email") || "Invalid email";
    if (!form.name || !form.name.trim()) newErrors.name = t("purchase.errors.name") || "Name is required";
    if (!form.address || !form.address.trim()) newErrors.address = t("purchase.errors.address") || "Address required";
    if (!form.city || !form.city.trim()) newErrors.city = t("purchase.errors.city") || "City required";
    if (!form.state || !form.state.trim()) newErrors.state = t("purchase.errors.state") || "State required";
    if (!form.zip || !form.zip.trim()) newErrors.zip = t("purchase.errors.zip") || "ZIP required";

    // card fields validation (basic)
    if (!form.card_number || !/^\d{12,19}$/.test(form.card_number.replace(/\s+/g, ""))) {
      newErrors.card_number = t("purchase.errors.card_number") || "Enter a valid card number";
    }
    if (!form.expiry_date || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry_date)) {
      newErrors.expiry_date = t("purchase.errors.expiry_date") || "Expiry must be MM/YY";
    }
    if (!form.cvv || !/^\d{3,4}$/.test(form.cvv)) {
      newErrors.cvv = t("purchase.errors.cvv") || "Enter CVV";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("plan_id", planId);
      fd.append("country_id", countryId);
      fd.append("email", form.email);
      fd.append("card_holder_name", form.name);
      fd.append("card_number", form.card_number.replace(/\s+/g, ""));
      fd.append("expiry_date", form.expiry_date);
      fd.append("cvv", form.cvv);
      fd.append("address", form.address);
      fd.append("city", form.city);
      fd.append("state", form.state);
      fd.append("zip_code", form.zip);

      const response = await createPayment(fd);

      if (response?.status === "success") {
        if (response?.data?.checkout_url) {
          window.open(response.data.checkout_url, "_blank");
        }
        setShowSuccess(true);
      } else {
        const message = response?.message || "Payment creation failed";
        throw new Error(message);
      }
    } catch (err) {
      console.error("createPayment error:", err);
      setSubmitError(err.message || t("purchase.errors.payment_failed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center px-2 ">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-y-auto max-h-[90vh] scrollbar-hide">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <FaTimes size={20} />
        </button>

        <div className="p-6 space-y-6">
          <h2 className="text-lg font-semibold">
            {t("purchase.title", { plan: planDetails?.title || t("purchase.plan") })}
          </h2>

          <div className="border-2 border-orange-400 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold flex items-center gap-2 text-orange-600">
                <FaCrown />{" "}
                {planDetails?.title || (loadingPlanDetails ? t("purchase.loading_plan") : t("purchase.plan"))}
              </h3>
              {loadingPlanDetails && <div className="text-xs text-gray-500">{t("purchase.loading_plan_details")}</div>}
            </div>

            <div className="flex justify-between items-end border-b pb-3 mb-3">
              <div>
                <p className="text-3xl font-bold">{planDetails?.pricing?.price || planDetails?.price || "$47"}</p>
              </div>
              <p className="text-xs text-gray-500 text-right">
                {t("purchase.price_label", { spots: planDetails?.remaining || "152" })}
              </p>
            </div>

            {planDetailsError && <p className="text-xs text-red-500 mb-2">{planDetailsError}</p>}
            {planDetails?.features && (
              <ul className="grid grid-cols-2 gap-y-2 text-xs text-gray-700">
                {Array.isArray(planDetails.features) && planDetails.features.map((f) => <li key={f.id}>✅ {f.name}</li>)}
              </ul>
            )}
          </div>

          <div>
            <p className="font-medium mb-2">{t("purchase.payment_method")}</p>
            <div className="flex gap-3">
              <button className="flex-1 bg-black text-white rounded-md py-3 text-xs font-medium">{t("purchase.credit_card")}</button>
              <button className="flex-1 border border-gray-100 text-gray-500 rounded-md py-3 text-xs font-medium cursor-not-allowed">
                {t("purchase.paypal")}
              </button>
            </div>
          </div>

          <div className="border rounded-md p-3 text-sm text-gray-600 bg-gray-50">{t("purchase.secure_payment")}</div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder={t("purchase.email_placeholder")}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full form-input px-3 py-2 text-sm"
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}

            <input
              type="text"
              name="name"
              placeholder={t("purchase.name_placeholder")}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full form-input px-3 py-2 text-sm"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}

            <p className="text-sm font-medium mt-2 mb-1">{t("purchase.billing_address")}</p>
            <input
              type="text"
              name="address"
              placeholder={t("purchase.street_placeholder")}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full form-input px-3 py-2 text-sm"
            />
            {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}

            <div className="flex gap-3">
              <input
                type="text"
                name="city"
                placeholder={t("purchase.city_placeholder")}
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-1/2 form-input px-3 py-2 text-sm"
              />
              <input
                type="text"
                name="state"
                placeholder={t("purchase.state_placeholder")}
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-1/2 form-input px-3 py-2 text-sm"
              />
            </div>
            {(errors.city || errors.state) && <p className="text-xs text-red-500">{errors.city || errors.state}</p>}

            <input
              type="text"
              name="zip"
              placeholder={t("purchase.zip_placeholder")}
              value={form.zip}
              onChange={(e) => setForm({ ...form, zip: e.target.value })}
              className="w-full form-input px-3 py-2 text-sm"
            />
            {errors.zip && <p className="text-xs text-red-500">{errors.zip}</p>}

            <div className="mt-2">
              <p className="text-sm font-medium mb-1">{t("purchase.card_details")}</p>

              <input
                type="text"
                name="card_number"
                placeholder={ "Card Number" || "4242 4242 4242 4242"}
                value={form.card_number}
                onChange={(e) => setForm({ ...form, card_number: e.target.value })}
                className="w-full form-input px-3 py-2 text-sm mb-2"
              />
              {errors.card_number && <p className="text-xs text-red-500">{errors.card_number}</p>}

              <div className="flex gap-3">
                <input
                  type="text"
                  name="expiry_date"
                  placeholder={ "Expiry Date" || "MM/YY"}
                  value={form.expiry_date}
                  onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
                  className="w-1/2 form-input px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder={"CVV" || "123"}
                  value={form.cvv}
                  onChange={(e) => setForm({ ...form, cvv: e.target.value })}
                  className="w-1/2 form-input px-3 py-2 text-sm"
                />
              </div>
              {(errors.expiry_date || errors.cvv) && (
                <p className="text-xs text-red-500">{errors.expiry_date || errors.cvv}</p>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 gap-4">
              <button
                type="button"
                className="flex-1 px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
                onClick={onClose}
                disabled={submitting}
              >
                {t("purchase.cancel")}
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-md flex items-center justify-center"
              >
                <FaLock className="mr-3" />
                {submitting ? t("purchase.processing") : t("purchase.pay", { price: planDetails?.pricing?.price || planDetails?.price || "$47"})}
              </button>
            </div>
          </form>

          {submitError && <p className="text-xs text-red-500">{submitError}</p>}
        </div>

        <SuccessPopupModel
          isOpen={showSuccess}
          onClose={() => {
            setShowSuccess(false);
            onClose();
          }}
          memberId={planDetails?.id || "348"}
        />
      </div>
    </div>
  );
};

export default PurchasePopupModel;
