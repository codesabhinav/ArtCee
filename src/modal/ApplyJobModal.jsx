// components/ApplyJobModal.jsx
import { useEffect, useState } from "react";
import { applyToJob } from "../Hooks/useSeller"; // make sure applyToJob exists in useSeller

const DEFAULT_JOB_IMAGE =
  "https://img.myloview.com/posters/businessman-avatar-image-with-beard-hairstyle-male-profile-vector-illustration-700-201088702.jpg";

const ApplyJobModal = ({ job, open, onClose, onApplied }) => {
  const [coverLetter, setCoverLetter] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (job?.apply_options && job.apply_options.length > 0) {
      setSelectedOption(job.apply_options[0]);
    } else {
      setSelectedOption(null);
    }
    setCoverLetter("");
    setError(null);
  }, [job]);

  if (!open || !job) return null;

  const buildPayload = (methodTitle = null) => {
    return {
      job_id: job?.job_id || "",
      title: job?.title || "",
      company_name: job?.company_name || job?.company || "",
      location: job?.location || "",
      via: job?.via || "",
      posted_at: job?.detected_extensions?.posted_at || "",
      schedule_type: job?.detected_extensions?.schedule_type || "",
      qualifications: job?.detected_extensions?.qualifications || "",
      dental_coverage: !!job?.dental_coverage,
      health_insurance: !!job?.health_insurance,
      description: job?.description || "",
      job_highlights: job?.job_highlights || [],
      apply_options: job?.apply_options || [],
      apply_method: methodTitle || (selectedOption && selectedOption.title) || "",
      cover_letter: coverLetter || "",
    };
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    const methodTitle = selectedOption?.title || "";
    const payload = buildPayload(methodTitle);

    try {
      await applyToJob(payload);
      if (onApplied) onApplied(job?.job_id);
      const linkToOpen = selectedOption?.link || job?.share_link || null;
      if (linkToOpen) window.open(linkToOpen, "_blank", "noopener,noreferrer");
      onClose?.();
    } catch (err) {
      console.error("Apply failed", err);
      setError(err?.message || "Failed to apply. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative overflow-auto max-h-[90vh] scrollbar-hide">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">✕</button>

        <h2 className="text-lg font-bold mb-4">Apply for {job.title}</h2>

        <div className="flex items-center gap-3 mb-4 bg-gray-50 p-3 rounded-md">
          <img
            src={job.thumbnail || job.image || DEFAULT_JOB_IMAGE}
            alt={job.title}
            className="w-12 h-12 rounded-md object-cover"
            onError={(e) => { if (e.currentTarget.src !== DEFAULT_JOB_IMAGE) e.currentTarget.src = DEFAULT_JOB_IMAGE; }}
          />
          <div>
            <h3 className="font-semibold">{job.title}</h3>
            <p className="text-sm text-gray-600">{job.company_name || job.company}</p>
          </div>
        </div>

        {/* Choose method if multiple */}
        {Array.isArray(job?.apply_options) && job.apply_options.length > 0 && (
          <div className="mb-4">
            <label className="block font-semibold mb-2">Apply via</label>
            <div className="flex flex-col gap-2">
              {job.apply_options.map((opt, i) => (
                <label
                  key={i}
                  className={`p-2 border rounded flex items-start gap-3 ${selectedOption?.link === opt.link ? "bg-teal-50 border-teal-200" : ""
                    }`}
                >
                  <input
                    type="radio"
                    name="apply_method"
                    checked={selectedOption?.link === opt.link}
                    onChange={() => setSelectedOption(opt)}
                    className="mt-1"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{opt.title}</div>
                    <div
                      className="text-xs text-gray-500 break-words"
                    >
                      {opt.link}
                    </div>
                  </div>
                </label>

              ))}
            </div>
          </div>
        )}

        {/* Cover Letter */}
        <div className="mb-4">
          <label className="block font-semibold mb-1 text-sm">Cover Letter (optional)</label>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={5}
            className="w-full border rounded-md p-2 text-sm focus:ring focus:ring-teal-400"
            placeholder="Tell the employer why you're a great fit..."
          />
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4 text-xs text-gray-700">
          <div className="text-black font-semibold text-base mb-2">Application Details</div>
          <p>• Your ArtCee profile and portfolio will be attached</p>
          <p>• The employer will review your application within 5 business days</p>
          <p>• You can track application status in your dashboard</p>
          <p>• Applications cannot be withdrawn after submission</p>
        </div>

        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

        <div className="flex justify-between">
          <button onClick={onClose} className="px-4 py-2 border rounded-md hover:bg-gray-100 text-xs">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 flex items-center gap-2 text-xs"
          >
            {loading ? "Applying..." : "Submit Application"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyJobModal;
