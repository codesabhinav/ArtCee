import { useState } from "react";
import { Link } from "react-router-dom";
import PolicyModal from "../modal/PolicyModal";
import { useTranslation } from "../contexts/LanguageProvider";

const Footer = () => {
  const [showPolicy, setShowPolicy] = useState(false);
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between">

        <div className="flex items-center space-x-2">
          <img src="logo.png" alt="ArtCee" className="w-8 h-8 rounded-full" />
          <span className="text-lg font-semibold text-gray-800">ArtCee</span>
        </div>

        <div className="mt-3 md:mt-0 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-xs text-gray-600">
          <p>{t("footer.rights")}</p>
          <div className="flex space-x-4">
            <button onClick={() => setShowPolicy(true)} className="hover:underline">
              {t("footer.privacy_policy")}
            </button>
            <Link to="/terms" className="hover:underline">
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
      <PolicyModal open={showPolicy} onClose={() => setShowPolicy(false)} />
    </footer>
  );
};

export default Footer;
