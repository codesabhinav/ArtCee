import { useEffect, useState, useCallback } from "react";
import { FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslation } from "../../contexts/LanguageProvider";
import CustomDropdown from "../../components/CustomDropdown";
import { Link, useNavigate } from "react-router-dom";

const PersonalInfoStep = ({ formData = {}, setFormData, setField, onNext }) => {
  const { t } = useTranslation();

  const STABLE_TYPES = {
    BUSINESS: "business",
    CREATIVE: "creative",
  };

  const labelFor = (stableValue) => {
    if (stableValue === STABLE_TYPES.BUSINESS)
      return t("personal_info.account_business");
    if (stableValue === STABLE_TYPES.CREATIVE)
      return t("personal_info.account_creative");
    return "";
  };

  const typeLabels = [
    t("personal_info.account_business"),
    t("personal_info.account_creative"),
  ];

  const [local, setLocal] = useState({
    type: formData.type || STABLE_TYPES.BUSINESS,
    typeLabel: formData.type
      ? labelFor(formData.type)
      : t("personal_info.account_business"),
    full_name: formData.full_name || "",
    email: formData.email || "",
    password: formData.password || "",
    phone: formData.phone || "",
    title: formData.title || "",
    // bio: formData.bio || "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLocal((prev) => ({
      ...prev,
      full_name: formData.full_name ?? prev.full_name ?? "",
      email: formData.email ?? prev.email ?? "",
      password: formData.password ?? prev.password ?? "",
      phone: formData.phone ?? prev.phone ?? "",
      title: formData.title ?? prev.title ?? "",
      // bio: formData.bio ?? prev.bio ?? "",
      type: formData.type || prev.type || STABLE_TYPES.BUSINESS,
      typeLabel: formData.type
        ? labelFor(formData.type)
        : prev.typeLabel || t("personal_info.account_business"),
    }));
  }, [
    formData?.full_name,
    formData?.email,
    formData?.password,
    formData?.phone,
    formData?.title,
    // formData?.bio,
    formData?.type,
    t,
  ]);

  const writeToParent = useCallback(
    (name, value) => {
      if (typeof setField === "function") {
        setField(name, value);
      } else if (typeof setFormData === "function") {
        setFormData((prev) => ({ ...(prev || {}), [name]: value }));
      }
    },
    [setField, setFormData]
  );

  const validateAll = useCallback(() => {
    const newErrors = {};
    if (!local.type) newErrors.type = t("personal_info.errors.type");
    if (!local.full_name || !local.full_name.trim())
      newErrors.full_name = t("personal_info.errors.full_name");
    if (!local.email) {
      newErrors.email = t("personal_info.errors.email");
    } else if (!/\S+@\S+\.\S+/.test(local.email)) {
      newErrors.email = t("personal_info.errors.email_valid");
    }
    if (!local.password) {
      newErrors.password = t("personal_info.errors.password_required");
    } else if (local.password.length < 12) {
      newErrors.password = t("personal_info.errors.password_length");
    }
    if (!local.phone) {
      newErrors.phone = t("personal_info.errors.phone_required");
    } else if (!/^\d{10,15}$/.test(local.phone)) {
      newErrors.phone = t("personal_info.errors.phone_valid");
    }
    if (!local.title || !local.title.trim())
      newErrors.title = t("personal_info.errors.title");
    // if (!local.bio || !local.bio.trim())
    //   newErrors.bio = t("personal_info.errors.bio");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [local, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocal((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleTypeDropdownChange = (selectedLabel) => {
    const stable =
      selectedLabel === t("personal_info.account_business")
        ? STABLE_TYPES.BUSINESS
        : selectedLabel === t("personal_info.account_creative")
          ? STABLE_TYPES.CREATIVE
          : "";

    setLocal((p) => ({ ...p, type: stable, typeLabel: selectedLabel }));

    writeToParent("type", stable);

    if (errors.type) setErrors((p) => ({ ...p, type: "" }));
  };

  const handleNext = (ev) => {
    ev.preventDefault();
    if (!validateAll()) {
      const first = Object.keys(errors)[0];
      if (first) {
        const el = document.querySelector(`[name="${first}"]`);
        if (el) el.focus();
      }
      return;
    }

    if (typeof setFormData === "function") {
      setFormData((prev) => ({
        ...(prev || {}),
        ...local,
        type: local.type || STABLE_TYPES.BUSINESS,
        password_confirmation: local.password,
      }));
    } else {
      Object.entries(local).forEach(([k, v]) => {
        writeToParent(k, v);
      });
      writeToParent("password_confirmation", local.password);
    }

    onNext && onNext();
  };

  return (
    <div className="w-full max-w-2xl bg-white p-8 rounded-lg border">
      <h2 className="text-xl text-md text-center mb-2">Welcome to ArtCee!</h2>
      <p className="text-gray-500 font-light text-xs text-center mb-4">
        Where artsy people go to get discovered <br />
        Let&apos;s start by getting to know you
      </p>

      <div className="bg-blue-50 border border-blue-200 text-teal-600 px-4 py-3 rounded-md mb-6 text-xs font-light text-center">
        {t("personal_info.note_required")}
      </div>

      <form onSubmit={handleNext} className="space-y-4" autoComplete="on">
        {/* Account Type */}
        <div>
          <label className="block text-xs font-semibold">
            {t("personal_info.account_type")} *
          </label>

          <CustomDropdown
            value={local.typeLabel || t("personal_info.account_business")}
            setValue={(val) => handleTypeDropdownChange(val)}
            options={typeLabels}
          />

          {errors.type && (
            <div className="text-xs text-red-500 mt-1">{errors.type}</div>
          )}
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold">
            {t("personal_info.full_name")} *
          </label>
          <input
            type="text"
            name="full_name"
            value={local.full_name}
            onChange={handleChange}
            className={`mt-1 block w-full border form-input text-xs ${errors.full_name ? "border-red-400" : "border-none"
              } rounded-md p-2`}
            placeholder={t("personal_info.full_name_placeholder")}
          />
          {errors.full_name && (
            <div className="text-xs text-red-500 mt-1">{errors.full_name}</div>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold">
            {t("personal_info.email")} *
          </label>
          <input
            type="email"
            name="email"
            value={local.email}
            onChange={handleChange}
            className={`mt-1 block w-full border form-input text-xs ${errors.email ? "border-red-400" : "border-none"
              } rounded-md p-2`}
            placeholder={t("personal_info.email_placeholder")}
            autoComplete="email"
          />
          {errors.email && (
            <div className="text-xs text-red-500 mt-1">{errors.email}</div>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block text-xs font-semibold">
            {t("personal_info.password")} *
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={local.password}
            onChange={handleChange}
            className={`mt-1 block w-full form-input border text-xs ${errors.password ? "border-red-400" : "border-none"
              } rounded-md p-2 pr-10`}
            placeholder={t("personal_info.password_placeholder")}
            autoComplete="new-password"
          />
          <span
            className="absolute right-3 top-7 cursor-pointer text-gray-500"
            onClick={() => setShowPassword((s) => !s)}
            aria-hidden
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          {errors.password && (
            <div className="text-xs text-red-500 mt-1">{errors.password}</div>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold">
            {t("personal_info.phone")} *
          </label>
          <input
            type="tel"
            name="phone"
            value={local.phone}
            onChange={handleChange}
            className={`mt-1 block w-full form-input border text-xs ${errors.phone ? "border-red-400" : "border-none"
              } rounded-md p-2`}
            placeholder={t("personal_info.phone_placeholder")}
            autoComplete="tel"
          />
          {errors.phone && (
            <div className="text-xs text-red-500 mt-1">{errors.phone}</div>
          )}
        </div>

        {/* Creative Specialty */}
        <div>
          <label className="block text-xs font-semibold">
            {t("personal_info.title")} *
          </label>
          <input
            type="text"
            name="title"
            value={local.title}
            onChange={handleChange}
            className={`mt-1 block w-full form-input border text-xs ${errors.title ? "border-red-400" : "border-none"
              } rounded-md p-2`}
            placeholder={t("personal_info.title_placeholder")}
          />
          {errors.title && (
            <div className="text-xs text-red-500 mt-1">{errors.title}</div>
          )}
        </div>

        {/* Personal Intro */}
        {/* <div>
          <label className="block text-xs font-semibold">
            {t("personal_info.bio")} *
          </label>
          <textarea
            name="bio"
            value={local.bio}
            onChange={handleChange}
            // onBlur={handleBlur}
            rows="3"
            className={`mt-1 block w-full form-input border text-xs ${
              errors.bio ? "border-red-400" : "border-none"
            } rounded-md p-2`}
            placeholder={t("personal_info.bio_placeholder")}
          />
          {errors.bio && (
            <div className="text-xs text-red-500 mt-1">{errors.bio}</div>
          )}
        </div> */}

        {/* Error Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-xs">
            <p>{t("personal_info.error_summary")}</p>
            <ul className="list-disc list-inside">
              {Object.values(errors).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end ">
          <button
            type="submit"
            className="flex items-center px-6 py-2 text-xs bg-teal-400 text-white rounded-md hover:bg-teal-500"
          >
            {t("personal_info.next")} <FaArrowRight className="ml-2" />
          </button>

        </div>
        <div className="flex justify-end">
          <Link
            to="/home"
            className="text-gray-600 text-xs border-2 px-3 py-1.5 rounded-md hover:bg-gray-100"
          >
            {t("register.skip_for_now")}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoStep;

