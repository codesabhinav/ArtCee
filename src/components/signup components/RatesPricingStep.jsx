// import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
// import { useState } from "react";

// const RatesPricingStep = ({ formData, setFormData, onNext, onPrev }) => {
//   const [errors, setErrors] = useState({});

//   const handleSubmit = () => {
//     let newErrors = {};
//     if (
//       !formData.hourly_rate &&
//       !formData.daily_rate &&
//       !formData.project_rate
//     ) {
//       newErrors.rates = "Please enter at least one rate.";
//     }
//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//       onNext();
//     }
//   };

//   return (
//     <div className="w-full max-w-3xl bg-white rounded-lg p-8 shadow">
//       {/* Icon + Title */}
//       <div className="flex justify-center mb-2">
//         <span className="text-5xl text-teal-500">$</span>
//       </div>

//       <h2 className="text-xl font-semibold text-center">Rates & Pricing</h2>
//       <p className="text-gray-500 text-center mb-6 text-sm">
//         Set your rates to attract the right clients
//       </p>

//       {/* Rates Fields */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Hourly Rate
//           </label>
//           <input
//             type="number"
//             name="hourly_rate"
//             value={formData.hourly_rate || ""}
//             onChange={(e) =>
//               setFormData({ ...formData, hourly_rate: e.target.value })
//             }
//             className={`mt-1 block w-full bg-gray-100 border placeholder:text-sm ${
//               errors.rates ? "border-red-400" : "border-gray-300"
//             } rounded-md p-2`}
//             placeholder="0"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Daily Rate
//           </label>
//           <input
//             type="number"
//             name="daily_rate"
//             value={formData.daily_rate || ""}
//             onChange={(e) =>
//               setFormData({ ...formData, daily_rate: e.target.value })
//             }
//             className={`mt-1 block w-full bg-gray-100 border placeholder:text-sm ${
//               errors.rates ? "border-red-400" : "border-gray-300"
//             } rounded-md p-2`}
//             placeholder="0"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Project Rate
//           </label>
//           <input
//             type="number"
//             name="project_rate"
//             value={formData.project_rate || ""}
//             onChange={(e) =>
//               setFormData({ ...formData, project_rate: e.target.value })
//             }
//             className={`mt-1 block w-full bg-gray-100 border placeholder:text-sm ${
//               errors.rates ? "border-red-400" : "border-gray-300"
//             } rounded-md p-2`}
//             placeholder="0"
//           />
//         </div>
//       </div>

//       {/* Currency + Negotiable */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Currency
//           </label>
//           <select
//             value={formData.currency || "USD"}
//             onChange={(e) =>
//               setFormData({ ...formData, currency: e.target.value })
//             }
//             className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2"
//           >
//             <option value="USD">USD ($)</option>
//             <option value="EUR">EUR (€)</option>
//             <option value="GBP">GBP (£)</option>
//             <option value="INR">INR (₹)</option>
//           </select>
//         </div>

//         {/* Toggle Switch */}
//         <div className="flex items-center mt-6">
//           <label className="mr-3 text-sm font-medium text-gray-700">
//             Rates are negotiable
//           </label>
//           <button
//             type="button"
//             onClick={() =>
//               setFormData({ ...formData, is_rate_negotiable: formData.is_rate_negotiable === 1 ? 0 : 1 })
//             }
//             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//               formData.is_rate_negotiable ? "bg-teal-500" : "bg-gray-300"
//             }`}
//           >
//             <span
//               className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                 formData.is_rate_negotiable ? "translate-x-6" : "translate-x-1"
//               }`}
//             />
//           </button>
//         </div>
//       </div>

//       {/* Error message */}
//       {errors.rates && (
//         <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-300 rounded-md p-3">
//           {errors.rates}
//         </div>
//       )}

//       {/* Navigation */}
//       <div className="flex justify-between pt-4">
//         <button
//           type="button"
//           onClick={onPrev}
//           className="flex items-center px-4 py-2 text-xs border rounded-md text-gray-700 hover:bg-gray-100"
//         >
//           <FaArrowLeft className="mr-2" /> Previous
//         </button>
//         <button
//           type="button"
//           onClick={handleSubmit}
//           className="flex items-center px-6 py-2 text-xs bg-teal-400 text-white rounded-md hover:bg-teal-500"
//         >
//           Next <FaArrowRight className="ml-2" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default RatesPricingStep;


// src/components/RatesPricingStep.jsx
// src/components/signup components/RatesPricingStep.jsx
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useTranslation } from "../../contexts/LanguageProvider";

/**
 * RatesPricingStep (local-state variant)
 * - Keeps local state for inputs to avoid losing focus on parent re-renders.
 * - Syncs local state to parent on blur and on navigation (Next/Prev).
 * - Preserves validation and UI exactly as before.
 */
