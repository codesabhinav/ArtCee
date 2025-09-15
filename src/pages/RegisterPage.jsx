// import { useEffect, useState } from "react";
// import StepProgress from "../components/signup components/StepProgress";
// import PersonalInfoStep from "../components/signup components/PersonalInfo";
// import LocationStep from "../components/signup components/LocationStep";
// import ProfessionalStep from "../components/signup components/ProfessionalStep";
// import { FaArrowLeft } from "react-icons/fa";
// import ServicesSkillsStep from "../components/signup components/ServicesSkillsStep";
// import PortfolioSocialStep from "../components/signup components/PortfolioSocialStep";
// import RatesPricingStep from "../components/signup components/RatesPricingStep";
// import ProfileSettingsStep from "../components/signup components/ProfileSettingsStep";
// import { Link } from "react-router-dom";
// import { register } from "../Hooks/useAuth";
// import toast from "react-hot-toast";
// import Cookies from 'js-cookie';

// const RegisterPage = () => {

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

//   const handleNext = () => {
//     setStep((prev) => Math.min(prev + 1, 7));
//   };

//   const handlePrev = () => {
//     setStep((prev) => Math.max(prev - 1, 1));
//   };

//   const handleSubmit = async () => {
//     try {
//       const res = await register(formData);
//       toast.success("Registration successful!");
//       console.log("Registered user:", res);
//     } catch (err) {
//       const apiMessage =
//         err.response?.data?.message || err.message || "Registration failed!";
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

//           const city = data.address.city || data.address.town || data.address.village || "";
//           const state = data.address.state || "";
//           const country = data.address.country || "";

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
//         }
//       });
//     }
//   }, []);


//   return (
//     <div className="min-h-screen bg-white flex flex-col items-center justify-center">
//       {/* Top header */}
//       <div className="w-full p-4 flex justify-between items-center md:max-w-[50%]">
//         <Link to="/home" className="text-gray-600 text-xs hover:bg-gray-200 rounded-md px-4 py-1 flex items-center">
//           <FaArrowLeft className="mr-2" /> Back
//         </Link>
//         <Link to="/home" className="text-gray-600 text-xs border px-3 py-1 rounded-md hover:bg-gray-200">
//           Skip for now
//         </Link>
//       </div>

//       {/* Step progress tracker */}
//       <div className="w-full md:max-w-[50%]">
//         <StepProgress currentStep={step} />
//       </div>

//       {/* Step content */}
//       <div className="w-full flex justify-center px-4 sm:px-6 lg:px-8 mt-8 md:max-w-[50%] mb-10">
//         {step === 1 && (
//           <PersonalInfoStep
//             formData={formData}
//             setFormData={setFormData}
//             onNext={handleNext}
//           />
//         )}
//         {step === 2 && (
//           <LocationStep
//             formData={formData}
//             setFormData={setFormData}
//             onNext={handleNext}
//             onPrev={handlePrev}
//           />
//         )}
//         {step === 3 && (
//           <ProfessionalStep
//             formData={formData}
//             setFormData={setFormData}
//             onNext={handleNext}
//             onPrev={handlePrev}
//           />
//         )}
//         {step === 4 && (
//           <ServicesSkillsStep
//             formData={formData}
//             setFormData={setFormData}
//             onNext={handleNext}
//             onPrev={handlePrev}
//           />
//         )}
//         {step === 5 && (
//           <PortfolioSocialStep
//             formData={formData}
//             setFormData={setFormData}
//             onNext={handleNext}
//             onPrev={handlePrev}
//           />
//         )}
//         {step === 6 && (
//           <RatesPricingStep
//             formData={formData}
//             setFormData={setFormData}
//             onNext={handleNext}
//             onPrev={handlePrev}
//           />
//         )}
//         {step === 7 && (
//           <ProfileSettingsStep
//             formData={formData}
//             setFormData={setFormData}
//             onPrev={handlePrev}
//             onSubmit={handleSubmit}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;



// src/pages/RegisterPage.jsx
import { useEffect, useState } from "react";
import StepProgress from "../components/signup components/StepProgress";
import PersonalInfoStep from "../components/signup components/PersonalInfo";
import LocationStep from "../components/signup components/LocationStep";
import ProfessionalStep from "../components/signup components/ProfessionalStep";
import { FaArrowLeft } from "react-icons/fa";
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

    //
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
    date_of_birth_type: "date", //date, age
    date_of_birth: "",
    age: "",
    step: "COMP"
  });

  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 7));
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    try {
      const res = await register(formData);
      toast.success(t("register.registration_success"));
      console.log("Registered user:", res);
    } catch (err) {
      const apiMessage =
        err.response?.data?.message || err.message || t("register.registration_failed");
      toast.error(apiMessage);
      console.error("Register failed:", err);
    }
  };

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
      navigator.geolocation.getCurrentPosition(async (pos) => {
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
      }, (err) => {
        // geolocation permission/failed
        console.warn("Geolocation failed", err);
        toast.error(t("register.geolocation_failed"));
      });
    }
  }, [t]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      {/* Top header */}
      <div className="w-full p-4 flex justify-between items-center md:max-w-[50%]">
        <Link to="/home" className="text-gray-600 text-xs hover:bg-gray-200 rounded-md px-4 py-1 flex items-center">
          <FaArrowLeft className="mr-2" /> {t("register.back")}
        </Link>
        <Link to="/home" className="text-gray-600 text-xs border px-3 py-1 rounded-md hover:bg-gray-200">
          {t("register.skip_for_now")}
        </Link>
      </div>

      {/* Step progress tracker */}
      <div className="w-full md:max-w-[50%]">
        <StepProgress currentStep={step} />
      </div>

      {/* Step content */}
      <div className="w-full flex justify-center px-4 sm:px-6 lg:px-8 mt-8 md:max-w-[50%] mb-10">
        {step === 1 && (
          <PersonalInfoStep
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
          />
        )}
        {step === 2 && (
          <LocationStep
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
        {step === 3 && (
          <ProfessionalStep
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
        {step === 4 && (
          <ServicesSkillsStep
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
        {step === 5 && (
          <PortfolioSocialStep
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
        {step === 6 && (
          <RatesPricingStep
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
        {step === 7 && (
          <ProfileSettingsStep
            formData={formData}
            setFormData={setFormData}
            onPrev={handlePrev}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
