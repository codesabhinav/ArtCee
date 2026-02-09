import React, { useEffect, useState } from "react";
import { FaTimes, FaCrown, FaLock, FaTimesCircle, FaShieldAlt } from "react-icons/fa";
import SuccessPopupModel from "./SuccessPopupModel";
import { createSubscription, createPayment, getPlanShow } from "../Hooks/useSeller";
import { useTranslation } from "../contexts/LanguageProvider";
import { Crown } from "lucide-react";
import toast from "react-hot-toast";

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
    promo_code: "",
  });
  const [errors, setErrors] = useState({});
  const [planDetails, setPlanDetails] = useState(null);
  const [loadingPlanDetails, setLoadingPlanDetails] = useState(false);
  const [planDetailsError, setPlanDetailsError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
        promo_code: "",
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

  const validateCardNumber = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s+/g, "");
    if (!/^\d{13,19}$/.test(cleaned)) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  const validateExpiryDate = (expiryDate) => {
    if (!expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
      return { valid: false, message: "Expiry must be MM/YY"};
    }

    const [month, year] = expiryDate.split("/");
    const expiryMonth = parseInt(month);
    const expiryYear = 2000 + parseInt(year);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
      return { valid: false, message: "Card has expired" };
    }

    return { valid: true };
  };

  const validatePincode = (zip) => {
    if (!zip || !zip.trim()) {
      return { valid: false, message: "ZIP/Pincode required" };
    }

    const cleaned = zip.trim();
    if (!/^[A-Z0-9\s-]{4,10}$/i.test(cleaned)) {
      return { valid: false, message: "Enter a valid ZIP/Pincode" };
    }

    return { valid: true };
  };

  const validate = () => {
    let newErrors = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = t("purchase.errors.email") || "Invalid email";
    if (!form.name || !form.name.trim()) newErrors.name = t("purchase.errors.name") || "Name is required";
    if (!form.address || !form.address.trim()) newErrors.address = t("purchase.errors.address") || "Address required";
    if (!form.city || !form.city.trim()) newErrors.city = t("purchase.errors.city") || "City required";
    if (!form.state || !form.state.trim()) newErrors.state = t("purchase.errors.state") || "State required";

    if (!form.card_number || !form.card_number.trim()) {
      newErrors.card_number = "Card number is required";
    } else if (!validateCardNumber(form.card_number)) {
      newErrors.card_number = "Enter a valid card number";
    }

    const expiryValidation = validateExpiryDate(form.expiry_date);
    if (!expiryValidation.valid) {
      newErrors.expiry_date = expiryValidation.message;
    }

    if (!form.cvv || !/^\d{3,4}$/.test(form.cvv)) {
      newErrors.cvv = "Enter CVV";
    }

    const zipValidation = validatePincode(form.zip);
    if (!zipValidation.valid) {
      newErrors.zip = zipValidation.message;
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
      const subFd = new FormData();
      subFd.append("plan_id", planId);
      if (countryId != null) subFd.append("country_id", countryId);
      if (form.email) subFd.append("email", form.email);
      if (form.promo_code?.trim()) subFd.append("promo_code", form.promo_code.trim());

      const subscriptionResponse = await createSubscription(subFd);
      const subscriptionPayload = subscriptionResponse?.data ?? subscriptionResponse;
      const subscriptionId = subscriptionPayload?.id ?? subscriptionResponse?.id ?? null;

      if (!subscriptionId) {
        const msg = subscriptionResponse?.error?.message || "Failed to create subscription";
        throw new Error(msg);
      }

      const fd = new FormData();
      fd.append("subscription_id", subscriptionId);
      fd.append("plan_id", planId);
      if (countryId != null) fd.append("country_id", countryId);
      fd.append("email", form.email);
      fd.append("card_holder_name", form.name);
      fd.append("card_number", form.card_number.replace(/\s+/g, ""));
      fd.append("expiry_date", form.expiry_date);
      fd.append("cvv", form.cvv);
      fd.append("address", form.address);
      fd.append("city", form.city);
      fd.append("state", form.state);
      fd.append("zip_code", form.zip);
      if (form.promo_code?.trim()) fd.append("promo_code", form.promo_code.trim());

      const paymentResponse = await createPayment(fd);
      const paymentPayload = paymentResponse?.data ?? paymentResponse;

      if (paymentResponse?.status === "success" || paymentPayload?.status === "success") {
        const checkoutUrl = paymentPayload?.checkout_url ?? paymentResponse?.checkout_url;
        if (checkoutUrl) {
          window.open(checkoutUrl, "_blank");
        }
        setShowSuccess(true);
      } else {
        const message = paymentResponse?.message || paymentPayload?.message || t("purchase.errors.payment_failed") || "Payment creation failed";
        throw new Error(message);
      }
    } catch (err) {
      console.error("Subscription/Payment error:", err);
      
      const errorMessage = err?.message || t("purchase.errors.payment_failed") || "An error occurred. Please try again.";
      
      setSubmitError(errorMessage);
      toast.error(`${errorMessage}, Update your location from profile page`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center px-2 ">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-y-auto max-h-[90vh] scrollbar-hide">

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-md font-semibold">
              {t("purchase.title", { plan: planDetails?.title || t("purchase.plan") })}
            </h2>
            <FaTimesCircle className="h-5 w-5" onClick={onClose} />
          </div>

          <div className="border-2 border-orange-400 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold flex items-center gap-2 text-orange-600">
                <Crown />{" "}
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

            {/* Promo code */}
            <div className="mt-3 pt-3 border-t border-orange-200">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {t("purchase.promo_code") || "Promo code"}
              </label>
              <input
                type="text"
                value={form.promo_code}
                onChange={(e) => setForm({ ...form, promo_code: e.target.value.toUpperCase() })}
                className="w-full form-input px-3 py-2 text-xs"
                placeholder="Enter Promo Code"
              />
            </div>
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

          <div className="border rounded-md p-3 border-blue-400 bg-blue-50">
            <div className="flex flex-row gap-2 items-center text-xs font-semibold text-black">
              <FaShieldAlt className="text-teal-500" /> {t("purchase.secure_payment")}
            </div>
            <p className="text-[10px] text-gray-600 mt-1">
              {t("purchase.secure_payment_desc")}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-xs font-medium mb-1">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full form-input px-3 py-2 text-xs"
                placeholder="you@email.com"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="block text-xs font-medium mb-1">Cardholder Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full form-input px-3 py-2 text-xs"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Card Number */}
            <div>
              <label className="block text-xs font-medium mb-1">Card Number</label>
              <input
                type="text"
                value={form.card_number}
                onChange={(e) => {
                  // Format card number with spaces every 4 digits
                  let value = e.target.value.replace(/\s+/g, "").replace(/\D/g, "");
                  if (value.length > 16) value = value.slice(0, 16);
                  // Add spaces every 4 digits
                  value = value.match(/.{1,4}/g)?.join(" ") || value;
                  setForm({ ...form, card_number: value });
                  // Clear error when user starts typing
                  if (errors.card_number) {
                    setErrors((prev) => ({ ...prev, card_number: "" }));
                  }
                }}
                maxLength={19}
                className="w-full form-input px-3 py-2 text-xs"
                placeholder="1234 5678 9012 3456"
              />
              {errors.card_number && <p className="text-xs text-red-500 mt-1">{errors.card_number}</p>}
            </div>

            {/* Expiry + CVV */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1">Expiry Date</label>
                <input
                  type="text"
                  value={form.expiry_date}
                  onChange={(e) => {
                    // Format expiry date as MM/YY
                    let value = e.target.value.replace(/\D/g, "");
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + "/" + value.slice(2, 4);
                    }
                    if (value.length > 5) value = value.slice(0, 5);
                    setForm({ ...form, expiry_date: value });
                    // Clear error when user starts typing
                    if (errors.expiry_date) {
                      setErrors((prev) => ({ ...prev, expiry_date: "" }));
                    }
                  }}
                  maxLength={5}
                  className="w-full form-input px-3 py-2 text-xs"
                  placeholder="MM/YY"
                />
                {errors.expiry_date && <p className="text-xs text-red-500 mt-1">{errors.expiry_date}</p>}
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1">CVV</label>
                <input
                  type="text"
                  value={form.cvv}
                  onChange={(e) => {
                    // Only allow digits, max 4 characters
                    let value = e.target.value.replace(/\D/g, "");
                    if (value.length > 4) value = value.slice(0, 4);
                    setForm({ ...form, cvv: value });
                    // Clear error when user starts typing
                    if (errors.cvv) {
                      setErrors((prev) => ({ ...prev, cvv: "" }));
                    }
                  }}
                  maxLength={4}
                  className="w-full form-input px-3 py-2 text-xs"
                  placeholder="123"
                />
                {errors.cvv && <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>}
              </div>
            </div>

            {/* Billing Address */}
            <div>
              <p className="text-xs font-medium mt-4 mb-2">Billing Address</p>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full form-input px-3 py-2 text-xs mb-2"
                placeholder="123 Main Street"
              />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}

              <div className="flex gap-3 mb-2">
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-1/2 form-input px-3 py-2 text-xs"
                  placeholder="City"
                />
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-1/2 form-input px-3 py-2 text-xs"
                  placeholder="State"
                />
              </div>
              {(errors.city || errors.state) && <p className="text-xs text-red-500 mt-1">{errors.city || errors.state}</p>}

              <input
                type="text"
                value={form.zip}
                onChange={(e) => {
                  // Allow alphanumeric pincode with spaces and hyphens
                  let value = e.target.value.toUpperCase();
                  if (value.length > 10) value = value.slice(0, 10);
                  setForm({ ...form, zip: value });
                  // Clear error when user starts typing
                  if (errors.zip) {
                    setErrors((prev) => ({ ...prev, zip: "" }));
                  }
                }}
                maxLength={10}
                className="w-full form-input px-3 py-2 text-xs"
                placeholder="ZIP/Pincode"
              />
              {errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip}</p>}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-between items-center pt-4 gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-xs border rounded-md hover:bg-gray-100"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-md flex items-center justify-center"
              >
                <FaLock className="mr-2" />
                {submitting ? "Processing..." : `Pay ${planDetails?.pricing?.price || "$47"}`}
              </button>
            </div>
          </form>

          {submitError && <p className="text-xs text-red-500 mt-3">{submitError}</p>}
        </div>

        {/* <SuccessPopupModel
          isOpen={showSuccess}
          onClose={() => {
            setShowSuccess(false);
            onClose();
          }}
          memberId={planDetails?.id || "348"}
        /> */}
      </div>
    </div>
  );
};

export default PurchasePopupModel;
