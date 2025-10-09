import React, { useEffect, useRef, useState } from "react";
import { X, Plus, Link as LinkIcon, Image as ImageIcon, Video as VideoIcon } from "lucide-react";
import toast from "react-hot-toast";
import { postBusinessListing } from "../Hooks/useSeller";

export default function BusinessListingModal({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [type, setType] = useState(null);
  const [description, setDescription] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [website, setWebsite] = useState("");
  const [socials, setSocials] = useState([{ id: Date.now(), url: "" }]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const inputRef = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      clearFile();
      setDescription("");
      setIntroduction("");
      setWebsite("");
      setSocials([{ id: Date.now(), url: "" }]);
      setErrors({});
      setSubmitting(false);
    }
  }, [isOpen]);

  const handleFileDropOrPick = (f) => {
    if (!f) return;

    const allowed = /^(image|video)\//;
    if (!allowed.test(f.type)) {
      setErrors((s) => ({ ...s, file: "Only image/video files are allowed." }));
      return;
    }

    const limitBytes = 10 * 1024 * 1024;
    if (f.size > limitBytes) {
      setErrors((s) => ({ ...s, file: "File is too large (max 10 MB)." }));
      return;
    }

    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
    }

    const url = URL.createObjectURL(f);
    previewRef.current = url;
    setPreviewUrl(url);
    setFile(f);
    if (f.type.startsWith("image/")) setType("image");
    else if (f.type.startsWith("video/")) setType("video");
    else setType(null);

    setErrors((s) => ({ ...s, file: null }));
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    handleFileDropOrPick(f);
  };

  const openFilePicker = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer.files?.[0] ?? null;
    if (f) handleFileDropOrPick(f);
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setType(null);
    setErrors((s) => ({ ...s, file: null }));
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  const addSocial = () => setSocials((s) => [...s, { id: Date.now() + Math.random(), url: "" }]);
  const removeSocial = (id) => setSocials((s) => s.filter((i) => i.id !== id));
  const updateSocial = (id, val) => setSocials((s) => s.map((i) => (i.id === id ? { ...i, url: val } : i)));

  const validate = () => {
    const errs = {};
    if (!description.trim()) errs.description = "Business description is required.";
    if (!introduction.trim()) errs.introduction = "Introduction is required.";
    if (website.trim()) {
      try {
        new URL(website);
      } catch {
        errs.website = "Website must be a valid URL (include https://).";
      }
    }
    const socialErrors = socials.map((s) => {
      if (!s.url) return null;
      try {
        new URL(s.url);
        return null;
      } catch {
        return "Invalid URL";
      }
    });
    if (socialErrors.some(Boolean)) errs.socials = socialErrors;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ---------- MAIN submit: call postBusinessListing API with expected field names ----------
  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (submitting) return;
    if (!validate()) return;
    setSubmitting(true);

    try {
      const formData = new FormData();

      // keys matched to your Postman example
      formData.append("description", description);
      formData.append("intro", introduction); // backend expects `intro`
      formData.append("website_link", website);

      // file key matches your API: `uploads_file`
      if (file) {
        formData.append("uploads_file", file);
      }

      // append each social as `social_media_link[]` (multiple fields)
      socials
        .map((s) => s.url?.trim())
        .filter(Boolean)
        .forEach((url) => {
          formData.append("social_media_link[]", url);
        });

      // call API
      const res = await postBusinessListing(formData);
      // success
      toast.success("Business listing created.");
      // optionally you can inspect res and do further actions
      clearFile();
      // close modal
      if (onClose) onClose();
    } catch (err) {
      console.error("Submit failed", err);
      const msg = err?.message ?? "Submit failed";
      toast.error(msg);
      setErrors((s) => ({ ...s, submit: msg }));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-2xl bg-white rounded-md shadow-xl p-0 overflow-hidden"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <h3 className="text-lg font-semibold">Add Business Listing</h3>
          <button type="button" onClick={onClose} className="p-1 rounded-md hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image / Video</label>
            <div className="border border-dashed border-gray-200 rounded-md p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 flex items-center justify-center rounded-md bg-gray-50">
                  {type === "video" ? <VideoIcon className="h-6 w-6 text-gray-500" /> : <ImageIcon className="h-6 w-6 text-gray-500" />}
                </div>

                <div>
                  <div className="text-xs font-medium">{file ? file.name : "Drag & drop or choose a file"}</div>
                  <div className="text-xs text-gray-500">Supported: images and videos. Max 10 MB.</div>
                  {errors.file && <div className="text-xs text-red-600 mt-1">{errors.file}</div>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input ref={inputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
                <button
                  type="button"
                  onClick={openFilePicker}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-white border rounded-md text-xs font-semibold hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                  Choose
                </button>
                {file && (
                  <button
                    type="button"
                    onClick={clearFile}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-md text-xs font-semibold hover:bg-red-100"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {previewUrl && (
              <div className="mt-3">
                {type === "image" ? (
                  <img src={previewUrl} alt="preview" className="h-28 rounded-md object-cover" />
                ) : (
                  <video src={previewUrl} controls className="h-28 rounded-md object-cover" />
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700">Business Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the business, services, specialties..."
                className="mt-1 text-xs block w-full rounded-md border px-3 py-2 form-input"
                rows={4}
              />
              {errors.description && <div className="text-xs text-red-600 mt-1">{errors.description}</div>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">Introduction</label>
              <input
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
                placeholder="Short intro (one-liner)"
                className="mt-1 text-xs block w-full rounded-md border px-3 py-2 form-input"
              />
              {errors.introduction && <div className="text-xs text-red-600 mt-1">{errors.introduction}</div>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">Website link</label>
              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="mt-1 text-xs block w-full rounded-md border px-3 py-2 form-input"
              />
              {errors.website && <div className="text-xs text-red-600 mt-1">{errors.website}</div>}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700">Social media links</label>
              <button type="button" onClick={addSocial} className="inline-flex items-center gap-2 text-xs text-teal-600">
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>

            <div className="mt-2 space-y-2">
              {socials.map((s, idx) => (
                <div key={s.id} className="flex items-center gap-2">
                  <div className="flex items-center w-full">
                    <input
                      value={s.url}
                      onChange={(e) => updateSocial(s.id, e.target.value)}
                      placeholder={idx === 0 ? "https://facebook.com/yourpage" : "https://"}
                      className="w-full text-xs form-input outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSocial(s.id)}
                    className="p-2 rounded-md hover:bg-gray-100 text-red-600"
                    title="Remove"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {errors.socials && <div className="text-xs text-red-600">Some social links are invalid.</div>}
            </div>
          </div>

          {errors.submit && <div className="text-sm text-red-600">{errors.submit}</div>}
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t bg-white">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold rounded-md border hover:bg-gray-100">
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-md text-xs font-semibold bg-teal-500 text-white hover:bg-teal-700 disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save Listing"}
          </button>
        </div>
      </form>
    </div>
  );
}
