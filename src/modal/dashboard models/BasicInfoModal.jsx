import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { updateBasicInfo } from "../../Hooks/useDashboard";
import { useTranslation } from "../../contexts/LanguageProvider";
import toast from "react-hot-toast";

const BasicInfoModal = ({ isOpen, onClose, initialData = {}, onSaved }) => {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    title: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setForm({
        full_name: initialData.full_name || "",
        email: initialData.email || "",
        title: initialData.title || "",
        bio: initialData.bio || "",
      });
      setErrors(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);

    if (!form.full_name.trim()) {
      return setErrors(t("basic_info.errors.full_name_required"));
    }
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return setErrors(t("basic_info.errors.valid_email_required"));
    }

    setLoading(true);
    try {
      const payload = { ...form };
      const res = await updateBasicInfo(initialData.uuid || initialData.id, payload);

      // Notify parent that save succeeded; parent will refresh dashboard
      onSaved?.(res);

      toast.success( "Profile updated");
      onClose();
    } catch (err) {
      setErrors(err?.message );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-auto max-h-[90vh]">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">{t("basic_info.title")}</h3>
          <button onClick={onClose} className="text-gray-500" aria-label={t("basic_info.close")}>
            <FaTimes />
          </button>
        </div>

        <form className="p-4 space-y-3" onSubmit={handleSubmit}>
          {errors && <div className="text-xs text-red-500">{errors}</div>}

          <div>
            <label className="text-xs block mb-1">{t("basic_info.labels.full_name")}</label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              className="w-full form-input px-3 py-2 rounded mt-1"
              placeholder={t("basic_info.placeholders.full_name")}
            />
          </div>

          <div>
            <label className="text-xs block mb-1">{t("basic_info.labels.email")}</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full form-input px-3 py-2 rounded mt-1"
              placeholder={t("basic_info.placeholders.email")}
            />
          </div>

          <div>
            <label className="text-xs block mb-1">{t("basic_info.labels.title")}</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full form-input px-3 py-2 rounded mt-1"
              placeholder={t("basic_info.placeholders.title")}
            />
          </div>

          <div>
            <label className="text-xs block mb-1">{t("basic_info.labels.bio")}</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full form-input px-3 py-2 rounded mt-1"
              rows={4}
              placeholder={t("basic_info.placeholders.bio")}
            />
          </div>

          <div className="flex justify-end gap-2 text-xs">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              {t("basic_info.buttons.cancel")}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-teal-500 text-white rounded"
            >
              {loading ? t("basic_info.buttons.saving") : t("basic_info.buttons.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BasicInfoModal;
