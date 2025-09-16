// import { FaArrowLeft, FaCheckCircle, FaUserCheck } from "react-icons/fa";
// import { useState } from "react";
// import AgeVerificationModal from "./AgeVerificationModal";

// const ProfileSettingsStep = ({ formData, setFormData, onPrev, onSubmit }) => {
//     const toggleSection = (key) => {
//         setFormData({ ...formData, [key]: formData[key]  === 1 ? 0 : 1 });
//     };

//     const [showModal, setShowModal] = useState(false);

//     return (
//         <div className="w-full max-w-3xl bg-white rounded-lg p-8 shadow">
//             {/* Icon + Heading */}
//             <div className="flex justify-center mb-2">
//                 <FaCheckCircle className="text-5xl text-orange-400" />
//             </div>
//             <h2 className="text-xl font-semibold text-center">Almost There!</h2>
//             <p className="text-gray-500 text-center mb-6 text-sm">
//                 Customize your profile settings and privacy
//             </p>

//             {/* Profile Sections Toggles */}
//             <div className="mb-6">
//                 <h3 className="text-sm font-medium text-gray-700 mb-3">
//                     Profile Sections to Display
//                 </h3>
//                 <div className="space-y-3">
//                     {[
//                         "education_visible",
//                         "pricing_visible",
//                         "client_review_visible",
//                         "professions_visible",
//                     ].map((key, idx) => (
//                         <div
//                             key={idx}
//                             className="flex items-center space-x-3 border-b pb-2"
//                         >
//                             <button
//                                 type="button"
//                                 onClick={() => toggleSection(key)}
//                                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData[key] ? "bg-teal-500" : "bg-gray-300"
//                                     }`}
//                             >
//                                 <span
//                                     className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData[key] ? "translate-x-6" : "translate-x-1"
//                                         }`}
//                                 />
//                             </button>

//                             <span className="text-gray-700 text-sm capitalize">
//                                 {key === "education_visible" && "Education & Training"}
//                                 {key === "pricing_visible" && "Pricing Information"}
//                                 {key === "client_review_visible" && "Client Reviews"}
//                                 {key === "professions_visible" && "Professional Endorsements"}
//                             </span>
//                         </div>

//                     ))}
//                 </div>
//             </div>

//             {/* Info Card */}
//             <div className="mb-6 p-4 rounded-md border bg-gradient-to-r from-green-50 to-green-100">
//                 <p className="text-sm font-medium text-gray-800">
//                     Ready to Create, Connect, and Collaborate?
//                 </p>
//                 <p className="text-xs text-gray-600">
//                     Your profile will help other creatives and clients discover your
//                     amazing work!
//                 </p>
//             </div>

//             {/* Next Steps */}
//             <div className="mb-6 p-4 rounded-md border bg-blue-50">
//                 <h3 className="text-sm font-medium text-gray-800 flex items-center mb-2">
//                     <FaUserCheck className="mr-2 text-teal-500" /> Next Steps
//                 </h3>
//                 <ul className="space-y-1 text-sm text-gray-700">
//                     <li>✓ Age verification and privacy consent</li>
//                     <li>✓ GDPR-compliant data processing</li>
//                     <li>✓ Email verification for security</li>
//                     <li>✓ Profile creation and activation</li>
//                 </ul>
//             </div>

//             {/* Navigation */}
//             <div className="flex justify-between pt-4">
//                 <button
//                     type="button"
//                     onClick={onPrev}
//                     className="flex items-center px-4 py-2 text-xs border rounded-md text-gray-700 hover:bg-gray-100"
//                 >
//                     <FaArrowLeft className="mr-2" /> Previous
//                 </button>
//                 <button
//                     type="button"
//                     onClick={() => setShowModal(true)}
//                     className="flex items-center px-6 py-2 text-xs bg-orange-500 text-white rounded-md hover:bg-orange-600"
//                 >
//                     Create Profile
//                 </button>
//             </div>

//             {/* Age Verification Modal */}
//             <AgeVerificationModal
//                 isOpen={showModal}
//                 onClose={() => setShowModal(false)}
//                 onSubmit={() => onSubmit(formData)}
//                 formData={formData}
//                 setFormData={setFormData}
//             />

//         </div>
//     );
// };

// export default ProfileSettingsStep;


// src/components/ProfileSettingsStep.jsx
import { FaArrowLeft, FaCheckCircle, FaUserCheck } from "react-icons/fa";
import { useState } from "react";
import AgeVerificationModal from "./AgeVerificationModal";
import { useTranslation } from "../../contexts/LanguageProvider";

const ProfileSettingsStep = ({ formData, setFormData, onPrev, onSubmit }) => {
  const { t } = useTranslation();

  const toggleSection = (key) => {
    setFormData({ ...formData, [key]: formData[key] === 1 ? 0 : 1 });
  };

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-full max-w-3xl bg-white rounded-lg p-8 shadow">
      {/* Icon + Heading */}
      <div className="flex justify-center mb-2">
        <FaCheckCircle className="text-5xl text-orange-400" />
      </div>
      <h2 className="text-xl font-semibold text-center">{t("profile_settings.title")}</h2>
      <p className="text-gray-500 text-center mb-6 text-sm">
        {t("profile_settings.subtitle")}
      </p>

      {/* Profile Sections Toggles */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          {t("profile_settings.sections_title")}
        </h3>
        <div className="space-y-3">
          {[
            "education_visible",
            "pricing_visible",
            "client_review_visible",
            "professions_visible",
          ].map((key, idx) => (
            <div key={idx} className="flex items-center space-x-3 border-b pb-2">
              <button
                type="button"
                onClick={() => toggleSection(key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData[key] ? "bg-teal-500" : "bg-gray-300"
                  }`}
                aria-pressed={formData[key] === 1}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData[key] ? "translate-x-6" : "translate-x-1"
                    }`}
                />
              </button>

              <span className="text-gray-700 text-sm">
                {key === "education_visible" && t("profile_settings.education")}
                {key === "pricing_visible" && t("profile_settings.pricing")}
                {key === "client_review_visible" && t("profile_settings.client_reviews")}
                {key === "professions_visible" && t("profile_settings.endorsements")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <div className="mb-6 p-4 rounded-md border bg-gradient-to-r from-green-50 to-green-100">
        <p className="text-sm font-medium text-gray-800">{t("profile_settings.ready_title")}</p>
        <p className="text-xs text-gray-600">{t("profile_settings.ready_subtitle")}</p>
      </div>

      {/* Next Steps */}
      <div className="mb-6 p-4 rounded-md border bg-blue-50">
        <h3 className="text-sm font-medium text-gray-800 flex items-center mb-2">
          <FaUserCheck className="mr-2 text-teal-500" /> {t("profile_settings.next_steps_title")}
        </h3>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>✓ {t("profile_settings.step_age_verification")}</li>
          <li>✓ {t("profile_settings.step_gdpr")}</li>
          <li>✓ {t("profile_settings.step_email_verification")}</li>
          <li>✓ {t("profile_settings.step_profile_activation")}</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center px-4 py-2 text-xs border rounded-md text-gray-700 hover:bg-gray-100"
        >
          <FaArrowLeft className="mr-2" /> {t("profile_settings.prev")}
        </button>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center px-6 py-2 text-xs bg-orange-500 text-white rounded-md hover:bg-orange-600"
        >
          {t("profile_settings.create_profile")}
        </button>
      </div>

      {/* Age Verification Modal */}
      <AgeVerificationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={() => onSubmit(formData)}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default ProfileSettingsStep;
