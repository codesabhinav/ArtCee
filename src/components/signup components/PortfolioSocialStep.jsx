// import { CameraIcon } from "@heroicons/react/24/outline";
// import { useState } from "react";
// import { FaArrowLeft, FaArrowRight, FaUpload, FaTimes } from "react-icons/fa";

// const PortfolioSocialStep = ({ formData, setFormData, onNext, onPrev }) => {
//   const [error, setError] = useState("");
//   const [preview, setPreview] = useState("");

//   // Handle file upload
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file && file.size <= 50 * 1024 * 1024) {
//       setFormData({ ...formData, portfolio: file }); // ✅ API expects "portfolio"
//       setPreview(URL.createObjectURL(file));
//       setError("");
//     } else {
//       setError("File must be under 50MB");
//     }
//   };

//   // Handle URL input
//   const handleUrlChange = async (e) => {
//     const url = e.target.value;

//     try {
//       // fetch the file from the given url
//       const response = await fetch(url);
//       const blob = await response.blob();

//       // Create a File object (with original filename if you want)
//       const file = new File([blob], "portfolio-from-url", { type: blob.type });

//       // Save as File (binary) in formData
//       setFormData({ ...formData, portfolio: file });
//       setPreview(url);
//       setError("");
//     } catch (err) {
//       console.error("Failed to fetch file from URL:", err);
//       setError("Invalid URL or unable to fetch file");
//     }
//   };

//   // Remove file/url
//   const handleRemoveFile = () => {
//     setFormData({ ...formData, portfolio: null });
//     setPreview("");
//   };

//   // Validation before next
//   const handleSubmit = () => {
//     const newErrors = {};

//     // Portfolio required
//     if (!formData.portfolio) {
//       newErrors.portfolio = "Profile Image/Video is required";
//     }

//     // Social fields required
//     if (!formData.social.website?.trim()) {
//       newErrors.website = "Website is required";
//     }
//     if (!formData.social.instagram?.trim()) {
//       newErrors.instagram = "Instagram is required";
//     }
//     if (!formData.social.linkind?.trim()) {
//       newErrors.linkind = "LinkedIn is required";
//     }
//     if (!formData.social.behance?.trim()) {
//       newErrors.behance = "Behance is required";
//     }
//     if (!formData.social.dribbble?.trim()) {
//       newErrors.dribbble = "Dribbble is required";
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setError(newErrors);
//       return;
//     }

//     setError({});
//     onNext();
//   };


//   return (
//     <div className="w-full max-w-3xl bg-white rounded-lg p-6 shadow">
//       {/* Top Icon */}
//       <div className="flex justify-center mb-2">
//         <CameraIcon className="text-orange-500 h-10 w-10" />
//       </div>

//       <h2 className="text-xl font-semibold text-center">Portfolio & Social Presence</h2>
//       <p className="text-gray-500 text-center mb-4 text-sm font-light">
//         Upload your best work and connect your social profiles
//       </p>

//       <p className="bg-purple-50 border border-purple-200 text-orange-600 px-4 py-3 rounded-md mb-6 text-xs font-light text-center">
//         * A profile image or video is required to help others discover and connect with you
//       </p>

//       {/* File Upload */}
//       <label className="block text-sm font-medium text-gray-700">
//         Profile Image/Video
//       </label>
//       <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative my-2">
//         {!preview ? (
//           <label htmlFor="portfolioFile" className="cursor-pointer flex flex-col items-center">
//             <FaUpload className="text-gray-500 text-2xl mb-2" />
//             <span className="text-gray-500">Click to upload or drag and drop</span>
//             <span className="text-xs text-gray-400">Images and videos up to 50MB</span>
//             <input
//               type="file"
//               id="portfolioFile"
//               accept="image/*,video/*"
//               className="hidden"
//               onChange={handleFileChange}
//             />
//           </label>
//         ) : (
//           <div className="relative">
//             {preview.match(/\.(jpeg|jpg|gif|png)$/i) ||
//               formData?.portfolio?.type?.startsWith("image/") ? (
//               <img
//                 src={preview}
//                 alt="Preview"
//                 className="max-h-56 mx-auto rounded-md shadow"
//               />
//             ) : (
//               <video controls className="max-h-56 mx-auto rounded-md shadow">
//                 <source src={preview} />
//               </video>
//             )}

//             {/* Cancel */}
//             <button
//               type="button"
//               onClick={handleRemoveFile}
//               className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
//             >
//               <FaTimes size={14} />
//             </button>
//           </div>
//         )}
//       </div>

//       <div className="text-center mb-4 text-gray-500">OR</div>

//       {/* URL Input */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700">
//           Enter Image/Video URL
//         </label>
//         <input
//           type="url"
//           placeholder="https://yourimage.com/photo.jpg or video URL"
//           value={formData.portfolio?.url || ""}
//           onChange={handleUrlChange}
//           className={`mt-1 block w-full bg-gray-100 border placeholder:text-sm ${error ? "border-red-400" : "border-gray-300"
//             } rounded-md p-2`}
//         />
//       </div>

//       {/* Social Links */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Website</label>
//           <input
//             type="url"
//             placeholder="https://yourwebsite.com"
//             value={formData.social.website || ""}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 social: { ...formData.social, website: e.target.value },
//               })
//             }
//             className="mt-1 block w-full bg-gray-100 border border-gray-300 placeholder:text-sm rounded-md p-2"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Instagram</label>
//           <input
//             type="text"
//             placeholder="@yourusername"
//             value={formData.social.instagram || ""}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 social: { ...formData.social, instagram: e.target.value },
//               })
//             }
//             className="mt-1 block w-full bg-gray-100 border border-gray-300 placeholder:text-sm rounded-md p-2"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
//           <input
//             type="url"
//             placeholder="linkedin.com/in/yourprofile"
//             value={formData.social.linkind || ""}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 social: { ...formData.social, linkind: e.target.value }, // ✅ matches API payload
//               })
//             }
//             className="mt-1 block w-full bg-gray-100 border border-gray-300 placeholder:text-sm rounded-md p-2"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Behance</label>
//           <input
//             type="url"
//             placeholder="behance.net/yourprofile"
//             value={formData.social.behance || ""}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 social: { ...formData.social, behance: e.target.value },
//               })
//             }
//             className="mt-1 block w-full bg-gray-100 border border-gray-300 placeholder:text-sm rounded-md p-2"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Dribbble</label>
//           <input
//             type="url"
//             placeholder="dribbble.com/yourprofile"
//             value={formData.social.dribbble || ""}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 social: { ...formData.social, dribbble: e.target.value },
//               })
//             }
//             className="mt-1 block w-full bg-gray-100 border border-gray-300 placeholder:text-sm rounded-md p-2"
//           />
//         </div>
//       </div>

//       {/* Error */}
//       {Object.keys(error).length > 0 && (
//         <div className="mt-6 text-sm text-red-600 bg-red-50 border border-red-300 rounded-md p-3">
//           <p className="font-medium">Please complete the following required fields:</p>
//           <ul className="list-disc list-inside">
//             {Object.values(error).map((err, i) => (
//               <li key={i}>{err}</li>
//             ))}
//           </ul>
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
//           type="submit"
//           onClick={handleSubmit}
//           className="flex items-center px-6 py-2 text-xs bg-teal-400 text-white rounded-md hover:bg-teal-500"
//         >
//           Next <FaArrowRight className="ml-2" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PortfolioSocialStep;


// src/components/PortfolioSocialStep.jsx
import { CameraIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaUpload, FaTimes } from "react-icons/fa";
import { useTranslation } from "../../contexts/LanguageProvider";

const PortfolioSocialStep = ({ formData, setFormData, onNext, onPrev }) => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 50 * 1024 * 1024) {
      setFormData({ ...formData, portfolio: file }); // ✅ API expects "portfolio"
      setPreview(URL.createObjectURL(file));
      setError("");
    } else {
      setError(t("portfolio_social.errors.file_size"));
    }
  };

  // Handle URL input
  const handleUrlChange = async (e) => {
    const url = e.target.value;

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], "portfolio-from-url", { type: blob.type });

      setFormData({ ...formData, portfolio: file });
      setPreview(url);
      setError("");
    } catch (err) {
      console.error("Failed to fetch file from URL:", err);
      setError(t("portfolio_social.errors.invalid_url"));
    }
  };

  // Remove file/url
  const handleRemoveFile = () => {
    setFormData({ ...formData, portfolio: null });
    setPreview("");
  };

  // Validation before next
  const handleSubmit = () => {
    const newErrors = {};

    // Portfolio required
    if (!formData.portfolio) {
      newErrors.portfolio = t("portfolio_social.errors.portfolio_required");
    }

    // Social fields required
    if (!formData.social?.website?.trim()) {
      newErrors.website = t("portfolio_social.errors.website_required");
    }
    if (!formData.social?.instagram?.trim()) {
      newErrors.instagram = t("portfolio_social.errors.instagram_required");
    }
    if (!formData.social?.linkind?.trim()) {
      newErrors.linkind = t("portfolio_social.errors.linkedin_required");
    }
    if (!formData.social?.behance?.trim()) {
      newErrors.behance = t("portfolio_social.errors.behance_required");
    }
    if (!formData.social?.dribbble?.trim()) {
      newErrors.dribbble = t("portfolio_social.errors.dribbble_required");
    }

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    setError({});
    onNext();
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-lg p-6 shadow">
      {/* Top Icon */}
      <div className="flex justify-center mb-2">
        <CameraIcon className="text-orange-500 h-10 w-10" />
      </div>

      <h2 className="text-xl font-semibold text-center">
        {t("portfolio_social.title")}
      </h2>
      <p className="text-gray-500 text-center mb-4 text-sm font-light">
        {t("portfolio_social.subtitle")}
      </p>

      <p className="bg-purple-50 border border-purple-200 text-orange-600 px-4 py-3 rounded-md mb-6 text-xs font-light text-center">
        {t("portfolio_social.note_required")}
      </p>

      {/* File Upload */}
      <label className="block text-sm font-medium text-gray-700">
        {t("portfolio_social.portfolio_label")}
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative my-2">
        {!preview ? (
          <label htmlFor="portfolioFile" className="cursor-pointer flex flex-col items-center">
            <FaUpload className="text-gray-500 text-2xl mb-2" />
            <span className="text-gray-500">{t("portfolio_social.upload_cta")}</span>
            <span className="text-xs text-gray-400">{t("portfolio_social.upload_hint")}</span>
            <input
              type="file"
              id="portfolioFile"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="relative">
            {preview.match(/\.(jpeg|jpg|gif|png)$/i) ||
              formData?.portfolio?.type?.startsWith("image/") ? (
              <img src={preview} alt="Preview" className="max-h-56 mx-auto rounded-md shadow" />
            ) : (
              <video controls className="max-h-56 mx-auto rounded-md shadow">
                <source src={preview} />
              </video>
            )}

            {/* Cancel */}
            <button
              type="button"
              onClick={handleRemoveFile}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              aria-label={t("portfolio_social.remove_label")}
            >
              <FaTimes size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="text-center mb-4 text-gray-500">{t("portfolio_social.or")}</div>

      {/* URL Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          {t("portfolio_social.url_label")}
        </label>
        <input
          type="url"
          placeholder={t("portfolio_social.url_placeholder")}
          value={formData.portfolio?.url || ""}
          onChange={handleUrlChange}
          className={`mt-1 block w-full bg-gray-100 border placeholder:text-sm ${error ? "border-red-400" : "border-gray-300"
            } rounded-md p-2`}
        />
      </div>

      {/* Social Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { key: "website", label: t("portfolio_social.website") , placeholder: t("portfolio_social.website_placeholder")},
          { key: "instagram", label: t("portfolio_social.instagram") , placeholder: t("portfolio_social.instagram_placeholder")},
          { key: "linkind", label: t("portfolio_social.linkedin") , placeholder: t("portfolio_social.linkedin_placeholder")},
          { key: "behance", label: t("portfolio_social.behance") , placeholder: t("portfolio_social.behance_placeholder")},
          { key: "dribbble", label: t("portfolio_social.dribbble") , placeholder: t("portfolio_social.dribbble_placeholder")},
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              type={key === "instagram" ? "text" : "url"}
              placeholder={placeholder}
              value={formData.social?.[key] || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  social: { ...formData.social, [key]: e.target.value },
                })
              }
              className="mt-1 block w-full bg-gray-100 border border-gray-300 placeholder:text-sm rounded-md p-2"
            />
          </div>
        ))}
      </div>

      {/* Error */}
      {Object.keys(error).length > 0 && (
        <div className="mt-6 text-sm text-red-600 bg-red-50 border border-red-300 rounded-md p-3">
          <p className="font-medium">{t("portfolio_social.error_summary_title")}</p>
          <ul className="list-disc list-inside">
            {Object.values(error).map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center px-4 py-2 text-xs border rounded-md text-gray-700 hover:bg-gray-100"
        >
          <FaArrowLeft className="mr-2" /> {t("portfolio_social.prev")}
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="flex items-center px-6 py-2 text-xs bg-teal-400 text-white rounded-md hover:bg-teal-500"
        >
          {t("portfolio_social.next")} <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default PortfolioSocialStep;
