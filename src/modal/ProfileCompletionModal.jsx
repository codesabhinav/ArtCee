// // ProfileCompletionModal.jsx
// import { useState } from "react"
// import { Star, X, CircleCheck as CircleCheckBig } from "lucide-react"


// const ProfileCompletionModal = ({ onClose, progress = 71, sectionsCompleted = "5/7" }) => {
//   const [p] = useState(progress)

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ">
//       <div
//         className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] relative p-6 text-gray-700 overflow-y-auto scrollbar-hide"
//         role="dialog"
//         aria-modal="true"
//       >
//         {/* Close Button */}
//         <div className="absolute right-4 top-4">
//           <button
//             onClick={onClose}
//             className="p-1 rounded hover:bg-gray-100 text-gray-600"
//             aria-label="Close"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {/* Header */}
//         <div className="text-center mt-2">
//           <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-teal-400 to-orange-400 text-white mb-3">
//             <Star className="h-7 w-7" />
//           </div>

//           <h2 className="text-[16px] font-medium text-gray-900">
//             Welcome back! Ready to get discovered?
//           </h2>

//           <p className="text-[13px] text-gray-600 mt-2 font-light max-w-2xl mx-auto">
//             Complete your profile to unlock premium features and connect with potential clients.
//           </p>

//           <div className="mt-3 flex items-center justify-center gap-3">
//             <div className="text-[11px] text-yellow-800 bg-yellow-50 border border-yellow-100 px-3 py-1 rounded-md font-medium">
//               Profile Incomplete
//             </div>
//             <div className="text-[11px] text-gray-500 font-light">
//               {sectionsCompleted} sections completed
//             </div>
//           </div>
//         </div>

//         {/* Progress */}
//         <div className="mt-5">
//           <div className="flex justify-between items-center mb-2">
//             <div className="text-[13px] font-semibold text-gray-800">Profile Completion</div>
//             <div className="text-[12px] text-gray-500">{p}%</div>
//           </div>

//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div
//               className="bg-[#0f1724] h-2 rounded-full"
//               style={{ width: `${p}%` }}
//             />
//           </div>
//         </div>

//         {/* Benefits */}
//         <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="flex items-start gap-3 rounded-lg bg-teal-50 p-4 text-[13px]">
//             <CircleCheckBig className="w-6 h-6 text-teal-500" />
//             <div>
//               <div className="font-medium text-teal-800">Get featured in search results</div>
//               <div className="text-xs text-teal-700/70">Build your discovery & reach</div>
//             </div>
//           </div>

//           <div className="flex items-start gap-3 rounded-lg bg-rose-50 p-4 text-[13px]">
//             <CircleCheckBig className="w-6 h-6 text-rose-500" />
//             <div>
//               <div className="font-medium text-rose-800">Receive booking requests</div>
//               <div className="text-xs text-rose-700/70">Connect with potential clients</div>
//             </div>
//           </div>

//           <div className="flex items-start gap-3 rounded-lg bg-teal-50 p-4 text-[13px]">
//             <CircleCheckBig className="w-6 h-6 text-teal-500" />
//             <div>
//               <div className="font-medium text-teal-800">Build your professional network</div>
//               <div className="text-xs text-teal-700/70">Collaborate and grow</div>
//             </div>
//           </div>

//           <div className="flex items-start gap-3 rounded-lg bg-rose-50 p-4 text-[13px]">
//             <CircleCheckBig className="w-6 h-6 text-rose-500" />
//             <div>
//               <div className="font-medium text-rose-800">Access to premium features</div>
//               <div className="text-xs text-rose-700/70">Unlock extra tools to grow your profile</div>
//             </div>
//           </div>
//         </div>

//         {/* Required Sections */}
//         <div className="mt-6">
//           <div className="flex items-center justify-between text-[13px] font-semibold text-gray-700 mb-3">
//             <div>Required for Profile Activation</div>
//             <div className="text-xs text-gray-500">{sectionsCompleted}</div>
//           </div>

