// import { useState } from "react"
// import { FaEnvelope, FaLock, FaGoogle } from "react-icons/fa"
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
// import { Link } from "react-router-dom"
// import toast from "react-hot-toast"
// import { login } from "../Hooks/useAuth"
// import { useGoogleLogin } from "@react-oauth/google"
// import ProfileCompletionModal from "../modal/ProfileCompletionModal"

// const LoginPage = ({ onClose }) => {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [googleLoading, setGoogleLoading] = useState(false)
//   const [showProfileModal, setShowProfileModal] = useState(false)

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       const response = await login({ email, password })
//       console.log("Login success:", response)

//       toast.success("Login successful 🎉")
//       // show profile completion if needed
//       setShowProfileModal(true);
//       // DO NOT call onClose() here — keep the login dialog open while user completes profile
//     } catch (error) {
//       toast.error(error.message || "Login failed")
//       console.error("Login error:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleGoogleSuccess = async (tokenResp) => {
//     setGoogleLoading(true)
//     try {
//       const token =
//         tokenResp?.access_token ?? tokenResp?.credential ?? tokenResp?.token

//       console.log("Google credential:", token)
//       if (!token) throw new Error("No credential returned from Google")
      
//       // call same login endpoint but send the google credential as 'token' or according to your backend contract
//       const response = await login({ token: token }) 

//       console.log("Google login success:", response)
//       // Cookie will be set by login() helper if backend returned the token in response
//       toast.success("Signed in with Google 🎉")

//       // Show profile completion modal (do NOT call onClose here, otherwise the modal won't appear)
//       setShowProfileModal(true);

//       // Do NOT call onClose() here. Instead, close login dialog when profile modal closes.
//     } catch (err) {
//       console.error("Google login error:", err)
//       toast.error(err.message || "Google sign-in failed")
//     } finally {
//       setGoogleLoading(false)
//     }
//   }

//   const handleGoogleError = (error) => {
//     console.error("Google login failure", error)
//     toast.error("Google sign-in failed")
//   }

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
//     <div className="fixed inset-0 bg-transperant bg-opacity-40 flex items-center justify-center z-50">
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
//             Welcome Back
//           </span>
//         </h2>
//         <p className="text-center text-gray-500 mb-6 font-light text-[14px]">
//           Sign in to your ArtCee account
//         </p>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Email */}
//           <div>
//             <label className="text-sm text-gray-700">Email</label>
//             <div className="flex items-center rounded-md px-2 mt-1 bg-gray-50 border">
//               <FaEnvelope className="text-gray-400 mr-2" />
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="w-full py-2 bg-transparent border-none focus:ring-0 focus:outline-none text-sm"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//           </div>

//           {/* Password */}
//           <div>
//             <label className="text-sm text-gray-700">Password</label>
//             <div className="flex items-center rounded-md px-2 mt-1 bg-gray-50 border">
//               <FaLock className="text-gray-400 mr-2" />
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter your password"
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
//                 <input type="checkbox" className="mr-1 rounded-md" /> Remember me
//               </label>
//               <button type="button" className="text-teal-500 hover:underline">
//                 Forgot password?
//               </button>
//             </div>
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-teal-500 text-sm font-semibold text-white py-2 rounded-md disabled:opacity-60"
//           >
//             {loading ? "Signing in..." : "Sign In"}
//           </button>
//         </form>

//         {/* Divider */}
//         <div className="flex items-center my-4">
//           <hr className="flex-grow border-gray-300" />
//           <span className="px-2 text-gray-500 text-xs font-light">OR CONTINUE WITH</span>
//           <hr className="flex-grow border-gray-300" />
//         </div>

//         {/* Google Sign In */}

        
//         <button
//         onClick={handleGoogleLogin}
//          className="w-full flex items-center justify-center text-xs font-semibold border py-2 rounded-md hover:bg-gray-100">
//           <FaGoogle className="mr-2" /> Sign in with Google
//         </button>

//         {/* Footer */}
//         <p className="text-center font-light text-xs mt-5">
//           Don’t have an account?{" "}
//           <Link
//             to="/register"
//             onClick={onClose}
//             className="text-teal-500 hover:underline font-semibold"
//           >
//             Sign up
//           </Link>
//         </p>
//       </div>
//       {showProfileModal && (
//         <ProfileCompletionModal
//           onClose={() => onProfileModalClose({ closeLogin: true })}
//         />
//       )}
//     </div>
//   )
// }

// export default LoginPage


import { useState } from "react";
import { FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../Hooks/useAuth";
import { useGoogleLogin } from "@react-oauth/google";
import ProfileCompletionModal from "../modal/ProfileCompletionModal";
import { useTranslation } from "../contexts/LanguageProvider";

const LoginPage = ({ onClose }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login({ email, password });
      console.log("Login success:", response);

      toast.success(t("login.success"));
      setShowProfileModal(true);
    } catch (error) {
      toast.error(error.message || t("login.error"));
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (tokenResp) => {
    setGoogleLoading(true);
    try {
      const token =
        tokenResp?.access_token ?? tokenResp?.credential ?? tokenResp?.token;

      if (!token) throw new Error(t("login.google_no_token"));
      const response = await login({ token });
      console.log("Google login success:", response);

      toast.success(t("login.google_success"));
      setShowProfileModal(true);
    } catch (err) {
      console.error("Google login error:", err);
      toast.error(err.message || t("login.google_error"));
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
      onClose?.();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
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
          onClick={handleGoogleLogin}
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
            onClick={onClose}
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
