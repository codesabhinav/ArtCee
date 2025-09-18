import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { updatePricing } from "../../Hooks/useDashboard";
import { getGuestDashboardData } from "../../Hooks/useSeller";
import toast from "react-hot-toast";
import CustomDropdown from "../../components/CustomDropdown";

const DEFAULT_CURRENCIES = ["USD", "EUR", "GBP", "INR"];

const isNumberLike = (v) => {
  if (v === null || v === undefined || v === "") return false;

  return !Number.isNaN(Number(String(v).trim()));
};

const PricingModal = ({ isOpen, onClose, initialData = {}, onSaved }) => {
  const [form, setForm] = useState({
    hourly_rate: "",
    daily_rate: "",
    project_rate: "",
    currency: "USD",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setErrors(null);

    const p = {
      hourly_rate: initialData?.hourly_rate ?? initialData?.pricing?.hourly_rate ?? "",
      daily_rate: initialData?.daily_rate ?? initialData?.pricing?.daily_rate ?? "",
      project_rate: initialData?.project_rate ?? initialData?.pricing?.project_rate ?? "",
      currency: initialData?.currency ?? initialData?.pricing?.currency ?? "USD",
    };

    setForm({
      hourly_rate: p.hourly_rate !== null && p.hourly_rate !== undefined ? String(p.hourly_rate) : "",
      daily_rate: p.daily_rate !== null && p.daily_rate !== undefined ? String(p.daily_rate) : "",
      project_rate: p.project_rate !== null && p.project_rate !== undefined ? String(p.project_rate) : "",
      currency: p.currency || "USD",
    });
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {

    if (form.hourly_rate && !isNumberLike(form.hourly_rate)) return "Hourly rate must be a number";
    if (form.daily_rate && !isNumberLike(form.daily_rate)) return "Daily rate must be a number";
    if (form.project_rate && !isNumberLike(form.project_rate)) return "Project rate must be a number";
    if (!form.currency || String(form.currency).trim().length === 0) return "Currency is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);

    const vErr = validate();
    if (vErr) {
      setErrors(vErr);
      return;
    }


    const payload = {
      hourly_rate: form.hourly_rate === "" ? null : Number(form.hourly_rate),
      daily_rate: form.daily_rate === "" ? null : Number(form.daily_rate),
      project_rate: form.project_rate === "" ? null : Number(form.project_rate),
      currency: String(form.currency).trim(),
    };

    setLoading(true);
    try {

      const res = await updatePricing(payload);
      onSaved?.(res);


      try {
        await getGuestDashboardData();
      } catch (refreshErr) {
        console.warn("Failed to refresh guest dashboard data:", refreshErr);
      }

      toast.success("Pricing updated");
      onClose();
    } catch (err) {
      setErrors(err?.message || "Failed to update pricing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-auto max-h-[90vh]">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">Set Pricing</h3>
          <button onClick={onClose} className="text-gray-500"><FaTimes /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {errors && <div className="text-xs text-red-500">{errors}</div>}

          <div>
            <label className="text-xs block">Currency</label>
            <CustomDropdown
              options={DEFAULT_CURRENCIES}
              value={form.currency}
              setValue={(val) => setForm((prev) => ({ ...prev, currency: val }))}
            />
          </div>

          <div>
            <label className="text-xs block">Hourly rate</label>
            <input
              name="hourly_rate"
              value={form.hourly_rate}
              onChange={handleChange}
              placeholder="e.g. 12.50"
              className="w-full form-input px-3 py-2 rounded mt-1 text-xs"
            />
            <p className="text-[11px] text-gray-500 mt-1"></p>
          </div>

          <div>
            <label className="text-xs block">Daily rate</label>
            <input
              name="daily_rate"
              value={form.daily_rate}
              onChange={handleChange}
              placeholder="e.g. 100"
              className="w-full form-input px-3 py-2 rounded mt-1 text-xs"
            />
            <p className="text-[11px] text-gray-500 mt-1"></p>
          </div>

          <div>
            <label className="text-xs block">Project rate</label>
            <input
              name="project_rate"
              value={form.project_rate}
              onChange={handleChange}
              placeholder="e.g. 900"
              className="w-full form-input px-3 py-2 rounded mt-1 text-xs"
            />
            <p className="text-[11px] text-gray-500 mt-1"></p>
          </div>

          <div className="flex justify-end gap-2 text-xs">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-teal-500 text-white rounded">
              {loading ? "Saving…" : "Save Pricing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PricingModal;
