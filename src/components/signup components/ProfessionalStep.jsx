// import { BriefcaseIcon } from "@heroicons/react/24/outline";
// import { useState } from "react";
// import { FaArrowLeft, FaArrowRight, FaBriefcase } from "react-icons/fa";

// const ProfessionalStep = ({ formData, setFormData, onNext, onPrev }) => {
//   const [errors, setErrors] = useState({});
//   const [showTopAlert, setShowTopAlert] = useState(false);

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.personal_intro.trim()) newErrors.personal_intro = "Personal Introduction";
//     if (!formData.exp_vision.trim()) newErrors.exp_vision = "Creative Vision";

//     setErrors(newErrors);
//     setShowTopAlert(Object.keys(newErrors).length > 0); // show orange alert
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));

//     if (errors[e.target.name]) {
//       setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
//     }
//   };

//   const handleNext = (e) => {
//     e.preventDefault();
//     if (validate()) {
//       onNext();
//     }
//   };

//   return (
//     <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-sm border">
//       {/* Header */}
//       <div className="flex flex-col items-center mb-4">
//         <BriefcaseIcon className="h-10 w-10 text-orange-400 mb-2" />
//         <h2 className="text-xl font-semibold">Professional Experience</h2>
//         <p className="text-gray-500 text-sm text-center">
//           Help others understand your level of expertise
//         </p>
//       </div>


//       <div className="bg-orange-50 border border-orange-200 text-orange-600 px-4 py-3 rounded-md text-xs mb-4 text-center">
//         * Your intro and creative vision are required to showcase your unique perspective
//       </div>

//       <form onSubmit={handleNext} className="space-y-5">
//         {/* Row: Years of Experience + Career Level */}
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Years of Experience
//             </label>
//             <input
//               type="number"
//               name="experience_in_year"
//               value={formData.experience_in_year}
//               onChange={handleChange}
//               className="mt-1 block w-full bg-gray-100 border placeholder:text-sm rounded-md p-2"
//               placeholder="0"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Career Level
//             </label>
//             <select
//               name="experience_in_level"
//               value={formData.experience_in_level}
//               onChange={handleChange}
//               className="mt-1 block w-full bg-gray-100 border placeholder:text-sm rounded-md p-2"
//             >
//               <option value="entry">Entry Level (0-2 years)</option>
//               <option value="mid">Mid Level (3-5 years)</option>
//               <option value="senior">Senior Level (6-10 years)</option>
//               <option value="expert">Expert Level (10+ years)</option>
//             </select>
//           </div>
//         </div>

//         {/* Personal Introduction */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Personal Introduction *
//           </label>
//           <textarea
//             name="personal_intro"
//             rows="3"
//             value={formData.personal_intro}
//             onChange={handleChange}
//             className={`mt-1 block w-full bg-gray-100 border placeholder:text-sm ${errors.personal_intro ? "border-red-400" : "border-gray-300"
//               } rounded-md p-2`}
//             placeholder="A brief, personal introduction that showcases your personality..."
//           />
//         </div>

//         {/* Creative Vision */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Creative Vision *
//           </label>
//           <textarea
//             name="exp_vision"
//             rows="3"
//             value={formData.exp_vision}
//             onChange={handleChange}
//             className={`mt-1 block w-full bg-gray-100 border placeholder:text-sm ${errors.exp_vision ? "border-red-400" : "border-gray-300"
//               } rounded-md p-2`}
//             placeholder="Share your creative vision and what drives your artistic work..."
//           />
//         </div>

//         {/* Error Summary */}
//         {Object.keys(errors).length > 0 && (
//           <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
//             <p>Please complete the following required fields:</p>
//             <ul className="list-disc list-inside">
//               {Object.values(errors).map((err, i) => (
//                 <li key={i}>{err}</li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Actions */}
//         <div className="flex justify-between py-3">
//           <button
//             type="button"
//             onClick={onPrev}
//             className="flex items-center px-4 py-2 text-xs border rounded-md text-black-600 hover:bg-gray-100"
//           >
//             <FaArrowLeft className="mr-2" /> Previous
//           </button>
//           <button
//             type="submit"
//             className="flex items-center px-6 py-2 text-xs bg-teal-400 text-white rounded-md hover:bg-teal-500"
//           >
//             Next <FaArrowRight className="ml-2" />
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ProfessionalStep;

