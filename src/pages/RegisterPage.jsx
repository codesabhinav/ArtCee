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
import { Link, useNavigate } from "react-router-dom";
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
    // bio: "",
    type: "",
    city: "",
    state: "",
    country: "",
    travel_radius_miles: 0,
    // experience_in_year: "",
    // experience_in_level: "",
    personal_intro: "",
    exp_vision: "",
    is_remote_active: 0,
    on_site_active: 0,
    skills: [],
    custom_skills: "",
    portfolio: null,
    social: {
      website: "",
      linkind: "",
      instagram: "",
      behance: "",
      dribbble: ""
    },
    // hourly_rate: 0,
    // daily_rate: 0,
    // project_rate: 0,
    // currency: "USD",
    // is_rate_negotiable: 0,
    // education_visible: 0,
    // pricing_visible: 0,
    // client_review_visible: 0,
    // professions_visible: 0,
    date_of_birth_type: "date",
    date_of_birth: "",
    age: "",
    address: "",
    resume: null,
    ss_id: "",
    profile_portfolio: [],
    step: "COMP"
  });

  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const totalSteps = 6;

  const handleNext = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));
  const handleGoto = (n) => setStep(() => Math.min(Math.max(1, n), totalSteps));

  const handleSubmit = async (payload) => {
    const dataToSend = payload ?? formData;

    try {
      const res = await register(dataToSend);
      toast.success(t("register.registration_success"));
      navigate("/home");
    } catch (err) {
      const apiMessage =
        err?.response?.data?.message || err?.message || t("register.registration_failed");
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
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
            );
            const data = await res.json();
            console.log(data);

            const city = data.address?.city || data.address?.town || data.address?.state_district || "";
            const state = data.address?.state || "";
            const country = data.address?.country || "";

            Cookies.set("user_city", city, { expires: 7 });
            Cookies.set("user_state", state, { expires: 7 });
            Cookies.set("user_country", country, { expires: 7 });

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
          console.warn("Geolocation failed", err);
          toast.error(t("register.geolocation_failed"));
        },
        { timeout: 10000, maximumAge: 600000, enableHighAccuracy: false }
      );
    }
  }, [t]);

  const StepWrapper = ({ children }) => {
    return (
      <div className="w-full flex-shrink-0 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start py-6">
      {/* Top header */}
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-full mx-auto">
        <div className="flex justify-between items-center py-4 max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
          <Link
            to="/"
            className="text-black font-medium text-xs hover:bg-gray-100 rounded-md px-3 py-2 flex items-center"
          >
            <FaArrowLeft className="mr-3" /> {t("register.back")}
          </Link>
          <Link
            to="/home"
            className="text-gray-600 text-xs border-2 px-3 py-1.5 rounded-md hover:bg-gray-100"
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

      <div className="w-full px-2 sm:px-6 lg:px-8 mt-2 mb-10 max-w-full mx-auto">
        <div className="max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
          <div className="relative">
            <div className="relative overflow-hidden rounded-lg bg-white shadow-sm" aria-roledescription="step-panel">
              <div className="flex flex-col">
                <div className="">
                  <StepWrapper>
                    {step === 1 ? (
                      <PersonalInfoStep formData={formData} setFormData={setFormData} onNext={handleNext} />
                    ) : null}
                  </StepWrapper>
                </div>

                <div className="">
                  <StepWrapper>
                    {step === 2 ? (
                      <LocationStep formData={formData} setFormData={setFormData} onNext={handleNext} onPrev={handlePrev} />
                    ) : null}
                  </StepWrapper>
                </div>

                <div className="">
                  <StepWrapper>
                    {step === 3 ? (
                      <ProfessionalStep formData={formData} setFormData={setFormData} onNext={handleNext} onPrev={handlePrev} />
                    ) : null}
                  </StepWrapper>
                </div>

                <div className="">
                  <StepWrapper>
                    {step === 4 ? (
                      <ServicesSkillsStep formData={formData} setFormData={setFormData} onNext={handleNext} onPrev={handlePrev} />
                    ) : null}
                  </StepWrapper>
                </div>

                <div className="">
                  <StepWrapper>
                    {step === 5 ? (
                      <PortfolioSocialStep formData={formData} setFormData={setFormData} onNext={handleNext} onPrev={handlePrev} />
                    ) : null}
                  </StepWrapper>
                </div>

                {/* <div className="">
                  <StepWrapper>
                    {step === 6 ? (
                      <RatesPricingStep formData={formData} setFormData={setFormData} onNext={handleNext} onPrev={handlePrev} />
                    ) : null}
                  </StepWrapper>
                </div> */}

                <div className="">
                  <StepWrapper>
                    {step === 6 ? (
                      <ProfileSettingsStep formData={formData} setFormData={setFormData} onPrev={handlePrev} onSubmit={handleSubmit} />
                    ) : null}
                  </StepWrapper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