//           <div className="space-y-3">
//             {[
//               {
//                 title: "Basic Information",
//                 desc: "Name, email, and creative specialty",
//                 completed: true,
//               },
//               {
//                 title: "Location Details",
//                 desc: "City and state/province",
//                 completed: true,
//               },
//               {
//                 title: "Personal Intro & Vision",
//                 desc: "Personal introduction and creative vision",
//                 completed: false,
//               },
//               {
//                 title: "Profile Image/Video",
//                 desc: "Profile photo or creative showcase video",
//                 completed: false,
//               },
//               {
//                 title: "Email Verification",
//                 desc: "Verify your email address",
//                 completed: true,
//               },
//             ].map((item, idx) => (
//               <div
//                 key={idx}
//                 className={`flex items-center justify-between rounded-lg p-3 text-[13px] ${
//                   item.completed
//                     ? "bg-green-50 border border-green-100"
//                     : "bg-gray-50 border border-gray-100"
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   {item.completed ? (
//                     <CircleCheckBig className="w-5 h-5 text-green-600" />
//                   ) : (
//                     <div className="w-5 h-5 flex items-center justify-center border border-gray-300 rounded-full text-gray-400 text-xs">
//                       ○
//                     </div>
//                   )}
//                   <div>
//                     <div className="font-medium text-gray-800">{item.title}</div>
//                     <div className="text-xs text-gray-500">{item.desc}</div>
//                   </div>
//                 </div>
//                 <button className="px-3 py-1.5 text-[12px] border rounded-full bg-white">
//                   Complete
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Optional Enhancements */}
//         <div className="mt-6">
//           <div className="text-[13px] font-semibold text-gray-700 mb-3">Optional Enhancements</div>

//           <div className="space-y-3">
//             <div className="flex items-start gap-3 bg-sky-50 border border-sky-100 rounded-lg p-3 text-[13px]">
//               <CircleCheckBig className="w-5 h-5 text-sky-600 mt-0.5" />
//               <div>
//                 <div className="font-medium text-gray-800">Portfolio Work</div>
//                 <div className="text-xs text-gray-500">Showcase your best creative work</div>
//               </div>
//             </div>

//             <div className="flex items-start gap-3 bg-sky-50 border border-sky-100 rounded-lg p-3 text-[13px]">
//               <CircleCheckBig className="w-5 h-5 text-sky-600 mt-0.5" />
//               <div>
//                 <div className="font-medium text-gray-800">Services & Skills</div>
//                 <div className="text-xs text-gray-500">Services offered and skill categories</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="mt-6">
//           <div className="flex gap-3">
//             <button className="flex-1 bg-teal-500 text-white py-2 rounded-md text-xs font-medium">
//               Complete My Profile
//             </button>
//             <button onClick={onClose} className="flex-1 border py-2 rounded-md text-xs font-medium hover:bg-gray-200">
//               Skip for Now
//             </button>
//           </div>

//           <p className="text-[11px] text-center text-gray-400 mt-3">
//             Takes about 5–10 minutes to complete • You can save progress and continue later
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProfileCompletionModal


// src/components/ProfileCompletionModal.jsx
import { useState } from "react";
import { Star, X, CircleCheck as CircleCheckBig } from "lucide-react";
import { useTranslation } from "../contexts/LanguageProvider";
import { useNavigate } from "react-router-dom";

const ProfileCompletionModal = ({ onClose, progress = 71, sectionsCompleted = "5/7" }) => {
  const { t } = useTranslation();
  const [p] = useState(progress);
   const navigate = useNavigate(); 

  // example required items (you can replace these with real data)
  const requiredItems = [
    {
      titleKey: "profile_completion.required.basic_info.title",
      descKey: "profile_completion.required.basic_info.desc",
      completed: true,
    },
    {
      titleKey: "profile_completion.required.location.title",
      descKey: "profile_completion.required.location.desc",
      completed: true,
    },
    {
      titleKey: "profile_completion.required.intro.title",
      descKey: "profile_completion.required.intro.desc",
      completed: false,
    },
    {
      titleKey: "profile_completion.required.media.title",
      descKey: "profile_completion.required.media.desc",
      completed: false,
    },
    {
      titleKey: "profile_completion.required.email_verify.title",
      descKey: "profile_completion.required.email_verify.desc",
      completed: true,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] relative p-6 text-gray-700 overflow-y-auto scrollbar-hide"
        role="dialog"
        aria-modal="true"
        aria-label={t("profile_completion.aria_label")}
      >
        {/* Close Button */}
        <div className="absolute right-4 top-4">
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 text-gray-600"
            aria-label={t("profile_completion.close")}
          >
            <X size={18} />
          </button>
        </div>

        {/* Header */}
        <div className="text-center mt-2">
          <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-teal-400 to-orange-400 text-white mb-3">
            <Star className="h-7 w-7" />
          </div>

          <h2 className="text-[16px] font-medium text-gray-900">
            {t("profile_completion.welcome_title")}
          </h2>

          <p className="text-[13px] text-gray-600 mt-2 font-light max-w-2xl mx-auto">
            {t("profile_completion.subtitle")}
          </p>

          <div className="mt-3 flex items-center justify-center gap-3">
            <div className="text-[11px] text-yellow-800 bg-yellow-50 border border-yellow-100 px-3 py-1 rounded-md font-medium">
              {t("profile_completion.badge.incomplete")}
            </div>
            <div className="text-[11px] text-gray-500 font-light">
              {sectionsCompleted} {t("profile_completion.sections_completed_label")}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="flex justify-between items-center mb-2">
            <div className="text-[13px] font-semibold text-gray-800">{t("profile_completion.progress_label")}</div>
            <div className="text-[12px] text-gray-500">{p}%</div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#0f1724] h-2 rounded-full"
              style={{ width: `${p}%` }}
            />
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 rounded-lg bg-teal-50 p-4 text-[13px]">
            <CircleCheckBig className="w-6 h-6 text-teal-500" />
            <div>
              <div className="font-medium text-teal-800">{t("profile_completion.benefits.featured")}</div>
              <div className="text-xs text-teal-700/70">{t("profile_completion.benefits.featured_desc")}</div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-rose-50 p-4 text-[13px]">
            <CircleCheckBig className="w-6 h-6 text-rose-500" />
            <div>
              <div className="font-medium text-rose-800">{t("profile_completion.benefits.booking")}</div>
              <div className="text-xs text-rose-700/70">{t("profile_completion.benefits.booking_desc")}</div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-teal-50 p-4 text-[13px]">
            <CircleCheckBig className="w-6 h-6 text-teal-500" />
            <div>
              <div className="font-medium text-teal-800">{t("profile_completion.benefits.network")}</div>
              <div className="text-xs text-teal-700/70">{t("profile_completion.benefits.network_desc")}</div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-rose-50 p-4 text-[13px]">
            <CircleCheckBig className="w-6 h-6 text-rose-500" />
            <div>
              <div className="font-medium text-rose-800">{t("profile_completion.benefits.premium")}</div>
              <div className="text-xs text-rose-700/70">{t("profile_completion.benefits.premium_desc")}</div>
            </div>
          </div>
        </div>

        {/* Required Sections */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-[13px] font-semibold text-gray-700 mb-3">
            <div>{t("profile_completion.required_title")}</div>
            <div className="text-xs text-gray-500">{sectionsCompleted}</div>
          </div>

          <div className="space-y-3">
            {requiredItems.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between rounded-lg p-3 text-[13px] ${
                  item.completed
                    ? "bg-green-50 border border-green-100"
                    : "bg-gray-50 border border-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.completed ? (
                    <CircleCheckBig className="w-5 h-5 text-green-600" />
                  ) : (
                    <div className="w-5 h-5 flex items-center justify-center border border-gray-300 rounded-full text-gray-400 text-xs">
                      ○
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-gray-800">{t(item.titleKey)}</div>
                    <div className="text-xs text-gray-500">{t(item.descKey)}</div>
                  </div>
                </div>
                <button className="px-3 py-1.5 text-[12px] border rounded-full bg-white">
                  {t("profile_completion.complete_button")}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Optional Enhancements */}
        <div className="mt-6">
          <div className="text-[13px] font-semibold text-gray-700 mb-3">{t("profile_completion.optional_title")}</div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-sky-50 border border-sky-100 rounded-lg p-3 text-[13px]">
              <CircleCheckBig className="w-5 h-5 text-sky-600 mt-0.5" />
              <div>
                <div className="font-medium text-gray-800">{t("profile_completion.optional.portfolio_title")}</div>
                <div className="text-xs text-gray-500">{t("profile_completion.optional.portfolio_desc")}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-sky-50 border border-sky-100 rounded-lg p-3 text-[13px]">
              <CircleCheckBig className="w-5 h-5 text-sky-600 mt-0.5" />
              <div>
                <div className="font-medium text-gray-800">{t("profile_completion.optional.services_title")}</div>
                <div className="text-xs text-gray-500">{t("profile_completion.optional.services_desc")}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6">
          <div className="flex gap-3">
            <button className="flex-1 bg-teal-500 text-white py-2 rounded-md text-xs font-medium"
             onClick={() => navigate("/guest-dashboard")}  >
              {t("profile_completion.primary_cta")}
            </button>
            <button onClick={onClose} className="flex-1 border py-2 rounded-md text-xs font-medium hover:bg-gray-200">
              {t("profile_completion.secondary_cta")}
            </button>
          </div>

          <p className="text-[11px] text-center text-gray-400 mt-3">
            {t("profile_completion.help_text")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;
