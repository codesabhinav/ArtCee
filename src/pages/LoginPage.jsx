
// import { useState } from "react";
// import { FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import { Link,useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { login } from "../Hooks/useAuth";
// import { useGoogleLogin } from "@react-oauth/google";
// import ProfileCompletionModal from "../modal/ProfileCompletionModal";
// import { useTranslation } from "../contexts/LanguageProvider";



// const LoginPage = ({ onClose }) => {
//   const { t } = useTranslation();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [googleLoading, setGoogleLoading] = useState(false);
//   const [showProfileModal, setShowProfileModal] = useState(false);
  


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await login({ email, password });
//       console.log("Login success:", response);

//       toast.success(t("login.success"));
//       setShowProfileModal(true);
//     } catch (error) {
//       toast.error(error.message || t("login.error"));
//       console.error("Login error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleSuccess = async (tokenResp) => {
//     setGoogleLoading(true);
//     try {
//       const token =
//         tokenResp?.access_token ?? tokenResp?.credential ?? tokenResp?.token;

//       if (!token) throw new Error(t("login.google_no_token"));
//       const response = await login({ token });
//       console.log("Google login success:", response);

//       toast.success(t("login.google_success"));
//       setShowProfileModal(true);
//     } catch (err) {
//       console.error("Google login error:", err);
//       toast.error(err.message || t("login.google_error"));
//     } finally {
//       setGoogleLoading(false);
//     }
//   };

//   const handleGoogleError = (error) => {
//     console.error("Google login failure", error);
//     toast.error(t("login.google_error"));
//   };

//   const handleGoogleLogin = useGoogleLogin({
//     onSuccess: handleGoogleSuccess,
//     onError: handleGoogleError,
//   });

//   const onProfileModalClose = (opts = {}) => {
//     setShowProfileModal(false);
//     if (opts.closeLogin !== false) {
//       onClose?.();
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
//         {/* Close button */}
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//         >
//           ✕
//         </button>

//         {/* Header */}
//         <h2 className="text-center text-xl font-light mb-2">
//           <span className="bg-gradient-to-r from-[#1FA29A] to-orange-400 bg-clip-text text-transparent">
//             {t("login.welcome_back")}
//           </span>
//         </h2>
//         <p className="text-center text-gray-500 mb-6 font-light text-[14px]">
//           {t("login.subtitle")}
//         </p>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Email */}
//           <div>
//             <label className="text-sm text-gray-700">
//               {t("login.email_label")}
//             </label>
//             <div className="flex items-center rounded-md px-2 mt-1 bg-gray-50 border">
//               <FaEnvelope className="text-gray-400 mr-2" />
//               <input
//                 type="email"
//                 placeholder={t("login.email_placeholder")}
//                 className="w-full py-2 bg-transparent border-none focus:ring-0 focus:outline-none text-sm"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//           </div>

//           {/* Password */}
//           <div>
//             <label className="text-sm text-gray-700">
//               {t("login.password_label")}
//             </label>
//             <div className="flex items-center rounded-md px-2 mt-1 bg-gray-50 border">
//               <FaLock className="text-gray-400 mr-2" />
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder={t("login.password_placeholder")}
//                 className="w-full py-2 bg-transparent border-none focus:ring-0 focus:outline-none text-sm"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <button
//                 type="button"
//                 className="text-gray-500"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
//               </button>
//             </div>
//             <div className="flex justify-between items-center text-xs mt-3">
//               <label className="flex items-center">
//                 <input type="checkbox" className="mr-1 rounded-md" />{" "}
//                 {t("login.remember_me")}
//               </label>
//               <button type="button" className="text-teal-500 hover:underline">
//                 {t("login.forgot_password")}
//               </button>
//             </div>
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-teal-500 text-sm font-semibold text-white py-2 rounded-md disabled:opacity-60"
//           >
//             {loading ? t("login.signing_in") : t("login.sign_in")}
//           </button>
//         </form>

//         {/* Divider */}
//         <div className="flex items-center my-4">
//           <hr className="flex-grow border-gray-300" />
//           <span className="px-2 text-gray-500 text-xs font-light">
//             {t("login.or_continue")}
//           </span>
//           <hr className="flex-grow border-gray-300" />
//         </div>

//         {/* Google Sign In */}
//         <button
//           onClick={handleGoogleLogin}
//           disabled={googleLoading}
//           className="w-full flex items-center justify-center text-xs font-semibold border py-2 rounded-md hover:bg-gray-100 disabled:opacity-60"
//         >
//           <FaGoogle className="mr-2" /> {t("login.sign_in_google")}
//         </button>

//         {/* Footer */}
//         <p className="text-center font-light text-xs mt-5">
//           {t("login.no_account")}{" "}
//           <Link
//             to="/register"
//             onClick={onClose}
//             className="text-teal-500 hover:underline font-semibold"
//           >
//             {t("login.sign_up")}
//           </Link>
//         </p>
//       </div>
//       {showProfileModal && (
//         <ProfileCompletionModal
//           onClose={() => onProfileModalClose({ closeLogin: true })}
//         />
//       )}
//     </div>
//   );
// };

