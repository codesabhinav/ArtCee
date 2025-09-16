// import React from "react";
// import { FaCheckCircle, FaRegCircle, FaChevronRight } from "react-icons/fa";

// const OPTIONAL_KEYS = [
//   "PERSONAL_BIO",
//   "SERVICE_SKILL_ADDED",
//   "PORTIFLIO_WORK",
//   "SOCAIL_LINK",
//   "PRICING_INFO",
// ];

// const LABELS = {
//   BASIC_INFO: "Basic Information",
//   LOCATION: "Location Details",
//   PERSONAL_INTRO: "Personal Intro & Vision",
//   PROFILE_IMAGE_VID: "Profile Image/Video",
//   EMAIL_VERIFY: "Email Verification",
//   PERSONAL_BIO: "Professional Bio",
//   SERVICE_SKILL_ADDED: "Services & Skills",
//   PORTIFLIO_WORK: "Portfolio Work",
//   SOCAIL_LINK: "Social Media Links",
//   PRICING_INFO: "Pricing Information",
// };

// const ProfileSteps = ({ data = {}, openStepModal }) => {
//   const total = Array.isArray(data.total_activities) ? data.total_activities : [];
//   const completed = new Set(Array.isArray(data.completed_activities) ? data.completed_activities : []);

//   const optionalFromServer = total.filter((k) => OPTIONAL_KEYS.includes(k));
//   const requiredFromServer = total.filter((k) => !OPTIONAL_KEYS.includes(k));

//   const requiredCompletedCount = requiredFromServer.filter((k) => completed.has(k)).length;

//   return (
//     <div className="space-y-6">
//       {/* Header row */}
//       <div className="flex items-start justify-between">
//         <h4 className="text-sm font-semibold">Required for Profile Activation</h4>
//         <div className="text-xs text-gray-400">
//           {requiredCompletedCount}/{requiredFromServer.length || 0}
//         </div>
//       </div>

//       {/* Required steps list */}
//       <div className="space-y-3">
//         {requiredFromServer.map((act) => {
//           const done = completed.has(act);
//           const label = LABELS[act] || act;

//           return (
//             <div
//               key={act}
//               className={`flex items-center justify-between rounded-lg px-4 py-3 border transition
//                 ${done ? "bg-green-50 border-green-200" : "bg-white border-gray-100 hover:shadow-sm"}`}
//             >
//               <div className="flex items-start gap-3">
//                 <div className={`mt-0.5 flex items-center justify-center rounded-full w-7 h-7 ${done ? "bg-green-100 text-green-600" : "border border-gray-200 text-gray-400"}`}>
//                   {done ? <FaCheckCircle className="w-4 h-4" /> : <FaRegCircle className="w-4 h-4" />}
//                 </div>

//                 <div>
//                   <div className={`text-xs font-medium ${done ? "text-gray-900" : "text-gray-800"}`}>{label}</div>
//                   <div className="text-xs text-gray-500 mt-0.5">{done ? "Completed" : "Pending"}</div>
//                 </div>
//               </div>

//               <button
//                 onClick={() => openStepModal(act)}
//                 className="text-gray-400 hover:text-gray-600 p-2 rounded-full"
//                 aria-label={`${done ? "Edit" : "Complete"} ${label}`}
//               >
//                 <FaChevronRight />
//               </button>
//             </div>
//           );
//         })}
//       </div>

//       {/* Optional header */}
//       <div className="flex items-start justify-between">
//         <h4 className="text-sm font-semibold">Optional Enhancements</h4>
//         <div className="text-xs text-gray-400">{optionalFromServer.length}/5</div>
//       </div>

//       {/* Optional list */}
//       <div className="space-y-3">
//         {optionalFromServer.map((act) => {
//           const label = LABELS[act] || act;
//           const done = completed.has(act);

