import { FaCrown, FaUsers } from "react-icons/fa";
import { GiPartyPopper } from "react-icons/gi";

const SuccessPopupModel = ({ isOpen, onClose, memberId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center px-2 ">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-y-auto max-h-[90vh] text-center scrollbar-hide">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-orange-400 text-white p-6 rounded-t-2xl relative">
          {/* Crown Icon in circle */}
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center">
            <FaCrown className="text-2xl text-white" />
          </div>
          
          <div className="text-2xl font-bold">🎉 Congrats!</div>
          <p className="text-sm font-bold">You're officially 1 of 500 Founding Members!</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <p className="text-sm text-gray-600">
            Your profile is now featured and visible to the ArtCee creative community.
          </p>

          {/* Blue Badge Text */}
          <p className="text-sm text-teal-600 font-medium">
            Your badge is permanent – welcome to the circle!
          </p>

          {/* Founding Member Badge */}
          <button className="bg-orange-500 text-white px-4 py-4 rounded-md text-sm font-bold ">
            🎉 Founding Member #{memberId || "348"}
          </button>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-gray-50 rounded-md">
              ⭐ Featured in Directory
              <p className="text-xs text-gray-500">Premium placement</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              📂 Unlimited Portfolio Uploads
              <p className="text-xs text-gray-500">Showcase all work</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              🔥 Story-First Spotlight
              <p className="text-xs text-gray-500">Weekly feature chance</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              🏆 Founding Member Badge
              <p className="text-xs text-gray-500">Permanent recognition</p>
            </div>
          </div>

          {/* Inner Circle Box */}
          <div className="bg-blue-50 border rounded-md p-4 text-sm">
            <FaUsers className="mx-auto text-2xl text-teal-600 mb-2" />
            <p className="font-medium mb-1">Welcome to the Inner Circle!</p>
            <p className="text-gray-600">
              You're now part of an exclusive group of 500 founding members who are shaping the future of ArtCee.
            </p>
            <span className="inline-block bg-orange-200 text-orange-700 text-xs font-medium px-3 py-1 mt-3 rounded-md">
              30 Days Premium Active
            </span>
          </div>

          {/* Dashboard Button */}
          <button
            onClick={onClose}
            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibosld rounded-md"
          >
            Go to My Dashboard
          </button>

          {/* Extra Footer Text */}
          <p className="text-xs text-gray-700 font-medium">
            Explore your new premium features and start getting discovered
          </p>

          {/* Footer Contact */}
          <p className="text-xs text-gray-500">
            Questions about your Founding Member benefits?{" "}
            <a href="mailto:founders@artcee.com" className="underline">
              Contact us anytime at founders@artcee.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopupModel;