const RatesPricingStep = ({ formData, setFormData, onNext, onPrev }) => {
  const { t } = useTranslation();

  // local copies to avoid focus loss
  const [localHourly, setLocalHourly] = useState(formData.hourly_rate ?? "");
  const [localDaily, setLocalDaily] = useState(formData.daily_rate ?? "");
  const [localProject, setLocalProject] = useState(formData.project_rate ?? "");
  const [localCurrency, setLocalCurrency] = useState(formData.currency ?? "USD");
  const [localNegotiable, setLocalNegotiable] = useState(formData.is_rate_negotiable === 1 ? 1 : 0);

  const [errors, setErrors] = useState({});

  // initialize local state when parent updates (mount or external changes)
  useEffect(() => {
    setLocalHourly(formData.hourly_rate ?? "");
    setLocalDaily(formData.daily_rate ?? "");
    setLocalProject(formData.project_rate ?? "");
    setLocalCurrency(formData.currency ?? "USD");
    setLocalNegotiable(formData.is_rate_negotiable === 1 ? 1 : 0);
  }, [formData.hourly_rate, formData.daily_rate, formData.project_rate, formData.currency, formData.is_rate_negotiable]);

  // sync helper: push local values up to parent
  const syncToParent = (overrides = {}) => {
    setFormData((prev) => ({
      ...prev,
      hourly_rate: overrides.hourly_rate ?? (localHourly === "" ? 0 : Number(localHourly)),
      daily_rate: overrides.daily_rate ?? (localDaily === "" ? 0 : Number(localDaily)),
      project_rate: overrides.project_rate ?? (localProject === "" ? 0 : Number(localProject)),
      currency: overrides.currency ?? localCurrency,
      is_rate_negotiable: typeof overrides.is_rate_negotiable !== "undefined" ? overrides.is_rate_negotiable : (localNegotiable ? 1 : 0),
    }));
  };

  // individual blur handlers will sync that single field to parent
  const handleHourlyBlur = () => syncToParent({ hourly_rate: localHourly === "" ? 0 : Number(localHourly) });
  const handleDailyBlur = () => syncToParent({ daily_rate: localDaily === "" ? 0 : Number(localDaily) });
  const handleProjectBlur = () => syncToParent({ project_rate: localProject === "" ? 0 : Number(localProject) });
  const handleCurrencyBlur = () => syncToParent({ currency: localCurrency });
  const handleNegotiableToggle = () => {
    const next = localNegotiable === 1 ? 0 : 1;
    setLocalNegotiable(next);
    syncToParent({ is_rate_negotiable: next });
  };

  // Validation and Next
  const handleSubmit = () => {
    let newErrors = {};
    const h = Number(localHourly) || 0;
    const d = Number(localDaily) || 0;
    const p = Number(localProject) || 0;

    if (h <= 0 && d <= 0 && p <= 0) {
      newErrors.rates = t("rates_pricing.errors.at_least_one");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // final sync before moving to next
      syncToParent();
      onNext();
    }
  };

  const handlePrev = () => {
    syncToParent();
    onPrev();
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-lg p-8 shadow">
      {/* Icon + Title */}
      <div className="flex justify-center mb-2">
        <span className="text-5xl text-teal-500">$</span>
      </div>

      <h2 className="text-xl font-semibold text-center">{t("rates_pricing.title")}</h2>
      <p className="text-gray-500 text-center mb-6 text-sm">{t("rates_pricing.subtitle")}</p>

      {/* Rates Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("rates_pricing.hourly_label")}
          </label>
          <input
            type="number"
            name="hourly_rate"
            value={localHourly ?? ""}
            onChange={(e) => setLocalHourly(e.target.value)}
            onBlur={handleHourlyBlur}
            className={`mt-1 block w-full bg-gray-100 border placeholder:text-sm ${
              errors.rates ? "border-red-400" : "border-gray-300"
            } rounded-md p-2`}
            placeholder={t("rates_pricing.placeholder")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("rates_pricing.daily_label")}
          </label>
          <input
            type="number"
            name="daily_rate"
            value={localDaily ?? ""}
            onChange={(e) => setLocalDaily(e.target.value)}
            onBlur={handleDailyBlur}
            className={`mt-1 block w-full bg-gray-100 border placeholder:text-sm ${
              errors.rates ? "border-red-400" : "border-gray-300"
            } rounded-md p-2`}
            placeholder={t("rates_pricing.placeholder")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("rates_pricing.project_label")}
          </label>
          <input
            type="number"
            name="project_rate"
            value={localProject ?? ""}
            onChange={(e) => setLocalProject(e.target.value)}
            onBlur={handleProjectBlur}
            className={`mt-1 block w-full bg-gray-100 border placeholder:text-sm ${
              errors.rates ? "border-red-400" : "border-gray-300"
            } rounded-md p-2`}
            placeholder={t("rates_pricing.placeholder")}
          />
        </div>
      </div>

      {/* Currency + Negotiable */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("rates_pricing.currency_label")}
          </label>
          <select
            value={localCurrency || "USD"}
            onChange={(e) => {
              setLocalCurrency(e.target.value);
              // we don't sync on every change, sync on blur/change explicitly
              syncToParent({ currency: e.target.value });
            }}
            onBlur={handleCurrencyBlur}
            className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="INR">INR (₹)</option>
          </select>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center mt-6">
          <label className="mr-3 text-sm font-medium text-gray-700">
            {t("rates_pricing.negotiable_label")}
          </label>
          <button
            type="button"
            onClick={handleNegotiableToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              localNegotiable ? "bg-teal-500" : "bg-gray-300"
            }`}
            aria-pressed={localNegotiable === 1}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                localNegotiable ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Error message */}
      {errors.rates && (
        <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-300 rounded-md p-3">
          {errors.rates}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={handlePrev}
          className="flex items-center px-4 py-2 text-xs border rounded-md text-gray-700 hover:bg-gray-100"
        >
          <FaArrowLeft className="mr-2" /> {t("rates_pricing.prev")}
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          className="flex items-center px-6 py-2 text-xs bg-teal-400 text-white rounded-md hover:bg-teal-500"
        >
          {t("rates_pricing.next")} <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default RatesPricingStep;
