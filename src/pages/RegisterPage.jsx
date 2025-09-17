

// import { useEffect, useRef, useState } from "react";
// import StepProgress from "../components/signup components/StepProgress";
// import PersonalInfoStep from "../components/signup components/PersonalInfo";
// import LocationStep from "../components/signup components/LocationStep";
// import ProfessionalStep from "../components/signup components/ProfessionalStep";
// import { FaArrowLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import ServicesSkillsStep from "../components/signup components/ServicesSkillsStep";
// import PortfolioSocialStep from "../components/signup components/PortfolioSocialStep";
// import RatesPricingStep from "../components/signup components/RatesPricingStep";
// import ProfileSettingsStep from "../components/signup components/ProfileSettingsStep";
// import { Link } from "react-router-dom";
// import { register } from "../Hooks/useAuth";
// import toast from "react-hot-toast";
// import Cookies from "js-cookie";
// import { useTranslation } from "../contexts/LanguageProvider";

// const RegisterPage = () => {
//   const { t } = useTranslation();

//   const [formData, setFormData] = useState({
//     full_name: "",
//     email: "",
//     password: "",
//     password_confirmation: "",
//     phone: "",
//     title: "",
//     bio: "",
//     type: "",

//     //
//     city: "",
//     state: "",
//     country: "",
//     travel_radius_miles: 0,
//     experience_in_year: "",
//     experience_in_level: "",
//     personal_intro: "",
//     exp_vision: "",
//     is_remote_active: 0,
//     on_site_active: 0,
//     skills: [],

//     portfolio: null,
//     social: {
//       website: "",
//       linkind: "",
//       instagram: "",
//       behance: "",
//       dribbble: ""
//     },

//     hourly_rate: 0,
//     daily_rate: 0,
//     project_rate: 0,
//     currency: "USD",
//     is_rate_negotiable: 0,
//     education_visible: 0,
//     pricing_visible: 0,
//     client_review_visible: 0,
//     professions_visible: 0,
//     date_of_birth_type: "date", //date, age
//     date_of_birth: "",
//     age: "",
//     step: "COMP"
//   });

//   const [step, setStep] = useState(1);
//   const totalSteps = 7;

//   // reactive desktop detection so we can disable the slider on desktop
//   const [isDesktop, setIsDesktop] = useState(
//     typeof window !== "undefined" ? window.innerWidth >= 768 : true
//   );

//   useEffect(() => {
//     const onResize = () => setIsDesktop(window.innerWidth >= 768);
//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, []);

//   const handleNext = () => {
//     setStep((prev) => Math.min(prev + 1, totalSteps));
//   };

//   const handlePrev = () => {
//     setStep((prev) => Math.max(prev - 1, 1));
//   };

//   const handleGoto = (n) => {
//     setStep(() => Math.min(Math.max(1, n), totalSteps));
//   };

//   const handleSubmit = async () => {
//     try {
//       const res = await register(formData);
//       toast.success(t("register.registration_success"));
//       console.log("Registered user:", res);
//     } catch (err) {
//       const apiMessage =
//         err.response?.data?.message || err.message || t("register.registration_failed");
//       toast.error(apiMessage);
//       console.error("Register failed:", err);
//     }
//   };

//   useEffect(() => {
//     const savedCity = Cookies.get("user_city");
//     const savedState = Cookies.get("user_state");
//     const savedCountry = Cookies.get("user_country");

//     if (savedCity && savedState && savedCountry) {
//       setFormData((prev) => ({
//         ...prev,
//         city: savedCity,
//         state: savedState,
//         country: savedCountry,
//       }));
//       return;
//     }

//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(async (pos) => {
//         const { latitude, longitude } = pos.coords;

//         try {
//           const res = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
//           );
//           const data = await res.json();

//           const city = data.address?.city || data.address?.town || data.address?.village || "";
//           const state = data.address?.state || "";
//           const country = data.address?.country || "";

//           // save to cookies
//           Cookies.set("user_city", city, { expires: 7 });
//           Cookies.set("user_state", state, { expires: 7 });
//           Cookies.set("user_country", country, { expires: 7 });

