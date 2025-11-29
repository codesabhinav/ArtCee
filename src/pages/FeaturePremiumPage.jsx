import { AiOutlineEye } from "react-icons/ai";
import { FaArrowLeft, FaUsers, FaChartLine, FaBolt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import PurchasePopupModel from "../modal/PurchasePopupModel";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "../contexts/LanguageProvider";
import Cookies from "js-cookie";
import { getPlans } from "../Hooks/useSeller";
import { updateLocation } from "../Hooks/useDashboard";
import { Crown, Heart, X } from "lucide-react";
import bannerImg from "../images/banner.avif";

const FeaturePremiumPage = () => {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const [open, setOpen] = useState(true);

  const joined = 347;
  const spotsLeft = 153;

  const [plans, setPlans] = useState([]);
  const [location, setLocation] = useState(null);
  const [locationId, setLocationId] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [plansError, setPlansError] = useState(null);

  const normalizePlansResponse = (res) => {
    if (!res) return [];
    if (res.data && Array.isArray(res.data.data)) return res.data.data;
    if (res.data && Array.isArray(res.data)) return res.data;
    if (Array.isArray(res)) return res;
    if (res.status && Array.isArray(res.data)) return res.data;
    return [];
  };

  useEffect(() => {
    const cookieCountry = Cookies.get("user_country");
    if (cookieCountry) {
      setLocation(cookieCountry);
      return;
    }

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
            );
            const data = await res.json();
            const city = data?.address?.city || data?.address?.town || data?.address?.village || "";
            const state = data?.address?.state || "";
            const country = data?.address?.country || "";

            if (country) {
              Cookies.set("user_city", city, { expires: 7 });
              Cookies.set("user_state", state, { expires: 7 });
              Cookies.set("user_country", country, { expires: 30 });
              setLocation(country);

              // Update user location if logged in
              const token = Cookies.get("artcee_token");
              if (token) {
                try {
                  const userId = Cookies.get("userId");
                  if (userId && (city || state || country)) {
                    await updateLocation(userId, {
                      city: city || "",
                      state: state || "",
                      country: country || "",
                    });
                    console.log("User location updated successfully");
                  }
                } catch (updateErr) {
                  console.warn("Failed to update user location:", updateErr);
                }
              }
            } else {
              setPermissionDenied(true);
            }
          } catch (err) {
            console.error("Reverse geocoding failed", err);
            setPermissionDenied(true);
          }
        },
        (err) => {
          console.warn("Geolocation error:", err);
          setPermissionDenied(true);
        },
        {
          timeout: 8000,
          maximumAge: 60 * 1000,
        }
      );
    } else {
      setPermissionDenied(true);
    }
  }, []);

  // useEffect(() => {
  //   if (open) {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "";
  //   }
  //   return () => {
  //     document.body.style.overflow = "";
  //   };
  // }, [open]);

  useEffect(() => {
    async function loadPlans(loc) {
      setLoadingPlans(true);
      setPlansError(null);
      try {
        const res = await getPlans({ location: loc });
        const normalized = normalizePlansResponse(res);
        setPlans(normalized);
        if (normalized.length > 0 && normalized[0].pricing) {
          setLocationId(normalized[0].pricing.country_id);
        }
      } catch (err) {
        const msg = err?.message || err?.response?.data?.message || "Failed to fetch plans";
        setPlansError(msg);
      } finally {
        setLoadingPlans(false);
      }
    }

    if (location && !permissionDenied) {
      loadPlans(location);
    }
  }, [location, permissionDenied]);

  const handleClose = () => {
    setOpen(false);
    if (window.history.state && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onBackdropClick = (e) => {
    if (e.target === modalRef.current) {
      handleClose();
    }
  };

  const renderFeatures = (plan) => {
    if (!plan.features || plan.features.length === 0) return null;
    return (
      <ul className="mt-4 space-y-2 text-sm text-gray-700 text-left">
        {plan.features.map((f) => (
          <li key={f.id} className="flex items-start gap-2">
            <span className="text-green-500">✔</span>
            <div>
              <div className="font-semibold text-xs">{f.name}</div>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const handleSelectPlan = (plan) => {
    if (!Cookies.get("artcee_token")) {
      navigate("/login");
      return;
    }
    setSelectedPlan(plan.id);
  };

  return (
    <>
      {open && (
        <div
          ref={modalRef}
          onClick={onBackdropClick}
          className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-6 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bannerImg})` }}
          aria-modal="true"
          role="dialog"
        >
          <div className="relative w-full max-w-4xl max-h-[85vh] overflow-auto bg-white rounded-md shadow-md scrollbar-hide">
            {/* Close / header */}
            <div className="flex items-center justify-end px-5 py-4">
                <button
                  onClick={handleClose}
                  className="text-gray-600 hover:bg-gray-100 p-2 rounded-md"
                  aria-label="Close"
                >
                  <X />
                </button>
                {/* <h2 className="text-lg font-bold">{t("premium.upgrade_title")}</h2> */}
              {/* <div className="flex items-center gap-3">
                <button className="px-3 py-2 text-xs hidden md:block bg-orange-500 text-white font-bold rounded-md">
                  {t("premium.limited_time")}
                </button>
              </div> */}
            </div>

            {/* Modal body */}
            <div className="p-6 md:p-8">
              {/* Crown icon hero */}
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-teal-500 to-orange-400 flex items-center justify-center">
                  <Crown className="text-white h-10 w-10" />
                </div>
              </div>

              <div className="text-center mt-6">
                <h3 className="text-xl md:text-3xl font-bold">{t("premium.hero_title")}</h3>
                <p className="mt-2 font-light text-gray-600 max-w-xl mx-auto">
                  {t("premium.hero_subtitle")}
                </p>
              </div>

              {/* Free vs Premium */}
              <div className="grid md:grid-cols-2 gap-6 my-8">
                <div className="border rounded-lg p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-ligh font-md">{t("premium.free_title")}</h4>
                    <span className=" text-xs font-semibold px-2 py-1 border-gray-400 border rounded-md">
                      {t("premium.current_plan")}
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>✔ Portfolio uploads (up to 5)</li>
                    <li>✔ {t("premium.free_blog_posts")}</li>
                    <li>✔ {t("premium.free_directory_listing")}</li>
                    <li>✔ Follow other creatives</li>
                    <li>✔ Like and support content</li>
                    <li>✔ {t("premium.free_basic_analytics")}</li>
                  </ul>
                </div>

                <div className="border-2 border-orange-400 rounded-lg p-6 shadow-lg relative">
                  <h4 className="font-light mb-4">{t("premium.premium_title")}</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="line-through text-gray-400">✔ {t("premium.free_included")}</li>
                    <li>👑 Unlimited portfolio uploads </li>
                    <li>📌 Unlimited job postings</li>
                    <li>🏅 Apply to jobs (unlimited)</li>
                    <li>👥 Direct message and video calls </li>
                    <li>📈 {t("premium.enhanced_analytics")}</li>
                  </ul>
                  <button className="absolute top-4 right-4 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                    {t("premium.upgrade_now")}
                  </button>
                </div>
              </div>

              {/* Pricing & plans */}
              <div className="flex justify-center">
                <div className="grid md:grid-cols-2 gap-10 mb-10 max-w-6xl justify-items-center w-full">
                  {permissionDenied ? (
                    <div className="col-span-2 p-6 text-center border rounded-lg">
                      <p className="text-sm text-gray-600">
                        {("Location permission denied. Plans are not available.")}
                      </p>
                    </div>
                  ) : (
                    <>
                      {loadingPlans && (
                        <div className="col-span-2 p-6 text-center">
                          <p className="text-sm text-gray-600">{("Loading plans...")}</p>
                        </div>
                      )}

                      {plansError && (
                        <div className="col-span-2 p-6 text-center text-red-500">
                          <p>{plansError}</p>
                        </div>
                      )}

                      {!loadingPlans && !plansError && plans.length === 0 && (
                        <div className="col-span-2 p-6 text-center border rounded-lg">
                          <p className="text-sm text-gray-600">{("No plans found for your location.")}</p>
                        </div>
                      )}

                      {plans.map((plan) => (
                        <div
                          key={plan.id}
                          className="border-2 rounded-xl p-8 shadow-sm flex flex-col w-full md:w-[350px] hover:shadow-md transition border-orange-400"
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="flex items-center font-light text-sm text-black">
                              <span className="mr-2 text-orange-400">
                                <Crown className="h-4 w-4" />
                              </span>{" "}
                              {plan.title}
                            </h4>
                            {plan.onetime_payment === "1" && (
                              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-md font-semibold">
                                {("One-time")}
                              </span>
                            )}
                          </div>

                          <div className="mt-4 items-center flex flex-col">
                            <p className="text-3xl font-bold text-gray-900">
                              {plan.pricing?.price ? `${plan.pricing.price}` : ("Free")}
                            </p>
                            {plan.billing_cycle && <p className="text-xs font-light text-gray-500">{plan.billing_cycle}</p>}
                            {plan.description && <p className="text-xs text-gray-500 mt-2 text-center">{plan.description}</p>}
                          </div>

                          {renderFeatures(plan)}

                          <div className="mt-6">
                            <button
                              onClick={() => handleSelectPlan(plan)}
                              className="mt-4 bg-orange-500 hover:bg-orange-600 text-xs text-white w-full py-3 rounded-md font-semibold flex items-center justify-center"
                            >
                              <span className="mr-4"><Crown className="h-4 w-4" /></span> {("Select plan")}
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Feature grid */}
              <div className="flex justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full px-6 mb-4">
                  <div className="border rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
                    <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-teal-500 text-white text-xl mb-3">
                      <FaBolt />
                    </div>
                    <h4 className="font-semibold text-md">{t("premium.instant_access_title")}</h4>
                    <p className="text-xs font-light text-gray-600 mt-1">{t("premium.instant_access_desc")}</p>
                  </div>

                  <div className="border rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
                    <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-orange-500 text-white text-xl mb-3">
                      <FaUsers />
                    </div>
                    <h4 className="font-semibold text-md">{t("premium.growing_community_title")}</h4>
                    <p className="text-xs font-light text-gray-600 mt-1">{t("premium.growing_community_desc")}</p>
                  </div>

                  <div className="border rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
                    <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-teal-500 text-white text-xl mb-3">
                      <FaChartLine />
                    </div>
                    <h4 className="font-semibold text-md">{t("premium.proven_results_title")}</h4>
                    <p className="text-xs font-light text-gray-600 mt-1">{t("premium.proven_results_desc")}</p>
                  </div>

                  <div className="border rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
                    <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-orange-500 text-white text-xl mb-3">
                      <Crown />
                    </div>
                    <h4 className="font-semibold text-md">{t("premium.exclusive_status_title")}</h4>
                    <p className="text-xs font-light text-gray-600 mt-1">{t("premium.exclusive_status_desc")}</p>
                  </div>
                </div>
              </div>
            </div> {/* end modal body */}
          </div>
        </div>
      )}

      {/* Payment Modal (purchase) */}
      <PurchasePopupModel
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        planId={selectedPlan}
        country={location}
        countryId={locationId}
      />
    </>
  );
};

export default FeaturePremiumPage;
