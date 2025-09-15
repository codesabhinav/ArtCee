// import { StarIcon } from "@heroicons/react/24/outline";
// import { useEffect, useState } from "react";
// import { FaStar, FaArrowLeft, FaArrowRight } from "react-icons/fa";
// import { getSkills } from "../../Hooks/useAuth";

// const ServicesSkillsStep = ({ formData, setFormData, onNext, onPrev }) => {
//     const [errors, setErrors] = useState({});
//     const [categories, setCategories] = useState({});
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         getSkills()
//             .then((data) => {
//                 // group by category.name
//                 const grouped = data.reduce((acc, item) => {
//                     const catName = item.category?.name || "Other";
//                     if (!acc[catName]) acc[catName] = [];
//                     acc[catName].push(item);
//                     return acc;
//                 }, {});
//                 setCategories(grouped);
//             })
//             .catch((err) => {
//                 console.error("Error loading skills:", err.message);
//             })
//             .finally(() => setLoading(false));
//     }, []);

//     const toggleSelection = (id) => {
//         setFormData((prev) => {
//             const current = prev.skills || [];
//             return {
//                 ...prev,
//                 skills: current.includes(id)
//                     ? current.filter((v) => v !== id) // remove
//                     : [...current, id], // add
//             };
//         });
//     };

//     const handleNext = (e) => {
//         e.preventDefault();
//         if (
//             (formData.industries?.length || 0) === 0 &&
//             (formData.services?.length || 0) === 0 &&
//             (formData.skills?.length || 0) === 0
//         ) {
//             setErrors({ selections: "Please select at least one option" });
//             return;
//         }
//         setErrors({});
//         onNext();
//     };


//     return (
//         <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-sm border">
//             {/* Header */}
//             <div className="flex flex-col items-center mb-6">
//                 <StarIcon className="h-10 w-10 text-teal-500 mb-2" />
//                 <h2 className="text-xl font-semibold">Services & Skills</h2>
//                 <p className="text-gray-500 text-sm text-center">
//                     What services do you offer and what are your skills?
//                 </p>
//             </div>

//             {/* Error */}
//             {errors.selections && (
//                 <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-4 text-center">
//                     {errors.selections}
//                 </div>
//             )}

//             {loading ? (
//                 <p className="text-center text-gray-500">Loading...</p>
//             ) : (
//                 <form onSubmit={handleNext} className="space-y-6">
//                     {Object.entries(categories).map(([catName, items]) => (
//                         <div key={catName}>
//                             <h3 className="font-medium text-gray-700 mb-2">{catName}</h3>
//                             <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//                                 {items.map((item) => (
//                                     <label key={item.id} className="flex items-center text-sm">
//                                         <input
//                                             type="checkbox"
//                                             checked={formData.skills?.includes(item.id) || false}
//                                             onChange={() => toggleSelection(item.id)}
//                                             className="mr-2"
//                                         />
//                                         {item.name}
//                                     </label>
//                                 ))}
//                             </div>
//                         </div>
//                     ))}

//                     {/* Actions */}
//                     <div className="flex justify-between pt-4">
//                         <button
//                             type="button"
//                             onClick={onPrev}
//                             className="flex items-center px-4 py-2 text-xs border rounded-md text-gray-700 hover:bg-gray-100"
//                         >
//                             <FaArrowLeft className="mr-2" /> Previous
//                         </button>
//                         <button
//                             type="submit"
//                             className="flex items-center px-6 py-2 text-xs bg-teal-400 text-white rounded-md hover:bg-teal-500"
//                         >
//                             Next <FaArrowRight className="ml-2" />
//                         </button>
//                     </div>
//                 </form>
//             )}
//         </div>
//     );

// };

// export default ServicesSkillsStep;


// src/components/ServicesSkillsStep.jsx
import { StarIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { FaStar, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { getSkills } from "../../Hooks/useAuth";
import { useTranslation } from "../../contexts/LanguageProvider";

const ServicesSkillsStep = ({ formData, setFormData, onNext, onPrev }) => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSkills()
      .then((data) => {
        // group by category.name
        const grouped = data.reduce((acc, item) => {
          const catName = item.category?.name || t("services_skills.category_other");
          if (!acc[catName]) acc[catName] = [];
          acc[catName].push(item);
          return acc;
        }, {});
        setCategories(grouped);
      })
      .catch((err) => {
        console.error("Error loading skills:", err?.message || err);
        setErrors({ fetch: t("services_skills.error_loading") });
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSelection = (id) => {
    setFormData((prev) => {
      const current = prev.skills || [];
      return {
        ...prev,
        skills: current.includes(id)
          ? current.filter((v) => v !== id) // remove
          : [...current, id], // add
      };
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (
      ((formData.industries?.length) || 0) === 0 &&
      ((formData.services?.length) || 0) === 0 &&
      ((formData.skills?.length) || 0) === 0
    ) {
      setErrors({ selections: t("services_skills.errors.select_one") });
      return;
    }
    setErrors({});
    onNext();
  };

  return (
    <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-sm border">
      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <StarIcon className="h-10 w-10 text-teal-500 mb-2" />
        <h2 className="text-xl font-semibold">{t("services_skills.title")}</h2>
        <p className="text-gray-500 text-sm text-center">
          {t("services_skills.subtitle")}
        </p>
      </div>

      {/* Fetch error */}
      {errors.fetch && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-4 text-center">
          {errors.fetch}
        </div>
      )}

      {/* Selection error */}
      {errors.selections && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-4 text-center">
          {errors.selections}
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">{t("services_skills.loading")}</p>
      ) : (
        <form onSubmit={handleNext} className="space-y-6">
          {Object.entries(categories).map(([catName, items]) => (
            <div key={catName}>
              <h3 className="font-medium text-gray-700 mb-2">
                {/* category names come from API; leave as-is but display a prefix label */}
                {t("services_skills.category_prefix")} {catName}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {items.map((item) => (
                  <label key={item.id} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={formData.skills?.includes(item.id) || false}
                      onChange={() => toggleSelection(item.id)}
                      className="mr-2"
                    />
                    {item.name}
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onPrev}
              className="flex items-center px-4 py-2 text-xs border rounded-md text-gray-700 hover:bg-gray-100"
            >
              <FaArrowLeft className="mr-2" /> {t("services_skills.prev")}
            </button>
            <button
              type="submit"
              className="flex items-center px-6 py-2 text-xs bg-teal-400 text-white rounded-md hover:bg-teal-500"
            >
              {t("services_skills.next")} <FaArrowRight className="ml-2" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ServicesSkillsStep;