//           // prefill form
//           setFormData((prev) => ({
//             ...prev,
//             city,
//             state,
//             country,
//           }));
//         } catch (err) {
//           console.error("Reverse geocoding failed", err);
//           toast.error(t("register.geocode_failed"));
//         }
//       }, (err) => {
//         // geolocation permission/failed
//         console.warn("Geolocation failed", err);
//         toast.error(t("register.geolocation_failed"));
//       });
//     }
//   }, [t]);

//   // --- slider/touch logic for non-desktop devices ---
//   const sliderRef = useRef(null);
//   const touchStartX = useRef(null);
//   const touchDeltaX = useRef(0);
//   const swipeThreshold = 50; // px

//   useEffect(() => {
//     // keyboard nav for slider (left/right)
//     const handleKey = (e) => {
//       if (isDesktop) return; // only enable on non-desktop
//       if (e.key === "ArrowLeft") handlePrev();
//       if (e.key === "ArrowRight") handleNext();
//     };
//     window.addEventListener("keydown", handleKey);
//     return () => window.removeEventListener("keydown", handleKey);
//   }, [isDesktop]);

//   const onTouchStart = (e) => {
//     if (isDesktop) return;
//     touchStartX.current = e.touches[0].clientX;
//     touchDeltaX.current = 0;
//   };

//   const onTouchMove = (e) => {
//     if (isDesktop || touchStartX.current === null) return;
//     const currentX = e.touches[0].clientX;
//     touchDeltaX.current = currentX - touchStartX.current;
//     // small visual feedback while dragging
//     if (sliderRef.current) {
//       sliderRef.current.style.transition = "none";
//       sliderRef.current.style.transform = `translateX(calc(-${(step - 1) * 100}% + ${touchDeltaX.current}px))`;
//     }
//   };

//   const onTouchEnd = () => {
//     if (isDesktop || touchStartX.current === null) return;
//     const dx = touchDeltaX.current;
//     // restore transition
//     if (sliderRef.current) {
//       sliderRef.current.style.transition = "";
//       sliderRef.current.style.transform = "";
//     }
//     if (dx > swipeThreshold) {
//       // swipe right -> prev
//       handlePrev();
//     } else if (dx < -swipeThreshold) {
//       // swipe left -> next
//       handleNext();
//     }
//     touchStartX.current = null;
//     touchDeltaX.current = 0;
//   };

//   // helper to render step content uniformly
//   const StepWrapper = ({ children }) => {
//     return (
//       <div className="w-full flex-shrink-0 px-4 sm:px-6 lg:px-8">
//         {children}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-white flex flex-col items-center justify-start py-6">
//       {/* Top header */}
//       <div className="w-full p-4 flex justify-between items-center max-w-full sm:max-w-xl md:max-w-[50%]">
//         <Link
//           to="/home"
//           className="text-gray-600 text-xs hover:bg-gray-200 rounded-md px-3 py-1 flex items-center"
//         >
//           <FaArrowLeft className="mr-2" /> {t("register.back")}
//         </Link>
//         <Link
//           to="/home"
//           className="text-gray-600 text-xs border px-3 py-1 rounded-md hover:bg-gray-200"
//         >
//           {t("register.skip_for_now")}
//         </Link>
//       </div>

//       {/* Step progress tracker */}
//       <div className="w-full px-4 sm:px-6 md:px-0 mb-4 max-w-full sm:max-w-xl md:max-w-[50%]">
//         <StepProgress currentStep={step} />
//       </div>

//       {/* Step content area */}
//       <div
//         className={`w-full px-4 sm:px-6 lg:px-8 mt-2 mb-10 max-w-full sm:max-w-xl md:max-w-[50%]`}
//       >
//         {/* For desktop, render the active step only (no slider transform).
//             For smaller devices render a horizontal slider (flex row) that translates based on step. */}
//         <div className="relative">
//           {/* slider viewport - on mobile it's overflow-hidden */}
//           <div
//             className={`relative overflow-visible ${isDesktop ? "" : "overflow-hidden rounded-lg bg-white shadow-sm"}`}
//             onTouchStart={onTouchStart}
//             onTouchMove={onTouchMove}
//             onTouchEnd={onTouchEnd}
//             aria-roledescription={isDesktop ? "step-panel" : "slider"}
//           >
//             {/* sliding inner container (only visually slides on small screens) */}
//             <div
//               ref={sliderRef}
//               className={`flex ${isDesktop ? "flex-col" : "flex-row"} transition-transform duration-300 ease-in-out`}
//               style={
//                 isDesktop
//                   ? {}
//                   : {
//                       width: `${100 * totalSteps}%`,
//                       transform: `translateX(-${(step - 1) * (100 / totalSteps)}%)`,
//                     }
//               }
//             >
//               {/* Step 1 */}
//               <div className={`${isDesktop ? "" : "w-[100%]"} ${isDesktop ? "" : "flex-shrink-0"}`}>
//                 <StepWrapper>
//                   {step === 1 || !isDesktop ? (
//                     <PersonalInfoStep formData={formData} setFormData={setFormData} onNext={handleNext} />
//                   ) : null}
//                 </StepWrapper>
//               </div>

