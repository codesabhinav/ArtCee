// FeaturePremiumPage.jsx
import { AiOutlineEye } from "react-icons/ai";
import { FaArrowLeft, FaCrown, FaUsers, FaHeart, FaEye, FaChartLine, FaBolt } from "react-icons/fa";
import { Link } from "react-router-dom";
import PurchasePopupModel from "../modal/PurchasePopupModel";
import { useEffect, useState } from "react";
import { useTranslation } from "../contexts/LanguageProvider";
import Cookies from "js-cookie";
import { getPlans } from "../Hooks/useSeller";

const FeaturePremiumPage = () => {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const joined = 347;
  const spotsLeft = 153;
  const foundingRemainingText = t("premium.founding_spots_remaining", { remaining: spotsLeft });

  const [plans, setPlans] = useState([]);
  const [location, setLocation] = useState(null);
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
              // Save cookies for future visits
              Cookies.set("user_city", city, { expires: 7 });
              Cookies.set("user_state", state, { expires: 7 });
              Cookies.set("user_country", country, { expires: 30 });
              setLocation(country);
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

  useEffect(() => {
    async function loadPlans(loc) {
      setLoadingPlans(true);
      setPlansError(null);
      try {
        const res = await getPlans({ location: loc });
        const normalized = normalizePlansResponse(res);
        setPlans(normalized);
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

  return (
    <div className="bg-white min-h-screen w-full">
      <div className="md:max-w-[80%] justify-center mx-auto pb-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between px-2 md:px-0 py-4 border-b">
          <Link
            to="/guest-dashboard"
            className="text-black font-medium text-xs hover:bg-gray-200 rounded-md px-4 py-2 flex items-center"
          >
            <FaArrowLeft className="mr-2" /> {t("premium.back_to_dashboard")}
          </Link>
          <h1 className="flex-1 text-center text-xl font-bold">{t("premium.upgrade_title")}</h1>
          <button className="px-4 py-2 text-xs bg-orange-500 text-white font-bold rounded-md">
            {t("premium.limited_time")}
          </button>
        </div>

        {/* Crown Icon */}
        <div className="flex justify-center mt-20">
          <div className="w-18 h-18 rounded-full bg-gradient-to-r from-teal-500 to-orange-400 flex items-center justify-center">
            <FaCrown className="text-white text-4xl" />
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mt-6">
          <h2 className="text-2xl md:text-3xl font-bold">{t("premium.hero_title")}</h2>
          <p className="mt-2 font-light text-gray-600 max-w-xl mx-auto">
            {t("premium.hero_subtitle")}
          </p>
        </div>

        {/* Founding Member Status */}
        <div className="mt-10 bg-white text-black p-6 rounded-xl shadow-md max-w-md w-full mx-auto border border-[#1FA29A]">
          <div className="font-bold text-start text-sm justify-between flex items-center">
            {t("premium.founding_status")}
            <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-1 rounded flex items-center gap-1">
              <FaCrown className="text-[10px]" /> {t("premium.badge_forever")}
            </span>
          </div>

          <div className="w-full bg-gray-200 h-3 rounded mt-3">
            <div className="bg-black h-3 rounded w-2/3"></div>
          </div>
          <p className="mt-2 text-black/50 text-xs justify-between flex">
            {t("premium.joined_count", { joined })} <span>{t("premium.spots_left", { spots: spotsLeft })}</span>
          </p>

          <p className="text-[#1FA29A] font-light mt-1 text-xs text-center">
            {t("premium.founding_note")}
          </p>
        </div>

        {/* Free vs Premium */}
        <div className="grid md:grid-cols-2 gap-6 m-10 md:ml-20 md:mr-20">
          {/* Free */}
          <div className="border rounded-lg p-6 shadow-md">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-ligh font-md">{t("premium.free_title")}</h4>
              <span className=" text-xs font-semibold px-2 py-1 border-gray-400 border rounded-md">
                {t("premium.current_plan")}
              </span>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✔ {t("premium.free_unlimited_uploads")}</li>
              <li>✔ {t("premium.free_unlimited_media")}</li>
              <li>✔ {t("premium.free_blog_posts")}</li>
              <li>✔ {t("premium.free_directory_listing")}</li>
              <li>✔ {t("premium.free_job_applications")}</li>
              <li>✔ {t("premium.free_basic_analytics")}</li>
            </ul>
          </div>

          {/* Premium */}
          <div className="border-2 border-orange-400 rounded-lg p-6 shadow-lg relative">
            <h4 className="font-light mb-4">{t("premium.premium_title")}</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="line-through text-gray-400">✔ {t("premium.free_included")}</li>
              <li>👑 {t("premium.featured_directory")}</li>
              <li>👥 {t("premium.follow_creatives")}</li>
              <li>❤️ {t("premium.like_content")}</li>
              <li>📈 {t("premium.enhanced_analytics")}</li>
              <li>📌 {t("premium.premium_job_posting")}</li>
              <li>🏅 {t("premium.permanent_badge")}</li>
            </ul>
            <button className="absolute top-4 right-4 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold">
              {t("premium.upgrade_now")}
            </button>
          </div>
        </div>

        {/* Connect & Collaborate */}
        <div className="m-10 md:ml-20 md:mr-20 bg-[#F9F8FF] rounded-xl p-10 text-center shadow-sm">
          <h3 className="text-2xl font-bold mb-2">{t("premium.connect_title")}</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-sm font-light">
            {t("premium.connect_subtitle")}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#1FA29A] flex items-center justify-center">
                <FaUsers className="text-white text-2xl" />
              </div>
              <h4 className="font-semibold mt-3 text-sm">{t("premium.connect_follow")}</h4>
              <p className="text-xs font-light text-gray-600 mt-1 text-center max-w-xs">
                {t("premium.connect_follow_desc")}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-orange-400 flex items-center justify-center">
                <FaHeart className="text-white text-2xl" />
              </div>
              <h4 className="font-semibold mt-3 text-sm">{t("premium.connect_appreciate")}</h4>
              <p className="text-xs font-light text-gray-600 mt-1 text-center max-w-xs">
                {t("premium.connect_appreciate_desc")}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#1FA29A] flex items-center justify-center">
                <AiOutlineEye className="text-white text-2xl" />
              </div>
              <h4 className="font-semibold mt-3 text-sm">{t("premium.connect_get_discovered")}</h4>
              <p className="text-xs font-light text-gray-600 mt-1 text-center max-w-xs">
                {t("premium.connect_get_discovered_desc")}
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Section: dynamic plan cards based on fetched plans */}
        <div className="flex justify-center">
          <div className="grid md:grid-cols-2 gap-10 m-10 max-w-6xl justify-items-center">
            {/* If permission denied, show message */}
            {permissionDenied ? (
              <div className="col-span-2 p-6 text-center border rounded-lg">
                <p className="text-sm text-gray-600">
                  {("Location permission denied. Plans are not available.")}
                </p>
              </div>
            ) : (
              <>
                {/* show loading / error / no plans */}
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
                    <p className="text-sm text-gray-600">
                      {(
                        "No plans found for your location."
                      )}
                    </p>
                    <div className="mt-3">
                      <button
                        onClick={() => {
                          setShowLocationPrompt(true);
                          setUserEnteredLocation("");
                        }}
                        className="px-4 py-2 bg-teal-500 text-white rounded"
                      >
                        {t("premium.enter_location", "Enter location")}
                      </button>
                    </div>
                  </div>
                )}

                {/* Render each plan */}
                {plans.map((plan) => (
                  <div key={plan.id} className="border-2 rounded-xl p-8 shadow-sm flex flex-col w-full md:w-[400px] hover:shadow-md transition border-orange-400">
                    <div className="flex justify-between items-center">
                      <h4 className="flex items-center font-light text-md text-black">
                        <span className="mr-4 text-orange-400"><FaCrown /></span> {plan.title}
                      </h4>
                      {plan.onetime_payment === "1" && (
                        <span className="bg-orange-400 text-white text-xs px-2 py-1 rounded-md font-semibold">
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
                        onClick={() => setSelectedPlan(plan.id)}
                        className="mt-4 bg-orange-500 hover:bg-orange-600 text-xs text-white w-full py-3 rounded-md font-semibold flex items-center justify-center"
                      >
                        <span className="mr-4"><FaCrown /></span> {("Select plan")}
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="flex justify-center md:ml-20 md:mr-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full px-6">
            {/* Instant Access */}
            <div className="border rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-teal-500 text-white text-xl mb-3">
                <FaBolt />
              </div>
              <h4 className="font-semibold text-md">{t("premium.instant_access_title")}</h4>
              <p className="text-xs font-light text-gray-600 mt-1">
                {t("premium.instant_access_desc")}
              </p>
            </div>

            {/* Growing Community */}
            <div className="border rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-orange-500 text-white text-xl mb-3">
                <FaUsers />
              </div>
              <h4 className="font-semibold text-md">{t("premium.growing_community_title")}</h4>
              <p className="text-xs font-light text-gray-600 mt-1">
                {t("premium.growing_community_desc")}
              </p>
            </div>

            {/* Proven Results */}
            <div className="border rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-teal-500 text-white text-xl mb-3">
                <FaChartLine />
              </div>
              <h4 className="font-semibold text-md">{t("premium.proven_results_title")}</h4>
              <p className="text-xs font-light text-gray-600 mt-1">
                {t("premium.proven_results_desc")}
              </p>
            </div>

            {/* Exclusive Status */}
            <div className="border rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-orange-500 text-white text-xl mb-3">
                <FaCrown />
              </div>
              <h4 className="font-semibold text-md">{t("premium.exclusive_status_title")}</h4>
              <p className="text-xs font-light text-gray-600 mt-1">
                {t("premium.exclusive_status_desc")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PurchasePopupModel
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        planId={selectedPlan}
        country={location}
      />
    </div>
  );
};

export default FeaturePremiumPage;
