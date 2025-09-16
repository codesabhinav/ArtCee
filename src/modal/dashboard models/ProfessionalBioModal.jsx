import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { updateProfessionalBio } from "../../Hooks/useDashboard";

const ProfessionalBioModal = ({ isOpen, onClose, initialData = {}, onSaved }) => {
  const [form, setForm] = useState({
    title: "",
    bio: "",
    experience_years: "",
    skills: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setForm({
        title: initialData.title || "",
        bio: initialData.bio || "",
        experience_years: initialData.experience_years || "",
        skills: Array.isArray(initialData.skills) ? initialData.skills.join(",") : (initialData.skills || ""),
      });
      setErrors(null);
      setSuccessMessage(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    if (!form.title.trim()) return "Title is required";
    if (!form.bio.trim()) return "Bio is required";
    if (form.experience_years && !/^\d+$/.test(String(form.experience_years).trim()))
      return "Experience must be a number (years)";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    setSuccessMessage(null);

    const err = validate();
    if (err) return setErrors(err);

    const payload = {
      ...(initialData.uuid ? { uuid: initialData.uuid } : (initialData.id ? { id: initialData.id } : {})),
      title: form.title.trim(),
      bio: form.bio.trim(),
      experience_years: String(form.experience_years).trim(),
      skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    setLoading(true);
    try {
      const res = await updateProfessionalBio(payload);
      setSuccessMessage("Saved successfully");
      onSaved?.(res);
      onClose();
    } catch (err) {
      setErrors(err?.message || "Failed to update professional bio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-auto max-h-[90vh]">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">Professional Bio</h3>
          <button onClick={onClose} className="text-gray-500"><FaTimes /></button>
        </div>

        <form className="p-4 space-y-3" onSubmit={handleSubmit}>
          {errors && <div className="text-xs text-red-500">{errors}</div>}
          {successMessage && <div className="text-xs text-green-600">{successMessage}</div>}

          <div>
            <label className="text-xs">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full form-input px-3 py-2 rounded mt-1 text-xs"
              placeholder="e.g. Senior Backend Developer"
            />
          </div>

          <div>
            <label className="text-xs">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full form-input px-3 py-2 rounded mt-1 text-xs"
              rows={3}
              placeholder="Short professional bio..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs">Experience (years)</label>
              <input
                name="experience_years"
                value={form.experience_years}
                onChange={handleChange}
                className="w-full form-input px-3 py-2 rounded mt-1 text-xs"
                placeholder="e.g. 10"
              />
            </div>

            <div>
              <label className="text-xs">Skills (comma-separated)</label>
              <input
                name="skills"
                value={form.skills}
                onChange={handleChange}
                className="w-full form-input px-3 py-2 rounded mt-1 text-xs"
                placeholder="MYSQL, LARAVEL, React"
              />
              <p className="text-xs text-gray-400 mt-1">Separate skills with commas.</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 text-xs">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-teal-500 text-white rounded">
              {loading ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfessionalBioModal;