//               {/* Step 2 */}
//               <div className={`${isDesktop ? "" : "w-[100%]"} ${isDesktop ? "" : "flex-shrink-0"}`}>
//                 <StepWrapper>
//                   {step === 2 || !isDesktop ? (
//                     <LocationStep formData={formData} setFormData={setFormData} onNext={handleNext} onPrev={handlePrev} />
//                   ) : null}
//                 </StepWrapper>
//               </div>

//               {/* Step 3 */}
//               <div className={`${isDesktop ? "" : "w-[100%]"} ${isDesktop ? "" : "flex-shrink-0"}`}>
//                 <StepWrapper>
//                   {step === 3 || !isDesktop ? (
//                     <ProfessionalStep formData={formData} setFormData={setFormData} onNext={handleNext} onPrev={handlePrev} />
//                   ) : null}
//                 </StepWrapper>
//               </div>

//               {/* Step 4 */}
//               <div className={`${isDesktop ? "" : "w-[100%]"} ${isDesktop ? "" : "flex-shrink-0"}`}>
//                 <StepWrapper>
//                   {step === 4 || !isDesktop ? (
//                     <ServicesSkillsStep formData={formData} setFormData={setFormData} onNext={handleNext} onPrev={handlePrev} />
//                   ) : null}
//                 </StepWrapper>
//               </div>

//               {/* Step 5 */}
//               <div className={`${isDesktop ? "" : "w-[100%]"} ${isDesktop ? "" : "flex-shrink-0"}`}>
//                 <StepWrapper>
//                   {step === 5 || !isDesktop ? (
//                     <PortfolioSocialStep formData={formData} setFormData={setFormData} onNext={handleNext} onPrev={handlePrev} />
//                   ) : null}
//                 </StepWrapper>
//               </div>

//               {/* Step 6 */}
//               <div className={`${isDesktop ? "" : "w-[100%]"} ${isDesktop ? "" : "flex-shrink-0"}`}>
//                 <StepWrapper>
//                   {step === 6 || !isDesktop ? (
//                     <RatesPricingStep formData={formData} setFormData={setFormData} onNext={handleNext} onPrev={handlePrev} />
//                   ) : null}
//                 </StepWrapper>
//               </div>

//               {/* Step 7 */}
//               <div className={`${isDesktop ? "" : "w-[100%]"} ${isDesktop ? "" : "flex-shrink-0"}`}>
//                 <StepWrapper>
//                   {step === 7 || !isDesktop ? (
//                     <ProfileSettingsStep formData={formData} setFormData={setFormData} onPrev={handlePrev} onSubmit={handleSubmit} />
//                   ) : null}
//                 </StepWrapper>
//               </div>
//             </div>
//           </div>

//           {/* Mobile slider controls (only visible when not desktop) */}
//           {!isDesktop && (
//             <>
//               <button
//                 type="button"
//                 onClick={handlePrev}
//                 aria-label="Previous step"
//                 className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow hover:bg-white"
//               >
//                 <FaChevronLeft />
//               </button>

//               <button
//                 type="button"
//                 onClick={handleNext}
//                 aria-label="Next step"
//                 className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow hover:bg-white"
//               >
//                 <FaChevronRight />
//               </button>

