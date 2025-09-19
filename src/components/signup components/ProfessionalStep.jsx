import { BriefcaseIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useTranslation } from "../../contexts/LanguageProvider";

const ProfessionalStep = ({ formData, setFormData, onNext, onPrev }) => {
  const { t } = useTranslation();

  const [local, setLocal] = useState({
    experience_in_year: formData.experience_in_year ?? "",
    experience_in_level: formData.experience_in_level ?? "",
    personal_intro: formData.personal_intro ?? "",
    exp_vision: formData.exp_vision ?? "",
  });

  const [errors, setErrors] = useState({});
  const [showTopAlert, setShowTopAlert] = useState(false);

  
  useEffect(() => {
    setLocal({
      experience_in_year: formData.experience_in_year ?? "",
      experience_in_level: formData.experience_in_level ?? "",
      personal_intro: formData.personal_intro ?? "",
      exp_vision: formData.exp_vision ?? "",
    });
  }, [
    formData.experience_in_year,
    formData.experience_in_level,
    formData.personal_intro,
    formData.exp_vision,
  ]);

  const validateLocal = () => {
    const newErrors = {};
    if (!String(local.personal_intro).trim())
      newErrors.personal_intro = t("professional.errors.personal_intro");
    if (!String(local.exp_vision).trim())
      newErrors.exp_vision = t("professional.errors.exp_vision");

    setErrors(newErrors);
    setShowTopAlert(Object.keys(newErrors).length > 0);
    return Object.keys(newErrors).length === 0;
  };

  const syncToParent = (overrides = {}) => {
    setFormData((prev) => ({
      ...prev,
      experience_in_year:
        overrides.experience_in_year ?? (local.experience_in_year === "" ? "" : local.experience_in_year),
      experience_in_level: overrides.experience_in_level ?? local.experience_in_level,
      personal_intro: overrides.personal_intro ?? local.personal_intro,
      exp_vision: overrides.exp_vision ?? local.exp_vision,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocal((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleBlurSync = (field) => {
    syncToParent({ [field]: local[field] });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateLocal()) {
      syncToParent();
      onNext();
    }
  };

  const handlePrev = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    syncToParent();
    onPrev();
  };

  return (
    <div className="w-full max-w-2xl bg-white p-8 rounded-lg border">
      {/* Header */}
      <div className="flex flex-col items-center mb-4">
        <BriefcaseIcon className="h-10 w-10 text-orange-400 mb-2" />
        <h2 className="text-xl font-semibold">{t("professional.title")}</h2>
        <p className="text-gray-500 text-sm text-center">{t("professional.subtitle")}</p>
      </div>

      {showTopAlert ? (
        <div className="bg-orange-50 border border-orange-200 text-orange-600 px-4 py-3 rounded-md text-xs mb-4 text-center">
          {t("professional.note_required")}
        </div>
      ) : (
        <div className="bg-orange-50 border border-orange-200 text-orange-600 px-4 py-3 rounded-md text-xs mb-4 text-center">
          {t("professional.hint")}
        </div>
      )}

      <form onSubmit={handleNext} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold">
              {t("professional.years_label")}
            </label>
            <input
              type="number"
              name="experience_in_year"
              value={local.experience_in_year ?? ""}
              onChange={handleChange}
              onBlur={() => handleBlurSync("experience_in_year")}
              className="mt-1 block w-full form-input border text-xs rounded-md p-2 form-input"
              placeholder={t("professional.years_placeholder")}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold">
              {t("professional.career_level_label")}
            </label>
            <select
              name="experience_in_level"
              value={local.experience_in_level ?? ""}
              onChange={handleChange}
              onBlur={() => handleBlurSync("experience_in_level")}
              className="mt-1 block w-full form-input border text-xs rounded-md p-2"
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
          <label className="block text-xs font-semibold">
            {t("professional.personal_intro_label")} *
          </label>
          <textarea
            name="personal_intro"
            rows="3"
            value={local.personal_intro ?? ""}
            onChange={handleChange}
            onBlur={() => handleBlurSync("personal_intro")}
            className={`mt-1 block w-full form-input border text-xs ${
              errors.personal_intro ? "border-red-400" : "border-none"
            } rounded-md p-2`}
            placeholder={t("professional.personal_intro_placeholder")}
          />
        </div>

        {/* Creative Vision */}
        <div>
          <label className="block text-xs font-semibold">
            {t("professional.exp_vision_label")} *
          </label>
          <textarea
            name="exp_vision"
            rows="3"
            value={local.exp_vision ?? ""}
            onChange={handleChange}
            onBlur={() => handleBlurSync("exp_vision")}
            className={`mt-1 block w-full form-input border text-xs ${
              errors.exp_vision ? "border-red-400" : "border-none"
            } rounded-md p-2`}
            placeholder={t("professional.exp_vision_placeholder")}
          />
        </div>

        {/* Error Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-xs">
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
            onClick={handlePrev}
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