//           return (
//             <div
//               key={act}
//               className={`flex items-center justify-between rounded-lg px-4 py-3 border transition
//                 ${done ? "bg-green-50 border-green-200" : "bg-white border-gray-100 hover:shadow-sm"}`}
//             >
//               <div className="flex items-start gap-3">
//                 <div className={`mt-0.5 flex items-center justify-center rounded-full w-7 h-7 ${done ? "bg-green-100 text-green-600" : "border border-gray-200 text-gray-400"}`}>
//                   {done ? <FaCheckCircle className="w-4 h-4" /> : <FaRegCircle className="w-4 h-4" />}
//                 </div>

//                 <div>
//                   <div className={`text-xs font-medium ${done ? "text-gray-900" : "text-gray-800"}`}>{label}</div>
//                   <div className="text-xs text-gray-500 mt-0.5">
//                     {act === "PERSONAL_BIO" && "Detailed professional biography"}
//                     {act === "SERVICE_SKILL_ADDED" && "Services offered and skill categories"}
//                     {act === "PORTIFLIO_WORK" && "Showcase your best creative work"}
//                     {act === "SOCAIL_LINK" && "Connect your social media profiles"}
//                     {act === "PRICING_INFO" && "Your starting rates and pricing"}
//                     {!["PERSONAL_BIO","SERVICE_SKILL_ADDED","PORTIFLIO_WORK","SOCAIL_LINK","PRICING_INFO"].includes(act) && "Optional"}
//                   </div>
//                 </div>
//               </div>

//               <button
//                 onClick={() => openStepModal(act)}
//                 className="text-gray-400 hover:text-gray-600 p-2 rounded-full"
//                 aria-label={`Open ${label}`}
//               >
//                 <FaChevronRight />
//               </button>
//             </div>
//           );
//         })}

//         {optionalFromServer.length === 0 && (
//           <div className="text-xs text-gray-400">No optional enhancements available.</div>
//         )}
//       </div>

//       <div className="bg-yellow-50 text-yellow-700 text-xs px-4 py-3 rounded-md">
//         Complete the required fields above to activate your profile and start getting discovered by potential clients.
//       </div>
//     </div>
//   );
// };

// export default ProfileSteps;

// src/components/ProfileSteps.jsx
import React from "react";
import { FaCheckCircle, FaRegCircle, FaChevronRight } from "react-icons/fa";
import { useTranslation } from "../contexts/LanguageProvider";

const OPTIONAL_KEYS = [
  "PERSONAL_BIO",
  "SERVICE_SKILL_ADDED",
  "PORTIFLIO_WORK",
  "SOCAIL_LINK",
  "PRICING_INFO",
];

// fallback labels if translations are missing
const FALLBACK_LABELS = {
  BASIC_INFO: "Basic Information",
  LOCATION: "Location Details",
  PERSONAL_INTRO: "Personal Intro & Vision",
  PROFILE_IMAGE_VID: "Profile Image/Video",
  EMAIL_VERIFY: "Email Verification",
  PERSONAL_BIO: "Professional Bio",
  SERVICE_SKILL_ADDED: "Services & Skills",
  PORTIFLIO_WORK: "Portfolio Work",
  SOCAIL_LINK: "Social Media Links",
  PRICING_INFO: "Pricing Information",
};

