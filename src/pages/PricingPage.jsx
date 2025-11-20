import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { getPlans } from "../Hooks/useSeller";
import Cookies from "js-cookie";
import PurchasePopupModel from "../modal/PurchasePopupModel";
import { SparklesIcon } from "lucide-react";

const featuresFree = [
  {
    title: "Portfolio Uploads (up to 5)",
    description:
      "Highlight your strongest pieces and create a polished, professional portfolio.",
  },
  {
    title: "Unlimited Blogs, Social Posts & Activity",
    description:
      "Share updates, behind-the-scenes, and stories to stay visible in the community.",
  },
  {
    title: "Social Media Link Management",
    description:
      "Combine all your links into one central hub to make following you effortless.",
  },
  {
    title: "Resume Upload",
    description:
      "Present your experience and credits alongside your portfolio.",
  },
  {
    title: "Save Jobs",
    description: "Bookmark opportunities and build your personal shortlist.",
  },
  {
    title: "Directory Listing",
    description:
      "Be discoverable by creatives, companies, casting directors, and clients.",
  },
  {
    title: "Follow Other Creatives",
    description: "Stay inspired and build your network with one click.",
  },
  {
    title: "Like & Support Content",
    description: "Engage with the community and increase your visibility.",
  },
];

const featuresPremium = [
  {
    title: "Everything in the FREE plan",
    description:
      "All the essential visibility tools, with expanded professional features.",
  },
  {
    title: "Unlimited Portfolio Uploads",
    description:
      "Upload your full library — perfect for photographers, filmmakers, designers, performers, and agencies.",
  },
  {
    title: "Unlimited Job Postings",
    description:
      "Post roles, castings, or gig opportunities anytime. Grow your team or crew effortlessly.",
  },
  {
    title: "Unlimited Job Applications",
    description:
      "Apply to as many opportunities as you want without restrictions.",
  },
  {
    title: "Direct Messaging",
    description:
      "Connect instantly with creatives and clients. No need to search for emails or socials.",
  },
  {
    title: "Video Calls",
    description:
      "Hold auditions, project discussions, interviews, or client meetings right from your profile.",
  },
];

const comparisonRows = [
  { label: "Portfolio Uploads", free: "Up to 5", premium: "Unlimited" },
  { label: "Blogs & Social Posts", free: "Unlimited", premium: "Unlimited" },
  { label: "Resume Upload", free: "✔", premium: "✔" },
  { label: "Directory Listing", free: "✔", premium: "Better visibility" },
  { label: "Save Jobs", free: "✔", premium: "✔" },
  { label: "Follow & Like", free: "✔", premium: "✔" },
  { label: "Job Applications", free: "✕", premium: "Unlimited" },
  { label: "Job Postings", free: "✕", premium: "Unlimited" },
  { label: "Direct Messaging", free: "✕", premium: "Included" },
  { label: "Video Calls", free: "✕", premium: "Included" },
];

