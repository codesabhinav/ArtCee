import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { updateLocation } from "../../Hooks/useDashboard";
import toast from "react-hot-toast";
import { getGuestDashboardData } from "../../Hooks/useSeller";

const LocationModal = ({ isOpen, onClose, initialData = {}, onSaved }) => {
  const [form, setForm] = useState({ country: "", state: "", city: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setForm({
        country: initialData.location.country.name || initialData.country_name || "",
        state: initialData.location.state.name || initialData.state_name || "",
        city: initialData.location.city.name || initialData.city_name || "",
      });
      setErr(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    if (!form.country) return setErr("Country is required");

    setLoading(true);
    try {
      const res = await updateLocation(initialData.uuid || initialData.id, form);
      onSaved?.(res);
       try {
      await getGuestDashboardData();
    } catch (refreshErr) {
      console.warn("Failed to refresh guest dashboard data:", refreshErr);
    }
    toast.success( "Data updated");
      onClose();
    } catch (err) {
      setErr(err.message || "Failed to update location");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">Location Details</h3>
          <button onClick={onClose} className="text-gray-500"><FaTimes /></button>
        </div>

        <form className="p-4 space-y-3" onSubmit={submit}>
          {err && <div className="text-xs text-red-500">{err}</div>}
          <div>
            <label className="text-xs">Country</label>
            <input name="country" value={form.country} onChange={onChange} className="w-full form-input px-3 py-2 rounded mt-1  text-xs" />
          </div>
          <div>
            <label className="text-xs">State</label>
            <input name="state" value={form.state} onChange={onChange} className="w-full form-input px-3 py-2 rounded mt-1 text-xs" />
          </div>
          <div>
            <label className="text-xs">City</label>
            <input name="city" value={form.city} onChange={onChange} className="w-full form-input px-3 py-2 rounded mt-1 text-xs" />
          </div>

          <div className="flex justify-end gap-2 text-xs">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-teal-500 text-white rounded">{loading ? "Saving…" : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationModal;