// export default LoginPage;


import { useState } from "react";
import { FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../Hooks/useAuth";
import { useGoogleLogin } from "@react-oauth/google";
import ProfileCompletionModal from "../modal/ProfileCompletionModal";
import { useTranslation } from "../contexts/LanguageProvider";
import Cookies from "js-cookie";

const LoginPage = ({ onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const saveTokenAndNotify = (resp) => {
    // Try several shapes: resp.token, resp.data?.token, resp.access_token
    const token =
      resp?.token || resp?.data?.token || resp?.access_token || resp?.accessToken || resp?.data?.access_token;

    if (token) {
      // set cookie (adjust options as needed)
      Cookies.set("token", token, { expires: 7 });
    }

    // Notify the app that auth changed
    window.dispatchEvent(new Event("authChanged"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login({ email, password });
      console.log("Login success:", response);

      // Persist token if returned and notify other parts of the app
      saveTokenAndNotify(response);

      toast.success(t("login.success"));
      setShowProfileModal(true);

      // close modal or navigate if used as standalone
      if (onClose) {
        // If this login page is used as modal, close it and let parent navigate if needed
        onClose();
      } else {
        // if it's a route, redirect to guest dashboard
        navigate("/guest-dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      // show server message if available
      toast.error(error?.message || t("login.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (tokenResp) => {
    setGoogleLoading(true);
    try {
      const token =
        tokenResp?.access_token ?? tokenResp?.credential ?? tokenResp?.token ?? tokenResp?.accessToken;

      if (!token) throw new Error(t("login.google_no_token"));

      const response = await login({ token });
      console.log("Google login success:", response);

      saveTokenAndNotify(response);

      toast.success(t("login.google_success"));
      setShowProfileModal(true);

      if (onClose) {
        onClose();
      } else {
        navigate("/guest-dashboard");
      }
    } catch (err) {
      console.error("Google login error:", err);
      toast.error(err?.message || t("login.google_error"));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    console.error("Google login failure", error);
    toast.error(t("login.google_error"));
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
  });

  const onProfileModalClose = (opts = {}) => {
    setShowProfileModal(false);
    if (opts.closeLogin !== false) {
      if (onClose) onClose();
      else navigate("/guest-dashboard");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* Close button */}
        <button
          onClick={() => {
            if (onClose) onClose();
            else navigate(-1);
          }}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-center text-xl font-light mb-2">
          <span className="bg-gradient-to-r from-[#1FA29A] to-orange-400 bg-clip-text text-transparent">
            {t("login.welcome_back")}
          </span>
        </h2>
        <p className="text-center text-gray-500 mb-6 font-light text-[14px]">
          {t("login.subtitle")}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm text-gray-700">
              {t("login.email_label")}
            </label>
            <div className="flex items-center rounded-md px-2 mt-1 bg-gray-50 border">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                placeholder={t("login.email_placeholder")}
                className="w-full py-2 bg-transparent border-none focus:ring-0 focus:outline-none text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-700">
              {t("login.password_label")}
            </label>
            <div className="flex items-center rounded-md px-2 mt-1 bg-gray-50 border">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t("login.password_placeholder")}
                className="w-full py-2 bg-transparent border-none focus:ring-0 focus:outline-none text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
            <div className="flex justify-between items-center text-xs mt-3">
              <label className="flex items-center">
                <input type="checkbox" className="mr-1 rounded-md" />{" "}
                {t("login.remember_me")}
              </label>
              <button type="button" className="text-teal-500 hover:underline">
                {t("login.forgot_password")}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 text-sm font-semibold text-white py-2 rounded-md disabled:opacity-60"
          >
            {loading ? t("login.signing_in") : t("login.sign_in")}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500 text-xs font-light">
            {t("login.or_continue")}
          </span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google Sign In */}
        <button
          onClick={() => handleGoogleLogin()}
          disabled={googleLoading}
          className="w-full flex items-center justify-center text-xs font-semibold border py-2 rounded-md hover:bg-gray-100 disabled:opacity-60"
        >
          <FaGoogle className="mr-2" /> {t("login.sign_in_google")}
        </button>

        {/* Footer */}
        <p className="text-center font-light text-xs mt-5">
          {t("login.no_account")}{" "}
          <Link
            to="/register"
            onClick={() => {
              if (onClose) onClose();
            }}
            className="text-teal-500 hover:underline font-semibold"
          >
            {t("login.sign_up")}
          </Link>
        </p>
      </div>
      {showProfileModal && (
        <ProfileCompletionModal
          onClose={() => onProfileModalClose({ closeLogin: true })}
        />
      )}
    </div>
  );
};

export default LoginPage;

