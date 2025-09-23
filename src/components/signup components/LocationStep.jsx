import { MapPinIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
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

const LocationStep = ({ formData = {}, setFormData, onNext, onPrev }) => {
  const { t } = useTranslation();
  const mountedRef = useRef(true);

  const [errors, setErrors] = useState({});

  const [local, setLocal] = useState({
    city: formData.city ?? "",
    state: formData.state ?? "", 
    state_id: formData.state_id ?? null, 
    country: formData.country ?? "", 
    country_id: formData.country_id ?? null, 
    is_remote_active: formData.is_remote_active ?? 0,
    on_site_active: formData.on_site_active ?? 0,
    travel_radius_miles:
      formData.travel_radius_miles !== undefined && formData.travel_radius_miles !== null
        ? formData.travel_radius_miles
        : "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // keep local in sync when parent updates externally
  useEffect(() => {
    setLocal((prev) => ({
      ...prev,
      city: formData.city ?? prev.city,
      state: formData.state ?? prev.state,
      state_id: formData.state_id ?? prev.state_id ?? null,
      country: formData.country ?? prev.country,
      country_id: formData.country_id ?? prev.country_id ?? null,
      is_remote_active: formData.is_remote_active ?? prev.is_remote_active ?? 0,
      on_site_active: formData.on_site_active ?? prev.on_site_active ?? 0,
      travel_radius_miles:
        formData.travel_radius_miles !== undefined && formData.travel_radius_miles !== null
          ? formData.travel_radius_miles
          : prev.travel_radius_miles ?? "",
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.city,
    formData.state,
    formData.state_id,
    formData.country,
    formData.country_id,
    formData.is_remote_active,
    formData.on_site_active,
    formData.travel_radius_miles,
  ]);

  // fetch countries (adjust endpoint if needed)
  useEffect(() => {
    const ctrl = new AbortController();
    const fetchCountries = async () => {
      setLoadingCountries(true);
      setApiError("");
      try {
        const res = await fetch("/api/countries", { signal: ctrl.signal });
        if (!res.ok) throw new Error(`Countries fetch failed: ${res.status}`);
        const data = await res.json();
        if (!mountedRef.current) return;
        setCountries(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.warn("Could not load countries:", err);
        if (mountedRef.current) setApiError("Could not load countries");
        setCountries([]);
      } finally {
        if (mountedRef.current) setLoadingCountries(false);
      }
    };
    fetchCountries();
    return () => ctrl.abort();
  }, []);

  // fetch states when country_id changes
  useEffect(() => {
    const countryId = local.country_id;
    if (!countryId) {
      setStates([]);
      setLoadingStates(false);
      return;
    }

    const ctrl = new AbortController();
    const fetchStates = async () => {
      setLoadingStates(true);
      try {
        const res = await fetch(`/api/countries/${countryId}/states`, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`States fetch failed: ${res.status}`);
        const data = await res.json();
        if (!mountedRef.current) return;
        setStates(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.warn("Could not load states:", err);
        if (mountedRef.current) setApiError("Could not load states for selected country");
        setStates([]);
      } finally {
        if (mountedRef.current) setLoadingStates(false);
      }
    };
    fetchStates();
    return () => ctrl.abort();
  }, [local.country_id]);

  // map cookie names to ids (optional UX improvement)
  useEffect(() => {
    if (!countries.length) return;
    const cookieCountry = Cookies.get("user_country") || "";
    const cookieState = Cookies.get("user_state") || "";

    if (!local.country_id && cookieCountry) {
      const found = countries.find((c) => String(c.name).toLowerCase() === String(cookieCountry).toLowerCase());
      if (found) {
        setLocal((p) => ({ ...p, country: found.name, country_id: found.id }));
        // sync ids & names to parent if helpful
        setFormData((prev) => ({ ...(prev || {}), country: found.name, country_id: found.id }));
      } else {
        setLocal((p) => ({ ...p, country: cookieCountry }));
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countries]);

  useEffect(() => {
    if (!states.length) return;
    const cookieState = Cookies.get("user_state") || "";
    if (!cookieState) return;
    const found = states.find((s) => String(s.name).toLowerCase() === String(cookieState).toLowerCase());
    if (found) {
      setLocal((p) => ({ ...p, state: found.name, state_id: found.id }));
      setFormData((prev) => ({ ...(prev || {}), state: found.name, state_id: found.id }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [states]);

  // validation (backend expects ids if lists exist, but we still allow typed names)
  const validate = () => {
    const newErrors = {};
    if (!String(local.city).trim()) newErrors.city = t("location.errors.city");
    // if lists present require ids, else require typed names
    if (countries.length > 0) {
      if (!local.country_id) newErrors.country = t("location.errors.country");
    } else {
      if (!String(local.country).trim()) newErrors.country = t("location.errors.country");
    }

    if (states.length > 0) {
      if (!local.state_id) newErrors.state = t("location.errors.state");
    } else {
      if (!String(local.state).trim()) newErrors.state = t("location.errors.state");
    }

    if (Number(local.on_site_active) === 1) {
      const val = Number(local.travel_radius_miles);
      if (!val || isNaN(val) || val <= 0) {
        newErrors.travel_radius_miles = t("location.errors.travel_radius");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Sync to parent: send both names and ids (ids may be null if user typed names)
  const syncToParent = (overrides = {}) => {
    setFormData((prev) => ({
      ...(prev || {}),
      city: overrides.city ?? local.city,
      state: overrides.state ?? local.state,
      state_id: overrides.state_id ?? local.state_id ?? null,
      country: overrides.country ?? local.country,
      country_id: overrides.country_id ?? local.country_id ?? null,
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

  // user selected a country from dropdown -> keep name + id and reset state
  const handleCountrySelect = (e) => {
    const id = e.target.value ? Number(e.target.value) : null;
    const selected = countries.find((c) => c.id === id);
    const name = selected ? selected.name : "";

    setLocal((p) => ({
      ...p,
      country: name,
      country_id: selected ? selected.id : null,
      state: "",
      state_id: null,
    }));
    setErrors((p) => ({ ...p, country: null, state: null }));

    // push names+ids to parent immediately
    syncToParent({ country: name, country_id: selected ? selected.id : null, state: "", state_id: null });
  };

  // user selected a state from dropdown -> keep name + id
  const handleStateSelect = (e) => {
    const id = e.target.value ? Number(e.target.value) : null;
    const selected = states.find((s) => s.id === id);
    const name = selected ? selected.name : "";

    setLocal((p) => ({ ...p, state: name, state_id: selected ? selected.id : null }));
    setErrors((p) => ({ ...p, state: null }));

    // push names+ids to parent immediately
    syncToParent({ state: name, state_id: selected ? selected.id : null });
  };

  const handleToggle = (name) => {
    setLocal((p) => {
      const toggled = p[name] === 1 ? 0 : 1;
      return { ...p, [name]: toggled };
    });
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));

    // optimistic sync: send names + toggled flag
    setTimeout(() => {
      syncToParent({ [name]: local[name] === 1 ? 0 : 1 });
    }, 0);
  };

  const handleBlurSync = (field) => {
    if (field === "country") {
      // user typed a country name (no id)
      syncToParent({ country: local.country, country_id: null });
    } else if (field === "state") {
      syncToParent({ state: local.state, state_id: null });
    } else {
      syncToParent({ [field]: local[field] });
    }
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

  return (
    <div className="w-full max-w-2xl bg-white p-8 rounded-lg border">
      <div className="flex justify-center mb-4 text-teal-500">
        <MapPinIcon className="h-10 w-10" />
      </div>

      <h2 className="text-xl text-md font-semibold text-center mb-2">{t("location.title")}</h2>
      <p className="text-gray-500 font-light text-sm text-center mb-6">{t("location.subtitle")}</p>

      {apiError && (
        <div className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-100 px-3 py-2 rounded mb-4 text-center">
          {t("location.api_fallback") || "Couldn't load country/state list — falling back to text input."}
        </div>
      )}

      <form onSubmit={handleNext} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold">{t("location.city_label")} *</label>
            <input
              type="text"
              name="city"
              value={local.city}
              onChange={handleChange}
              onBlur={() => handleBlurSync("city")}
              className={`mt-1 block w-full form-input border text-xs ${errors.city ? "border-red-400" : "border-none"} rounded-md p-2`}
              placeholder={t("location.city_placeholder")}
            />
            {errors.city && <div className="text-xs text-red-500 mt-1">{errors.city}</div>}
          </div>

          <div>
            <label className="block text-xs font-semibold">{t("location.state_label")} *</label>

            {states.length > 0 ? (
              <select
                name="state_id"
                value={local.state_id ?? ""}
                onChange={handleStateSelect}
                onBlur={() => handleBlurSync("state")}
                className={`mt-1 block w-full form-input border text-xs ${errors.state ? "border-red-400" : "border-none"} rounded-md p-2`}
              >
                <option value="">{t("location.state_placeholder")}</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name="state"
                value={local.state}
                onChange={handleChange}
                onBlur={() => handleBlurSync("state")}
                className={`mt-1 block w-full form-input border text-xs ${errors.state ? "border-red-400" : "border-none"} rounded-md p-2`}
                placeholder={t("location.state_placeholder")}
              />
            )}

            {loadingStates && <div className="text-xs text-gray-500 mt-1">{t("location.loading_states") || "Loading states..."}</div>}
            {errors.state && <div className="text-xs text-red-500 mt-1">{errors.state}</div>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold">{t("location.country_label")} *</label>

          {countries.length > 0 ? (
            <select
              name="country_id"
              value={local.country_id ?? ""}
              onChange={handleCountrySelect}
              onBlur={() => handleBlurSync("country")}
              className={`mt-1 block w-full form-input border text-xs ${errors.country ? "border-red-400" : "border-none"} rounded-md p-2`}
            >
              <option value="">{t("location.country_placeholder")}</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              name="country"
              value={local.country}
              onChange={handleChange}
              onBlur={() => handleBlurSync("country")}
              className={`mt-1 block w-full form-input border text-xs ${errors.country ? "border-red-400" : "border-none"} rounded-md p-2`}
              placeholder={t("location.country_placeholder")}
            />
          )}

          {loadingCountries && <div className="text-xs text-gray-500 mt-1">{t("location.loading_countries") || "Loading countries..."}</div>}
          {errors.country && <div className="text-xs text-red-500 mt-1">{errors.country}</div>}
        </div>

        <ToggleSwitch label={t("location.toggle_remote")} checked={local.is_remote_active === 1} onChange={() => handleToggle("is_remote_active")} />
        <ToggleSwitch label={t("location.toggle_on_site")} checked={local.on_site_active === 1} onChange={() => handleToggle("on_site_active")} />

        {local.on_site_active === 1 && (
          <div>
            <label className="block text-xs font-semibold">{t("location.travel_radius_label")} *</label>
            <input
              type="number"
              name="travel_radius_miles"
              value={local.travel_radius_miles}
              onChange={handleChange}
              onBlur={() => handleBlurSync("travel_radius_miles")}
              className={`mt-1 block w-full form-input border text-xs ${errors.travel_radius_miles ? "border-red-400" : "border-none"} rounded-md p-2`}
              placeholder={t("location.travel_radius_placeholder")}
            />
            {errors.travel_radius_miles && <div className="text-xs text-red-500 mt-1">{errors.travel_radius_miles}</div>}
          </div>
        )}

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

        <div className="flex justify-between py-3">
          <button type="button" onClick={handlePrev} className="flex items-center px-4 py-2 text-xs border rounded-md hover:bg-gray-100">
            <FaArrowLeft className="mr-2" /> {t("location.prev")}
          </button>
          <button type="submit" className="flex items-center px-6 py-2 text-xs bg-teal-400 text-white rounded-md hover:bg-teal-500">
            {t("location.next")} <FaArrowRight className="ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default LocationStep;
