import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { updateSocialLinks } from "../../Hooks/useDashboard";

const DEFAULT_PLATFORMS = [
  "website",
  "linkedin",
  "instagram",
  "behance",
  "dribbble",
];

const isValidUrl = (val) => {
  if (!val) return true; 
  try {
    const url = new URL(val);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

const SocialLinksModal = ({ isOpen, onClose, initialData = {}, onSaved }) => {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setErrors(null);

    const socialObj = {};

    if (initialData?.social && typeof initialData.social === "object") {
      Object.assign(socialObj, initialData.social);
    }

    if (Array.isArray(initialData?.social_media)) {
      initialData.social_media.forEach((item) => {
        if (item?.platform && item?.url) {
          socialObj[item.platform] = item.url;
        }
      });
    }

    DEFAULT_PLATFORMS.forEach((p) => {
      if (!Object.prototype.hasOwnProperty.call(socialObj, p)) socialObj[p] = "";
    });

    setForm(socialObj);
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);

    for (const [k, v] of Object.entries(form)) {
      if (v && !isValidUrl(v)) {
        return setErrors(`Invalid URL for ${k}: ${v}`);
      }
    }

    const id = initialData?.uuid || initialData?.id;
    if (!id) return setErrors("Missing user id (uuid/id) to update social links.");

    const socialPayload = {};
    Object.entries(form).forEach(([k, v]) => {
      if (v && String(v).trim()) socialPayload[k] = String(v).trim();
    });

    const payload = { social: socialPayload };

    setLoading(true);
    try {
      const res = await updateSocialLinks(id, payload);
      onSaved?.(res);
      onClose();
    } catch (err) {
      setErrors(err?.message || "Failed to update social links");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-auto max-h-[90vh]">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">Social Media Links</h3>
          <button onClick={onClose} className="text-gray-500"><FaTimes /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {errors && <div className="text-xs text-red-500">{errors}</div>}

          <div className="text-xs text-gray-500">Add links for the platforms you want to show. Leave blank to skip.</div>

          {DEFAULT_PLATFORMS.map((platform) => (
            <div key={platform}>
              <label className="text-xs capitalize">{platform.replace("_", " ")}</label>
              <input
                name={platform}
                value={form[platform] ?? ""}
                onChange={handleChange}
                placeholder={`https://www.${platform}.com/your-profile`}
                className="w-full form-input px-3 py-2 rounded mt-1 text-xs"
              />
            </div>
          ))}

          <div className="flex justify-end gap-2 text-xs">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-teal-500 text-white rounded">
              {loading ? "Saving…" : "Save Links"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SocialLinksModal;
