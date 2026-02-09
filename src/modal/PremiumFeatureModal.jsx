import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Crown, X } from "lucide-react";

const PremiumFeatureModal = ({ open, onClose, onUpgrade }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleUpgrade = () => {
    onClose();
    if (typeof onUpgrade === "function") {
      onUpgrade();
    } else {
      navigate("/featured");
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="premium-modal-title"
    >
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-1 rounded"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center pt-2">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
            <Crown className="h-6 w-6 text-orange-500" />
          </div>
          <h2 id="premium-modal-title" className="text-lg font-semibold text-gray-900 mb-2">
            Premium feature
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            This is a premium feature. Would you like to upgrade now?
          </p>

          <div className="flex gap-3 w-full">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpgrade}
              className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Crown className="h-4 w-4" /> Upgrade now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumFeatureModal;
