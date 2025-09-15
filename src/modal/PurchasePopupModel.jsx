// import { useState } from "react";
// import { FaTimes, FaCrown, FaLock } from "react-icons/fa";
// import SuccessPopupModel from "./SuccessPopupModel";

// const PurchasePopupModel = ({ isOpen, onClose, plan }) => {
//     const [showSuccess, setShowSuccess] = useState(false);

//     const [form, setForm] = useState({
//         email: "",
//         name: "",
//         cardNumber: "",
//         expiry: "",
//         cvv: "",
//         address: "",
//         city: "",
//         state: "",
//         zip: "",
//     });

//     const [errors, setErrors] = useState({});

//     if (!isOpen) return null;

//     // 🔹 Validation
//     const validate = () => {
//         let newErrors = {};

//         if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
//             newErrors.email = "Valid email required";
//         }
//         if (!form.name.trim()) newErrors.name = "Cardholder name required";
//         if (!/^\d{16}$/.test(form.cardNumber.replace(/\s+/g, ""))) {
//             newErrors.cardNumber = "Card number must be 16 digits";
//         }
//         if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) {
//             newErrors.expiry = "Expiry must be MM/YY";
//         }
//         if (!/^\d{3,4}$/.test(form.cvv)) {
//             newErrors.cvv = "CVV must be 3–4 digits";
//         }
//         if (!form.address.trim()) newErrors.address = "Address required";
//         if (!form.city.trim()) newErrors.city = "City required";
//         if (!form.state.trim()) newErrors.state = "State required";
//         if (!form.zip.trim()) newErrors.zip = "ZIP required";

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     // 🔹 Handle Submit
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (validate()) {
//             setShowSuccess(true); // ✅ show success popup
//         }
//     };

//     // 🔹 Track input changes
//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     return (
//         <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center px-2 ">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-y-auto max-h-[90vh] scrollbar-hide">

//                 {/* Close Button */}
//                 <button
//                     onClick={onClose}
//                     className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//                 >
//                     <FaTimes size={20} />
//                 </button>

//                 {/* Content */}
//                 <div className="p-6 space-y-6">
//                     {/* Heading */}
//                     <h2 className="text-lg font-semibold">
//                         Complete Your {plan?.title || "Premium"} Upgrade
//                     </h2>

//                     {/* Plan Card */}
//                     <div className="border-2 border-orange-400 rounded-lg p-4">
//                         <div className="flex justify-between items-center mb-3">
//                             <h3 className="font-bold flex items-center gap-2 text-orange-600">
//                                 <FaCrown /> {plan?.title}
//                             </h3>
//                             <span className="bg-orange-100 text-orange-600 text-xs font-medium px-2 py-1 rounded-full">
//                                 #{plan?.spots || "348"} of {plan?.totalSpots || "500"}
//                             </span>
//                         </div>

//                         <div className="flex justify-between items-end border-b pb-3 mb-3">
//                             <div>
//                                 <p className="text-3xl font-bold">
//                                     {plan?.price || "$47"}
//                                     <span className="text-gray-400 line-through ml-1">
//                                         {plan?.oldPrice || "$97"}
//                                     </span>
//                                 </p>
//                                 <p className="text-sm text-orange-500">
//                                     Save {plan?.discount || "$50"} with Founding Member pricing!
//                                 </p>
//                             </div>
//                             <p className="text-xs text-gray-500 text-right">
//                                 Limited time – only {plan?.remaining || "152"} spots remaining!
//                             </p>
//                         </div>

//                         {/* Features */}
//                         <ul className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
//                             {plan?.features?.map((f, i) => (
//                                 <li key={i} className="flex items-center gap-2">
//                                     ✅ {f}
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>

//                     {/* Payment Method */}
//                     <div>
//                         <p className="font-medium mb-2">Payment Method</p>
//                         <div className="flex gap-3">
//                             <button className="flex-1 bg-black text-white rounded-md py-3 text-xs font-medium">
//                                 Credit/Debit Card
//                             </button>
//                             <button className="flex-1 border border-gray-100 text-gray-500 rounded-md py-3 text-xs font-medium cursor-not-allowed">
//                                 PayPal (Coming Soon)
//                             </button>
//                         </div>
//                     </div>

//                     {/* Secure Payment Notice */}
//                     <div className="border rounded-md p-3 text-sm text-gray-600 bg-gray-50">
//                         🔒 Secure Payment — Your payment info is encrypted & processed with Stripe
//                     </div>

//                     {/* Payment Form */}
//                     <form className="space-y-3" onSubmit={handleSubmit}>
//                         <input
//                             type="email"
//                             name="email"
//                             placeholder="Email Address"
//                             value={form.email}
//                             onChange={handleChange}
//                             className="w-full form-input px-3 py-2 text-sm"
//                         />
//                         {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}

//                         <input
//                             type="text"
//                             name="name"
//                             placeholder="Cardholder Name"
//                             value={form.name}
//                             onChange={handleChange}
//                             className="w-full form-input px-3 py-2 text-sm"
//                         />
//                         {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}

//                         <input
//                             type="text"
//                             name="cardNumber"
//                             placeholder="Card Number"
//                             value={form.cardNumber}
//                             onChange={handleChange}
//                             className="w-full form-input px-3 py-2 text-sm"
//                         />
//                         {errors.cardNumber && <p className="text-xs text-red-500">{errors.cardNumber}</p>}

//                         <div className="flex gap-3">
//                             <input
//                                 type="text"
//                                 name="expiry"
//                                 placeholder="MM/YY"
//                                 value={form.expiry}
//                                 onChange={handleChange}
//                                 className="w-1/2 form-input px-3 py-2 text-sm"
//                             />
//                             <input
//                                 type="text"
//                                 name="cvv"
//                                 placeholder="CVV"
//                                 value={form.cvv}
//                                 onChange={handleChange}
//                                 className="w-1/2 form-input px-3 py-2 text-sm"
//                             />
//                         </div>
//                         {(errors.expiry || errors.cvv) && (
//                             <p className="text-xs text-red-500">{errors.expiry || errors.cvv}</p>
//                         )}

//                         <p className="font-medium mt-4">Billing Address</p>
//                         <input
//                             type="text"
//                             name="address"
//                             placeholder="Street Address"
//                             value={form.address}
//                             onChange={handleChange}
//                             className="w-full form-input px-3 py-2 text-sm"
//                         />
//                         {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}

//                         <div className="flex gap-3">
//                             <input
//                                 type="text"
//                                 name="city"
//                                 placeholder="City"
//                                 value={form.city}
//                                 onChange={handleChange}
//                                 className="w-1/2 form-input px-3 py-2 text-sm"
//                             />
//                             <input
//                                 type="text"
//                                 name="state"
//                                 placeholder="State"
//                                 value={form.state}
//                                 onChange={handleChange}
//                                 className="w-1/2 form-input px-3 py-2 text-sm"
//                             />
//                         </div>
//                         {(errors.city || errors.state) && (
//                             <p className="text-xs text-red-500">{errors.city || errors.state}</p>
//                         )}

//                         <input
//                             type="text"
//                             name="zip"
//                             placeholder="ZIP Code"
//                             value={form.zip}
//                             onChange={handleChange}
//                             className="w-full form-input px-3 py-2 text-sm"
//                         />
//                         {errors.zip && <p className="text-xs text-red-500">{errors.zip}</p>}

//                         {/* Footer */}
//                         <div className="flex justify-between items-center pt-4 gap-4">
//                             <button
//                                 type="button"
//                                 onClick={onClose}
//                                 className="flex-1 px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 className="flex-1 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-md flex items-center justify-center"
//                             >
//                                 <FaLock className="mr-4" /> Pay {plan?.price || "$47"}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//             <SuccessPopupModel
//                 isOpen={showSuccess}
//                 onClose={() => {
//                     setShowSuccess(false);
//                     onClose();
//                 }}
//                 memberId={plan?.memberId || "348"}
//             />
//         </div>
//     );
// };

// export default PurchasePopupModel;

// PurchasePopupModel.jsx
import { useState } from "react";
import { FaTimes, FaCrown, FaLock } from "react-icons/fa";
import SuccessPopupModel from "./SuccessPopupModel";
import { useTranslation } from "../contexts/LanguageProvider";

const PurchasePopupModel = ({ isOpen, onClose, plan = {} }) => {
  const { t } = useTranslation();
  const [showSuccess, setShowSuccess] = useState(false);

  const [form, setForm] = useState({
    email: "",
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  // Validation
  const validate = () => {
    let newErrors = {};

    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = t("purchase.validation_email");
    }
    if (!form.name.trim()) newErrors.name = t("purchase.validation_name");
    if (!/^\d{16}$/.test(form.cardNumber.replace(/\s+/g, ""))) {
      newErrors.cardNumber = t("purchase.validation_card_number");
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) {
      newErrors.expiry = t("purchase.validation_expiry");
    }
    if (!/^\d{3,4}$/.test(form.cvv)) {
      newErrors.cvv = t("purchase.validation_cvv");
    }
    if (!form.address.trim()) newErrors.address = t("purchase.validation_address");
    if (!form.city.trim()) newErrors.city = t("purchase.validation_city");
    if (!form.state.trim()) newErrors.state = t("purchase.validation_state");
    if (!form.zip.trim()) newErrors.zip = t("purchase.validation_zip");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // normally call payment API here
      setShowSuccess(true);
    }
  };

  // Input change handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const planTitle = plan?.title || t("purchase.premium");

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center px-2 ">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-y-auto max-h-[90vh] scrollbar-hide">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label={t("purchase.close_aria")}
        >
          <FaTimes size={20} />
        </button>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Heading */}
          <h2 className="text-lg font-semibold">
            {t("purchase.complete_upgrade", { plan: planTitle })}
          </h2>

          {/* Plan Card */}
          <div className="border-2 border-orange-400 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold flex items-center gap-2 text-orange-600">
                <FaCrown /> {planTitle}
              </h3>
              <span className="bg-orange-100 text-orange-600 text-xs font-medium px-2 py-1 rounded-full">
                #{plan?.spots || t("purchase.default_spot")} {t("purchase.of")}{" "}
                {plan?.totalSpots ?? t("purchase.default_total")}
              </span>
            </div>

            <div className="flex justify-between items-end border-b pb-3 mb-3">
              <div>
                <p className="text-3xl font-bold">
                  {plan?.price || t("purchase.default_price")}
                  <span className="text-gray-400 line-through ml-1">
                    {plan?.oldPrice || t("purchase.default_old_price")}
                  </span>
                </p>
                <p className="text-sm text-orange-500">
                  {t("purchase.save_with_founder", { discount: plan?.discount || t("purchase.default_discount") })}
                </p>
              </div>
              <p className="text-xs text-gray-500 text-right">
                {t("purchase.limited_time_spots", { remaining: plan?.remaining ?? t("purchase.default_remaining") })}
              </p>
            </div>

            {/* Features */}
            <ul className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
              {Array.isArray(plan?.features) && plan.features.length > 0 ? (
                plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    ✅ {f}
                  </li>
                ))
              ) : (
                <li className="col-span-2 text-xs text-gray-500">{t("purchase.no_features")}</li>
              )}
            </ul>
          </div>

          {/* Payment Method */}
          <div>
            <p className="font-medium mb-2">{t("purchase.payment_method")}</p>
            <div className="flex gap-3">
              <button className="flex-1 bg-black text-white rounded-md py-3 text-xs font-medium">
                {t("purchase.payment_card")}
              </button>
              <button className="flex-1 border border-gray-100 text-gray-500 rounded-md py-3 text-xs font-medium cursor-not-allowed">
                {t("purchase.payment_paypal")} ({t("purchase.coming_soon")})
              </button>
            </div>
          </div>

          {/* Secure Payment Notice */}
          <div className="border rounded-md p-3 text-sm text-gray-600 bg-gray-50">
            {t("purchase.secure_notice")}
          </div>

          {/* Payment Form */}
          <form className="space-y-3" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder={t("purchase.placeholder_email")}
              value={form.email}
              onChange={handleChange}
              className="w-full form-input px-3 py-2 text-sm"
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}

            <input
              type="text"
              name="name"
              placeholder={t("purchase.placeholder_name")}
              value={form.name}
              onChange={handleChange}
              className="w-full form-input px-3 py-2 text-sm"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}

            <input
              type="text"
              name="cardNumber"
              placeholder={t("purchase.placeholder_card_number")}
              value={form.cardNumber}
              onChange={handleChange}
              className="w-full form-input px-3 py-2 text-sm"
            />
            {errors.cardNumber && <p className="text-xs text-red-500">{errors.cardNumber}</p>}

            <div className="flex gap-3">
              <input
                type="text"
                name="expiry"
                placeholder={t("purchase.placeholder_expiry")}
                value={form.expiry}
                onChange={handleChange}
                className="w-1/2 form-input px-3 py-2 text-sm"
              />
              <input
                type="text"
                name="cvv"
                placeholder={t("purchase.placeholder_cvv")}
                value={form.cvv}
                onChange={handleChange}
                className="w-1/2 form-input px-3 py-2 text-sm"
              />
            </div>
            {(errors.expiry || errors.cvv) && (
              <p className="text-xs text-red-500">{errors.expiry || errors.cvv}</p>
            )}

            <p className="font-medium mt-4">{t("purchase.billing_address")}</p>
            <input
              type="text"
              name="address"
              placeholder={t("purchase.placeholder_address")}
              value={form.address}
              onChange={handleChange}
              className="w-full form-input px-3 py-2 text-sm"
            />
            {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}

            <div className="flex gap-3">
              <input
                type="text"
                name="city"
                placeholder={t("purchase.placeholder_city")}
                value={form.city}
                onChange={handleChange}
                className="w-1/2 form-input px-3 py-2 text-sm"
              />
              <input
                type="text"
                name="state"
                placeholder={t("purchase.placeholder_state")}
                value={form.state}
                onChange={handleChange}
                className="w-1/2 form-input px-3 py-2 text-sm"
              />
            </div>
            {(errors.city || errors.state) && (
              <p className="text-xs text-red-500">{errors.city || errors.state}</p>
            )}

            <input
              type="text"
              name="zip"
              placeholder={t("purchase.placeholder_zip")}
              value={form.zip}
              onChange={handleChange}
              className="w-full form-input px-3 py-2 text-sm"
            />
            {errors.zip && <p className="text-xs text-red-500">{errors.zip}</p>}

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
              >
                {t("purchase.cancel")}
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-md flex items-center justify-center"
              >
                <FaLock className="mr-4" /> {t("purchase.pay_now", { price: plan?.price || t("purchase.default_price") })}
              </button>
            </div>
          </form>
        </div>
      </div>

      <SuccessPopupModel
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          onClose();
        }}
        memberId={plan?.memberId || t("purchase.default_member_id")}
      />
    </div>
  );
};

export default PurchasePopupModel;