const ProfileSteps = ({ data = {}, openStepModal }) => {
  const { t } = useTranslation();

  const total = Array.isArray(data.total_activities) ? data.total_activities : [];
  const completed = new Set(Array.isArray(data.completed_activities) ? data.completed_activities : []);

  const optionalFromServer = total.filter((k) => OPTIONAL_KEYS.includes(k));
  const requiredFromServer = total.filter((k) => !OPTIONAL_KEYS.includes(k));

  const requiredCompletedCount = requiredFromServer.filter((k) => completed.has(k)).length;

  const labelFor = (key) => {
    // prefer translation; fallback to known labels; otherwise return raw key
    const transKey = `profile_steps.labels.${key}`;
    const translated = t(transKey);
    if (translated && translated !== transKey) return translated;
    return FALLBACK_LABELS[key] || key;
  };

  const descForOptional = (key) => {
    const transKey = `profile_steps.descriptions.${key}`;
    const translated = t(transKey);
    if (translated && translated !== transKey) return translated;

    // fallback short descriptions (english)
    const FALLBACK_DESC = {
      PERSONAL_BIO: "Detailed professional biography",
      SERVICE_SKILL_ADDED: "Services offered and skill categories",
      PORTIFLIO_WORK: "Showcase your best creative work",
      SOCAIL_LINK: "Connect your social media profiles",
      PRICING_INFO: "Your starting rates and pricing",
    };
    return FALLBACK_DESC[key] || t("profile_steps.descriptions.default");
  };

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-start justify-between">
        <h4 className="text-sm font-semibold">{t("profile_steps.required_title")}</h4>
        <div className="text-xs text-gray-400">
          {requiredCompletedCount}/{requiredFromServer.length || 0}
        </div>
      </div>

      {/* Required steps list */}
      <div className="space-y-3">
        {requiredFromServer.map((act) => {
          const done = completed.has(act);
          const label = labelFor(act);
          const statusLabel = done ? t("profile_steps.status.completed") : t("profile_steps.status.pending");

          return (
            <div
              key={act}
              className={`flex items-center justify-between rounded-lg px-4 py-3 border transition
                ${done ? "bg-green-50 border-green-200" : "bg-white border-gray-100 hover:shadow-sm"}`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex items-center justify-center rounded-full w-7 h-7 ${done ? "bg-green-100 text-green-600" : "border border-gray-200 text-gray-400"}`}>
                  {done ? <FaCheckCircle className="w-4 h-4" /> : <FaRegCircle className="w-4 h-4" />}
                </div>

                <div>
                  <div className={`text-xs font-medium ${done ? "text-gray-900" : "text-gray-800"}`}>{label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{statusLabel}</div>
                </div>
              </div>

              <button
                onClick={() => openStepModal(act)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full"
                aria-label={`${t(done ? "profile_steps.aria.edit" : "profile_steps.aria.complete", { label })}`}
              >
                <FaChevronRight />
              </button>
            </div>
          );
        })}
      </div>

      {/* Optional header */}
      <div className="flex items-start justify-between">
        <h4 className="text-sm font-semibold">{t("profile_steps.optional_title")}</h4>
        <div className="text-xs text-gray-400">{optionalFromServer.length}/{OPTIONAL_KEYS.length}</div>
      </div>

      {/* Optional list */}
      <div className="space-y-3">
        {optionalFromServer.map((act) => {
          const label = labelFor(act);
          const done = completed.has(act);
          const desc = descForOptional(act);

          return (
            <div
              key={act}
              className={`flex items-center justify-between rounded-lg px-4 py-3 border transition
                ${done ? "bg-green-50 border-green-200" : "bg-white border-gray-100 hover:shadow-sm"}`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex items-center justify-center rounded-full w-7 h-7 ${done ? "bg-green-100 text-green-600" : "border border-gray-200 text-gray-400"}`}>
                  {done ? <FaCheckCircle className="w-4 h-4" /> : <FaRegCircle className="w-4 h-4" />}
                </div>

                <div>
                  <div className={`text-xs font-medium ${done ? "text-gray-900" : "text-gray-800"}`}>{label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                </div>
              </div>

              <button
                onClick={() => openStepModal(act)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full"
                aria-label={t("profile_steps.aria.open", { label })}
              >
                <FaChevronRight />
              </button>
            </div>
          );
        })}

        {optionalFromServer.length === 0 && (
          <div className="text-xs text-gray-400">{t("profile_steps.no_optional")}</div>
        )}
      </div>

      <div className="bg-yellow-50 text-yellow-700 text-xs px-4 py-3 rounded-md">
        {t("profile_steps.help_text")}
      </div>
    </div>
  );
};

export default ProfileSteps;