export default function PricingPage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [premiumPrice, setPremiumPrice] = useState("12");
  const [billingCycle, setBillingCycle] = useState("/ month");
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [locationId, setLocationId] = useState(null);
  const [premiumPlanId, setPremiumPlanId] = useState(null);

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
            const country = data?.address?.country || "";

            if (country) {
              Cookies.set("user_country", country, { expires: 30 });
              setLocation(country);
            } else {
              setPermissionDenied(true);
              setLocation("United States");
            }
          } catch (err) {
            console.error("Reverse geocoding failed", err);
            setPermissionDenied(true);
            setLocation("United States");
          }
        },
        (err) => {
          console.warn("Geolocation error:", err);
          setPermissionDenied(true);
          setLocation("United States");
        },
        {
          timeout: 8000,
          maximumAge: 60 * 1000,
        }
      );
    } else {
      setPermissionDenied(true);
      setLocation("United States");
    }
  }, []);

  useEffect(() => {
    async function loadPlans(loc) {
      setLoadingPrice(true);
      try {
        const locationToUse = loc || "United States";
        const res = await getPlans({ location: locationToUse });
        const normalized = normalizePlansResponse(res);

        if (normalized.length > 0) {
          const premiumPlan =
            normalized.find(
              (plan) =>
                plan.pricing?.price && parseFloat(plan.pricing.price) > 0
            ) || normalized[0];

          if (premiumPlan?.pricing?.price) {
            setPremiumPrice(premiumPlan.pricing.price);
          }

          if (premiumPlan?.billing_cycle) {
            setBillingCycle(`/ ${premiumPlan.billing_cycle}`);
          }

          const symbol =
            premiumPlan?.pricing?.country?.currency_symbol ??
            premiumPlan?.pricing?.currency ??
            "$"; 
          setCurrencySymbol(symbol);

          if (premiumPlan?.id) {
            setPremiumPlanId(premiumPlan.id);
          }
          if (premiumPlan?.pricing?.country_id) {
            setLocationId(premiumPlan.pricing.country_id);
          }
        }
      } catch (err) {
        console.error("Failed to load plans:", err);
      } finally {
        setLoadingPrice(false);
      }
    }

    if (location !== null || permissionDenied) {
      const locationToUse = location || "United States";
      loadPlans(locationToUse);
    }
  }, [location, permissionDenied]);

  const handleSelectPlan = () => {
    if (!Cookies.get("artcee_token")) {
      navigate("/login");
      return;
    }
    if (premiumPlanId) {
      setSelectedPlan(premiumPlanId);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="w-full bg-white">
        <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-4">
          <Link
            to="/home"
            className="text-slate-700 font-medium text-xs hover:bg-gray-100 rounded-md px-3 py-2 flex items-center"
          >
            <FaArrowLeft className="mr-2 text-xs" /> Back
          </Link>

          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0">
              <img
                src="logo.png"
                alt="ArtCee"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-sm sm:text-lg font-medium text-slate-800">
              ArtCee
            </h1>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <section className="text-center mb-10">
          <button className="inline-flex items-center rounded-full bg-gradient-to-r from-teal-50 to-orange-50 px-3 py-2 text-xs font-medium text-black mb-4 font-regular">
            {" "}
            <SparklesIcon className="h-4 w-4 text-teal-400 mr-2" />
            Choose Your Creative Journey{" "}
          </button>
          <h1 className="text-3xl lg:text-4xl font-semibold mb-2 text-slate-800">
            ArtCee Pricing Plans
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto text-md">
            Where artsy people go to get discovered. Create, Connect, and
            Collaborate.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-10 mb-16 -mx-4 px-4 py-10 rounded-md">
          <div className="bg-white rounded-lg border-2 border-slate-200 p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-100 hover:-translate-y-1 cursor-pointer">
            <p className="uppercase text-2xl font-semibold mb-1 text-slate-800">
              FREE PLAN
            </p>
            <p className="text-4xl font-bold text-teal-500 mb-2">
              {loadingPrice ? (
                <span className="text-2xl">Loading...</span>
              ) : (
                <>{currencySymbol}0</>
              )}
            </p>
            <p className="text-slate-600 text-sm mb-4">
              Your creative journey starts here.
            </p>

            <p className="text-slate-600 text-sm mb-4">
              A clean, modern profile that lets you showcase your work, grow
              your network, and follow opportunities — all at no cost.
            </p>

            <h3 className="font-semibold mb-3 text-sm text-slate-800">
              Features & Benefits
            </h3>

            <ul className="text-sm space-y-3 mb-6">
              {featuresFree.map((item, index) => (
                <li key={index} className="text-slate-600">
                  <div className="flex gap-2 mb-1">
                    <span className="text-green-500 text-sm flex-shrink-0">
                      ✔
                    </span>
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <p className="text-xs text-slate-500 ml-5">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>

            <button className="w-full rounded-md border border-teal-400 text-teal-500 py-2 font-medium hover:bg-teal-50 bg-white text-xs">
              Current Plan
            </button>
          </div>

          <div className="relative bg-white rounded-lg border-2 border-orange-300 p-8 shadow-md transition-all duration-300 hover:shadow-xl hover:scale-100 hover:-translate-y-1 cursor-pointer hover:border-orange-400">
            <div className="absolute -top-3 right-6 bg-orange-500 text-xs text-white font-bold px-3 py-2 rounded-md uppercase tracking-wide">
              MOST POPULAR
            </div>

            <p className="uppercase text-2xl font-semibold mb-1 text-slate-800">
              PREMIUM PLAN
            </p>
            <p className="text-4xl font-bold text-orange-500 mb-2">
              {loadingPrice ? (
                <span className="text-2xl">Loading...</span>
              ) : (
                <>
                  {currencySymbol}
                  {premiumPrice}{" "}
                  <span className="text-sm text-slate-500 font-normal">
                    {billingCycle}
                  </span>
                </>
              )}
            </p>
            <p className="text-slate-600 text-sm mb-4">
              For working creatives, studios, and businesses that need full
              power.
            </p>

            <p className="text-slate-600 text-sm mb-4">
              Unlock unlimited tools to market your work, land opportunities,
              and run your creative brand like a pro.
            </p>

            <h3 className="font-semibold mb-3 text-sm text-slate-800">
              Features & Benefits
            </h3>

            <ul className="text-sm space-y-3 mb-6">
              {featuresPremium.map((item, index) => (
                <li key={index} className="text-slate-600">
                  <div className="flex gap-2 mb-1">
                    <span className="text-green-500 text-sm flex-shrink-0">
                      ✔
                    </span>
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <p className="text-xs text-slate-500 ml-5">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>

            <button
              onClick={handleSelectPlan}
              className="w-full rounded-md bg-orange-500 text-white py-2 font-medium hover:bg-orange-600 text-xs"
            >
              Upgrade to Premium
            </button>
          </div>
        </section>

        <section className="mb-10 flex justify-center">
          <div className="rounded-3xl overflow-hidden shadow-md max-w-xl w-full aspect-video bg-black">
            <img
              src="../images/chinii.png"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        <section className="mb-20">
          <div className="text-center mb-6">
            <h2 className="text-xl lg:text-3xl font-regular text-slate-800">
              Plan Comparison at a Glance
            </h2>
            <p className="text-slate-600 text-md">
              See what makes Premium the choice for serious creatives.
            </p>
          </div>

          <div className="rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-white border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 text-left text-slate-500 text-sm">
                    Feature
                  </th>
                  <th className="py-3 px-4 text-center text-teal-500 text-xs">
                    Free
                  </th>
                  <th className="py-3 px-4 text-center text-orange-500 text-xs">
                    Premium
                  </th>
                </tr>
              </thead>

              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.label}
                    className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                  >
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {row.label}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600">
                      {row.free === "✔" ? (
                        <span className="text-green-500 text-base">✔</span>
                      ) : row.free === "✕" ? (
                        <span className="text-slate-400 text-base">✕</span>
                      ) : (
                        row.free
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600">
                      {row.premium.includes("✔") ? (
                        <span className="text-green-500">{row.premium}</span>
                      ) : row.premium === "✕" ? (
                        <span className="text-slate-400 text-base">✕</span>
                      ) : (
                        row.premium
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="text-center pb-20">
          <h2 className="text-2xl lg:text-3xl font-regular text-slate-800">
            Ready to take your creative career to the next level?
          </h2>
          <p className="text-slate-600 mt-2 mb-6">
            Join thousands of creatives who are creating, connecting, and
            collaborating on ArtCee.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleSelectPlan}
              className="rounded-md bg-orange-500 text-white px-6 py-3 text-sm font-medium hover:bg-orange-600"
            >
              Upgrade to Premium Now
            </button>

            <Link
              to="/home"
              className="rounded-md border border-teal-500 text-teal-500 px-6 py-3 text-sm font-medium hover:bg-teal-50"
            >
              Explore Free Features
            </Link>
          </div>
        </section>
      </main>

      <PurchasePopupModel
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        planId={selectedPlan}
        country={location || "United States"}
        countryId={locationId}
      />
    </div>
  );
}
