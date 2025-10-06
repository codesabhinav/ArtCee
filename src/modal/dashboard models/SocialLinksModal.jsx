import React, { useEffect, useState } from "react";
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import { updateSocialLinks } from "../../Hooks/useDashboard";
import { getGuestDashboardData } from "../../Hooks/useSeller";
import toast from "react-hot-toast";
import { Eye } from "lucide-react";

const KEY_REGEX = /^[a-zA-Z0-9_-]+$/;

const isValidUrl = (val) => {
  if (!val) return true;
  try {
    const url = new URL(val);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

const normalizeKey = (k) => {
  if (!k) return k;
  return String(k).trim().toLowerCase().replace(/\s+/g, "_");
};

const SocialLinksModal = ({ isOpen, onClose, initialData = {}, onSaved }) => {
  const [existing, setExisting] = useState([]);
  const [newKey, setNewKey] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setErrors(null);
    const arr = [];

    if (initialData?.social && typeof initialData.social === "object") {
      Object.entries(initialData.social).forEach(([k, v]) => {
        if (v) arr.push({ key: normalizeKey(k), url: String(v) });
      });
    }

    const list = initialData?.social_links ?? initialData?.social_media ?? [];
    if (Array.isArray(list)) {
      list.forEach((it) => {
        const p = it?.platform ?? it?.platform_name ?? it?.name;
        const u = it?.url ?? it?.link;
        if (p && u) arr.push({ key: normalizeKey(p), url: String(u) });
      });
    }

    const seen = new Set();
    const deduped = [];
    arr.forEach((item) => {
      if (!seen.has(item.key)) {
        seen.add(item.key);
        deduped.push(item);
      }
    });

    setExisting(deduped);
    setNewKey("");
    setNewUrl("");
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const updateExistingUrl = (key, url) => {
    setExisting((prev) => prev.map((p) => (p.key === key ? { ...p, url } : p)));
  };

  const removeExisting = (key) => {
    setExisting((prev) => prev.filter((p) => p.key !== key));
  };

  const handleAddNew = (e) => {
    e?.preventDefault();
    setErrors(null);
    const rawKey = normalizeKey(newKey || "");
    const rawUrl = (newUrl || "").trim();

    if (!rawKey) return setErrors("Enter platform key (no spaces).");
    if (!KEY_REGEX.test(rawKey)) return setErrors("Key may only contain letters, numbers, underscore(_) or hyphen(-). No spaces.");
    if (!rawUrl) return setErrors("Provide URL for the new platform.");
    if (!isValidUrl(rawUrl)) return setErrors("Invalid URL for new platform.");

    if (existing.some((p) => p.key === rawKey)) return setErrors("This platform key already exists. Edit the existing entry instead.");

    setExisting((prev) => [...prev, { key: rawKey, url: rawUrl }]);
    setNewKey("");
    setNewUrl("");
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setErrors(null);

    for (const { key, url } of existing) {
      if (!KEY_REGEX.test(key)) {
        return setErrors(`Invalid key name: "${key}". Only letters, numbers, "_" and "-" allowed.`);
      }
      if (url && !isValidUrl(url)) {
        return setErrors(`Invalid URL for "${key}": ${url}`);
      }
    }

    const id = initialData?.uuid || initialData?.id;
    if (!id) return setErrors("Missing user id (uuid/id) to update social links.");

    const socialPayload = {};
    existing.forEach(({ key, url }) => {
      if (url && String(url).trim()) socialPayload[key] = String(url).trim();
    });

    setLoading(true);
    try {
      const payload = { social: socialPayload };
      const res = await updateSocialLinks(id, payload);
      toast.success("Social links updated");
      onSaved?.(res);

      try {
        await getGuestDashboardData();
      } catch (err) {
        console.warn("Refresh failed:", err);
      }

      onClose();
    } catch (err) {
      console.error("Failed to save social links", err);
      setErrors(err?.message || "Failed to update social links");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-auto max-h-[90vh]">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">Social Media Links</h3>
          <button onClick={onClose} className="text-gray-500"><FaTimes /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {errors && <div className="text-xs text-red-500">{errors}</div>}

          <div className="text-xs text-gray-500">Existing links. Add new platforms below.</div>

          {/* Existing links list */}
          <div className="space-y-3 mt-2">
            {existing.length === 0 && <div className="text-sm text-gray-500">No links added yet.</div>}
            {existing.map(({ key, url }) => (
              <div key={key} className="flex items-start gap-3">
                <div className="w-1/4">
                  <label className="text-xs font-medium">{key.replace(/_/g, " ")}</label>
                </div>

                <div className="flex-1">
                  <input
                    value={url ?? ""}
                    onChange={(e) => updateExistingUrl(key, e.target.value)}
                    placeholder={`https://example.com/${key}`}
                    className="w-full form-input px-3 py-2 rounded mt-1 text-xs"
                  />
                </div>

                <div className="flex flex-col items-center">
                  {url ? (
                    <a href={url} target="_blank" rel="noreferrer" className="text-teal-600 text-xs underline mb-2"><Eye className="h-4 w-4"/></a>
                  ) : (
                    <div className="text-xs text-gray-400 mb-2">No URL</div>
                  )}
                  <button type="button" onClick={() => removeExisting(key)} className="text-red-500 text-sm">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <hr />

          {/* Add new platform */}
          <div>
            <div className="text-xs font-medium mb-2">Add a new platform</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
              <div className="sm:col-span-1">
                <label className="text-xs">Platform key (no spaces)</label>
                <input
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="e.g. google_meet, tiktok"
                  className="w-full form-input px-3 py-2 rounded mt-1 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs">URL</label>
                <input
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full form-input px-3 py-2 rounded mt-1 text-xs"
                />
              </div>

              <div className="sm:col-span-3 flex justify-end mt-1">
                <button type="button" onClick={handleAddNew} className="px-3 py-2 bg-teal-500 text-white rounded text-xs inline-flex items-center gap-2">
                  <FaPlus /> Add Platform
                </button>
              </div>
            </div>
          </div>

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
