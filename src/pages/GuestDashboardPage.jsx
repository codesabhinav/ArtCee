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
import { getGuestDashboardData, getPostData, JobsData } from "../Hooks/useSeller";
import { Crown, LogOut, Star } from "lucide-react";
import StepModalManager from "../modal/dashboard models/StepModalManager";
import ProfileSteps from "../components/ProfileSteps";
import UploadProfileModal from "../modal/dashboard models/UploadProfileModal";
import Cookies from "js-cookie";
import { RiLogoutCircleRLine } from "react-icons/ri";
import toast from "react-hot-toast";
import PortfolioModal from "../modal/dashboard models/PortfolioModal";

const GuestDashboardPage = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payload, setPayload] = useState(null);
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [isPhotoOpen, setPhotoIsOpen] = useState(false);
  const [isWorkOpen, setWorkOpen] = useState(false);

  const [jobsList, setJobsList] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState(null);

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

  useEffect(() => {
    let mounted = true;
    // fetch dashboard when component mounts
    fetchDashboard();

    return () => {
      mounted = false;
    };
  }, [fetchDashboard]);

  // fetch jobs on page load
  useEffect(() => {
    let mounted = true;
    setJobsLoading(true);
    setJobsError(null);

    JobsData({ page: 1 })
      .then(({ jobs }) => {
        if (!mounted) return;
        setJobsList(jobs || []);
      })
      .catch((err) => {
        if (!mounted) return;
        setJobsError(err?.message || "Failed to load jobs");
      })
      .finally(() => {
        if (!mounted) return;
        setJobsLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    setLoading(true);
    getPostData(page)
      .then(({ posts, meta }) => {
        setPosts(posts);
        setMeta(meta);
      })
      .catch((err) => console.error(err?.message || t("guest.posts_load_error")))
      .finally(() => setLoading(false));
  }, [page, t]);

  const user = payload?.user ?? {};
  const seller = payload?.seller ?? null;
  const sellerUser = seller?.user ?? user?.seller?.user ?? null;
  const profile = payload?.data?.profile ?? user?.profile ?? sellerUser?.profile ?? null;

  // location (prefer user.location, fall back to seller.user.location)
  const location = user?.location ?? sellerUser?.location ?? null;
  const city = location?.city?.name ?? null;
  const state = location?.state?.name ?? null;
  const country = location?.country?.name ?? null;

  const data = payload?.data ?? {};
  const uuid = user?.uuid ?? user?.id ?? null;

  const fullName = user?.full_name ?? profile?.title ?? t("guest.default_name");
  const roleDisplay = (user?.role && user.role[0]?.display_name) ?? t("guest.default_role");
  const avatar = profile?.profile_picture ?? "https://img.freepik.com/premium-photo/memoji-emoji-handsome-smiling-man-white-background_826801-6987.jpg?semt=ais_hybrid&w=740&q=80";
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
    Cookies.remove("token");
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
    } catch (err) {
      console.warn("Failed to refresh dashboard after modal save:", err);
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
            {/* Profile Card */}
            <div className="bg-white border rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <img
                  src={avatar}
                  alt={fullName}
                  className="w-16 h-16 rounded-full mx-auto sm:mx-0 object-cover"
                />
                <div className="text-center sm:text-left">
                  <h2 className="text-base sm:text-lg font-bold">{fullName}</h2>
                  <p className="text-gray-500 text-sm">{title}</p>
                  <div className="flex flex-row">
                    <p className="text-xs text-gray-500 mt-1 flex flex-row items-center gap-1">
                      <FaMapMarkerAlt /> {city ?? t("guest.unknown")}, {state ?? t("guest.unknown")}, {country ?? t("guest.unknown")}
                    </p>
                    <p className="text-xs text-gray-500 mx-5 mt-1 flex flex-row items-center gap-1">
                      <Star className="h-3 w-3" /> {rating}/{t("guest.rating_scale")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-600 text-center sm:text-left mt-4 line-clamp-2">
                {bio || t("guest.no_bio")}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 text-center mt-6 gap-4">
                <div>
                  <p className="font-bold">{followers}</p>
                  <p className="text-xs text-gray-500">{t("guest.stats.followers")}</p>
                </div>
                <div>
                  <p className="font-bold">{portfolioCount}</p>
                  <p className="text-xs text-gray-500">{t("guest.stats.portfolio")}</p>
                </div>
                <div>
                  <p className="font-bold">{servicesCount}</p>
                  <p className="text-xs text-gray-500">{t("guest.stats.services")}</p>
                </div>
                <div>
                  <p className="font-bold">{yearsExp}</p>
                  <p className="text-xs text-gray-500">{t("guest.stats.years")}</p>
                </div>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-white border rounded-lg p-6 mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center  mb-3 gap-2">
                <h3 className="font-regular text-sm">{t("guest.profile_completion_title")}</h3>
                <span className="text-xs font-medium bg-yellow-100 text-yellow-600 px-3 py-1 rounded-md w-fit">
                  {progress >= 100 ? t("guest.profile_complete") : t("guest.profile_incomplete")}
                </span>
              </div>

              <p className="text-xs text-gray-500 mb-4">
                {data.progress_percentage ?? 0}/100 {t("guest.completed_of")} – {progress}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-black h-2 rounded-full"
                  style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
                />
              </div>

              <ProfileSteps data={data} openStepModal={openStepModal} />
            </div>

            {/* Activity & Blog (posts) */}
            <div className="bg-white border rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3 sm:gap-0">
                <h3 className="text-sm flex items-center gap-2 justify-center text-center sm:justify-start sm:text-left w-full sm:w-auto">
                  <PencilIcon className="h-5 w-5" /> {t("guest.activity_blog_title")}
                </h3>

                <button
                  onClick={() => setIsOpen(true)}
                  className="bg-teal-500 text-white px-4 py-2 text-xs rounded-md hover:bg-teal-600 w-full sm:w-auto"
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

                          <div className="mt-2 sm:mt-0">
                            <span className="inline-block text-[10px] px-2 py-1 bg-yellow-100 max-h-[22px] text-yellow-600 rounded-md whitespace-nowrap mx-auto sm:mx-0">
                              {post.type}
                            </span>
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
                    <button className="bg-teal-500 text-white px-4 py-2 rounded-md text-xs w-full sm:w-auto">
                      + {t("guest.create_your_first_post")}
                    </button>
                  </div>
                )
              )}
            </div>

            {/* Job Applications Section (dynamic) */}
            <div className="bg-white border rounded-lg p-6 mt-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3 sm:gap-0">
                <h3 className="text-sm flex items-center gap-2">
                  <BriefcaseIcon className="h-5 w-5" /> {t("guest.job_applications_title")}
                </h3>
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
                  <p className="text-sm font-medium">{t("guest.no_jobs_title") || "No jobs available"}</p>
                  <p className="text-xs text-gray-500 mb-4">{t("guest.no_jobs_desc") || "Check back later or browse all jobs."}</p>
                  <button
                    onClick={() => navigate("/jobs")}
                    className="bg-teal-500 text-white px-4 py-2 rounded-md text-xs w-full sm:w-auto"
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

              <button onClick={() => navigate("/featured")} className="w-full text-xs mt-3 bg-orange-500 text-white py-2 rounded-md font-medium">
                {t("guest.founding_member_cta")}
              </button>
              <button onClick={() => navigate("/featured")} className="w-full text-xs mt-3 border border-teal-500 text-teal-600 py-2 rounded-md font-medium hover:bg-gray-200">
                {t("guest.premium_monthly_cta")}
              </button>
            </div>

            {/* Account Includes */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-normal text-sm mb-3">{t("guest.account_includes_title")}</h3>
              <ul className="space-y-3 text-xs">
                <li className="flex justify-between items-center">
                  <span className="flex items-center  gap-2">
                    <BiCloudUpload className="text-teal-500 h-4 w-4" /> {t("guest.includes.portfolio_uploads")}
                  </span>
                  <span className="bg-green-100 text-green-600 font-semibold text-xs px-2 py-1 rounded-md">{t("guest.includes.unlimited")}</span>
                </li>
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
                <h3 className="font-normal text-sm">{t("guest.current_plan_title")}: {payload?.data?.subcription?.plan_id ? t("guest.plan_paid") : t("guest.plan_free")}</h3>
                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-xl">
                  {payload?.data?.subcription?.status === "active" ? t("guest.plan_active") : t("guest.plan_inactive")}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6 text-xs">
                <div>
                  <p className="text-black font-medium mb-2">{t("guest.billing.title")}</p>
                  <p className="text-gray-500">{t("guest.billing.price")}</p>
                  <p className="font-medium mb-2">{payload?.data?.subcription?.plan_id ? "$" + payload?.data?.subcription?.plan_id : "$0"}</p>

                  <p className="text-gray-500">{t("guest.billing.cycle")}</p>
                  <p className="font-medium mb-2">{payload?.data?.subcription?.status === "active" ? t("guest.billing.paid") : t("guest.billing.free")}</p>

                  <p className="text-gray-500">{t("guest.billing.member_since")}</p>
                  <p className="font-medium">{memberSince}</p>

                  <button onClick={() => navigate("/featured")} className="w-full mt-4 bg-teal-500 text-white py-1.5 rounded-md text-xs font-semibold">
                    {t("guest.upgrade_button")}
                  </button>
                  <p className="text-[10px] text-gray-500 mt-1 text-center">{t("guest.upgrade_hint")}</p>
                </div>

                <div>
                  <p className="text-black font-medium mb-2">{t("guest.plan_features_title")}</p>
                  <ul className="space-y-2 text-xs">
                    <li className="flex items-center gap-2 text-gray-700"><span className="text-green-500">✔</span> {t("guest.features.basic_profile")}</li>
                    <li className="flex items-center gap-2 text-gray-700"><span className="text-green-500">✔</span> {t("guest.features.unlimited_portfolio")}</li>
                    <li className="flex items-center gap-2 text-gray-700"><span className="text-green-500">✔</span> {t("guest.features.job_applications")}</li>
                    <li className="flex items-center gap-2 text-gray-700"><span className="text-green-500">✔</span> {t("guest.features.directory_listing")}</li>
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
                <li onClick={() => setWorkOpen(true)} className="flex items-center justify-between border px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
                  <span className="flex items-center gap-2"><BiCloudUpload className="h-4 w-4" /> {t("guest.quick.upload_work")}</span>
                </li>
                <li onClick={() => setIsOpen(true)} className="flex items-center justify-between border px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
                  <span className="flex items-center gap-2"><PencilIcon className="h-4 w-4" /> {t("guest.quick.write_blog")}</span>
                </li>
                <li onClick={() => navigate("/jobs")} className="flex items-center justify-between border px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
                  <span className="flex items-center gap-2"><BriefcaseIcon className="h-4 w-4" /> {t("guest.quick.browse_jobs")}</span>
                </li>
                <li onClick={() => setPhotoIsOpen(true)} className="flex items-center justify-between border px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
                  <span className="flex items-center gap-2"><CameraIcon className="h-4 w-4" /> {t("guest.quick.update_photo")}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <CreatePostPopupModel isOpen={isOpen} setIsOpen={setIsOpen} onSuccess={handleModalSaved}/>

      <UploadProfileModal isOpen={isPhotoOpen} onClose={() => setPhotoIsOpen(false)} uuid={uuid} onSaved={handleModalSaved}/>

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
    </div>
  );
};

export default GuestDashboardPage;
