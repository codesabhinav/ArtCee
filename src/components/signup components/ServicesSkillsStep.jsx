import { StarIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { getSkills } from "../../Hooks/useAuth";
import { useTranslation } from "../../contexts/LanguageProvider";

const ServicesSkillsStep = ({ formData, setFormData, onNext, onPrev }) => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);

  const [selectedSkills, setSelectedSkills] = useState(formData.skills || []);

  const [customInput, setCustomInput] = useState("");
  const [customSkills, setCustomSkills] = useState(() => {
    if (!formData?.custom_skills) return [];
    // accept either array or comma string from incoming formData
    return Array.isArray(formData.custom_skills)
      ? formData.custom_skills
      : String(formData.custom_skills)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
  });

  useEffect(() => {
    getSkills()
      .then((data) => {
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
  }, []);

  const toggleSelection = (id) => {
    setSelectedSkills((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  const addCustomSkill = (value) => {
    const val = String(value || customInput).trim();
    if (!val) return;
    const parts = val.split(",").map((p) => p.trim()).filter(Boolean);
    const next = [...customSkills];
    parts.forEach((p) => {
      if (!next.includes(p)) next.push(p);
    });
    setCustomSkills(next);
    setCustomInput("");
  };

  const removeCustomSkill = (skill) => {
    setCustomSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleCustomKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomSkill();
    }
    if (e.key === ",") {
      e.preventDefault();
      addCustomSkill();
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (((formData.industries?.length) || 0) === 0 && ((formData.services?.length) || 0) === 0 && ((selectedSkills.length) || 0) === 0 && ((customSkills.length) || 0) === 0) {
      setErrors({ selections: t("services_skills.errors.select_one") });
      return;
    }
    setErrors({});

    // pass custom_skills as a single comma-separated string
    const customSkillsString = customSkills.join(", ");

    setFormData((prev) => ({ ...prev, skills: selectedSkills, custom_skills: customSkillsString }));
    onNext();
  };

  const handlePrev = () => {
    const customSkillsString = customSkills.join(", ");
    setFormData((prev) => ({ ...prev, skills: selectedSkills, custom_skills: customSkillsString }));
    onPrev();
  };

  return (
    <div className="w-full max-w-2xl bg-white p-8 rounded-lg border">
      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <StarIcon className="h-10 w-10 text-teal-500 mb-2" />
        <h2 className="text-xl font-semibold">{t("services_skills.title")}</h2>
        <p className="text-gray-500 text-sm text-center">{t("services_skills.subtitle")}</p>
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
              <h3 className="font-semibold text-sm mb-2">{t("services_skills.category_prefix")} {catName}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {items.map((item) => (
                  <label key={item.id} className="flex items-center text-xs font-medium">
                    <input type="checkbox" checked={selectedSkills.includes(item.id)} onChange={() => toggleSelection(item.id)} className="mr-2 rounded-md bg-gray-100 text-teal-500" />
                    {item.name}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div>
            <h3 className="font-semibold text-sm mb-2">Others</h3>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={handleCustomKeyDown}
                placeholder="Add custom skills press Enter or comma to add"
                className="flex-1 form-input border rounded-md p-2 text-xs"
              />
              <button type="button" onClick={() => addCustomSkill()} className="px-3 py-2 text-xs bg-gray-100 rounded-md border">
                Add
              </button>
            </div>

            {/* chips */}
            <div className="mt-3 flex flex-wrap gap-2">
              {customSkills.map((s) => (
                <span key={s} className="inline-flex items-center text-xs bg-gray-100 rounded-full px-3 py-1">
                  <span className="mr-2">{s}</span>
                  <button type="button" onClick={() => removeCustomSkill(s)} className="text-gray-500 text-xs px-1">✕</button>
                </span>
              ))}
              {customSkills.length === 0 && <div className="text-xs text-gray-400">Optional: list any other skills</div>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <button type="button" onClick={handlePrev} className="flex items-center px-4 py-2 text-xs border rounded-md text-gray-700 hover:bg-gray-100">
              <FaArrowLeft className="mr-2" /> {t("services_skills.prev")}
            </button>
            <button type="submit" className="flex items-center px-6 py-2 text-xs bg-teal-400 text-white rounded-md hover:bg-teal-500">
              {t("services_skills.next")} <FaArrowRight className="ml-2" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ServicesSkillsStep;
