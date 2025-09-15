// // components/ViewJobDetailsModel.jsx
// import { useState, useEffect } from "react";

// const DEFAULT_JOB_IMAGE =
//   "https://img.myloview.com/posters/businessman-avatar-image-with-beard-hairstyle-male-profile-vector-illustration-700-201088702.jpg";

// const ViewJobDetailsModel = ({ job, open, onClose, onOpenApply }) => {
//   const [applied, setApplied] = useState(job?.applied || false);

//   useEffect(() => {
//     setApplied(job?.applied || false);
//   }, [job]);

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative overflow-auto max-h-[90vh]">
//         <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">✕</button>

//         <div className="flex items-center gap-4">
//           <img
//             src={job.thumbnail || job.image || DEFAULT_JOB_IMAGE}
//             alt={job.title}
//             className="w-20 h-20 rounded-md object-contain flex-shrink-0 border-2"
//             onError={(e) => { if (e.currentTarget.src !== DEFAULT_JOB_IMAGE) e.currentTarget.src = DEFAULT_JOB_IMAGE; }}
//           />
//           <div className="flex-1">
//             <h2 className="text-md font-bold">{job.title}</h2>
//             <p className="text-sm text-gray-600">{job.company_name}</p>
//             {/* <p className="text-xs text-gray-500 mt-1">{job.location}</p>
//             <div className="mt-2 text-xs text-gray-500 flex gap-3 flex-wrap">
//               {job.detected_extensions?.posted_at && <span>{job.detected_extensions.posted_at}</span>}
//               {job.detected_extensions?.schedule_type && <span>{job.detected_extensions.schedule_type}</span>}
//               {job.detected_extensions?.qualifications && <span>{job.detected_extensions.qualifications}</span>}
//             </div> */}
//           </div>
//         </div>

//         <div className="mt-6">
//           <h3 className="font-bold mb-2">Job Description</h3>
//           <div className="text-gray-700 whitespace-pre-wrap text-sm">{job?.description}</div>
//         </div>

//         {Array.isArray(job?.job_highlights) && job.job_highlights.length > 0 && (
//           <div className="mt-6">
//             {job.job_highlights.map((section, i) => (
//               <div key={i} className="mb-4">
//                 <h4 className="font-bold">{section.title}</h4>
//                 <ul className="list-disc list-inside mt-2 text-gray-700">
//                   {section.items.map((it, ii) => <li key={ii} className="text-sm">{it}</li>)}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         )}

//         {Array.isArray(job?.extensions) && job.extensions.length > 0 && (
//           <div className="my-4 text-sm text-gray-600">
//             <strong>Quick facts:</strong>
//             <div className="flex gap-3 mt-2 flex-wrap">
//               {job.extensions.map((ex, i) => <span key={i} className="bg-gray-100 px-2 py-1 rounded text-xs">{ex}</span>)}
//             </div>
//           </div>
//         )}

//         <div className="flex flex-col items-end gap-2 border-t pt-4">
//             {applied ? (
//               <button disabled className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md text-sm">Applied</button>
//             ) : (
//               <button onClick={() => onOpenApply && onOpenApply(job)} className="px-4 py-2 bg-teal-500 text-white rounded-md text-xs font-semibold">Apply Now</button>
//             )}
//           </div>
//       </div>
      
//     </div>
//   );
// };

// export default ViewJobDetailsModel;


import { useState, useEffect } from "react";
import { useTranslation } from "../contexts/LanguageProvider"; // adjust path if needed

const DEFAULT_JOB_IMAGE =
  "https://img.myloview.com/posters/businessman-avatar-image-with-beard-hairstyle-male-profile-vector-illustration-700-201088702.jpg";

const ViewJobDetailsModel = ({ job, open, onClose, onOpenApply }) => {
  const { t } = useTranslation();
  const [applied, setApplied] = useState(job?.applied || false);

  useEffect(() => {
    setApplied(job?.applied || false);
  }, [job]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative overflow-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          aria-label={t("view_job_modal.close")}
        >
          ✕
        </button>

        <div className="flex items-center gap-4">
          <img
            src={job.thumbnail || job.image || DEFAULT_JOB_IMAGE}
            alt={job.title || t("view_job_modal.no_title")}
            className="w-20 h-20 rounded-md object-contain flex-shrink-0 border-2"
            onError={(e) => {
              if (e.currentTarget.src !== DEFAULT_JOB_IMAGE) {
                e.currentTarget.src = DEFAULT_JOB_IMAGE;
              }
            }}
          />
          <div className="flex-1">
            <h2 className="text-md font-bold">{job.title}</h2>
            <p className="text-sm text-gray-600">
              <strong>{t("view_job_modal.company")}:</strong>{" "}
              {job.company_name || "-"}
            </p>
            {job.location && (
              <p className="text-xs text-gray-500 mt-1">
                <strong>{t("view_job_modal.location")}:</strong> {job.location}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-bold mb-2">{t("view_job_modal.description_title")}</h3>
          <div className="text-gray-700 whitespace-pre-wrap text-sm">
            {job?.description || t("view_job_modal.no_description")}
          </div>
        </div>

        {Array.isArray(job?.job_highlights) && job.job_highlights.length > 0 && (
          <div className="mt-6">
            {job.job_highlights.map((section, i) => (
              <div key={i} className="mb-4">
                <h4 className="font-bold">{section.title}</h4>
                <ul className="list-disc list-inside mt-2 text-gray-700">
                  {section.items.map((it, ii) => (
                    <li key={ii} className="text-sm">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {Array.isArray(job?.extensions) && job.extensions.length > 0 && (
          <div className="my-4 text-sm text-gray-600">
            <strong>{t("view_job_modal.quick_facts")}</strong>
            <div className="flex gap-3 mt-2 flex-wrap">
              {job.extensions.map((ex, i) => (
                <span key={i} className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {ex}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col items-end gap-2 border-t pt-4">
          {applied ? (
            <button
              disabled
              className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md text-sm"
            >
              {t("view_job_modal.applied")}
            </button>
          ) : (
            <button
              onClick={() => onOpenApply && onOpenApply(job)}
              className="px-4 py-2 bg-teal-500 text-white rounded-md text-xs font-semibold"
            >
              {t("view_job_modal.apply_now")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewJobDetailsModel;
