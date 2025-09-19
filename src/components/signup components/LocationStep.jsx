import { MapPinIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Cookies from "js-cookie";
import { useTranslation } from "../../contexts/LanguageProvider";

const ToggleSwitch = ({ label, checked, onChange }) => {
  return (
    <div className="flex items-center space-x-3 py-2">
      <button
        type="button"
        onClick={onChange}
        className={`w-9 h-5 flex items-center rounded-full transition-colors ${
          checked ? "bg-teal-500" : "bg-gray-300"
        }`}
        aria-pressed={checked}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
      <span className="text-xs font-semibold">{label}</span>
    </div>
  );
};

const LocationStep = ({ formData, setFormData, onNext, onPrev }) => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});

  const [local, setLocal] = useState({
    city: formData.city ?? "",
    state: formData.state ?? "",
    country: formData.country ?? "",
    is_remote_active: formData.is_remote_active ?? 0,
    on_site_active: formData.on_site_active ?? 0,
    travel_radius_miles: formData.travel_radius_miles ?? "",
  });

  useEffect(() => {
    setLocal({
      city: formData.city ?? "",
      state: formData.state ?? "",
      country: formData.country ?? "",
      is_remote_active: formData.is_remote_active ?? 0,
      on_site_active: formData.on_site_active ?? 0,
      travel_radius_miles:
        formData.travel_radius_miles !== undefined && formData.travel_radius_miles !== null
          ? formData.travel_radius_miles
          : "",
    });
  }, [formData.city, formData.state, formData.country, formData.is_remote_active, formData.on_site_active, formData.travel_radius_miles]);

  const validate = () => {
    const newErrors = {};
    if (!String(local.city).trim()) newErrors.city = t("location.errors.city");
    if (!String(local.state).trim()) newErrors.state = t("location.errors.state");
    if (!String(local.country).trim()) newErrors.country = t("location.errors.country");

    if (Number(local.on_site_active) === 1) {
      const val = Number(local.travel_radius_miles);
      if (!val || isNaN(val) || val <= 0) {
        newErrors.travel_radius_miles = t("location.errors.travel_radius");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const syncToParent = (overrides = {}) => {
    setFormData((prev) => ({
      ...prev,
      city: overrides.city ?? local.city,
      state: overrides.state ?? local.state,
      country: overrides.country ?? local.country,
      is_remote_active: overrides.is_remote_active ?? local.is_remote_active,
      on_site_active: overrides.on_site_active ?? local.on_site_active,
      travel_radius_miles:
        overrides.travel_radius_miles ?? (local.travel_radius_miles === "" ? 0 : local.travel_radius_miles),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocal((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleToggle = (name) => {
    setLocal((p) => {
      const toggled = p[name] === 1 ? 0 : 1;
      return { ...p, [name]: toggled };
    });
    // clear related errors
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleBlurSync = (field) => {
    syncToParent({ [field]: local[field] });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validate()) {
      syncToParent();
      onNext();
    }
  };

  const handlePrev = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    syncToParent();
    onPrev();
  };

  useEffect(() => {
    const city = Cookies.get("user_city") || "";
    const state = Cookies.get("user_state") || "";
    const country = Cookies.get("user_country") || "";

    setLocal((p) => ({
      ...p,
      city: p.city || city,
      state: p.state || state,
      country: p.country || country,
    }));
  }, []);

  return (
    <div className="w-full max-w-2xl bg-white p-8 rounded-lg border">
      <div className="flex justify-center mb-4 text-teal-500">
        <MapPinIcon className="h-10 w-10" />
      </div>

      <h2 className="text-xl text-md font-semibold text-center mb-2">
        {t("location.title")}
      </h2>
      <p className="text-gray-500 font-light text-sm text-center mb-6">
        {t("location.subtitle")}
      </p>

      <form onSubmit={handleNext} className="space-y-4" noValidate>
        {/* City + State */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold">
              {t("location.city_label")} *
            </label>
            <input
              type="text"
              name="city"
              value={local.city}
              onChange={handleChange}
              onBlur={() => handleBlurSync("city")}
              className={`mt-1 block w-full form-input border text-xs ${
                errors.city ? "border-red-400" : "border-none"
              } rounded-md p-2`}
              placeholder={t("location.city_placeholder")}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold">
              {t("location.state_label")} *
            </label>
            <input
              type="text"
              name="state"
              value={local.state}
              onChange={handleChange}
              onBlur={() => handleBlurSync("state")}
              className={`mt-1 block w-full form-input border text-xs ${
                errors.state ? "border-red-400" : "border-none"
              } rounded-md p-2`}
              placeholder={t("location.state_placeholder")}
            />
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-xs font-semibold">
            {t("location.country_label")} *
          </label>
          <input
            type="text"
            name="country"
            value={local.country}
            onChange={handleChange}
            onBlur={() => handleBlurSync("country")}
            className={`mt-1 block w-full form-input border text-xs ${
              errors.country ? "border-red-400" : "border-none"
            } rounded-md p-2`}
            placeholder={t("location.country_placeholder")}
          />
        </div>

        {/* Toggles */}
        <ToggleSwitch
          label={t("location.toggle_remote")}
          checked={local.is_remote_active === 1}
          onChange={() => {
            handleToggle("is_remote_active");
            // optimistic sync for toggles (so parent sees it quickly)
            setTimeout(() => syncToParent({ is_remote_active: local.is_remote_active === 1 ? 0 : 1 }), 0);
          }}
        />

        <ToggleSwitch
          label={t("location.toggle_on_site")}
          checked={local.on_site_active === 1}
          onChange={() => {
            handleToggle("on_site_active");
            setTimeout(() => syncToParent({ on_site_active: local.on_site_active === 1 ? 0 : 1 }), 0);
          }}
        />

        {/* Travel Radius (only if on-site travel is active) */}
        {local.on_site_active === 1 && (
          <div>
            <label className="block text-xs font-semibold">
              {t("location.travel_radius_label")} *
            </label>
            <input
              type="number"
              name="travel_radius_miles"
              value={local.travel_radius_miles}
              onChange={handleChange}
              onBlur={() => handleBlurSync("travel_radius_miles")}
              className={`mt-1 block w-full form-input border text-xs ${
                errors.travel_radius_miles ? "border-red-400" : "border-none"
              } rounded-md p-2`}
              placeholder={t("location.travel_radius_placeholder")}
            />
          </div>
        )}

        {/* Error Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-xs">
            <p>{t("location.error_summary")}</p>
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
            className="flex items-center px-4 py-2 text-xs border rounded-md hover:bg-gray-100"
          >
            <FaArrowLeft className="mr-2" /> {t("location.prev")}
          </button>
          <button
            type="submit"
            className="flex items-center px-6 py-2 text-xs bg-teal-400 text-white rounded-md hover:bg-teal-500"
          >
            {t("location.next")} <FaArrowRight className="ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default LocationStep;
