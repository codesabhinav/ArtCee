// src/components/ProfileSettingsStep.jsx
import { FaArrowLeft, FaCheckCircle, FaUserCheck } from "react-icons/fa";
import { useState, useEffect } from "react";
import AgeVerificationModal from "./AgeVerificationModal";
import { useTranslation } from "../../contexts/LanguageProvider";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { deletePortfolio, getPortfolios } from "../../Hooks/useAuth";
import RegisterUploadPortfolioModal from "../../modal/RegisterUploadPortfolioModal";

const ProfileSettingsStep = ({ formData, setFormData, onPrev, onSubmit }) => {
  const { t } = useTranslation();

  const toggleSection = (key) => {
    setFormData({ ...formData, [key]: formData[key] === 1 ? 0 : 1 });
  };

  const [showModal, setShowModal] = useState(false);

  const [portfolios, setPortfolios] = useState([]);
  const [loadingPortfolios, setLoadingPortfolios] = useState(false);
  const [modalInitialData, setModalInitialData] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    if (!Array.isArray(formData.profile_portfolio)) {
      setFormData((p) => ({ ...(p || {}), profile_portfolio: [] }));
    }
  }, []);

  const openAddModal = () => {
    setModalInitialData(null);
    setShowUploadModal(true);
  };

  const openEditModal = (portfolio) => {
    setModalInitialData(portfolio);
    setShowUploadModal(true);
  };

  const handleSavedPortfolio = async (saved) => {
    if (!saved || !saved.id) {
      console.warn("Saved portfolio did not return id:", saved);
    } else {
      setFormData((prev) => {
        const prevIds = Array.isArray(prev?.profile_portfolio) ? prev.profile_portfolio : [];
        const nextIds = Array.from(new Set([...prevIds, saved.id]));
        return { ...(prev || {}), profile_portfolio: nextIds };
      });

      setPortfolios((prev) => {
        const foundIndex = prev.findIndex((p) => p.id === saved.id);
        if (foundIndex >= 0) {
          const next = [...prev];
          next[foundIndex] = saved;
          return next;
        }
        return [saved, ...prev];
      });

      toast.success("Portfolio saved");
    }

    // ----- store session id as ss_id for registration -----
    const ss_id =
      saved?.session_id ??
      saved?.data?.session_id ??
      saved?.sessionId ??
      saved?.data?.sessionId ??
      null;

    if (ss_id) {
      setFormData((prev) => ({
        ...(prev || {}),
        ss_id,
        profile_portfolio: Array.from(new Set([...(prev?.profile_portfolio || []), saved?.id].filter(Boolean))),
      }));

      try {
        const fetched = await getPortfolios(ss_id);
        const list = Array.isArray(fetched) ? fetched : (fetched?.data && Array.isArray(fetched.data) ? fetched.data : []);
        setPortfolios(list);

        const ids = list.map((p) => p.id).filter(Boolean);
        setFormData((prev) => ({ ...(prev || {}), profile_portfolio: Array.from(new Set([...(prev?.profile_portfolio || []), ...ids])) }));
      } catch (err) {
        console.warn("Failed to refresh portfolios after save", err);
      }
    }

    setShowUploadModal(false);
  };


  const handleDeletePortfolio = async (id) => {
    if (!id) return;
    if (!confirm("Delete this portfolio? This cannot be undone.")) return;
    try {
      await deletePortfolio(id);
      setPortfolios((p) => p.filter((x) => x.id !== id));
      setFormData((prev) => ({
        ...(prev || {}),
        profile_portfolio: (prev?.profile_portfolio || []).filter((pid) => pid !== id),
      }));
      toast.success("Deleted portfolio");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error(err?.message || "Failed to delete portfolio");
    }
  };

  const [showModalAge, setShowModalAge] = useState(false);
  useEffect(() => {
    setShowModal((s) => s);
  }, []);

  return (
    <div className="w-full max-w-3xl bg-white rounded-lg p-8 border">
      <div className="flex justify-center mb-2">
        <FaCheckCircle className="text-5xl text-orange-400" />
      </div>
      <h2 className="text-xl font-semibold text-center">{t("profile_settings.title")}</h2>
      <p className="text-gray-500 text-center mb-6 text-sm">
        Are you ready to complete your profile?
      </p>
      <p className="text-gray-500 text-center mb-6 text-xs">
        Bring your profile to life upload your art, music, or projects now.
      </p>

      <div className="flex gap-2 justify-center">
        {/* make sure this button doesn't accidentally submit a parent form */}
        <button
          type="button"
          onClick={openAddModal}
          className="px-4 py-2 bg-teal-500 text-white text-xs rounded-md font-semibold hover:bg-teal-600"
        >
          Upload Portfolio
        </button>
        <button
          type="button"
          onClick={() => onSubmit(formData)} // Skip for now -> submit current formData
          className="px-4 py-2 bg-white border text-xs rounded-md font-semibold hover:bg-gray-200"
        >
          Skip for Now
        </button>
      </div>

      {/* Profile Sections Toggles */}
      {/* <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">
          {t("profile_settings.sections_title")}
        </h3>
        <div className="space-y-3">
          {[  // ...comment preserved
            "education_visible",
            "pricing_visible",
            "client_review_visible",
            "professions_visible",
          ].map((key, idx) => (
            <div key={idx} className="flex items-center space-x-3 pb-2">
              <button
                type="button"
                onClick={() => toggleSection(key)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${formData[key] ? "bg-teal-500" : "bg-gray-300"
                  }`}
                aria-pressed={formData[key] === 1}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData[key] ? "translate-x-5" : "translate-x-0"
                    }`}
                />
              </button>

              <span className="text-xs font-semibold">
                {key === "education_visible" && t("profile_settings.education")}
                {key === "pricing_visible" && t("profile_settings.pricing")}
                {key === "client_review_visible" && t("profile_settings.client_reviews")}
                {key === "professions_visible" && t("profile_settings.endorsements")}
              </span>
            </div>
          ))}
        </div>
      </div> */}

      {/* Info Card */}
      {/* <div className="mb-6 p-4 rounded-md border bg-gradient-to-r from-cyan-50 to-orange-50 flex flex-row items-center gap-3 border border-teal-500">
        <Heart className="text-teal-500 h-5 w-5"/>
        <div>
          <p className="text-sm font-semibold text-gray-800">{t("profile_settings.ready_title")}</p>
          <p className="text-xs text-gray-600">{t("profile_settings.ready_subtitle")}</p>
        </div>
      </div> */}

      {/* Next Steps */}
      {/* <div className="mb-6 p-4 rounded-md border bg-blue-50 border-teal-500">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center mb-2">
          <FaUserCheck className="mr-2 text-teal-500" /> {t("profile_settings.next_steps_title")}
        </h3>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>✓ {t("profile_settings.step_age_verification")}</li>
          <li>✓ {t("profile_settings.step_gdpr")}</li>
          <li>✓ {t("profile_settings.step_email_verification")}</li>
          <li>✓ {t("profile_settings.step_profile_activation")}</li>
        </ul>
      </div> */}

      {/* NEW: Show uploaded portfolios */}
      {/* <div className="mt-6">
        <h3 className="text-sm font-semibold mb-3">Your portfolios</h3>

        {loadingPortfolios ? (
          <div className="text-xs text-gray-500">Loading portfolios…</div>
        ) : portfolios.length === 0 ? (
          <div className="text-xs text-gray-400">No portfolios uploaded yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {portfolios.map((p) => {
              const meta = p.data || {};
              const title = meta.title || p.title || `Portfolio #${p.id}`;
              const description = meta.description || "";
              const media = Array.isArray(p.media) && p.media.length ? p.media[0] : null;
              const thumbnail = media?.url || meta.project_url || (media?.mime_type?.startsWith("image") && media?.url) || null;

              return (
                <div key={p.id} className="border rounded p-3 flex gap-3 items-start">
                  <div className="w-24 h-16 bg-gray-50 rounded overflow-hidden flex items-center justify-center">
                    {thumbnail ? (
                      <img src={thumbnail} alt={title} className="object-cover w-full h-full" />
                    ) : (
                      <div className="text-xs text-gray-400">No preview</div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-semibold">{title}</div>
                        {description && <div className="text-xs text-gray-500 mt-1">{description}</div>}
                        <div className="text-xs text-gray-400 mt-2">
                          {meta.technologies ? `Technologies: ${meta.technologies}` : null}
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="text-xs px-2 py-1 border rounded bg-white hover:bg-gray-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeletePortfolio(p.id)}
                          className="text-xs px-2 py-1 border rounded text-red-500 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div> */}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center px-4 py-2 text-xs border rounded-md text-gray-700 hover:bg-gray-100"
        >
          <FaArrowLeft className="mr-2" /> {t("profile_settings.prev")}
        </button>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center px-6 py-2 text-xs bg-orange-500 text-white rounded-md hover:bg-orange-600"
        >
          {t("profile_settings.create_profile")}
        </button>
      </div>

      {/* Age Verification Modal */}
      <AgeVerificationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={onSubmit}
        formData={formData}
        setFormData={setFormData}
      />

      <RegisterUploadPortfolioModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        initialData={modalInitialData || {}}
        onSaved={handleSavedPortfolio}
      />
    </div>
  );
};

export default ProfileSettingsStep;
