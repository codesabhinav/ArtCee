import { useEffect, useState, useRef } from "react";
import { applyToJob, uploadResume, fetchResume } from "../Hooks/useSeller";
import { useTranslation } from "../contexts/LanguageProvider";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Eye } from "lucide-react";

const DEFAULT_JOB_IMAGE =
  "https://img.myloview.com/posters/businessman-avatar-image-with-beard-hairstyle-male-profile-vector-illustration-700-201088702.jpg";

function filenameFromUrl(url) {
  if (!url) return null;
  try {
    const decoded = decodeURIComponent(url.split("?")[0]);
    const parts = decoded.split("/");
    return parts[parts.length - 1] || decoded;
  } catch {
    return url;
  }
}

const ApplyJobModal = ({ job, open, onClose, onApplied }) => {
  const { t } = useTranslation();
  const [coverLetter, setCoverLetter] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(() => {
    try {
      return Cookies.get("userId");
    } catch {
      return null;
    }
  });

  const [resumeFileName, setResumeFileName] = useState(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState(null);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (job?.apply_options && job.apply_options.length > 0) {
      setSelectedOption(job.apply_options[0]);
    } else {
      setSelectedOption(null);
    }

    setCoverLetter("");
    setError(null);
  }, [job]);

  useEffect(() => {
    if (!open) return;
    try {
      const id = Cookies.get("userId");
      setUserId(id ?? null);
      if (id) {
        (async () => {
          try {
            const res = await fetchResume(id);
            const url = res?.data?.resume_url ?? res?.resume_url ?? null;
            if (url) {
              setResumeUrl(url);
              setResumeFileName(filenameFromUrl(url));
            } else {
              setResumeUrl(null);
              setResumeFileName(null);
            }
          } catch (err) {
            console.debug("No resume found or fetch failed:", err?.message || err);
            setResumeUrl(null);
            setResumeFileName(null);
          }
        })();
      } else {
        setResumeUrl(null);
        setResumeFileName(null);
      }
    } catch {
      setUserId(null);
      setResumeUrl(null);
      setResumeFileName(null);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const buildPayload = (methodTitle = null) => ({
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
    cover_letter: coverLetter || "",
    resume_url: resumeUrl || undefined,
  });

  const onPickResume = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setResumeFileName(file.name);
    setResumeUploading(true);
    setError(null);

    const uid = userId || Cookies.get("userId");
    if (!uid) {
      toast.error("You must be logged in to upload resume");
      setResumeUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await uploadResume(uid, formData);
      // response shapes handled defensively
      const url = res?.data?.resume_url ?? res?.resume_url ?? res?.data ?? null;
      const resolvedUrl = typeof url === "string" ? url : (res?.data?.resume_url ?? null);

      if (resolvedUrl) {
        setResumeUrl(resolvedUrl);
        setResumeFileName(filenameFromUrl(resolvedUrl) || file.name);
        toast.success("Resume uploaded");
      } else {
        // fallback if only message returned
        toast.success(res?.data?.message ?? "Resume uploaded");
      }
    } catch (err) {
      console.error("Resume upload failed:", err);
      const msg = err?.message || "Failed to upload resume";
      setError(msg);
      toast.error(msg);
      // revert filename if upload failed
      setResumeFileName(null);
      setResumeUrl(null);
    } finally {
      setResumeUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
      return;
    }

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

  if (!open || !job) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative overflow-auto max-h-[90vh] scrollbar-hide">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          aria-label={"Close"}
        >
          ✕
        </button>

        <h2 className="text-lg font-bold mb-4">Apply for {job.title}</h2>

        <div className="flex items-center gap-3 mb-4 bg-gray-50 p-3 rounded-md">
          <img
            src={job.thumbnail || job.image || DEFAULT_JOB_IMAGE}
            alt={job.title}
            className="w-12 h-12 rounded-md object-cover"
            onError={(e) => {
              if (e.currentTarget.src !== DEFAULT_JOB_IMAGE) e.currentTarget.src = DEFAULT_JOB_IMAGE;
            }}
          />
          <div>
            <h3 className="font-semibold">{job.title}</h3>
            <p className="text-sm text-gray-600">{job.company_name || job.company}</p>
          </div>
        </div>

        {/* Choose method if multiple */}
        {Array.isArray(job?.apply_options) && job.apply_options.length > 0 && (
          <div className="mb-4">
            <label className="block font-semibold mb-2">{t("apply_job_modal.apply_via_label")}</label>
            <div className="flex flex-col gap-2">
              {job.apply_options.map((opt, i) => (
                <label
                  key={i}
                  className={`p-2 gap-2 border rounded flex items-center ${selectedOption?.link === opt.link ? "bg-teal-50 border-teal-200" : ""}`}
                >
                  <input type="radio" name="apply_method" checked={selectedOption?.link === opt.link} onChange={() => setSelectedOption(opt)} />
                  <div>
                    <div className="text-sm font-medium text-start">{opt.title}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Cover Letter & Resume Upload */}
        <div className="mb-4">
          <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onPickResume}
              className="border rounded-md p-2 text-sm focus:ring focus:ring-black-200 text-xs font-semibold mb-2"
            >
              {resumeUploading ? "Uploading..." : resumeFileName ? "Change resume" : "Upload resume"}
            </button>

            {resumeFileName && !resumeUploading && (
              <div className="text-xs text-gray-600 flex flex-row itmes-center">
                {resumeFileName}{" "}
                {resumeUrl ? (
                  <a className="ml-2 text-teal-600 underline" href={resumeUrl} target="_blank" rel="noreferrer">
                    <Eye className="h-3 w-3"/>
                  </a>
                ) : null}
              </div>
            )}

            {resumeUploading && <div className="text-xs text-gray-500">Uploading...</div>}
          </div>

          <label className="block font-semibold mb-1">{t("apply_job_modal.cover_letter_label")}</label>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={5}
            className="w-full border rounded-md p-2 text-sm focus:ring focus:ring-teal-400"
            placeholder={t("apply_job_modal.cover_letter_placeholder")}
          />
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4 text-sm text-gray-700">
          <ul className="list-disc pl-5">
            <li>{t("apply_job_modal.info_bullet_1")}</li>
            <li>{t("apply_job_modal.info_bullet_2")}</li>
            <li>{t("apply_job_modal.info_bullet_3")}</li>
            <li>{t("apply_job_modal.info_bullet_4")}</li>
          </ul>
        </div>

        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

        <div className="flex justify-between">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold border rounded-md hover:bg-gray-100">
            {t("apply_job_modal.cancel")}
          </button>
          <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 text-xs font-semibold bg-teal-500 text-white rounded-md hover:bg-teal-600 flex items-center gap-2">
            {loading ? t("apply_job_modal.applying") : t("apply_job_modal.submit")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyJobModal;
