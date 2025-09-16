// GuestDashboardPage.jsx
import {
  BriefcaseIcon,
  CameraIcon,
  PencilIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import {
  BiCloudUpload,
  BiImage,
  BiSearch,
} from "react-icons/bi";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaChevronRight,
  FaCrown,
  FaMapMarkerAlt,
  FaRegCircle,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import CreatePostPopupModel from "../modal/CreatePostPopupModel";
import { useTranslation } from "../contexts/LanguageProvider";
import SpinnerProvider from "../components/SpinnerProvider";
import { getGuestDashboardData, getPostData } from "../Hooks/useSeller";
import { Star } from "lucide-react";
import StepModalManager from "../modal/dashboard models/StepModalManager";
import ProfileSteps from "../components/ProfileSteps";
import UploadProfileModal from "../modal/dashboard models/UploadProfileModal";
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
  const [isPortfolioOpen, setPortfolioOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getGuestDashboardData()
      .then((res) => {
        if (!mounted) return;
        setPayload(res || {});
        setError(null);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.message || "Failed to load dashboard");
        setPayload(null);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    getPostData(page)
      .then(({ posts, meta }) => {
        setPosts(posts);
        setMeta(meta);
      })
      .catch((err) => console.error(err.message))
      .finally(() => setLoading(false));
  }, [page]);

  const user = payload?.user ?? {};
  const profile = payload?.data?.profile ?? user?.profile ?? user?.seller?.profile ?? null;

  // safe location extraction
  const sellerUser = user?.seller?.user ?? null;
  const city = user?.location?.city?.name ?? null;
  const state = user?.location?.state?.name ?? null;
  const country = user?.location?.country?.name ?? null;

  const data = payload?.data ?? {};
  const uuid = user?.uuid || user?.id || null;

  const fullName = user?.full_name || profile?.title || "Guest User";
  const roleDisplay = user?.role?.[0]?.display_name || "Creative Professional";
  const avatar = profile?.profile_picture || "https://img.freepik.com/premium-photo/memoji-emoji-handsome-smiling-man-white-background_826801-6987.jpg?semt=ais_hybrid&w=740&q=80";
  const bio = profile?.bio || "";
  const title = profile?.title || "Creative Professional";
  const followers = data?.following_count ?? 0;
  const portfolioCount = data?.portfolio_count ?? 0;
  const servicesCount = data?.services_count ?? 0;
  const yearsExp = user?.seller?.experience_in_year ?? data?.experience_in_year ?? 0;
  const progress = data?.progress_percentage ?? 0;
  const rating = user?.seller?.rating ?? 0;
  const totalReviews = profile?.total_reviews ?? 0;
  const memberSince = new Date(user?.created_at || profile?.created_at || Date.now()).toLocaleDateString();

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
            <h1 className="text-lg sm:text-xl font-bold"> Welcome, {fullName}</h1>
            <p className="text-sm font-light text-gray-600">
              {t("guest.manage_profile")}
            </p>
          </div>

          <span className="px-4 py-1 text-xs bg-gray-100 text-gray-500 font-medium rounded-md w-fit sm:ml-auto">
            {t("guest.free_account")}
          </span>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 mb-2">
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
                    <p className="text-xs text-gray-500 mt-1 flex flex-row items-center gap-1"> <FaMapMarkerAlt /> {city}, {state}, {country}</p>
                    <p className="text-xs text-gray-500 mx-5 mt-1 flex flex-row items-center gap-1"> <Star className="h-3 w-3" /> {rating}/5 </p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-600 text-center sm:text-left mt-4 line-clamp-2">
                {bio}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 text-center mt-6 gap-4">
                <div>
                  <p className="font-bold">{followers}</p>
                  <p className="text-xs text-gray-500">Followers</p>
                </div>
                <div>
                  <p className="font-bold">{portfolioCount}</p>
                  <p className="text-xs text-gray-500">Portfolio</p>
                </div>
                <div>
                  <p className="font-bold">{servicesCount}</p>
                  <p className="text-xs text-gray-500">Services</p>
                </div>
                <div>
                  <p className="font-bold">{yearsExp}</p>
                  <p className="text-xs text-gray-500">Years Exp</p>
                </div>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-white border rounded-lg p-6 mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center  mb-3 gap-2">
                <h3 className="font-regular text-sm">Profile Completion</h3>
                <span className="text-xs font-medium bg-yellow-100 text-yellow-600 px-3 py-1 rounded-md w-fit">
                  {progress >= 100 ? "Complete" : "Incomplete Profile"}
                </span>
              </div>

              <p className="text-xs text-gray-500 mb-4">
                {data.progress_percentage ?? 0}/100 completed – {progress}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-black h-2 rounded-full"
                  style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
                />
              </div>

              {/* ProfileSteps component */}
              <ProfileSteps data={data} openStepModal={openStepModal} />
            </div>

            {/* Activity & Blog Section */}
            <div className="bg-white border rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3 sm:gap-0">
                <h3 className="text-sm flex items-center gap-2">
                  <PencilIcon className="h-5 w-5" /> Activity & Blog
                </h3>
                <button
                  onClick={() => setIsOpen(true)}
                  className="bg-teal-500 text-white px-4 py-2 text-xs rounded-md hover:bg-teal-600 w-full sm:w-auto"
                >
                  + Create Post
                </button>
              </div>

              {/* If posts exist, show them; otherwise show empty state */}
              {!loading && posts.length > 0 ? (
                <div className="grid gap-6">
                  {posts.map((post) => (
                    <div key={post.id} className="flex gap-4 border p-4 rounded-lg">
                      <img
                        src={post.image || post.image_url}
                        alt={post.title}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{post.title}</h4>
                        <p className="text-xs text-gray-600">{post.dsc}</p>
                        <p className="text-xs text-gray-600 line-clamp-3">{post.content}</p>
                      </div>
                      <div className="text-[10px] px-2 py-1 bg-yellow-100 max-h-[22px] text-yellow-600 rounded-md">
                        {post.type}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !loading && (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-gray-100">
                      <PencilIcon className="h-7 w-7" />
                    </div>
                    <p className="text-sm font-medium">
                      Start sharing your creative journey
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      Create blog posts to showcase your work, share insights, and
                      attract potential clients
                    </p>
                    <button className="bg-teal-500 text-white px-4 py-2 rounded-md text-xs w-full sm:w-auto">
                      + Create Your First Post
                    </button>
                  </div>
                )
              )}
            </div>


            {/* Job Applications Section */}
            <div className="bg-white border rounded-lg p-6 mt-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3 sm:gap-0">
                <h3 className="text-sm flex items-center gap-2">
                  <BriefcaseIcon className="h-5 w-5" /> Job Applications
                </h3>
                <button
                  onClick={() => navigate("/jobs")}
                  className="border px-3 py-1 text-xs rounded-md hover:bg-gray-100 w-full sm:w-auto"
                >
                  Browse Jobs
                </button>
              </div>

              <div className="text-center py-6">
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-gray-100">
                  <BriefcaseIcon className="h-7 w-7" />
                </div>
                <p className="text-sm font-medium">No applications yet</p>
                <p className="text-xs text-gray-500 mb-4">Start applying to creative jobs to track your progress here</p>
                <button
                  onClick={() => navigate("/jobs")}
                  className="bg-teal-500 text-white px-4 py-2 rounded-md text-xs w-full sm:w-auto"
                >
                  Browse Available Jobs
                </button>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            {/* Upgrade Card */}
            <div className="bg-white border border-orange-400 rounded-lg p-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-orange-500 text-white w-12 h-12 flex items-center justify-center rounded-full mb-3">
                  <FaCrown className="text-2xl" />
                </div>
                <h3 className="font-bold text-md mb-1">Unlock Social Features</h3>
                <p className="text-xs text-gray-500 mb-4">Get featured placement and unlock follow/like interactions</p>
              </div>

              <ul className="text-xs space-y-2 text-left">
                <li className="text-green-600">✔ Featured in Directory</li>
                <li className="text-green-600">✔ Follow Other Creatives</li>
                <li className="text-green-600">✔ Like & Support Content</li>
                <li className="text-green-600">✔ Story-First Spotlight</li>
                <li className="text-orange-500">★ Founding Member Badge</li>
              </ul>

              <div className="mt-4 text-xs bg-orange-50 text-orange-600 border border-orange-600 px-3 py-2 rounded-md">
                Limited Time: Founding Member pricing – Save $50!
              </div>

              <button onClick={() => navigate("/featured")} className="w-full text-xs mt-3 bg-orange-500 text-white py-2 rounded-md font-medium">
                Become Founding Member – $47
              </button>
              <button onClick={() => navigate("/featured")} className="w-full text-xs mt-3 border border-teal-500 text-teal-600 py-2 rounded-md font-medium hover:bg-gray-200">
                Premium Monthly – $29/mo
              </button>
            </div>

            {/* Account Includes */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-normal text-sm mb-3">Your Free Account Includes</h3>
              <ul className="space-y-3 text-xs">
                <li className="flex justify-between items-center">
                  <span className="flex items-center  gap-2">
                    <BiCloudUpload className="text-teal-500 h-4 w-4" /> Portfolio Uploads
                  </span>
                  <span className="bg-green-100 text-green-600 font-semibold text-xs px-2 py-1 rounded-md">Unlimited</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <BiImage className="text-teal-500 h-4 w-4" /> Images & Videos
                  </span>
                  <span className="bg-green-100 text-green-600 font-semibold text-xs px-2 py-1 rounded-md">Unlimited</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <PencilIcon className="text-teal-500 h-4 w-4" /> Blog Posts
                  </span>
                  <span className="bg-green-100 text-green-600 font-semibold text-xs px-2 py-1 rounded-md">Unlimited</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <BriefcaseIcon className="text-teal-500 h-4 w-4" /> Job Applications
                  </span>
                  <span className="bg-green-100 text-green-600 font-semibold text-xs px-2 py-1 rounded-md">Unlimited</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <BiSearch className="text-teal-500 h-4 w-4" /> Directory Listing
                  </span>
                  <span className="bg-green-100 text-green-600 font-semibold text-xs px-2 py-1 rounded-md">Included</span>
                </li>
              </ul>
            </div>

            {/* Current Plan */}
            <div className="bg-white border rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-normal text-sm">Current Plan: {payload?.data?.subcription?.plan_id ? "Paid" : "Free Account"}</h3>
                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-xl">
                  {payload?.data?.subcription?.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6 text-xs">
                <div>
                  <p className="text-black font-medium mb-2">Billing Information</p>
                  <p className="text-gray-500">Price:</p>
                  <p className="font-medium mb-2">{payload?.data?.subcription?.plan_id ? "$" + payload?.data?.subcription?.plan_id : "$0"}</p>

                  <p className="text-gray-500">Billing Cycle:</p>
                  <p className="font-medium mb-2">{payload?.data?.subcription?.status === "active" ? "Paid" : "Free"}</p>

                  <p className="text-gray-500">Member Since:</p>
                  <p className="font-medium">{memberSince}</p>

                  <button onClick={() => navigate("/featured")} className="w-full mt-4 bg-teal-500 text-white py-1.5 rounded-md text-xs font-semibold">
                    Upgrade to Premium
                  </button>
                  <p className="text-[10px] text-gray-500 mt-1 text-center">Unlock social features and premium placement</p>
                </div>

                <div>
                  <p className="text-black font-medium mb-2">Plan Features</p>
                  <ul className="space-y-2 text-xs">
                    <li className="flex items-center gap-2 text-gray-700"><span className="text-green-500">✔</span> Basic Profile</li>
                    <li className="flex items-center gap-2 text-gray-700"><span className="text-green-500">✔</span> Unlimited Portfolio Uploads</li>
                    <li className="flex items-center gap-2 text-gray-700"><span className="text-green-500">✔</span> Job Applications</li>
                    <li className="flex items-center gap-2 text-gray-700"><span className="text-green-500">✔</span> Basic Directory Listing</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Account Usage */}
            <div className="bg-white border rounded-lg p-6 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <StarIcon className="h-5 w-5" />
                <h3 className="font-normal text-sm">Account Usage</h3>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 rounded-md py-4">
                  <p className="text-2xl font-bold text-teal-500">{payload?.data?.profile_views ?? 342}</p>
                  <p className="text-xs text-gray-500">Profile Views</p>
                  <p className="text-[11px] text-orange-500 font-medium">+23 this month</p>
                </div>
                <div className="bg-gray-50 rounded-md py-4">
                  <p className="text-2xl font-bold text-orange-500">{portfolioCount}</p>
                  <p className="text-xs text-gray-500">Portfolio Items</p>
                  <p className="text-[11px] text-teal-400">Unlimited uploads</p>
                </div>
                <div className="bg-gray-50 rounded-md py-4">
                  <p className="text-2xl font-bold text-teal-500">{payload?.data?.orders_count ?? 12}</p>
                  <p className="text-xs text-gray-500">Job Applications</p>
                  <p className="text-[11px] text-orange-500 font-medium">+3 this week</p>
                </div>
              </div>
            </div>

            {/* Profile Stats */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-semibold text-sm mb-3">Profile Stats</h3>
              <ul className="space-y-2 text-xs font-light">
                <li className="flex justify-between"><span>Profile Views</span><span className="font-bold">{payload?.data?.profile_views ?? 42}</span></li>
                <li className="flex justify-between"><span>Portfolio Items</span><span className="font-bold">{portfolioCount}</span></li>
                <li className="flex justify-between"><span>Blog Posts</span><span className="font-bold">{payload?.data?.blog_posts_count ?? 0}</span></li>
                <li className="flex justify-between"><span>Job Applications</span><span className="font-bold">{payload?.data?.orders_count ?? 0}</span></li>
                <li className="flex justify-between"><span>Member Since</span><span className="font-bold">{memberSince}</span></li>
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <ul className="space-y-2 text-xs font-bold">
                <li onClick={() => setPortfolioOpen(true)} className="flex items-center justify-between border px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
                  <span className="flex items-center gap-2"><BiCloudUpload className="h-4 w-4" /> Upload New Work</span>
                </li>
                <li onClick={() => setIsOpen(true)} className="flex items-center justify-between border px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
                  <span className="flex items-center gap-2"><PencilIcon className="h-4 w-4" /> Write Blog Post</span>
                </li>
                <li onClick={() => navigate("/jobs")} className="flex items-center justify-between border px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
                  <span className="flex items-center gap-2"><BriefcaseIcon className="h-4 w-4" /> Browse Jobs</span>
                </li>
                <li onClick={() => setPhotoIsOpen(true)} className="flex items-center justify-between border px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
                  <span className="flex items-center gap-2"><CameraIcon className="h-4 w-4" /> Update Profile Photo</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <CreatePostPopupModel isOpen={isOpen} setIsOpen={setIsOpen} />

      <UploadProfileModal isOpen={isPhotoOpen} onClose={() => setPhotoIsOpen(false)} uuid={uuid} />

      <PortfolioModal isOpen={isPortfolioOpen} onClose={() => setPortfolioOpen(false)} />

      <StepModalManager
        stepKey={activeStep}
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setActiveStep(null); }}
        initialData={{
          ...user,
          ...profile,
          ...payload?.data
        }}
        onSaved={(serverResponse) => {
          console.log("saved", serverResponse);
          // you may want to re-fetch dashboard data here
        }}
      />
    </div>
  );
};

export default GuestDashboardPage;