//               {/* dots */}
//               <div className="w-full flex justify-center mt-4 space-x-2">
//                 {Array.from({ length: totalSteps }).map((_, i) => {
//                   const idx = i + 1;
//                   return (
//                     <button
//                       key={idx}
//                       onClick={() => handleGoto(idx)}
//                       aria-label={`Go to step ${idx}`}
//                       className={`w-2 h-2 rounded-full ${step === idx ? "bg-gray-800" : "bg-gray-300"}`}
//                     />
//                   );
//                 })}
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* bottom "desktop-only" footer nav to move between steps (keeps desktop behavior unchanged) */}
//       {isDesktop && (
//         <div className="w-full px-4 sm:px-6 md:px-0 max-w-full sm:max-w-xl md:max-w-[50%]">
//           <div className="flex justify-between items-center mt-4 pb-6">
//             <div>
//               {step > 1 && (
//                 <button
//                   onClick={handlePrev}
//                   className="text-sm px-3 py-2 rounded-md hover:bg-gray-100 border"
//                 >
//                   {t("register.previous") || "Previous"}
//                 </button>
//               )}
//             </div>

//             <div className="flex items-center gap-3">
//               {/* show step indicator + optional jump */}
//               <div className="text-sm text-gray-600">
//                 {t("register.step_label", { current: step, total: totalSteps }) || `Step ${step} of ${totalSteps}`}
//               </div>

//               {step < totalSteps ? (
//                 <button
//                   onClick={handleNext}
//                   className="text-sm px-4 py-2 rounded-md bg-blue-600 text-white hover:opacity-95"
//                 >
//                   {t("register.next") || "Next"}
//                 </button>
//               ) : (
//                 <button
//                   onClick={handleSubmit}
//                   className="text-sm px-4 py-2 rounded-md bg-green-600 text-white hover:opacity-95"
//                 >
//                   {t("register.finish") || "Finish"}
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RegisterPage;
import { useEffect, useRef, useState } from "react";
import StepProgress from "../components/signup components/StepProgress";
import PersonalInfoStep from "../components/signup components/PersonalInfo";
import LocationStep from "../components/signup components/LocationStep";
import ProfessionalStep from "../components/signup components/ProfessionalStep";
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ServicesSkillsStep from "../components/signup components/ServicesSkillsStep";
import PortfolioSocialStep from "../components/signup components/PortfolioSocialStep";
import RatesPricingStep from "../components/signup components/RatesPricingStep";
import ProfileSettingsStep from "../components/signup components/ProfileSettingsStep";
import { Link } from "react-router-dom";
import { register } from "../Hooks/useAuth";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useTranslation } from "../contexts/LanguageProvider";

