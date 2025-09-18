import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { getSkills } from "../../Hooks/useAuth";
import { updateSkills } from "../../Hooks/useDashboard";
import { getGuestDashboardData } from "../../Hooks/useSeller";
import toast from "react-hot-toast";

const SkillsModal = ({ isOpen, onClose, initialData = {}, onSaved }) => {
  const [available, setAvailable] = useState([]); // [{id, name, ...}]
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setErrors(null);

    // normalize initial selection (ids or objects)
    const initSkills = initialData?.skills || [];
    const ids = new Set();

    if (Array.isArray(initSkills) && initSkills.length > 0 && typeof initSkills[0] === "object") {
      initSkills.forEach((s) => {
        if (s?.id) ids.add(Number(s.id));
      });
    } else if (Array.isArray(initSkills) && initSkills.length > 0 && typeof initSkills[0] === "number") {
      initSkills.forEach((id) => ids.add(Number(id)));
    }
    // if it's array of strings, we'll map after fetching available skills

    setSelectedIds(ids);
    loadSkills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialData]);

  const loadSkills = async () => {
    setFetching(true);
    setErrors(null);
    try {
      const res = await getSkills();
      const list = Array.isArray(res) ? res : [];
      setAvailable(list);

      // If initialData.skills are strings (names), map to ids now
      const initSkills = initialData?.skills || [];
      if (Array.isArray(initSkills) && initSkills.length > 0 && typeof initSkills[0] === "string") {
        const nameToIdMap = {};
        list.forEach((s) => {
          if (s && s.name) nameToIdMap[String(s.name).toLowerCase()] = s.id;
        });
        const matched = new Set();
        initSkills.forEach((n) => {
          const id = nameToIdMap[String(n).toLowerCase().trim()];
          if (id) matched.add(Number(id));
        });
        setSelectedIds((prev) => new Set([...Array.from(prev), ...Array.from(matched)]));
      }
    } catch (err) {
      setErrors(err?.message || "Failed to load skills");
    } finally {
      setFetching(false);
    }
  };

  if (!isOpen) return null;

  const toggle = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);

    const id = initialData?.uuid || initialData?.id;
    if (!id) return setErrors("Missing user id (uuid/id) to update skills.");

    const payload = {
      skills: Array.from(selectedIds).map((x) => Number(x)),
    };

    setLoading(true);
    try {
      const res = await updateSkills(id, payload);
      onSaved?.(res);

          try {
      await getGuestDashboardData();
    } catch (refreshErr) {
      console.warn("Failed to refresh guest dashboard data:", refreshErr);
    }
    toast.success("Data updated");

      onClose();

    } catch (err) {
      setErrors(err?.message || "Failed to update skills");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl overflow-auto max-h-[90vh]">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">Services & Skills</h3>
          <button onClick={onClose} className="text-gray-500"><FaTimes /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {errors && <div className="text-xs text-red-500">{errors}</div>}

          <div className="text-xs text-gray-500">{fetching ? "Loading skills..." : `${available.length} skills available`}</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {!fetching && available.length === 0 && (
              <div className="text-sm text-gray-500 p-3">No skills available.</div>
            )}

            {available.map((skill) => {
              const id = Number(skill.id);
              const checked = selectedIds.has(id);
              return (
                <label key={skill.id} className="flex items-center gap-3 border rounded p-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(id)}
                    className="w-4 h-4"
                  />
                  <div>
                    <div className="text-xs font-medium">{skill.name}</div>
                    {skill.category && <div className="text-xs text-gray-400">{skill.category?.name}</div>}
                  </div>
                </label>
              );
            })}
          </div>

          <div className="flex justify-end gap-2 text-xs">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-teal-500 text-white rounded">
              {loading ? "Saving…" : "Save Skills"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillsModal;