// src/components/ProfessionalStep.jsx
import { BriefcaseIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useTranslation } from "../../contexts/LanguageProvider";

const ProfessionalStep = ({ formData, setFormData, onNext, onPrev }) => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});
  const [showTopAlert, setShowTopAlert] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.personal_intro?.trim())
      newErrors.personal_intro = t("professional.errors.personal_intro");
    if (!formData.exp_vision?.trim())
      newErrors.exp_vision = t("professional.errors.exp_vision");

    setErrors(newErrors);
    setShowTopAlert(Object.keys(newErrors).length > 0); // show orange alert
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-sm border">
      {/* Header */}
      <div className="flex flex-col items-center mb-4">
        <BriefcaseIcon className="h-10 w-10 text-orange-400 mb-2" />
        <h2 className="text-xl font-semibold">
          {t("professional.title")}
        </h2>
        <p className="text-gray-500 text-sm text-center">
          {t("professional.subtitle")}
        </p>
      </div>

      {showTopAlert && (
        <div className="bg-orange-50 border border-orange-200 text-orange-600 px-4 py-3 rounded-md text-xs mb-4 text-center">
          {t("professional.note_required")}
        </div>
      )}

      {!showTopAlert && (
        <div className="bg-orange-50 border border-orange-200 text-orange-600 px-4 py-3 rounded-md text-xs mb-4 text-center">
          {t("professional.hint")}
        </div>
      )}

      <form onSubmit={handleNext} className="space-y-5">
        {/* Row: Years of Experience + Career Level */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("professional.years_label")}
            </label>
            <input
              type="number"
              name="experience_in_year"
              value={formData.experience_in_year ?? ""}
              onChange={handleChange}
              className="mt-1 block w-full bg-gray-100 border placeholder:text-sm rounded-md p-2"
              placeholder={t("professional.years_placeholder")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("professional.career_level_label")}
            </label>
            <select
              name="experience_in_level"
              value={formData.experience_in_level ?? ""}
              onChange={handleChange}
              className="mt-1 block w-full bg-gray-100 border placeholder:text-sm rounded-md p-2"
            >
              <option value="">{t("professional.career_level_placeholder")}</option>
              <option value="entry">{t("professional.level_entry")}</option>
              <option value="mid">{t("professional.level_mid")}</option>
              <option value="senior">{t("professional.level_senior")}</option>
              <option value="expert">{t("professional.level_expert")}</option>
            </select>
          </div>
        </div>

        {/* Personal Introduction */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("professional.personal_intro_label")} *
          </label>
          <textarea
            name="personal_intro"
            rows="3"
            value={formData.personal_intro ?? ""}
            onChange={handleChange}
            className={`mt-1 block w-full bg-gray-100 border placeholder:text-sm ${
              errors.personal_intro ? "border-red-400" : "border-gray-300"
            } rounded-md p-2`}
            placeholder={t("professional.personal_intro_placeholder")}
          />
        </div>

        {/* Creative Vision */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("professional.exp_vision_label")} *
          </label>
          <textarea
            name="exp_vision"
            rows="3"
            value={formData.exp_vision ?? ""}
            onChange={handleChange}
            className={`mt-1 block w-full bg-gray-100 border placeholder:text-sm ${
              errors.exp_vision ? "border-red-400" : "border-gray-300"
            } rounded-md p-2`}
            placeholder={t("professional.exp_vision_placeholder")}
          />
        </div>

        {/* Error Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            <p>{t("professional.error_summary")}</p>
            <ul className="list-disc list-inside">
              {Object.values(errors).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between py-3">
          <button
            type="button"
            onClick={onPrev}
            className="flex items-center px-4 py-2 text-xs border rounded-md text-black hover:bg-gray-100"
          >
            <FaArrowLeft className="mr-2" /> {t("professional.prev")}
          </button>
          <button
            type="submit"
            className="flex items-center px-6 py-2 text-xs bg-teal-400 text-white rounded-md hover:bg-teal-500"
          >
            {t("professional.next")} <FaArrowRight className="ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfessionalStep;
