import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUser, FaShieldAlt, FaCalendarAlt, FaUserCheck } from "react-icons/fa";
import { useTranslation } from "../../contexts/LanguageProvider";

const safeSplitDOB = (dob) => {
  if (typeof dob !== "string" || !dob.trim()) return [];
  const parts = dob.split("-");
  if (parts.length !== 3) return [];

  if (parts[0].length === 4) {
    const [y, m, d] = parts;
    if (!y || !m || !d) return [];
    return [String(Number(d)).padStart(2, "0"), String(Number(m)).padStart(2, "0"), String(y)];
  }

  const [d, m, y] = parts;
  if (!d || !m || !y) return [];
  return [String(Number(d)).padStart(2, "0"), String(Number(m)).padStart(2, "0"), String(y)];
};

const AgeVerificationModal = ({ isOpen, onClose, onSubmit, formData = {}, setFormData }) => {
  const { t } = useTranslation();

  const [method, setMethod] = useState("dob");
  const [localYear, setLocalYear] = useState("");
  const [localMonth, setLocalMonth] = useState("");
  const [localDay, setLocalDay] = useState("");
  const [localAge, setLocalAge] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const months = (t("age_verification.months") || "January|February|March|April|May|June|July|August|September|October|November|December").split("|");

  useEffect(() => {
    if (!isOpen) return;

    const dtype = formData?.date_of_birth_type || "date";
    setMethod(dtype === "age" ? "declaration" : "dob");

    const parts = safeSplitDOB(formData?.date_of_birth || "");
    const [dayPart, monthPart, yearPart] = parts.length === 3 ? parts : ["", "", ""];
    setLocalDay(dayPart || "");
    setLocalMonth(monthPart ? String(Number(monthPart)).padStart(2, "0") : "");
    setLocalYear(yearPart || "");
    setLocalAge(formData?.age ? String(formData.age) : "");
    setError("");
  }, [isOpen, formData, t]);

  useEffect(() => {
    if (isOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  if (!isOpen) return null;

  const calculateAgeFromLocal = () => {
    const year = Number(localYear);
    const month = Number(localMonth);
    const day = Number(localDay);
    if (!year || !month || !day) return null;

    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleVerify = async () => {
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      let userAge = null;
      let next = { ...(formData || {}) };

      if (method === "dob") {
        if (!localDay || !localMonth || !localYear) {
          const msg = t("age_verification.errors.invalid_dob");
          setError(msg);
          toast.error(msg);
          setLoading(false);
          return;
        }

        userAge = calculateAgeFromLocal();
        if (userAge === null || userAge < 0) {
          const msg = t("age_verification.errors.invalid_dob");
          setError(msg);
          toast.error(msg);
          setLoading(false);
          return;
        }

        const monthStr = String(Number(localMonth)).padStart(2, "0");
        const dayStr = String(Number(localDay)).padStart(2, "0");
        const dobIso = `${dayStr}-${monthStr}-${localYear}`;

        next = {
          ...next,
          date_of_birth_type: "date",
          date_of_birth: dobIso,
          age: String(userAge),
        };
      } else {
        if (!localAge) {
          const msg = t("age_verification.errors.enter_age");
          setError(msg);
          toast.error(msg);
          setLoading(false);
          return;
        }
        const parsed = parseInt(localAge, 10);
        if (Number.isNaN(parsed)) {
          const msg = t("age_verification.errors.enter_age");
          setError(msg);
          toast.error(msg);
          setLoading(false);
          return;
        }
        userAge = parsed;

        next = {
          ...next,
          date_of_birth_type: "age",
          age: String(userAge),
          date_of_birth: "",
        };
      }

      if (userAge < 18) {
        const msg = t("age_verification.errors.underage");
        setError(msg);
        toast.error(msg);
        setLoading(false);
        return;
      }

      toast.success(t("age_verification.success"));

      if (typeof onSubmit === "function") {
        await onSubmit(next);
      }

      if (typeof setFormData === "function") {
        setFormData((prev) => ({ ...(prev || {}), ...next }));
      }

      onClose();
    } catch (err) {
      console.error("onSubmit error:", err);
      toast.error(t("age_verification.errors.submit_failed") || "Submit failed");
    } finally {
      setLoading(false);
    }
  };

  const selectMethod = (m, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setMethod(m);
    setError("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg p-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
        <div className="flex justify-between items-start">
          <h2 className="text-sm font-semibold">{t("age_verification.title")}</h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-800 text-sm"
            aria-label={t("age_verification.close")}
          >
            ✕
          </button>
        </div>

        <div className="flex justify-center my-4">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-teal-500">
            <FaUser className="text-white text-2xl" />
          </div>
        </div>

        <h3 className="text-sm font-bold text-center mb-2">{t("age_verification.heading")}</h3>
        <p className="text-xs font-regular text-gray-600 text-center mb-6">{t("age_verification.subheading")}</p>

        <div className="border rounded-lg p-4 mb-6 flex space-x-3">
          <FaShieldAlt className="text-gray-600 mt-1" />
          <div>
            <p className="font-bold text-gray-600 text-xs">{t("age_verification.privacy_title")}</p>
            <p className="text-xs font-light text-gray-600">{t("age_verification.privacy_body")}</p>
          </div>
        </div>

        <div className="border rounded-lg p-4 mb-6">
          <h4 className="text-xs font-semibold mb-3">{t("age_verification.choose_method")}</h4>
          <div className="space-y-3">
            <button
              type="button"
              onClick={(e) => selectMethod("dob", e)}
              className={`w-full text-left flex items-start justify-start border rounded-lg p-3 ${method === "dob" ? "bg-teal-50 border-teal-400" : "hover:bg-gray-50"}`}
            >
              <input type="radio" checked={method === "dob"} readOnly />
              <div className="ml-2">
                <div className="flex flex-row gap-2">
                  <FaCalendarAlt className="text-teal-500 h-3 w-3" />
                  <p className="font-semibold text-xs">{t("age_verification.method_dob.title")}</p>
                </div>
                <p className="text-[10px] text-gray-500">{t("age_verification.method_dob.desc")}</p>
              </div>
            </button>

            <button
              type="button"
              onClick={(e) => selectMethod("declaration", e)}
              className={`w-full text-left flex items-start justify-start border rounded-lg p-3 ${method === "declaration" ? "bg-teal-50 border-teal-400" : "hover:bg-gray-50"}`}
            >
              <input type="radio" checked={method === "declaration"} readOnly />
              <div className="ml-2">
                <div className="flex flex-row gap-2">
                  <FaUserCheck className="text-teal-500 h-3 w-3" />
                  <p className="font-semibold text-xs">{t("age_verification.method_decl.title")}</p>
                </div>
                <p className="text-[10px] text-gray-500">{t("age_verification.method_decl.desc")}</p>
              </div>
            </button>
          </div>
        </div>

        {method === "dob" ? (
          <div className="border rounded-lg p-4 mb-6">
            <h4 className="text-xs font-semibold mb-3">{t("age_verification.enter_dob")}</h4>
            <div className="flex space-x-3">
              <select
                className="border form-input rounded-md p-2 w-1/3 text-xs"
                value={localMonth || ""}
                onChange={(e) => {
                  const val = String(e.target.value).padStart(2, "0");
                  setLocalMonth(val === "00" ? "" : val);
                }}
              >
                <option value="">{t("age_verification.month_placeholder")}</option>
                {months.map((m, i) => (
                  <option key={i} value={String(i + 1).padStart(2, "0")}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                className="border form-input rounded-md p-2 w-1/3 text-xs"
                value={localDay || ""}
                onChange={(e) => {
                  const val = String(e.target.value).padStart(2, "0");
                  setLocalDay(val === "00" ? "" : val);
                }}
              >
                <option value="">{t("age_verification.day_placeholder")}</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                    {i + 1}
                  </option>
                ))}
              </select>

              <select
                className="border form-input rounded-md p-2 w-1/3 text-xs"
                value={localYear || ""}
                onChange={(e) => setLocalYear(String(e.target.value))}
              >
                <option value="">{t("age_verification.year_placeholder")}</option>
                {Array.from({ length: 100 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={String(year)}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        ) : (
          <div className="border rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium mb-3">{t("age_verification.enter_age")}</h4>
            <input
              type="number"
              placeholder={t("age_verification.age_placeholder")}
              value={localAge || ""}
              onChange={(e) => setLocalAge(e.target.value)}
              className="border rounded-md p-2 w-full text-sm"
            />
          </div>
        )}

        {error && <p className="text-red-500 text-xs mb-4 text-center">{error}</p>}

        <div className="flex justify-between space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="flex-1 px-4 py-2 text-xs border rounded-md text-gray-700 hover:bg-gray-100"
            type="button"
            disabled={loading}
          >
            {t("age_verification.cancel")}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleVerify();
            }}
            disabled={loading}
            type="button"
            className={`flex-1 px-4 py-2 text-xs text-white rounded-md ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-teal-400 hover:bg-teal-500"}`}
          >
            {loading ? "Registration in progress..." : t("age_verification.verify")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationModal;
