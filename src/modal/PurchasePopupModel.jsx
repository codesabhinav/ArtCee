import React, { useEffect, useState } from "react";
import { FaTimes, FaCrown, FaLock } from "react-icons/fa";
import SuccessPopupModel from "./SuccessPopupModel";
import { getPlanShow } from "../Hooks/useSeller";

import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_KEY || null;

const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

const StripePaymentForm = ({ planId, country, planDetails, prefill, onPaid, onError }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async (billing) => {
    if (!stripe || !elements) {
      setError("Stripe is not ready. Try again in a moment.");
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const resp = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          country,
          email: billing.email,
        }),
      });

      if (!resp.ok) {
        const errBody = await resp.json().catch(() => ({}));
        throw new Error(errBody.message || "Failed to create payment intent");
      }

      const { clientSecret } = await resp.json();
      if (!clientSecret) throw new Error("No clientSecret returned from server");

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card input not found");

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: billing.name,
            email: billing.email,
            address: {
              line1: billing.address,
              city: billing.city,
              state: billing.state,
              postal_code: billing.zip,
            },
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message || "Payment failed");
      }

      if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        onPaid(result.paymentIntent);
      } else {
        onError("Payment status: " + (result.paymentIntent?.status || "unknown"));
      }
    } catch (err) {
      console.error("Stripe payment error:", err);
      setError(err.message || "Payment failed");
      onError?.(err.message || "Payment failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="border rounded-md p-3 mb-3">
        <CardElement options={{ style: { base: { fontSize: "14px" } } }} />
      </div>

      <div className="flex justify-between items-center pt-4 gap-4">
        <button type="button" className="flex-1 px-4 py-2 text-sm border rounded-md hover:bg-gray-100" onClick={() => onError && onError("cancel")}>
          Cancel
        </button>

        <button
          type="button"
          onClick={() =>
            handlePayment({
              name: prefill.name,
              email: prefill.email,
              address: prefill.address,
              city: prefill.city,
              state: prefill.state,
              zip: prefill.zip,
            })
          }
          disabled={busy}
          className="flex-1 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-md flex items-center justify-center"
        >
          <FaLock className="mr-3" />
          {busy ? "Processing…" : `Pay ${planDetails?.pricing?.[0]?.price || planDetails?.price || "$47"}`}
        </button>
      </div>
    </>
  );
};

const PurchasePopupModel = ({ isOpen, onClose, planId, country }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState({
    email: "",
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [errors, setErrors] = useState({});
  const [planDetails, setPlanDetails] = useState(null);
  const [loadingPlanDetails, setLoadingPlanDetails] = useState(false);
  const [planDetailsError, setPlanDetailsError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // reset when modal closed
  useEffect(() => {
    if (!isOpen) {
      setPlanDetails(null);
      setPlanDetailsError(null);
      setLoadingPlanDetails(false);
      setForm({ email: "", name: "", address: "", city: "", state: "", zip: "" });
      setErrors({});
      setShowSuccess(false);
      setSubmitError(null);
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
          const msg = err?.message || err?.response?.data?.message || "Failed to load plan details";
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
  }, [isOpen, planId, country]);

  if (!isOpen) return null;

  const validate = () => {
    let newErrors = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Valid email required";
    if (!form.name || !form.name.trim()) newErrors.name = "Name required";
    if (!form.address || !form.address.trim()) newErrors.address = "Address required";
    if (!form.city || !form.city.trim()) newErrors.city = "City required";
    if (!form.state || !form.state.trim()) newErrors.state = "State required";
    if (!form.zip || !form.zip.trim()) newErrors.zip = "ZIP required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;
  };

  const onPaid = (paymentIntent) => {
    setShowSuccess(true);
  };

  const onError = (errMsg) => {
    if (errMsg === "cancel") {
      onClose();
      return;
    }
    setSubmitError(errMsg || "Payment failed");
  };

  const prefill = form;

  return (
    <Elements stripe={stripePromise}>
      <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center px-2 ">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-y-auto max-h-[90vh] scrollbar-hide">
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>

          <div className="p-6 space-y-6">
            <h2 className="text-lg font-semibold">Complete Your {planDetails?.title || "Premium"} Upgrade</h2>

            <div className="border-2 border-orange-400 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold flex items-center gap-2 text-orange-600">
                  <FaCrown /> {planDetails?.title || (loadingPlanDetails ? "Loading..." : "Plan")}
                </h3>
                {loadingPlanDetails && <div className="text-xs text-gray-500">Loading plan details…</div>}
              </div>

              <div className="flex justify-between items-end border-b pb-3 mb-3">
                <div>
                  <p className="text-3xl font-bold">{planDetails?.pricing?.price || planDetails?.price || "$47"}</p>
                </div>
                <p className="text-xs text-gray-500 text-right">Limited time – only {planDetails?.remaining || "152"} spots remaining!</p>
              </div>

              {planDetailsError && <p className="text-xs text-red-500 mb-2">{planDetailsError}</p>}
              {planDetails?.features && (
                <ul className="grid grid-cols-2 gap-y-2 text-xs text-gray-700">
                  {planDetails.features.map((f) => <li key={f.id}>✅ {f.name}</li>)}
                </ul>
              )}
            </div>

            <div>
              <p className="font-medium mb-2">Payment Method</p>
              <div className="flex gap-3">
                <button className="flex-1 bg-black text-white rounded-md py-3 text-xs font-medium">Credit/Debit Card</button>
                <button className="flex-1 border border-gray-100 text-gray-500 rounded-md py-3 text-xs font-medium cursor-not-allowed">PayPal (Coming Soon)</button>
              </div>
            </div>

            <div className="border rounded-md p-3 text-sm text-gray-600 bg-gray-50">🔒 Secure Payment — Your payment info is encrypted & processed with Stripe</div>

            <form className="space-y-3" onSubmit={handleSubmit}>
              <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full form-input px-3 py-2 text-sm" />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}

              <input type="text" name="name" placeholder="Cardholder Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full form-input px-3 py-2 text-sm" />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}

              <p className="text-sm font-medium mt-2 mb-1">Billing Address</p>
              <input type="text" name="address" placeholder="Street address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full form-input px-3 py-2 text-sm" />
              {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}

              <div className="flex gap-3">
                <input type="text" name="city" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-1/2 form-input px-3 py-2 text-sm" />
                <input type="text" name="state" placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="w-1/2 form-input px-3 py-2 text-sm" />
              </div>
              {(errors.city || errors.state) && <p className="text-xs text-red-500">{errors.city || errors.state}</p>}

              <input type="text" name="zip" placeholder="ZIP Code" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} className="w-full form-input px-3 py-2 text-sm" />
              {errors.zip && <p className="text-xs text-red-500">{errors.zip}</p>}

              <div className="mt-2">
                <p className="text-sm font-medium mb-1">Card details</p>
                <StripePaymentForm
                  planId={planId}
                  country={country}
                  planDetails={planDetails}
                  prefill={prefill}
                  onPaid={(pi) => {
                    onPaid(pi);
                    setShowSuccess(true);
                  }}
                  onError={onError}
                />
              </div>
            </form>

            {submitError && <p className="text-xs text-red-500">{submitError}</p>}
          </div>
        </div>

        <SuccessPopupModel isOpen={showSuccess} onClose={() => { setShowSuccess(false); onClose(); }} memberId={planDetails?.id || "348"} />
      </div>
    </Elements>
  );
};

export default PurchasePopupModel;