const RegisterPage = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    title: "",
    bio: "",
    type: "",
    city: "",
    state: "",
    country: "",
    travel_radius_miles: 0,
    experience_in_year: "",
    experience_in_level: "",
    personal_intro: "",
    exp_vision: "",
    is_remote_active: 0,
    on_site_active: 0,
    skills: [],
    portfolio: null,
    social: {
      website: "",
      linkind: "",
      instagram: "",
      behance: "",
      dribbble: ""
    },
    hourly_rate: 0,
    daily_rate: 0,
    project_rate: 0,
    currency: "USD",
    is_rate_negotiable: 0,
    education_visible: 0,
    pricing_visible: 0,
    client_review_visible: 0,
    professions_visible: 0,
    date_of_birth_type: "date",
    date_of_birth: "",
    age: "",
    step: "COMP"
  });

  const [step, setStep] = useState(1);
  const totalSteps = 7;

  // reactive desktop detection so desktop layout is preserved
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleNext = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));
  const handleGoto = (n) => setStep(() => Math.min(Math.max(1, n), totalSteps));

  const handleSubmit = async () => {
    try {
      const res = await register(formData);
      toast.success(t("register.registration_success"));
      console.log("Registered user:", res);
    } catch (err) {
      const apiMessage =
        err?.response?.data?.message || err?.message || t("register.registration_failed");
      toast.error(apiMessage);
      console.error("Register failed:", err);
    }
  };

  // --- location prefill (unchanged behaviour) ---
  useEffect(() => {
    const savedCity = Cookies.get("user_city");
    const savedState = Cookies.get("user_state");
    const savedCountry = Cookies.get("user_country");

    if (savedCity && savedState && savedCountry) {
      setFormData((prev) => ({
        ...prev,
        city: savedCity,
        state: savedState,
        country: savedCountry,
      }));
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
            );
            const data = await res.json();

            const city = data.address?.city || data.address?.town || data.address?.village || "";
            const state = data.address?.state || "";
            const country = data.address?.country || "";

            // save to cookies
            Cookies.set("user_city", city, { expires: 7 });
            Cookies.set("user_state", state, { expires: 7 });
            Cookies.set("user_country", country, { expires: 7 });

            // prefill form
            setFormData((prev) => ({
              ...prev,
              city,
              state,
              country,
            }));
          } catch (err) {
            console.error("Reverse geocoding failed", err);
            toast.error(t("register.geocode_failed"));
          }
        },
        (err) => {
          // geolocation permission/failed
          console.warn("Geolocation failed", err);
          toast.error(t("register.geolocation_failed"));
        },
        { timeout: 10000, maximumAge: 600000, enableHighAccuracy: false }
      );
    }
  }, [t]);

  // --- slider/touch logic for non-desktop devices ---
  const sliderRef = useRef(null);
  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);
  const swipeThreshold = 50; // px

  useEffect(() => {
    // keyboard nav for slider (left/right)
    const handleKey = (e) => {
      if (isDesktop) return; // only enable on non-desktop
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isDesktop]);

  const onTouchStart = (e) => {
    if (isDesktop) return;
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    if (sliderRef.current) sliderRef.current.style.transition = "none";
  };

  const onTouchMove = (e) => {
    if (isDesktop || touchStartX.current === null) return;
    const currentX = e.touches[0].clientX;
    touchDeltaX.current = currentX - touchStartX.current;
    // small visual feedback while dragging
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(calc(-${(step - 1) * 100}% + ${touchDeltaX.current}px))`;
    }
  };

  const onTouchEnd = () => {
    if (isDesktop || touchStartX.current === null) return;
    const dx = touchDeltaX.current;
    // restore transition
    if (sliderRef.current) {
      sliderRef.current.style.transition = "transform 300ms ease-in-out";
      sliderRef.current.style.transform = `translateX(-${(step - 1) * 100}%)`;
    }
    if (dx > swipeThreshold) {
      // swipe right -> prev
      handlePrev();
    } else if (dx < -swipeThreshold) {
      // swipe left -> next
      handleNext();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  // helper to render step content uniformly
  const StepWrapper = ({ children }) => {
    return (
      <div className="w-full flex-shrink-0 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    );
  };

  // update slider transform whenever step changes (only on mobile)
  useEffect(() => {
    if (!isDesktop && sliderRef.current) {
      sliderRef.current.style.transition = "transform 300ms ease-in-out";
      sliderRef.current.style.transform = `translateX(-${(step - 1) * 100}%)`;
    }
  }, [step, isDesktop]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start py-6">
      {/* Top header */}
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-full mx-auto">
        <div className="flex justify-between items-center py-4 max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
          <Link
            to="/home"
            className="text-gray-600 text-xs hover:bg-gray-200 rounded-md px-3 py-1 flex items-center"
          >
            <FaArrowLeft className="mr-2" /> {t("register.back")}
          </Link>
          <Link
            to="/home"
            className="text-gray-600 text-xs border px-3 py-1 rounded-md hover:bg-gray-200"
          >
            {t("register.skip_for_now")}
          </Link>
        </div>
      </div>

      {/* Step progress tracker */}
      <div className="w-full px-4 sm:px-6 lg:px-8 mb-4 max-w-full mx-auto">
        <div className="max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
          <StepProgress currentStep={step} />
        </div>
      </div>

      {/* Step content area */}
      <div className="w-full px-2 sm:px-6 lg:px-8 mt-2 mb-10 max-w-full mx-auto">
        <div className="max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
          <div className="relative">
            {/* slider viewport - on mobile it's overflow-hidden */}
            <div
              className={`relative ${isDesktop ? "" : "overflow-hidden rounded-lg bg-white shadow-sm"}`}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              aria-roledescription={isDesktop ? "step-panel" : "slider"}
            >
              {/* sliding inner container (only visually slides on small screens) */}
              <div
                ref={sliderRef}
                className={`flex ${isDesktop ? "flex-col" : "flex-row"}`}
                style={
                  isDesktop
                    ? {}
                    : {
                        width: `${100 * totalSteps}%`,
                        transform: `translateX(-${(step - 1) * 100}%)`,
                      }
                }
              >
                {/* each slide width = container width on small screens */}
                <div style={!isDesktop ? { width: `${100 / totalSteps}%` } : {}} className={`${isDesktop ? "" : "flex-shrink-0"}`}>
                  <StepWrapper>
                    {step === 1 || !isDesktop ? (
                      <PersonalInfoStep formData={formData} setFormData={setFormData} onNext={handleNext} />
                    ) : null}
                  </StepWrapper>
                </div>

                <div style={!isDesktop ? { width: `${100 / totalSteps}%` } : {}} className={`${isDesktop ? "" : "flex-shrink-0"}`}>
                  <StepWrapper>
                    {step === 2 || !isDesktop ? (
                      <LocationStep formData={formData} setFormData={setFormData} onNext={handleNext} onPrev={handlePrev} />
                    ) : null}
                  </StepWrapper>
                </div>

                <div style={!isDesktop ? { width: `${100 / totalSteps}%` } : {}} className={`${isDesktop ? "" : "flex-shrink-0"}`}>
                  <StepWrapper>
                    {step === 3 || !isDesktop ? (
                      <ProfessionalStep formData={formData} setFormData={setFormData} onNext={handleNext} onPrev={handlePrev} />
                    ) : null}
                  </StepWrapper>
                </div>

                <div style={!isDesktop ? { width: `${100 / totalSteps}%` } : {}} className={`${isDesktop ? "" : "flex-shrink-0"}`}>
                  <StepWrapper>
                    {step === 4 || !isDesktop ? (
                      <ServicesSkillsStep formData={formData} setFormData={setFormData} onNext={handleNext} onPrev={handlePrev} />
                    ) : null}
                  </StepWrapper>
                </div>

                <div style={!isDesktop ? { width: `${100 / totalSteps}%` } : {}} className={`${isDesktop ? "" : "flex-shrink-0"}`}>
                  <StepWrapper>
                    {step === 5 || !isDesktop ? (
                      <PortfolioSocialStep formData={formData} setFormData={setFormData} onNext={handleNext} onPrev={handlePrev} />
                    ) : null}
                  </StepWrapper>
                </div>

                <div style={!isDesktop ? { width: `${100 / totalSteps}%` } : {}} className={`${isDesktop ? "" : "flex-shrink-0"}`}>
                  <StepWrapper>
                    {step === 6 || !isDesktop ? (
                      <RatesPricingStep formData={formData} setFormData={setFormData} onNext={handleNext} onPrev={handlePrev} />
                    ) : null}
                  </StepWrapper>
                </div>

                <div style={!isDesktop ? { width: `${100 / totalSteps}%` } : {}} className={`${isDesktop ? "" : "flex-shrink-0"}`}>
                  <StepWrapper>
                    {step === 7 || !isDesktop ? (
                      <ProfileSettingsStep formData={formData} setFormData={setFormData} onPrev={handlePrev} onSubmit={handleSubmit} />
                    ) : null}
                  </StepWrapper>
                </div>
              </div>
            </div>

            {/* Mobile slider controls (only visible when not desktop) */}
            
          </div>
        </div>
      </div>

      {/* bottom "desktop-only" footer nav to move between steps (keeps desktop behavior unchanged) */}
      {isDesktop && (
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-full mx-auto">
          <div className="max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
            <div className="flex justify-between items-center mt-4 pb-6">
              <div>
                {step > 1 && (
                  <button
                    onClick={handlePrev}
                    className="text-sm px-3 py-2 rounded-md hover:bg-gray-100 border"
                  >
                    {t("register.previous") || "Previous"}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* show step indicator + optional jump */}
                <div className="text-sm text-gray-600">
                  {t("register.step_label", { current: step, total: totalSteps }) || `Step ${step} of ${totalSteps}`}
                </div>

                {step < totalSteps ? (
                  <button
                    onClick={handleNext}
                    className="text-sm px-4 py-2 rounded-md bg-blue-600 text-white hover:opacity-95"
                  >
                    {t("register.next") || "Next"}
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="text-sm px-4 py-2 rounded-md bg-green-600 text-white hover:opacity-95"
                  >
                    {t("register.finish") || "Finish"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
