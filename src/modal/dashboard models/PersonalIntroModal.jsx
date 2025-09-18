// src/modal/steps/PersonalIntroModal.jsx
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { updatePersonalIntro } from "../../Hooks/useDashboard";
import CustomDropdown from "../../components/CustomDropdown";
import toast from "react-hot-toast";
import { getGuestDashboardData } from "../../Hooks/useSeller";

const levelOptions = [
    "Entry Level (0-2 years)",
    "Mid Level (3-5 years)",
    "Senior Level (6-10 years)",
    "Expert Level (10+ years)",
];

const typeOptions = [
    "creative",
    "business"
];

const PersonalIntroModal = ({ isOpen, onClose, initialData = {}, onSaved }) => {
    const [form, setForm] = useState({
        type: "",
        experience_in_year: "",
        experience_in_level: "Entry Level (0-2 years)",
        personal_intro: "",
        exp_vision: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            const levelMap = {
                entry: "Entry Level (0-2 years)",
                mid: "Mid Level (3-5 years)",
                senior: "Senior Level (6-10 years)",
                expert: "Expert Level (10+ years)",
            };

            setForm({
                type: initialData.type ?? "Select Type",
                experience_in_year: initialData.experience_in_year ?? "",
                experience_in_level: levelMap[initialData.experience_in_level] || "Entry Level (0-2 years)",
                personal_intro: initialData.personal_intro ?? "",
                exp_vision: initialData.exp_vision ?? "",
            });
            setError(null);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        if (!form.personal_intro || form.personal_intro.trim().length < 10) {
            setError("Personal intro should be at least 10 characters.");
            return false;
        }
        if (!form.exp_vision || form.exp_vision.trim().length < 10) {
            setError("Vision should be at least 10 characters.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setError(null);

        try {
            const id = initialData.uuid || initialData.id;
            if (!id) throw new Error("Missing user id");

            // Map dropdown back to API value
            const levelValue = {
                "Entry Level (0-2 years)": "entry",
                "Mid Level (3-5 years)": "mid",
                "Senior Level (6-10 years)": "senior",
                "Expert Level (10+ years)": "expert",
            }[form.experience_in_level];

            const payload = {
                type: form.type,
                experience_in_year: form.experience_in_year,
                experience_in_level: levelValue,
                personal_intro: form.personal_intro,
                exp_vision: form.exp_vision,
            };

            const res = await updatePersonalIntro(id, payload);
            onSaved?.(res);
            try {
      await getGuestDashboardData();
    } catch (refreshErr) {
      console.warn("Failed to refresh guest dashboard data:", refreshErr);
    }
    toast.success( "Data updated");
            onClose();
        } catch (err) {
            setError(err.message || "Failed to update personal intro");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-auto max-h-[90vh]">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Personal Intro & Vision</h3>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
                        <FaTimes />
                    </button>
                </div>

                {/* Body */}
                <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                    {error && <div className="text-xs text-red-600">{error}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Type
                            </label>
                            <CustomDropdown
                                options={typeOptions}
                                value={form.type}
                                setValue={(val) => setForm((prev) => ({ ...prev, type: val }))}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Years of Experience
                            </label>
                            <input
                                type="number"
                                name="experience_in_year"
                                value={form.experience_in_year}
                                onChange={handleChange}
                                className="w-full form-input rounded px-3 py-2 text-xs"
                                placeholder="e.g. 5"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Experience Level
                            </label>
                            <CustomDropdown
                                options={levelOptions}
                                value={form.experience_in_level}
                                setValue={(val) => setForm((prev) => ({ ...prev, experience_in_level: val }))}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Personal Intro
                        </label>
                        <textarea
                            name="personal_intro"
                            value={form.personal_intro}
                            onChange={handleChange}
                            rows={3}
                            className="w-full form-input rounded px-3 py-2 text-xs"
                            placeholder="Introduce yourself, your background, skills, and work"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Vision
                        </label>
                        <textarea
                            name="exp_vision"
                            value={form.exp_vision}
                            onChange={handleChange}
                            rows={3}
                            className="w-full form-input rounded px-3 py-2 text-xs"
                            placeholder="Your goals, the type of projects you want, how you want to grow"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded text-xs hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-teal-500 text-white rounded text-xs hover:bg-teal-600 disabled:opacity-60"
                        >
                            {loading ? "Saving…" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PersonalIntroModal;
