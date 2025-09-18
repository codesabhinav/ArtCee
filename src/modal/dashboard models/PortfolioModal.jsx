// src/components/modals/PortfolioModal.jsx
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { updatePortfolio } from "../../Hooks/useDashboard";
import { getGuestDashboardData } from "../../Hooks/useSeller";
import toast from "react-hot-toast";

const PortfolioModal = ({ isOpen, onClose, initialData = {}, onSaved }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    role: "",
    technologies: "",
    project_url: "",
  });
  const [files, setFiles] = useState([]);
  const [existingMedia, setExistingMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setErrors(null);
    setFiles([]);
    setExistingMedia(Array.isArray(initialData.media) ? initialData.media : []);

    setForm({
      title: "",
      description: "",
      role: "",
      technologies: "",
      project_url: "",
    });
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleFiles = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles(list);
  };

  const removeExistingMedia = (mediaId) => {
    setExistingMedia((prev) => prev.filter((m) => m.id !== mediaId));
  };

  const validate = () => {
    if (!form.title.trim()) return "Title is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);

    const err = validate();
    if (err) return setErrors(err);

    const fd = new FormData();

    if (initialData.uuid) fd.append("uuid", initialData.uuid);
    if (initialData.id) fd.append("id", initialData.id);

    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("role", form.role);
    fd.append("project_url", form.project_url || "");
    fd.append("technologies", form.technologies || "");

    if (existingMedia.length > 0) {
      existingMedia.forEach((m) => fd.append("existing_media[]", m.id));
    }

    files.forEach((f) => {
      fd.append("files[]", f);
    });

    setLoading(true);
    try {
      const res = await updatePortfolio(fd);
      onSaved?.(res);

      try {
        await getGuestDashboardData();
      } catch (refreshErr) {
        console.warn("Failed to refresh guest dashboard data:", refreshErr);
      }
      toast.success("Data updated");
      onClose();
    } catch (err) {
      setErrors(err?.message || "Failed to update portfolio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-auto max-h-[90vh]">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">Portfolio</h3>
          <button onClick={onClose} className="text-gray-500"><FaTimes /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {errors && <div className="text-xs text-red-500">{errors}</div>}

          <div>
            <label className="text-xs">Title</label>
            <input name="title" value={form.title} onChange={handleChange} className="w-full form-input px-3 py-2 rounded mt-1 text-xs" />
          </div>

          <div>
            <label className="text-xs">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full form-input px-3 py-2 rounded mt-1 text-xs" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs">Role</label>
              <input name="role" value={form.role} onChange={handleChange} className="w-full form-input px-3 py-2 rounded mt-1 text-xs" />
            </div>

            <div>
              <label className="text-xs">Technologies (comma-separated)</label>
              <input name="technologies" value={form.technologies} onChange={handleChange} className="w-full form-input px-3 py-2 rounded mt-1 text-xs" placeholder="MYSQL, LARAVEL, React" />
            </div>
          </div>

          <div>
            <label className="text-xs">Project URL</label>
            <input name="project_url" value={form.project_url} onChange={handleChange} className="w-full form-input px-3 py-2 rounded mt-1 text-xs" />
          </div>

          <div>
            <label className="text-xs">Upload files (you can add multiple)</label>
            <input type="file" multiple onChange={handleFiles} className="w-full mt-1" />
            {files.length > 0 && (
              <div className="mt-2 text-xs">
                <div className="font-medium">Ready to upload:</div>
                <ul className="text-xs list-disc pl-5">
                  {files.map((f, i) => <li key={i}>{f.name} ({Math.round(f.size / 1024)} KB)</li>)}
                </ul>
              </div>
            )}
          </div>

          {existingMedia.length > 0 && (
            <div>
              <div className="text-xs font-medium mb-2">Existing media</div>
              <div className="grid grid-cols-2 gap-2">
                {existingMedia.map((m) => (
                  <div key={m.id} className="border rounded p-2 flex items-start gap-2">
                    <div className="w-16 h-12 overflow-hidden rounded bg-gray-100 flex items-center justify-center">
                      {m.mime_type?.startsWith("image") ? (
                        <img src={m.url} alt={`media-${m.id}`} className="object-cover w-full h-full" />
                      ) : (
                        <div className="text-xs">{m.file_name}</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm">{m.file_name}</div>
                      <div className="text-xs text-gray-400">{m.mime_type} • {Math.round((m.size || 0) / 1024)} KB</div>
                    </div>
                    <div>
                      <button type="button" onClick={() => removeExistingMedia(m.id)} className="text-xs px-2 py-1 border rounded">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 text-xs">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-teal-500 text-white rounded">
              {loading ? "Saving…" : "Save Portfolio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PortfolioModal;
