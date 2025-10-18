import {
  BriefcaseIcon,
  CameraIcon,
  PencilIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState, useCallback } from "react";
import {
  BiCloudUpload,
  BiImage,
  BiMoney,
  BiSearch,
} from "react-icons/bi";
import {
  FaArrowLeft,
  FaCrown,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import CreatePostPopupModel from "../modal/CreatePostPopupModel";
import { useTranslation } from "../contexts/LanguageProvider";
import SpinnerProvider from "../components/SpinnerProvider";
import { deletePost, getGuestDashboardData, getPlans, getPostData, getPostJobData, JobsData } from "../Hooks/useSeller";
import { Building, Building2, Crown, LogOut, MessageCircleMoreIcon, Plus, Star, TrashIcon } from "lucide-react";
import StepModalManager from "../modal/dashboard models/StepModalManager";
import ProfileSteps from "../components/ProfileSteps";
import UploadProfileModal from "../modal/dashboard models/UploadProfileModal";
import Cookies from "js-cookie";
import { RiLogoutCircleRLine } from "react-icons/ri";
import toast from "react-hot-toast";
import PortfolioModal from "../modal/dashboard models/PortfolioModal";
import PostJobPopupModal from "../modal/PostJobPopupModal";
import BusinessListingModal from "../modal/BusinessListingModal";
import UploadCoverPhotoModal from "../modal/dashboard models/UploadCoverPhotoModal";

const GuestDashboardPage = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payload, setPayload] = useState(null);
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [isPhotoOpen, setPhotoIsOpen] = useState(false);
  const [isWorkOpen, setWorkOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState(null);
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansError, setPlansError] = useState(null);
  const [isPostJobOpen, setPostJobOpen] = useState(false);
  const [jobsPostLoading, setJobsPostLoading] = useState(false);
  const [jobsPostError, setjobsPostError] = useState(null);
  const [jobsPostData, setjobsPostData] = useState(null);
  const [listingOpen, setListingOpen] = useState(null);
  const [openCompletion, setOpenCompletion] = useState(true);
  const [openPortfolio, setOpenPortfolio] = useState(true);
  const [openActivity, setOpenActivity] = useState(true);
  const [openJobs, setOpenJobs] = useState(true);
  const [openPosted, setOpenPosted] = useState(true);
  const [isCoverPhotoOpen, setCoverPhotoIsOpen] = useState(false);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getGuestDashboardData();
      setPayload(res || {});
    } catch (err) {
      setError(err?.message || t("guest.load_error"));
      setPayload(null);
    } finally {
      setLoading(false);
    }
  }, [t]);

  const fetchJobs = useCallback(async () => {
    setJobsPostLoading(true);
    setjobsPostError(null);

    const userId = Cookies.get("userId");
    try {
      const res = await getPostJobData(userId);
      const postedJobs =
        res?.job ??
        (res?.data && (res.data.job ?? res.data)) ??
        res ??
        [];
      setjobsPostData(Array.isArray(postedJobs) ? postedJobs : [postedJobs]);
    } catch (err) {
      setjobsPostError(err?.message || "Failed to load job listing.");
      setjobsPostData([]);
    } finally {
      setJobsPostLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    let mounted = true;
    fetchDashboard();

    return () => {
      mounted = false;
    };
  }, [fetchDashboard]);

  function openCreate() {
    setEditingPost(null);
    setIsOpen(true);
  }

  function openEdit(post) {
    setEditingPost(post);
    setIsOpen(true);
  }

  async function handleDelete(postId) {
    try {
      await deletePost(postId);
      fetchDashboard();
      toast.success("Post deleted");
    } catch (err) {
      console.error("Failed to delete:", err);
      alert(err.message || "Failed to delete post");
    }
  }
  const user = payload?.user ?? {};
  const seller = payload?.seller ?? null;
  const sellerUser = seller?.user ?? user?.seller?.user ?? null;
  const profile = payload?.data?.profile ?? user?.profile ?? sellerUser?.profile ?? null;

  const location = user?.location ?? sellerUser?.location ?? null;
  const city = location?.city?.name ?? null;
  const state = location?.state?.name ?? null;
  const country = location?.country?.name ?? null;

  const data = payload?.data ?? {};
  const uuid = user?.uuid ?? user?.id ?? null;

  const fullName = user?.full_name ?? profile?.title ?? t("guest.default_name");
  const roleDisplay = (user?.role && user.role[0]?.display_name) ?? t("guest.default_role");
  const avatar = profile?.profile_picture ?? "https://img.freepik.com/premium-photo/memoji-emoji-handsome-smiling-man-white-background_826801-6987.jpg?semt=ais_hybrid&w=740&q=80";
  const cover_image = profile?.cover_picture ?? null;
  const bio = profile?.bio ?? "";
  const title = profile?.title ?? t("guest.default_title");

  const followers = data?.followers_count ?? 0;
  const following = data?.follow_count ?? 0;
  const portfolioCount = data?.portfolio_count ?? 0;
  const servicesCount = data?.services_count ?? 0;
  const postsCount = data?.post_count ?? 0;
  const jobsCount = data?.jobs_count ?? 0;
  const ordersCount = data?.orders_count ?? 0;

  const yearsExp = seller?.experience_in_year ?? sellerUser?.seller?.experience_in_year ?? user?.seller?.experience_in_year ?? data?.experience_in_year ?? 0;
  const experienceLevel = seller?.experience_in_level ?? null;
  const availability = seller?.availability ?? null;

  const progress = data?.progress_percentage ?? 0;
  const rating = user?.rating ?? seller?.avg_rating ?? user?.seller?.rating ?? 0;
  const totalReviews = profile?.total_reviews ?? 0;

  const memberSince = new Date(user?.created_at ?? profile?.created_at ?? Date.now()).toLocaleDateString();
  const jobsList = payload?.jobs ?? [];
  const posts = payload?.posts ?? [];
  const portfolios = payload?.portfolieo ?? [];
  const subscription =
    payload?.user?.subcription ??
    payload?.seller?.user?.subcription ??
    user?.subcription ??
    sellerUser?.subcription ??
    null;

  const planDetails =
    subscription?.plan ??
    payload?.user?.plan ??
    payload?.seller?.user?.plan ??
    user?.plan ??
    sellerUser?.plan ??
    null;

  const planPricing =
    planDetails?.pricing?.price ??
    (planDetails?.pricing === undefined && planDetails?.country ? planDetails?.country : null);

  const subscriptionExpiry = subscription?.expired_date
    ? new Date(subscription.expired_date).toLocaleDateString()
    : null;

  const planPriceDisplay = (() => {
    if (planPricing?.price) {
      const symbol = planPricing?.country?.currency_symbol ?? planPricing?.currency ?? "₹";
      return `${symbol} ${planPricing.price}`;
    }
    if (planDetails?.pricing?.price) {
      const symbol = planDetails?.pricing?.country?.currency_symbol ?? planDetails?.pricing?.currency ?? "₹";
      return `${symbol} ${planDetails.pricing.price}`;
    }
    return null;
  })();

  const hasActiveSubscription = (subscription?.status ?? "").toLowerCase() === "active";


  useEffect(() => {
    const loadPlansForCountry = async () => {
      if (!payload) return;

      const user = payload?.user ?? {};
      const seller = payload?.seller ?? null;
      const sellerUser = seller?.user ?? user?.seller?.user ?? null;
      const location = user?.location ?? sellerUser?.location ?? null;
      const countryName = location?.country?.name ?? null;

      if (!countryName) return;

      setPlansLoading(true);
      setPlansError(null);
      try {
        const params = { location: countryName };
        const res = await getPlans(params);
        setPlans(res?.data ?? []);
      } catch (err) {
        setPlansError(err?.message || "Failed to load plans");
        setPlans([]);
      } finally {
        setPlansLoading(false);
      }
    };

    loadPlansForCountry();
  }, [payload]);

  const getPriceForPlan = (plan) => {
    const location = payload?.user?.location ?? payload?.seller?.user?.location ?? null;
    const countryId = location?.country?.id ?? null;
    const countryName = location?.country?.name ?? null;

    if (plan?.pricing) {
      const pricing = plan.pricing;
      if (pricing?.country?.id && countryId && Number(pricing.country.id) === Number(countryId)) {
        return { price: pricing.price, symbol: pricing.country.currency_symbol ?? pricing.currency ?? "" };
      }
      if (pricing?.country_id && countryId && Number(pricing.country_id) === Number(countryId)) {
        return { price: pricing.price, symbol: pricing.currency ?? "" };
      }
    }

    if (plan?.location && countryId) {
      const match = plan.location.find((c) => Number(c.id) === Number(countryId) || c.name === countryName);
      if (match) {
        return { price: plan.pricing?.price ?? null, symbol: plan.pricing?.country?.currency_symbol ?? match.currency_symbol ?? "" };
      }
    }

    return { price: null, symbol: "" };
  };

  const premiumMonthly = plans.find((p) => p.title?.toLowerCase().includes("premium")) ?? plans[0];
  const foundingMember = plans.find((p) => p.title?.toLowerCase().includes("founding")) ?? plans[1];

  const premiumPrice = premiumMonthly ? getPriceForPlan(premiumMonthly) : { price: null, symbol: "" };
  const foundingPrice = foundingMember ? getPriceForPlan(foundingMember) : { price: null, symbol: "" };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-gray-600"> <SpinnerProvider /> </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-red-600">{error}</div>
      </div>
    );
  }

  const openStepModal = (stepKey) => {
    setActiveStep(stepKey);
    setModalOpen(true);
  };

  const handleLogout = () => {
    Cookies.remove("artcee_token");
    Cookies.remove("userId");
    Cookies.remove("subscription_status");
    window.dispatchEvent(new Event("authChanged"));
    navigate("/home");
  };

  const handleApply = (job, opt = null) => {
    const option = opt || (Array.isArray(job.apply_options) ? job.apply_options[0] : null);
    if (option?.link) {
      window.open(option.link, "_blank", "noopener,noreferrer");
      return;
    }
    console.warn("No apply link for job", job?.id);
  };

  const handleModalSaved = async (serverResponse) => {
    try {
      await fetchDashboard();
      await fetchJobs();
    } catch (err) {
      console.warn("Failed to refresh dashboard after modal save:", err);
    }
  };

  function formatDateShort(dateStr) {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d)) return dateStr;
      return d.toLocaleString(undefined, { month: "short", year: "numeric" });
    } catch {
      return dateStr;
    }
  }

  const formatLocation = (loc) => {
    if (!loc) return "-";
    if (Array.isArray(loc)) return loc.filter(Boolean).join(", ");
    return String(loc);
  };

  const Badge = ({ children, variant = "gray" }) => {
    const base = "text-xs px-2 py-1 rounded-full border";
    const color = {
      gray: "bg-gray-100 border-gray-200",
      indigo: "bg-indigo-100 border-indigo-200",
      green: "bg-green-100 border-green-200",
      yellow: "bg-yellow-100 border-yellow-200",
      red: "bg-red-100 border-red-200",
    }[variant] || "bg-gray-100 border-gray-200";
    return <span className={`${base} ${color} mr-2 mb-2 inline-block`}>{children}</span>;
  };

  const handleInboxClick = () => {
    if (hasActiveSubscription) {
      navigate("/inbox");
    } else {
      navigate("/featured");
    }
  };

  return (
    <div className="bg-white min-h-screen w-full">
      <div className="md:max-w-[80%] mx-auto px-4 pb-2 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b gap-3 sm:gap-0">
          <Link
            to="/home"
            className="text-black font-medium text-xs hover:bg-gray-200 rounded-md px-4 py-2 flex items-center w-fit"
          >
            <FaArrowLeft className="mr-2" /> {t("guest.back_to_home")}
          </Link>

          <div className="flex flex-col flex-1 text-start sm:ml-4">
            <h1 className="text-lg sm:text-xl font-bold">{t("guest.welcome")}, {fullName}</h1>
            <p className="text-sm font-light text-gray-600">
              {t("guest.manage_profile")}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs bg-gray-100 text-gray-800 rounded-md hover:bg-gray-300 inline-flex items-center"
            >
              <LogOut className="mr-2" size={18} />
              {t("nav.logout")}
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mt-6 mb-2">
          {/* Left Side */}
          <div className="col-span-2 space-y-6">
            {/* Profile Card with Cover Image */}
            <div className="bg-white border rounded-lg overflow-hidden shadow">
              <div className="relative h-40 bg-gray-100">
                {cover_image ? (
                  <img
                    src={cover_image}
                    alt={`${fullName} cover`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-gray-100 via-white to-white" />
                )}

                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
                </div>

                <div className="absolute top-4 right-4 z-20">
                  <button
                    type="button"
                    onClick={() => setCoverPhotoIsOpen(true)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white bg-opacity-95 border rounded-md text-xs shadow hover:bg-opacity-100"
                    title="Change Cover"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M3 15v4a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7 10l5-5 5 5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 5v10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="hidden sm:inline">Change Cover</span>
                  </button>
                </div>

                <div className="absolute left-6 right-6 -bottom-14 flex items-end z-10">
                  <div className="flex items-end gap-6 w-full">
                    <div className="relative flex-shrink-0">
                      <img
                        src={avatar}
                        alt={fullName}
                        className="w-20 h-20 sm:w-28 sm:h-28 rounded-md object-cover border-4 border-white shadow"
                      />

                      <button
                        onClick={() => setPhotoIsOpen(true)}
                        className="absolute -bottom-1 -right-1 w-8 h-8 rounded-sm bg-white border flex items-center justify-center shadow hover:bg-gray-50"
                        title="Change Avatar"
                        aria-label="Change Avatar"
                      >
                        <svg className="w-4 h-4 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M12 5v10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M7 10l5-5 5 5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-10 sm:h-10" />

              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 ">{fullName}</h3>
                    <p className="text-sm text-gray-600 truncate">
                      {title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{city} {state} {country}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold">{followers}</p>
                    <p className="text-xs text-gray-500">{t("guest.stats.followers")}</p>
                    <button onClick={handleInboxClick} className="text-xs font-semibold px-2 py-2 bg-white border hover:bg-gray-100 rounded-md text-black mt-2 flex items-center justify-center gap-2">
                      <MessageCircleMoreIcon className="h-4 w-4" /> Inbox
                    </button>
                    <p className="text-[10px] text-gray-500 mt-1">Premium Feature</p>
                  </div>

                </div>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-white border rounded-lg p-6 mt-6">
              <button
                type="button"
                onClick={() => setOpenCompletion((v) => !v)}
                aria-expanded={openCompletion}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-medium">{t("guest.profile_completion_title")}</h3>
                  <span className="text-xs font-medium bg-yellow-100 text-yellow-600 px-3 py-1 rounded-md w-fit">
                    {progress >= 100 ? t("guest.profile_complete") : t("guest.profile_incomplete")}
                  </span>
                </div>

                <svg
                  className={`w-4 h-4 transform transition-transform ${openCompletion ? "rotate-180" : "rotate-0"}`}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {openCompletion && (
                <div className="">
                  <p className="text-xs text-gray-500 mb-4">
                    {data.progress_percentage ?? 0}/100 {t("guest.completed_of")} – {progress}%
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-black h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
                    />
                  </div>

                  <ProfileSteps data={data} openStepModal={openStepModal} />
                </div>
              )}
            </div>

            {/* Portfolio Section */}
            <div className="bg-white border rounded-lg p-0 overflow-hidden mt-6">
              <button
                type="button"
                onClick={() => setOpenPortfolio((v) => !v)}
                aria-expanded={openPortfolio}
                className="w-full flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-sm flex items-center gap-2">
                    <BiCloudUpload className="h-5 w-5" /> Portfolio Work
                  </h3>
                </div>

                <svg
                  className={`w-4 h-4 transform transition-transform ${openPortfolio ? "rotate-180" : "rotate-0"}`}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M5 8l5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {openPortfolio && (
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center mb-4 gap-3 sm:gap-0">
                    <button
                      onClick={() => setWorkOpen(true)}
                      className="bg-teal-500 text-white px-4 py-2 text-xs font-semibold rounded-md hover:bg-teal-600 w-full sm:w-auto"
                    >
                      + Add Portfolio Work
                    </button>
                  </div>

                  {!loading && portfolios.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {portfolios.map((post, index) => {
                        const isLocked = !hasActiveSubscription && index >= 5; // lock after 5 items if no active subscription
                        const title = post?.title || t("guest.untitled");
                        const description = post?.description || "";
                        const role = post?.role || "";
                        const technologies = Array.isArray(post?.technologies)
                          ? post.technologies.join(", ")
                          : "";
                        const projectUrl = post?.project_url || "";

                        return (
                          <article
                            key={post.id ?? post.uuid}
                            className="relative flex flex-col sm:flex-row gap-4 border p-4 rounded-lg items-center sm:items-start transition"
                          >
                            {/* Content wrapper that gets blurred and non-interactive when locked */}
                            <div className={`${isLocked ? "pointer-events-none filter opacity-60" : ""} flex-1 min-w-0 text-center sm:text-left`}>
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                <div className="min-w-0">
                                  <h4 className="font-semibold text-sm truncate">{title}</h4>
                                  <p className="text-xs text-gray-600 mt-1 truncate">{description}</p>

                                  {technologies && (
                                    <p className="text-[11px] text-gray-500 mt-2 truncate">
                                      <strong className="mr-1">Tech:</strong> {technologies}
                                    </p>
                                  )}
                                </div>

                                <div className="mt-2 sm:mt-0 flex items-center gap-2">
                                  {role && (
                                    <span className="inline-block text-[10px] px-2 py-1 bg-yellow-100 max-h-[22px] text-yellow-600 rounded-md whitespace-nowrap">
                                      {role}
                                    </span>
                                  )}

                                  {projectUrl && (
                                    <a
                                      href={projectUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs underline px-2 py-1 rounded hover:bg-gray-100"
                                      title="Open project"
                                    >
                                      Open Project
                                    </a>
                                  )}
                                </div>
                              </div>

                              {post?.created_at && (
                                <p className="text-[11px] text-gray-400 mt-2">
                                  Added: {new Date(post.created_at).toLocaleDateString()}
                                </p>
                              )}

                              {description && (
                                <p className="text-xs text-gray-600 mt-2 line-clamp-3">{description}</p>
                              )}
                            </div>

                            {/* Locked Overlay — visible and interactive */}
                            {isLocked && (
                              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-lg bg-white/80 backdrop-blur-sm text-center p-4">
                                <p className="text-gray-700 text-sm font-semibold mb-2">Upgrade to Premium</p>
                                <p className="text-xs text-gray-500 mb-3">Unlock all your portfolio items and more!</p>
                                <button
                                  onClick={() => navigate("/featured")}
                                  className="z-30 bg-orange-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-orange-600"
                                >
                                  View Plans
                                </button>
                              </div>
                            )}
                          </article>

                        );
                      })}
                    </div>
                  ) : (
                    !loading && (
                      <div className="text-center py-6">
                        <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-gray-100">
                          <BiCloudUpload className="h-7 w-7" />
                        </div>
                        <p className="text-sm font-medium">No Portfolio Work Added Yet</p>
                        <button
                          onClick={() => setWorkOpen(true)}
                          className="bg-teal-500 text-white px-4 py-2 rounded-md text-xs font-semibold w-full sm:w-auto mt-3"
                        >
                          + Add Your First Portfolio Work
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Activity & Blog (posts) */}
            <div className="bg-white border rounded-lg p-0 overflow-hidden mt-6">
              <button
                type="button"
                onClick={() => setOpenActivity((v) => !v)}
                aria-expanded={openActivity}
                className="w-full flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-sm flex items-center gap-2">
                    <PencilIcon className="h-5 w-5" /> {t("guest.activity_blog_title")}
                  </h3>
                </div>

                <svg
                  className={`w-4 h-4 transform transition-transform ${openActivity ? "rotate-180" : "rotate-0"}`}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {openActivity && (
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center mb-4 gap-3 sm:gap-0">
                    {/* <h3 className="text-sm flex items-center gap-2 justify-center text-center sm:justify-start sm:text-left w-full sm:w-auto">
                      <PencilIcon className="h-5 w-5" /> {t("guest.activity_blog_title")}
                    </h3> */}

                    <button
                      onClick={openCreate}
                      className="bg-teal-500 text-white px-4 py-2 text-xs font-semibold rounded-md hover:bg-teal-600 w-full sm:w-auto"
                    >
                      + {t("guest.create_post")}
                    </button>
                  </div>

                  {!loading && posts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {posts.map((post) => (
                        <article key={post.id} className="flex flex-col sm:flex-row gap-4 border p-4 rounded-lg items-center sm:items-start">
                          <img
                            src={post.image || post.image_url || ""}
                            alt={post.title || t("guest.untitled")}
                            loading="lazy"
                            className="w-24 h-24 object-cover rounded-md flex-shrink-0 mx-auto sm:mx-0"
                          />

                          <div className="flex-1 min-w-0 text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                              <div className="min-w-0">
                                <h4 className="font-semibold text-sm truncate">{post.title}</h4>
                                <p className="text-xs text-gray-600 mt-1 truncate">{post.dsc}</p>
                              </div>

                              <div className="mt-2 sm:mt-0 flex items-center gap-2">
                                <span className="inline-block text-[10px] px-2 py-1 bg-yellow-100 max-h-[22px] text-yellow-600 rounded-md whitespace-nowrap mx-auto sm:mx-0">
                                  {post.type}
                                </span>

                                <button
                                  onClick={() => openEdit(post)}
                                  className="p-1 rounded hover:bg-gray-100"
                                  title="Edit"
                                  aria-label="Edit"
                                >
                                  <PencilIcon className="h-4 w-4 text-gray-600" />
                                </button>

                                <button
                                  onClick={() => handleDelete(post.id)}
                                  className="p-1 rounded hover:bg-gray-100"
                                  title="Delete"
                                  aria-label="Delete"
                                >
                                  <TrashIcon className="h-4 w-4 text-red-500" />
                                </button>
                              </div>
                            </div>

                            <p className="text-xs text-gray-600 mt-2 line-clamp-3">
                              {post.content}
                            </p>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    !loading && (
                      <div className="text-center py-6">
                        <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-gray-100">
                          <PencilIcon className="h-7 w-7" />
                        </div>
                        <p className="text-sm font-medium">{t("guest.posts_empty_title")}</p>
                        <p className="text-xs text-gray-500 mb-4">{t("guest.posts_empty_desc")}</p>
                        <button onClick={openCreate} className="bg-teal-500 text-white px-4 py-2 rounded-md text-xs font-semibold w-full sm:w-auto">
                          + {t("guest.create_your_first_post")}
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Job Applications Section (dynamic) */}
            <div className="bg-white border rounded-lg p-0 overflow-hidden mt-6">
              <button
                type="button"
                onClick={() => setOpenJobs(v => !v)}
                aria-expanded={openJobs}
                className="w-full flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-sm flex items-center gap-2">
                    <BriefcaseIcon className="h-5 w-5" /> {t("guest.job_applications_title")}
                  </h3>
                  <span className="text-xs text-gray-500">{/* optional subtitle */}</span>
                </div>

                <svg
                  className={`w-4 h-4 transform transition-transform ${openJobs ? "rotate-180" : "rotate-0"}`}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {openJobs && (
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center mb-4 gap-3 sm:gap-0">
                    {/* <h3 className="text-sm flex items-center gap-2">
                      <BriefcaseIcon className="h-5 w-5" /> {t("guest.job_applications_title")}
                    </h3> */}
                    <button
                      onClick={() => navigate("/jobs")}
                      className="border px-3 py-1 text-xs rounded-md hover:bg-gray-100 w-full sm:w-auto"
                    >
                      {t("guest.browse_jobs")}
                    </button>
                  </div>

                  {jobsLoading ? (
                    <div className="text-sm text-gray-600">Loading jobs…</div>
                  ) : jobsError ? (
                    <div className="text-sm text-red-500">{jobsError}</div>
                  ) : jobsList.length === 0 ? (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-gray-100">
                        <BriefcaseIcon className="h-7 w-7" />
                      </div>
                      <p className="text-sm font-medium">{t("guest.no_applications") || "No jobs available"}</p>
                      <p className="text-xs text-gray-500 mb-4">{t("guest.no_applications_desc") || "Check back later or browse all jobs."}</p>
                      <button
                        onClick={() => navigate("/jobs")}
                        className="bg-teal-500 text-white font-semibold px-4 py-2 rounded-md text-xs w-full sm:w-auto"
                      >
                        {t("guest.browse_available_jobs")}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {jobsList.map((job) => (
                        <div key={job.id} className="border rounded-md p-3 flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <div className="min-w-0">
                                <h4 className="font-semibold text-sm truncate">{job.title}</h4>
                                <p className="text-xs text-gray-600 truncate">{job.location} • {job.schedule_type}</p>
                              </div>
                              <div className="ml-2">
                                <span className="text-[10px] px-2 py-1 bg-yellow-100 text-yellow-600 rounded-md">
                                  {job.via || "Source"}
                                </span>
                              </div>
                            </div>

                            <p className="text-xs text-gray-600 mt-2 line-clamp-3 hidden sm:block">
                              {job.description?.slice(0, 200)}{job.description && job.description.length > 200 ? "…" : ""}
                            </p>

                            {/* apply buttons */}
                            <div className="mt-3 flex flex-wrap gap-2">
                              {Array.isArray(job.apply_options) && job.apply_options.length > 0 ? (
                                job.apply_options.slice(0, 3).map((opt) => (
                                  <button
                                    key={opt.id}
                                    onClick={() => handleApply(job, opt)}
                                    className="text-xs px-3 py-1 border rounded-md hover:bg-gray-50"
                                  >
                                    {opt.title}
                                  </button>
                                ))
                              ) : (
                                <button
                                  onClick={() => handleApply(job)}
                                  className="text-xs px-3 py-1 bg-teal-500 text-white rounded-md"
                                >
                                  Apply
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Posted Job Listing */}
            {hasActiveSubscription ? (
              <div className="bg-white border rounded-lg p-0 overflow-hidden mt-6">
                <button
                  type="button"
                  onClick={() => setOpenPosted(v => !v)}
                  aria-expanded={openPosted}
                  className="w-full flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm flex items-center gap-2">
                      <Building2 className="h-5 w-5" /> Posted Jobs
                    </h3>
                  </div>

                  <svg
                    className={`w-4 h-4 transform transition-transform ${openPosted ? "rotate-180" : "rotate-0"}`}
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {openPosted && (
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center mb-4 gap-3 sm:gap-0">
                      {/* <h3 className="text-sm flex items-center gap-2">
                        <Building2 className="h-5 w-5" /> Posted Jobs
                      </h3> */}
                      <button
                        onClick={() => setPostJobOpen(true)}
                        className="bg-teal-500 text-white font-semibold px-3 py-2 text-xs rounded-md  w-full sm:w-auto"
                      >
                        + Post Job
                      </button>
                    </div>

                    {jobsPostLoading ? (
                      <div className="text-sm text-gray-600">Loading jobs…</div>
                    ) : jobsPostError ? (
                      <div className="text-sm text-red-500">{jobsPostError}</div>
                    ) : jobsPostData.length === 0 ? (
                      <div className="text-center py-6">
                        <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-gray-100">
                          <Building2 className="h-7 w-7" />
                        </div>
                        <p className="text-sm font-regular my-2">No jobs posted yet</p>
                        <button
                          onClick={() => setPostJobOpen(true)}
                          className="bg-teal-500 text-white font-semibold px-4 py-2 rounded-md text-xs w-full sm:w-auto"
                        >
                          + Post Your First Job
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {jobsPostData.map((job) => (
                          <article
                            key={job.id ?? job.uuid}
                            className="border rounded-lg p-4 shadow-sm bg-white flex flex-col space-y-3"
                          >
                            <h4 className="text-md font-semibold leading-tight">{job.title}</h4>
                            {job.description && (
                              <p className="text-sm text-gray-700">
                                <strong>Description:</strong> {job.description}
                              </p>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-xs text-gray-600">
                              <div><strong>Company:</strong> {job.company?.company_name ?? "Company"}</div>
                              <div><strong>Rate:</strong> {job.rate ? `${job.rate} ${job.rate_type ?? ''}` : '-'}</div>
                              <div><strong>Schedule:</strong> {job.schedule_type ?? '-'}</div>
                              <div><strong>Source:</strong> {job.via ?? '-'}</div>
                              <div><strong>Job ID:</strong> {job.uuid ?? '-'}</div>
                              <div><strong>Posted:</strong> {formatDateShort(job.posted_at ?? job.created_at)}</div>
                              <div><strong>Updated:</strong> {formatDateShort(job.updated_at)}</div>
                              <div><strong>Location:</strong> {formatLocation(job.location)}</div>
                              {job.cultural_identifiers && (
                                <div><strong>Cultural Identifiers:</strong> {job.cultural_identifiers}</div>
                              )}
                            </div>

                            {(job.job_highlights || []).length > 0 && (
                              <div className="space-y-2">
                                {job.job_highlights.map((section) => (
                                  <div key={section.id}>
                                    <div className="text-xs font-medium">{section.title}</div>
                                    <ul className="list-disc pl-5 text-xs text-gray-700">
                                      {(section.items || []).map((it, idx) => (
                                        <li key={idx}>{it}</li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            )}

                            {(job.applyOptions || []).length > 0 && (
                              <div className="mt-2 flex flex-col space-y-2">
                                {job.applyOptions.map((opt, i) => (
                                  <a
                                    key={i}
                                    href={opt.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs font-semibold px-3 py-1 rounded border hover:bg-gray-100 w-fit"
                                  >
                                    {opt.title ?? "Apply"}
                                  </a>
                                ))}
                              </div>
                            )}
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}

          </div>

          {/* Right Side */}
          <div className="space-y-6">
            {/* Upgrade Card */}
            <div className="bg-white border border-orange-400 rounded-lg p-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-orange-500 text-white w-12 h-12 flex items-center justify-center rounded-full mb-3">
                  <Crown className="text-2xl" />
                </div>
                <h3 className="font-bold text-md mb-1">{t("guest.unlock_title")}</h3>
                <p className="text-xs text-gray-500 mb-4">{t("guest.unlock_subtitle")}</p>
              </div>

              {hasActiveSubscription && planDetails ? (
                <div className="text-xs text-left space-y-3 mb-3">
                  <span className="text-xs font-semibold bg-green-100 text-gray-600 px-2 py-1 rounded-xl">
                    {subscription ? (subscription.status === "active" ? t("guest.plan_active") : t("guest.plan_inactive")) : t("guest.plan_free")}
                  </span>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{planDetails.title}</p>
                      <p className="text-[11px] text-gray-500">{planDetails.description}</p>
                    </div>
                    <div className="text-right">
                      {planPriceDisplay && <div className="font-semibold">{planPriceDisplay}</div>}
                      {subscriptionExpiry && <div className="text-[11px] text-gray-500">Expires: {subscriptionExpiry}</div>}
                    </div>
                  </div>

                  <div className="text-[12px]">
                    <p className="font-medium mb-1">Plan includes:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      {planDetails.features?.length ? (
                        planDetails.features.map((f) => (
                          <li key={f.id} className="text-xs">{f.name ?? f}</li>
                        ))
                      ) : (
                        <li className="text-xs">{t("guest.upgrade_default_features")}</li>
                      )}
                    </ul>
                  </div>
                </div>
              ) : (
                <>
                  <ul className="text-xs space-y-2 text-left">
                    <li className="text-green-600">✔ {t("guest.upgrade.featured")}</li>
                    <li className="text-green-600">✔ {t("guest.upgrade.follow")}</li>
                    <li className="text-green-600">✔ {t("guest.upgrade.like")}</li>
                    <li className="text-green-600">✔ {t("guest.upgrade.story")}</li>
                    <li className="text-orange-500">★ {t("guest.upgrade.badge")}</li>
                  </ul>

                  <div className="mt-4 text-xs bg-orange-50 text-orange-600 border border-orange-600 px-3 py-2 rounded-md">
                    {t("guest.upgrade_limited")}
                  </div>
                </>
              )}

              <div className="mt-3 space-y-2">
                <button
                  onClick={() => navigate("/featured")}
                  className="w-full text-xs hover:bg-orange-500 hover:text-white py-2 rounded-md font-medium bg-white border border-orange-500 text-orange-500"
                >
                  {premiumPrice.price ? `${premiumPrice.symbol} ${premiumPrice.price} • ${t("guest.premium_monthly_cta")}` : t("guest.founding_member_cta")}
                </button>

                <button
                  onClick={() => navigate("/featured")}
                  className="w-full text-xs border border-teal-500 text-teal-600 py-2 rounded-md font-medium hover:bg-teal-500 hover:text-white"
                >
                  {foundingPrice.price ? `${foundingPrice.symbol} ${foundingPrice.price} • ${t("guest.founding_member_cta")}` : t("guest.premium_monthly_cta")}
                </button>

                {/* {hasActiveSubscription ? (
                  <button
                    onClick={() => navigate("/subscription/manage")}
                    className="w-full text-xs mt-2 bg-gray-100 text-gray-700 py-2 rounded-md font-medium"
                  >
                    {t("guest.manage_subscription") || "Manage subscription"}
                  </button>
                ) : null} */}
              </div>
            </div>

            {/* Account Includes */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-normal text-sm mb-3">{t("guest.account_includes_title")}</h3>
              <ul className="space-y-3 text-xs">
                {/* <li className="flex justify-between items-center">
                  <span className="flex items-center  gap-2">
                    <BiCloudUpload className="text-teal-500 h-4 w-4" /> {t("guest.includes.portfolio_uploads")}
                  </span>
                  <span className="bg-green-100 text-green-600 font-semibold text-xs px-2 py-1 rounded-md">{t("guest.includes.unlimited")}</span>
                </li> */}
                <li className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <BiImage className="text-teal-500 h-4 w-4" /> {t("guest.includes.images_videos")}
                  </span>
                  <span className="bg-green-100 text-green-600 font-semibold text-xs px-2 py-1 rounded-md">{t("guest.includes.unlimited")}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <PencilIcon className="text-teal-500 h-4 w-4" /> {t("guest.includes.blog_posts")}
                  </span>
                  <span className="bg-green-100 text-green-600 font-semibold text-xs px-2 py-1 rounded-md">{t("guest.includes.unlimited")}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <BriefcaseIcon className="text-teal-500 h-4 w-4" /> {t("guest.includes.job_applications")}
                  </span>
                  <span className="bg-green-100 text-green-600 font-semibold text-xs px-2 py-1 rounded-md">{t("guest.includes.unlimited")}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <BiSearch className="text-teal-500 h-4 w-4" /> {t("guest.includes.directory_listing")}
                  </span>
                  <span className="bg-green-100 text-green-600 font-semibold text-xs px-2 py-1 rounded-md">{t("guest.includes.included")}</span>
                </li>
              </ul>
            </div>

            {/* Current Plan */}
            <div className="bg-white border rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-normal text-sm">
                  {t("guest.current_plan_title")}: {subscription?.plan?.title ? subscription.plan.title : (payload?.data?.subcription?.plan_id ? t("guest.plan_paid") : t("guest.plan_free"))}
                </h3>
                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-xl">
                  {subscription ? (subscription.status === "active" ? t("guest.plan_active") : t("guest.plan_inactive")) : t("guest.plan_free")}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6 text-xs">
                <div>
                  <p className="text-black font-medium mb-2">{t("guest.billing.title")}</p>
                  <p className="text-gray-500">{t("guest.billing.price")}</p>
                  <p className="font-medium mb-2"> {foundingPrice.symbol} {user?.plan?.pricing?.price}</p>

                  <p className="text-gray-500">{t("guest.billing.cycle")}</p>
                  <p className="font-medium mb-2">{planDetails?.billing_cycle ?? t("guest.billing.free")}</p>

                  <p className="text-gray-500">{t("guest.billing.member_since")}</p>
                  <p className="font-medium">{subscriptionExpiry ?? memberSince}</p>

                  <div className="mt-3">
                    {hasActiveSubscription ? (
                      <button onClick={() => setPostJobOpen(true)} className="w-full mt-2 bg-teal-500 text-white py-1.5 rounded-md text-xs font-semibold">
                        Post a job
                      </button>
                    ) : (
                      <button onClick={() => navigate("/featured")} className="w-full mt-4 bg-teal-500 text-white py-1.5 rounded-md text-xs font-semibold">
                        {t("guest.upgrade_button")}
                      </button>
                    )}
                    <p className="text-[10px] text-gray-500 mt-1 text-center">{t("guest.upgrade_hint")}</p>
                  </div>
                </div>

                <div>
                  <p className="text-black font-medium mb-2">{t("guest.plan_features_title")}</p>
                  <ul className="space-y-2 text-xs">
                    {planDetails?.features?.length ? (
                      planDetails.features.map((f) => (
                        <li key={f.id} className="flex items-center gap-2 text-gray-700"><span className="text-green-500">✔</span> {f.name}</li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-center gap-2 text-gray-700"><span className="text-green-500">✔</span> {t("guest.features.basic_profile")}</li>
                        <li className="flex items-center gap-2 text-gray-700"><span className="text-green-500">✔</span> {t("guest.features.unlimited_portfolio")}</li>
                        <li className="flex items-center gap-2 text-gray-700"><span className="text-green-500">✔</span> {t("guest.features.job_applications")}</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>


            {/* Account Usage */}
            <div className="bg-white border rounded-lg p-6 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <StarIcon className="h-5 w-5" />
                <h3 className="font-normal text-sm">{t("guest.account_usage_title")}</h3>
              </div>

              <div className="grid lg:grid-cols-3 gap-4 break-words text-center">
                <div className="bg-gray-50 rounded-md py-4">
                  <p className="text-2xl font-bold text-teal-500">{payload?.data?.profile_views ?? 0}</p>
                  <p className="text-xs text-gray-500">{t("guest.usage.profile_views")}</p>
                  <p className="text-[11px] text-orange-500 font-medium">+23 {t("guest.usage.this_month")}</p>
                </div>
                <div className="bg-gray-50 rounded-md py-4">
                  <p className="text-2xl font-bold text-orange-500">{portfolioCount}</p>
                  <p className="text-xs text-gray-500">{t("guest.usage.portfolio_items")}</p>
                  <p className="text-[11px] text-teal-400">{t("guest.usage.unlimited_uploads")}</p>
                </div>
                <div className="bg-gray-50 rounded-md py-4">
                  <p className="text-2xl font-bold text-teal-500">{payload?.data?.orders_count ?? 0}</p>
                  <p className="text-xs text-gray-500">{t("guest.usage.job_applications")}</p>
                  <p className="text-[11px] text-orange-500 font-medium">+3 {t("guest.usage.this_week")}</p>
                </div>
              </div>
            </div>

            {/* Profile Stats */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-semibold text-sm mb-3">{t("guest.profile_stats_title")}</h3>
              <ul className="space-y-2 text-xs font-light">
                <li className="flex justify-between"><span>{t("guest.stats.profile_views")}</span><span className="font-bold">{payload?.data?.profile_views ?? 0}</span></li>
                <li className="flex justify-between"><span>{t("guest.stats.portfolio_items")}</span><span className="font-bold">{portfolioCount}</span></li>
                <li className="flex justify-between"><span>{t("guest.stats.blog_posts")}</span><span className="font-bold">{postsCount}</span></li>
                <li className="flex justify-between"><span>{t("guest.stats.job_applications")}</span><span className="font-bold">{payload?.data?.orders_count ?? 0}</span></li>
                <li className="flex justify-between"><span>{t("guest.stats.member_since")}</span><span className="font-bold">{memberSince}</span></li>
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-semibold mb-3">{t("guest.quick_actions_title")}</h3>
              <ul className="space-y-2 text-xs font-bold">
                <li onClick={() => setWorkOpen(true)} className="flex items-center justify-between border px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer">
                  <span className="flex items-center gap-2"><BiCloudUpload className="h-4 w-4" /> {t("guest.quick.upload_work")}</span>
                </li>
                <li onClick={openCreate} className="flex items-center justify-between border px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer">
                  <span className="flex items-center gap-2"><PencilIcon className="h-4 w-4" /> {t("guest.quick.write_blog")}</span>
                </li>
                <li onClick={() => navigate("/jobs")} className="flex items-center justify-between border px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer">
                  <span className="flex items-center gap-2"><BriefcaseIcon className="h-4 w-4" /> {t("guest.quick.browse_jobs")}</span>
                </li>
                <li onClick={() => setListingOpen(true)} className="flex items-center justify-between border px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer">
                  <span className="flex items-center gap-2"><Building2 className="h-4 w-4" /> Add Business Listing</span>
                </li>
                <li onClick={handleInboxClick} className="flex items-center justify-between border px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer">
                  <span className="flex items-center gap-2"><MessageCircleMoreIcon className="h-4 w-4" />	Go to Inbox </span>
                </li>
                {/* <li onClick={() => setPhotoIsOpen(true)} className="flex items-center justify-between border px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer">
                  <span className="flex items-center gap-2"><CameraIcon className="h-4 w-4" /> {t("guest.quick.update_photo")}</span>
                </li> */}
                {hasActiveSubscription ? (
                  <li onClick={() => setPostJobOpen(true)} className="flex items-center justify-between border px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer">
                    <span className="flex items-center gap-2"><Plus className="h-4 w-4" />Post a job</span>
                  </li>
                ) : null}
                <li onClick={() => navigate("/featured")} className="flex items-center justify-between border px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer">
                  <span className="flex items-center gap-2"><BiMoney className="h-4 w-4" />Upgrade to Premium</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <PostJobPopupModal
        isOpen={isPostJobOpen}
        setIsOpen={setPostJobOpen}
        editingJob={null}
        onSaved={handleModalSaved}
      />

      <CreatePostPopupModel
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSuccess={handleModalSaved}
        editingPost={editingPost}
      />

      <UploadProfileModal isOpen={isPhotoOpen} onClose={() => setPhotoIsOpen(false)} uuid={uuid} onSaved={handleModalSaved} />

      <UploadCoverPhotoModal isOpen={isCoverPhotoOpen} onClose={() => setCoverPhotoIsOpen(false)} uuid={uuid} onSaved={handleModalSaved} />

      <PortfolioModal isOpen={isWorkOpen} onClose={() => setWorkOpen(false)} initialData={{
        ...user,
        ...profile,
        ...payload?.data,
        ...seller,
      }} onSaved={handleModalSaved} />

      <StepModalManager
        stepKey={activeStep}
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setActiveStep(null); }}
        initialData={{
          ...user,
          ...profile,
          ...payload?.data,
          ...seller,
        }}
        uuid={uuid}
        onSaved={handleModalSaved}
      />

      <BusinessListingModal isOpen={listingOpen} onClose={() => setListingOpen(false)} />
    </div>
  );
};

export default GuestDashboardPage;
