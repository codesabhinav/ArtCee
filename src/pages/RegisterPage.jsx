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

  const sliderRef = useRef(null);
  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);
  const swipeThreshold = 50; 
  useEffect(() => {
    const handleKey = (e) => {
      if (isDesktop) return; 
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
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(calc(-${(step - 1) * 100}% + ${touchDeltaX.current}px))`;
    }
  };

  const onTouchEnd = () => {
    if (isDesktop || touchStartX.current === null) return;
    const dx = touchDeltaX.current;
    if (sliderRef.current) {
      sliderRef.current.style.transition = "transform 300ms ease-in-out";
      sliderRef.current.style.transform = `translateX(-${(step - 1) * 100}%)`;
    }
    if (dx > swipeThreshold) {
      handlePrev();
    } else if (dx < -swipeThreshold) {
      handleNext();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  const StepWrapper = ({ children }) => {
    return (
      <div className="w-full flex-shrink-0 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    );
  };

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
            to="/"
            className="text-black font-medium text-xs hover:bg-gray-100 rounded-md px-3 py-2 flex items-center"
          >
            <FaArrowLeft className="mr-3" /> {t("register.back")}
          </Link>
          <Link
            to="/home"
            className="text-gray-600 text-xs border-2 px-3 py-2 rounded-md hover:bg-gray-100"
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
            <div
              className={`relative ${isDesktop ? "" : "overflow-hidden rounded-lg bg-white shadow-sm"}`}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              aria-roledescription={isDesktop ? "step-panel" : "slider"}
            >
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

          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
