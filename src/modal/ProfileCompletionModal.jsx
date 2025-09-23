import { useCallback, useEffect, useState } from "react";
import { Star, X, CircleCheck as CircleCheckBig } from "lucide-react";
import { useTranslation } from "../contexts/LanguageProvider";
import { useNavigate } from "react-router-dom";
import ProfileSteps from "../components/ProfileSteps";
import { getGuestDashboardData } from "../Hooks/useSeller";

const ProfileCompletionModal = ({ onClose, progress = 71, sectionsCompleted = "5/7" }) => {
  const { t } = useTranslation();
  const [p] = useState(progress);
  const [payload, setPayload] = useState(null);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getGuestDashboardData();
      setPayload(res || {});
    } catch (err) {
      setError(err?.message || t("guest.load_error"));
      setPayload(null);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    let mounted = true;
    fetchDashboard();

    return () => {
      mounted = false;
    };
  }, [fetchDashboard]);

  const data = payload?.data ?? {};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] relative p-6 text-gray-700 overflow-y-auto scrollbar-hide"
        role="dialog"
        aria-modal="true"
        aria-label={t("profile_completion.aria_label")}
      >
        {/* Close Button */}
        <div className="absolute right-4 top-4">
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 text-gray-600"
            aria-label={t("profile_completion.close")}
          >
            <X size={18} />
          </button>
        </div>

        {/* Header */}
        <div className="text-center mt-2">
          <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-teal-400 to-orange-400 text-white mb-3">
            <Star className="h-7 w-7" />
          </div>

          <h2 className="text-[16px] font-medium text-gray-900">
            {t("profile_completion.welcome_title")}
          </h2>

          <p className="text-[13px] text-gray-600 mt-2 font-light max-w-2xl mx-auto">
            {t("profile_completion.subtitle")}
          </p>
        </div>

        <div className="bg-white border rounded-lg p-6 mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center  mb-3 gap-2">
            <h3 className="font-regular text-sm">{t("guest.profile_completion_title")}</h3>
            <span className="text-xs font-medium bg-yellow-100 text-yellow-600 px-3 py-1 rounded-md w-fit">
              {progress >= 100 ? t("guest.profile_complete") : t("guest.profile_incomplete")}
            </span>
          </div>

          <p className="text-xs text-gray-500 mb-4">
            {data.progress_percentage ?? 0}/100 {t("guest.completed_of")} – {progress}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-black h-2 rounded-full"
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%`  }}
            />
          </div>

          <ProfileSteps data={data} />
        </div>

        {/* Footer */}
        <div className="mt-6">
          <div className="flex gap-3">
            <button className="flex-1 bg-teal-500 text-white py-2 rounded-md text-xs font-medium"
              onClick={() => navigate("/profile")}  >
              {t("profile_completion.primary_cta")}
            </button>
            <button onClick={() => navigate("/home")}   className="flex-1 border py-2 rounded-md text-xs font-medium hover:bg-gray-200">
              {t("profile_completion.secondary_cta")}
            </button>
          </div>

          <p className="text-[11px] text-center text-gray-400 mt-3">
            {t("profile_completion.help_text")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;
