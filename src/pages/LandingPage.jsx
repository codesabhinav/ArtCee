import { StarIcon } from "@heroicons/react/24/outline";
import { FaPalette, FaUserFriends } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PolicyModal from "../modal/PolicyModal";
import { useState } from "react";
import { useTranslation } from "../contexts/LanguageProvider";

const LandingPage = () => {
  const navigate = useNavigate();
  const [showPolicy, setShowPolicy] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <div className="min-h-screen p-10 flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4 text-center">
        <div className="bg-teal-500 text-white p-4 rounded-full mb-6">
          <FaPalette size={36} />
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-4xl font-bold text-gray-800">{t("landing.title")}</h1>
        <p className="text-teal-600 mt-2 text-lg font-medium">
          {t("landing.tagline")}
        </p>
        <p className="text-gray-500 mt-2 text-center max-w-lg">
          {t("landing.welcome")}
        </p>

        <p className="text-gray-500 mt-2 text-center max-w-lg">
          {t("landing.hint")}
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 w-full max-w-4xl">
          <div className="bg-white border rounded-xl p-6 text-center shadow-sm ">
            <div className="h-12 w-12 mx-auto flex justify-center items-center bg-orange-500 text-white rounded-full mb-3">
              <FaPalette size={24} />
            </div>
            <h3 className="text-medium font-regular">{t("landing.feature_create.title")}</h3>
            <p className="text-gray-500 text-sm mt-2 text-sm font-light">
              {t("landing.feature_create.desc")}
            </p>
          </div>

          <div className="bg-white border rounded-xl p-6 text-center shadow-sm">
            <div className="h-12 w-12 mx-auto flex justify-center items-center bg-teal-500 text-white rounded-full mb-3">
              <FaUserFriends size={24} />
            </div>
            <h3 className="text-medium font-regular">{t("landing.feature_connect.title")}</h3>
            <p className="text-gray-500 text-sm mt-2 text-sm font-light">
              {t("landing.feature_connect.desc")}
            </p>
          </div>

          <div className="bg-white border rounded-xl p-6 text-center shadow-sm">
            <div className="h-12 w-12 mx-auto flex justify-center items-center bg-orange-500 text-white rounded-full mb-3">
              <StarIcon className="h-6 w-6" />
            </div>
            <h3 className="text-medium font-regular">{t("landing.feature_collab.title")}</h3>
            <p className="text-gray-500 text-sm mt-2 text-sm font-light">
              {t("landing.feature_collab.desc")}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center mt-12 space-y-4">
          <button
            onClick={() => navigate("/register")}
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-8 py-2 rounded-full shadow"
          >
            {t("landing.cta_join")}
          </button>
          <button
            onClick={() => navigate("/home")}
            className="border border-orange-500  bg-white text-orange-500 hover:bg-orange-50 px-8 py-2 rounded-full text-sm font-semibold"
          >
            {t("landing.cta_skip")}
          </button>
        </div>

        <button className="border border-orange-500 text-orange-500 mt-10 flex items-center gap-2 px-6 py-3 rounded-full text-xs">
          <StarIcon className="text-orange-400 h-4 w-4" /> {t("landing.prototype_tag")}
        </button>

        {/* Footer */}
        <p className="text-gray-400 text-xs mt-8">
          {t("landing.footer_prefix")}&nbsp;
          <a href="#" className="underline text-teal-500">
            {t("landing.terms")}
          </a>
          &nbsp;{t("landing.and")}&nbsp;
          <button onClick={() => setShowPolicy(true)} className="underline text-teal-500">
            {t("landing.privacy")}
          </button>
        </p>
      </div>

      <PolicyModal open={showPolicy} onClose={() => setShowPolicy(false)} />
    </>
  );
};

export default LandingPage;
