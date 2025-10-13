import React, { useEffect, useState, useCallback } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { useTranslation } from "../contexts/LanguageProvider";
import {
  fetchBusinessListing,
  fetchResume,
  followUnfollowMethod,
  getPostJobData,
  getProfileData,
} from "../Hooks/useSeller";
import SpinnerProvider from "../components/SpinnerProvider";
import { FaCalendarAlt, FaClock, FaStar, FaUniversity } from "react-icons/fa";
import {
  CalendarRange,
  Copy,
  Crown,
  Download,
  Eye,
  FileText,
  Heart,
  Image as ImageIcon,
  Link as LinkIcon,
  LocationEdit,
  MessageCircle,
  Share,
  Share2,
  Star,
  Timer,
  Video,
  Video as VideoIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import MessagePopupModal from "./MessagePopupModal";

const DEFAULT_AVATAR =
  "https://img.freepik.com/premium-photo/memoji-emoji-handsome-smiling-man-white-background_826801-6987.jpg?semt=ais_hybrid&w=740&q=80";

const ViewProfilePopupModel = ({ isOpen, onClose, uuid }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(t("profile.tabs.portfolio"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profilePayload, setProfilePayload] = useState(null);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [jobLoading, setJobLoading] = useState(false);
  const [jobError, setJobError] = useState(null);
  const [jobData, setJobData] = useState([]);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [listing, setListing] = useState([]);

  const [hasActiveSubscription, setHasActiveSubscription] = useState(() => {
    try {
      return Cookies.get("subscription_status") === "active";
    } catch {
      return false;
    }
  });
  const navigate = useNavigate();

  const loadListing = useCallback(async (uuid) => {
    if (!uuid) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchBusinessListing(uuid);
      const payload = res?.data ?? res;
      let data = payload?.data ?? payload;

      const items = Array.isArray(data) ? data : data ? [data] : [];
      setListing(items);
    } catch (err) {
      setError(err?.message ?? "Failed to fetch business listing");
      setListing([]);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    if (!uuid) return;
    let alive = true;
    (async () => {
      if (!alive) return;
      await loadListing(uuid);
    })();
    return () => {
      alive = false;
    };
  }, [uuid, loadListing]);

  useEffect(() => {
    if (!isOpen) return;
    try {
      const status = Cookies.get("subscription_status");
      setHasActiveSubscription(status === "active");
    } catch {
      setHasActiveSubscription(false);
    }
  }, [isOpen]);

  const fetchProfile = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getProfileData(id);
      const payload = res?.data ?? res;
      setProfilePayload(payload?.data ?? payload);
    } catch (err) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (!uuid) {
      setError("No profile id provided.");
      return;
    }

    let mounted = true;
    (async () => {
      if (!mounted) return;
      await fetchProfile(uuid);
    })();

    return () => {
      mounted = false;
    };
  }, [isOpen, uuid, fetchProfile]);

  const handleFollow = async (id) => {
    if (!Cookies.get("token")) {
      navigate("/login");
      return;
    }

    if (!id) {
      toast.error("Invalid user.");
      return;
    }

    setLoading(true);
    try {
      const api = await followUnfollowMethod(id);
      const message = api?.data?.message || "Updated follow status";
      toast.success(message);

      await fetchProfile(id);
    } catch (error) {
      const errMsg = error?.message || "Failed to update follow status";
      toast.error(errMsg);
      console.error("Follow/Unfollow failed:", errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageClick = () => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!hasActiveSubscription) {
      toast.error("You need an active subscription to message creatives. Please upgrade.");
      navigate("/featured");
      return;
    }

    setIsMessageOpen(true);
  };

  const handleVideoClick = () => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!hasActiveSubscription) {
      toast.error("You need an active subscription to start a video call. Please upgrade.");
      navigate("/featured");
      return;
    }

    navigate(`/video-call/${uuid}`);
  };

  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    async function loadJob() {
      if (!uuid) {
        if (!mounted) return;
        setJobError("No job id provided.");
        setJobData([]);
        return;
      }
      setJobLoading(true);
      setJobError(null);
      try {
        const res = await getPostJobData(uuid);
        const jobs =
          res?.job ??
          (res?.data && (res.data.job ?? res.data)) ??
          res ??
          [];
        if (!mounted) return;
        setJobData(Array.isArray(jobs) ? jobs : [jobs]);
      } catch (err) {
        if (!mounted) return;
        setJobError(err?.message || "Failed to load job listing.");
        setJobData([]);
      } finally {
        if (!mounted) return;
        setJobLoading(false);
      }
    }

    loadJob();

    return () => {
      mounted = false;
    };
  }, [activeTab, uuid, isOpen]);

  useEffect(() => {
    if (!uuid) return;

    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchResume(uuid);
        const url =
          res?.data?.resume_url ??
          res?.resume_url ??
          (res?.data && (res.data.resume_url ?? null)) ??
          null;

        if (mounted) {
          if (url) setResumeUrl(url);
          else setError("No resume found for this user.");
        }
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load resume.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [uuid]);

  const getFileName = (url) => {
    try {
      const urlPath = new URL(url).pathname;
      return decodeURIComponent(urlPath.split("/").pop() || "resume");
    } catch {
      const parts = url?.split("/") ?? [];
      return decodeURIComponent(parts[parts.length - 1] || "resume");
    }
  };

  const getExtension = (url) => {
    const name = getFileName(url);
    const match = name.match(/\.(\w+)(\?.*)?$/);
    return match ? match[1].toLowerCase() : "";
  };

  const ext = resumeUrl ? getExtension(resumeUrl) : "";

  if (!isOpen) return null;

  const fullName = profilePayload?.full_name ?? profilePayload?.user?.full_name ?? "Unknown";
  const title = profilePayload?.profile?.title ?? profilePayload?.title ?? t("profile.role_photography");
  const bio = profilePayload?.profile?.bio ?? profilePayload?.personal_intro ?? t("profile.about_text");
  const avatar = profilePayload?.profile?.profile_picture ?? DEFAULT_AVATAR;
  const rating = profilePayload?.seller.user?.rating ?? profilePayload?.user?.rating ?? 0;
  const rating_count = profilePayload?.rating_count ?? 0;
  const followers = profilePayload?.followers_count ?? profilePayload?.user?.followers_count ?? 0;
  const following = profilePayload?.following_count ?? profilePayload?.user?.following_count ?? 0;
  const likes = profilePayload?.likes ?? 0;
  const skills = profilePayload?.seller?.skills ?? profilePayload?.skills ?? [];
  const portfolio = profilePayload?.portfolieo ?? [];
  const socials = profilePayload?.social_links ?? [];
  const hourly = profilePayload?.seller?.hourly_rate ?? profilePayload?.profile?.hourly_rate ?? profilePayload?.hourly_rate;
  const daily = profilePayload?.seller?.daily_rate ?? profilePayload?.profile?.daily_rate ?? profilePayload?.daily_rate;
  const projectRate = profilePayload?.seller?.project_rate ?? profilePayload?.profile?.project_rate ?? profilePayload?.project_rate;
  const availabilityLabel = profilePayload?.seller?.availability_label ?? profilePayload?.profile?.availability_label ?? profilePayload?.availability;
  const city = profilePayload?.seller?.user.location?.city?.name ?? "";
  const state = profilePayload?.seller.user.location?.state?.name ?? "";
  const country = profilePayload?.seller.user.location?.country?.name ?? "";
  const is_followed_by_login_user = profilePayload?.is_followed_by_login_user ?? false;

  const tabs = [
    t("profile.tabs.portfolio"),
    t("profile.tabs.reviews"),
    t("profile.tabs.education"),
    "My Business Listing ",
    "Post a Job",
    "Uploaded Resume",
  ];

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

  const getMediaUrl = (item) => {
    if (!item) return null;
    return (
      item.uploads_file ??
      item.uploads_file_url ??
      item.media_url ??
      item.file_url ??
      item.image ??
      (item.media && (item.media.url ?? item.media[0]?.url)) ??
      item.media ??
      item.url ??
      null
    );
  };

  const getSocials = (item) => {
    if (!item) return [];
    const raw =
      item.social_media_link ??
      item.social_media_links ??
      item.socials ??
      item.social_media_link_list ??
      item.social_media_link_list_json ??
      item.social_media_link_array ??
      null;

    if (!raw) return [];
    if (Array.isArray(raw)) return raw.filter(Boolean);
    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch {
        return raw.split(/\n|,/).map((s) => s.trim()).filter(Boolean);
      }
    }
    if (typeof raw === "object") {
      return Object.values(raw).filter(Boolean);
    }
    return [];
  };

  const mediaUrl = getMediaUrl(listing);
  const isVideo = mediaUrl && /\.(mp4|webm|mov|ogg)(?:\?.*)?$/i.test(mediaUrl);
  const b_socials = getSocials(listing);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[800px] max-h-[80vh] overflow-y-auto rounded-xl shadow-lg relative border border-orange-600 scrollbar-hide">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <img src={avatar} alt={DEFAULT_AVATAR} onError={(e) => {
              if (e.currentTarget.src !== DEFAULT_AVATAR) {
                e.currentTarget.src = DEFAULT_AVATAR;
              }
            }} className="w-12 h-12 rounded-md object-cover" />
            <div>
              <h2 className="font-bold text-lg flex items-center gap-2">
                {fullName}
                <div className="bg-orange-500 text-white text-xs px-2 py-1 font-semibold rounded-md gap-1 flex flex-row items-center">
                  <Crown className="h-3 w-3" /> {t("profile.featured_tag")}
                </div>
              </h2>
              <p className="text-sm text-gray-500 font-light">{title}</p>
            </div>
          </div>
          <button onClick={onClose}>
            <IoCloseCircle className="w-6 h-6 text-gray-500 hover:text-black" />
          </button>
        </div>

        {/* Loading / Error */}
        <div className="px-6 py-4">
          {loading && <SpinnerProvider />}
        </div>

        {/* <div className="border bg-orange-50 border-orange-500 px-4 py-4 rounded-md mx-6 flex gap-3 items-center">
          <Crown className="h-6 w-6 text-orange-500" />
          <div className="flex flex-col gap-1">
            <div className="text-orange-500 text-sm font-semibold">Featured Creative</div>
            <div className="text-xs text-gray-600">This creative is highlighted for their exceptional work and premium membership</div>
          </div>
        </div> */}

        {/* Profile Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 py-6">
          {/* Left Column */}
          <div className="col-span-1 flex flex-col items-center rounded-lg">
            <img src={avatar} alt={DEFAULT_AVATAR} onError={(e) => {
              if (e.currentTarget.src !== DEFAULT_AVATAR) {
                e.currentTarget.src = DEFAULT_AVATAR;
              }
            }} className="h-50 w-full rounded-lg object-cover" />

            {/* Stats */}
            <div className="flex gap-6 text-center mt-4">
              <div>
                <p className="font-bold">{followers}</p>
                <p className="text-[11px] text-gray-500">{t("profile.followers")}</p>
              </div>
              <div>
                <p className="font-bold">{following}</p>
                <p className="text-[11px] text-gray-500">{t("profile.following")}</p>
              </div>
              <div>
                <p className="font-bold">{likes}</p>
                <p className="text-[11px] text-gray-500">{t("profile.likes")}</p>
              </div>
            </div>


            {/* Premium Upgrade */}
            <div className="mt-2 w-full text-center items-center justify-center flex flex-col">
              <button
                onClick={() => handleFollow(uuid)}
                disabled={loading}
                className={`text-xs text-black-600 font-semibold mt-2 border px-4 py-2 rounded-lg w-full flex items-center justify-center ${loading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
              >
                {loading ? (
                  <span className="text-[12px]">...</span>
                ) : is_followed_by_login_user ? (
                  "Unfollow"
                ) : (
                  "Follow"
                )}
              </button>
              {/* <p className="text-[10px] mt-1 text-gray-500">{t("profile.premium_feature_note")}</p> */}
            </div>

            <button className="text-xs mt-2 w-full font-semibold bg-white hover:bg-gray-100 border text-black px-4 py-2 rounded-lg items-center justify-center flex gap-2">
              <Share className="h-3 w-4" /> Share Profile
            </button>


            <div className="w-full mt-4">
              <h3 className="font-semibold">{t("profile.connect_title")}</h3>
              <div className="flex gap-2 mt-2 grid grid-cols-2 flex-wrap">
                {socials.length === 0 && (
                  <>
                    <p className="text-xs">No Links Added</p>
                  </>
                )}
                {socials.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noreferrer" className="border px-3 py-1 rounded-lg text-sm font-semibold text-center hover:bg-gray-100">
                    {s.platform}
                  </a>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <button className="mt-4 text-xs font-semibold bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg w-full">
              {t("profile.book_now")}
            </button>
            <div className="mt-3 w-full ">
              <h3 class="font-semibold">Collaborate</h3>
              <div className="flex gap-2 mt-1 w-full justify-center items-center">
                <button
                  onClick={handleMessageClick}
                  disabled={loading || !Cookies.get("token") || !hasActiveSubscription}
                  className={`inline-flex items-center justify-center text-xs border font-semibold px-4 py-2 rounded-lg gap-2
    ${(!Cookies.get("token") || !hasActiveSubscription) ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <MessageCircle className="h-3 w-3" /> {t("profile.message")}
                </button>

                <button
                  onClick={handleVideoClick}
                  disabled={loading || !Cookies.get("token") || !hasActiveSubscription}
                  className={`inline-flex items-center justify-center text-xs border font-semibold px-4 py-2 rounded-lg gap-2
    ${(!Cookies.get("token") || !hasActiveSubscription) ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Video className="h-4 w-3" /> {t("profile.video_call")}
                </button>

              </div>
            </div>

            <p className="text-[10px] text-gray-500 my-1">{t("profile.premium_features")}</p>

            <Link to='/featured' className="text-[10px] font-semibold bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg items-center justify-center flex gap-2">
              <Crown className="h-3 w-3" /> {t("profile.upgrade")}
            </Link>
          </div>

          {/* Right Column */}
          <div className="col-span-2 space-y-4">
            {/* Quick Info */}
            <div className="grid gap-6 text-sm grid-cols-2">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-orange-600" /> <b>{rating} rating</b>
              </div>

              <div className="flex items-center gap-2 font-light">
                <LocationEdit className="h-4 w-4 text-orange-600" /> <b>{city}, {state}, {country}</b>
              </div>

              <div className="flex items-center gap-2 font-light">
                <CalendarRange className="h-4 w-4 text-orange-600" /> <b>{profilePayload?.seller?.experience_in_year ?? "0"} years experience</b>
              </div>

              <div className="flex items-center gap-2 font-light">
                <Timer className="h-4 w-4 text-orange-600" /> <b>{availabilityLabel ?? t("profile.available_text")}</b>
              </div>
            </div>

            {/* About */}
            <div>
              <h3 className="font-semibold">{t("profile.about_title")}</h3>
              <p className="text-gray-600 font-light mt-1 text-sm line-clamp-4">{bio}</p>
            </div>

            {/* Introduction */}
            <div>
              <h3 className="font-semibold flex items-center gap-2 text-black">
                <span>💬</span> {t("profile.introduction_title")}
              </h3>
              <div className="text-gray-600 font-light text-sm italic mt-1 line-clamp-4">
                {profilePayload?.seller?.personal_intro ?? profilePayload?.profile?.personal_intro ?? t("profile.introduction_quote")}
              </div>
            </div>

            {/* Creative Vision */}
            <div>
              <h3 className="font-semibold flex items-center gap-2 text-black">
                <span>💡</span> {t("profile.vision_title")}
              </h3>
              <p className="text-gray-600 font-light mt-1 text-sm line-clamp-4">{profilePayload?.seller?.exp_vision ?? t("profile.vision_text")}</p>
            </div>

            {/* Services & Industries (use skills/categories from API) */}
            <div>
              <h3 className="font-semibold text-sm">{t("profile.industries_title")}</h3>
              <div className="flex gap-2 flex-wrap mt-2">
                {skills.length === 0 && <span className="text-xs text-gray-500">{t("profile.no_skills")}</span>}
                {skills.map((s) => (
                  <span key={s.id ?? s.name} className="bg-gray-100 text-black font-semibold text-[10px] px-3 py-1 rounded-lg">
                    {s.name}
                  </span>
                ))}
              </div>

              <h3 className="font-semibold mt-4 text-sm">{t("profile.services_title")}</h3>
              <div className="flex gap-2 flex-wrap mt-2">
                {(profilePayload?.seller?.skills ?? []).slice(0, 4).map((s) => (
                  <span key={s.id ?? s.name} className="bg-teal-500 text-white text-[10px] font-semibold px-3 py-1 rounded-lg">
                    {s.name}
                  </span>
                )) || (
                    [
                      t("profile.service.photography"),
                      t("profile.service.creative_direction"),
                      t("profile.service.brand_photography"),
                      t("profile.service.content_creation"),
                    ].map((s) => (
                      <span key={s} className="bg-teal-500 text-white text-[10px] font-semibold px-3 py-1 rounded-lg">{s}</span>
                    ))
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 py-4 ">
          <div className="flex justify-between overflow-x-auto border-b bg-gray-200 rounded-full">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-1 text-xs text-black m-1 font-medium rounded-full transition ${activeTab === tab ? "bg-white shadow" : "bg-gray-200"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-4">
            {activeTab === t("profile.tabs.portfolio") && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolio.length === 0 && <div className="text-xs text-gray-500">No Portfolio Found</div>}
                {portfolio.map((p) => (
                  <div key={p.id} className="overflow-hidden">
                    <img src={p.media?.[0]?.url ?? p.project_url ?? "https://picsum.photos/300/200"} alt={p.title} className="w-full h-40 bg-gray-100 object-cover rounded-lg transform transition-transform duration-300 ease-out hover:scale-110" />
                    <div className="p-3">
                      <h4 className="font-semibold text-xs">{p.title}</h4>
                      <p className="text-xs text-gray-500">{p.role}</p>
                      <p className="text-xs text-gray-500">{p.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === t("profile.tabs.reviews") && (
              <div className="space-y-4">
                {/* keep earlier structure but use rating array */}
                <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-md">{t("profile.reviews.client_reviews")}</h3>
                    <p className="text-xs text-gray-500">Based on {rating_count} reviews</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-md">{rating}</p>
                    <p className="text-orange-500">★★★★★</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {(profilePayload?.rating ?? []).map((r) => (
                    <div key={r.id} className="border rounded-lg p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <img src={r.rater?.profile_picture ?? DEFAULT_AVATAR} alt={r.rater?.full_name} onError={(e) => {
                            if (e.currentTarget.src !== DEFAULT_AVATAR) {
                              e.currentTarget.src = DEFAULT_AVATAR;
                            }
                          }} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <h4 className="font-semibold">{r.rater?.full_name ?? fullName}</h4>
                            <p className="text-xs text-gray-500">{r.rater?.title}</p>
                            <p className="text-gray-600 text-xs font-light">{r.comment}</p>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <p className="text-orange-500">{"★".repeat(Number(r.stars))}</p>
                          <p className="text-gray-400 text-xs">{r.created_at?.split?.(" ")?.[0] ?? r.created_at}</p>
                        </div>
                      </div>
                    </div>
                  )) || <div className="text-sm text-gray-500">{t("profile.no_reviews")}</div>}
                </div>
              </div>
            )}

            {activeTab === t("profile.tabs.education") && (
              <div className="space-y-4">
                {/* header with count */}
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{t("profile.education_title")}</h3>
                  <span className="text-xs text-gray-500">
                    {((profilePayload?.education) || []).length} Profile
                  </span>
                </div>

                {/* list */}
                <div className="space-y-4">
                  {(profilePayload?.education ?? []).length === 0 ? (
                    <div className="text-xs text-gray-500">No Education Found</div>
                  ) : (
                    (profilePayload.education ?? []).map((edu) => (
                      <article
                        key={edu.id}
                        className="flex flex-col md:flex-row gap-4 items-start bg-white rounded-lg p-4 shadow-sm border"
                      >
                        {/* LEFT: degree, school, field, date + description & created/updated (stacked in one column) */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 text-teal-600 mt-0.5">
                              <FaUniversity className="w-5 h-5" />
                            </div>

                            <div className="w-full">
                              {/* Degree + Institution */}
                              <div className="flex items-start justify-between">
                                <div className="min-w-0">
                                  <h4 className="font-semibold text-sm text-gray-800 truncate">{edu.degree || "-"}</h4>
                                  <p className="text-xs text-gray-600 mt-1 truncate">{edu.institution_name || "-"}</p>
                                  {edu.field_of_study && (
                                    <p className="text-xs text-gray-500 mt-1 truncate">{edu.field_of_study}</p>
                                  )}
                                </div>

                                {/* small badges */}
                                <div className="hidden md:flex flex-col items-end gap-2 ml-3">
                                  {edu.is_current && (
                                    <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">Current</span>
                                  )}
                                  {!edu.is_visible && (
                                    <span className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded-full">Hidden</span>
                                  )}
                                </div>
                              </div>

                              {/* meta row */}
                              <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500 items-center">
                                <span className="inline-flex items-center gap-1">
                                  <FaCalendarAlt className="w-3 h-3 text-gray-400" />
                                  {edu.date_range ?? `${formatDateShort(edu.start_date)} — ${formatDateShort(edu.end_date)}`}
                                </span>

                                {edu.duration_years != null && (
                                  <span className="inline-flex items-center gap-1">
                                    <FaClock className="w-3 h-3 text-gray-400" />
                                    {Number(edu.duration_years).toFixed(1)} Years
                                  </span>
                                )}
                              </div>

                              {/* Description (now directly under the left block) */}
                              <div className="mt-4 text-xs text-gray-600">
                                <p className="mb-3">{edu.description ?? <span className="text-gray-400">—</span>}</p>

                                <div className="text-[11px] text-gray-400 space-y-1">
                                  <div>
                                    <span className="font-medium text-gray-600">Created:</span>{" "}
                                    {formatDateShort(edu.created_at) ?? "-"}
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-600">Updated:</span>{" "}
                                    {formatDateShort(edu.updated_at) ?? "-"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT: narrow GPA column (fixed small width on md) */}
                        <div className="w-full md:w-24 flex md:flex-col items-center md:items-end justify-center md:justify-end">
                          {edu.gpa ? (
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-yellow-50 text-yellow-800 text-xs font-medium">
                              <FaStar className="w-3 h-3" />
                              <span>GPA {edu.gpa}</span>
                              {edu.grade_scale ? <span className="text-[11px] text-gray-400 ml-1">({edu.grade_scale})</span> : null}
                            </span>
                          ) : (
                            <div className="text-xs text-gray-300">—</div>
                          )}
                        </div>
                      </article>

                    ))
                  )}
                </div>
              </div>
            )}

            {/* {activeTab === t("profile.tabs.activity") && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-sm">{t("profile.activity.professional_experience")}</h3>
                  <div className="grid grid-cols-3 gap-6 text-sm">
                    <div>
                      <p className="text-black font-semibold">{t("profile.activity.career_level")}</p>
                      <span className="inline-block bg-teal-500 text-white text-xs font-medium px-3 py-1 mt-2 rounded-md">
                        {profilePayload?.seller?.experience_in_level ?? t("profile.activity.senior_level")} Level
                      </span>
                    </div>
                    <div>
                      <p className="text-black font-semibold">{t("profile.activity.years_active")}</p>
                      <p className="font-medium mt-2">{profilePayload?.seller?.experience_in_year ?? "-"} {t("profile.activity.years")}</p>
                    </div>
                    <div>
                      <p className="text-black font-semibold">{t("profile.activity.availability")}</p>
                      <p className="text-green-600 flex items-center gap-1 mt-2">{availabilityLabel}</p>
                    </div>
                  </div>

                  <h3 className="font-semibold text-sm">Skills & Tools</h3>
                  <div className="flex gap-2 flex-wrap mt-2">
                    {skills.length === 0 && <span className="text-xs text-gray-500">{t("profile.no_skills")}</span>}
                    {skills.map((s) => (
                      <span key={s.id ?? s.name} className="bg-gray-100 text-black font-semibold text-[10px] px-3 py-1 rounded-lg">
                        {s.name}
                      </span>
                    ))}
                  </div>

                </div>
                <h3 className="font-semibold text-sm mb-4">Recent Activity &amp; Blog Posts</h3>

                {(!profilePayload?.posts || profilePayload.posts.length === 0) ? (
                  <div className="text-sm text-gray-500">No recent posts</div>
                ) : (
                  <div className="space-y-4">
                    {profilePayload.posts.map((post) => (
                      <article
                        key={post.id}
                        className="flex flex-col md:flex-row gap-3 bg-white rounded-lg p-3 md:p-4 items-start md:items-center border"
                      >
                        <div className="w-full md:w-28 flex-shrink-0">
                          <img
                            src={post.image || post.image_url || "https://picsum.photos/400/280"}
                            alt={post.title || "post image"}
                            className="w-full h-40 md:h-20 object-cover rounded-md"
                            onError={(e) => { e.currentTarget.src = "https://picsum.photos/400/280"; }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{post.title}</h4>

                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {post.dsc ?? post.content ?? "-"}
                          </p>

                          <div className="flex items-center gap-3 text-xs text-gray-400 mt-3 flex-wrap">
                            <time dateTime={post.created_at || post.updated_at || new Date().toISOString()}>
                              {new Date(post.created_at || post.updated_at || Date.now()).toLocaleDateString()}
                            </time>

                            {post.type && (
                              <span className="inline-block text-[11px] border rounded-full px-2 py-0.5 bg-white">
                                {post.type}
                              </span>
                            )}

                            <div className="flex gap-2 flex-wrap mt-2">
                              {(post.tags || []).slice(0, 4).map((tag) => (
                                <span
                                  key={tag.id ?? tag.name}
                                  className="text-[10px] font-semibold px-2 py-1 rounded-md border bg-gray-50"
                                >
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="w-full md:w-auto flex md:flex-col items-start md:items-end gap-2 mt-3 md:mt-0">
                          <button
                            className="w-full md:w-auto text-xs text-gray-600 font-semibold border px-3 py-1 rounded-md bg-white flex items-center justify-center gap-2"
                            aria-label={`Like ${post.title}`}
                          >
                            <Heart className="h-3 w-3" /> <span className="hidden md:inline">Like</span>
                            <span className="md:hidden text-[11px]">♥</span>
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}

              </div>
            )}

            {activeTab === t("profile.tabs.pricing") && (
              <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                <h3 className="font-semibold text-lg flex items-center gap-2"><span className="text-green-600 text-xl">💲</span> {t("profile.pricing.title")}</h3>

                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-teal-600 font-bold text-2xl">{hourly ? `${hourly}` : t("profile.pricing.per_hour_amount")}</p>
                    <p className="text-gray-500 text-sm">{t("profile.pricing.per_hour")}</p>
                  </div>
                  <div>
                    <p className="text-teal-600 font-bold text-2xl">{daily ? `${daily}` : t("profile.pricing.per_day_amount")}</p>
                    <p className="text-gray-500 text-sm">{t("profile.pricing.per_day")}</p>
                  </div>
                  <div>
                    <p className="text-teal-600 font-bold text-2xl">{projectRate ? `${projectRate}` : t("profile.pricing.per_project_amount")}</p>
                    <p className="text-gray-500 text-sm">{t("profile.pricing.per_project")}</p>
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-2">
                  <p><span className="font-medium">{t("profile.pricing.currency_label")}:</span> {t("profile.pricing.currency")}</p>
                  <p><span className="font-medium">{t("profile.pricing.rates_negotiable_label")}:</span> <span className="text-green-600 font-medium">{profilePayload?.seller?.is_rate_negotiable === "1" ? t("profile.pricing.yes") : t("profile.pricing.no")}</span></p>
                </div>
              </div>
            )} */}

            {activeTab === "My Business Listing " && (
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-3">Business Listing</h3>

                {listing.length === 0 ? (
                  <div className="border rounded-lg bg-white shadow-sm p-6 text-sm text-gray-500">No Business Listing yet.</div>
                ) : (
                  listing.map((item, idx) => {
                    const mediaUrlItem = getMediaUrl(item);
                    const isVideoItem = mediaUrlItem && /\.(mp4|webm|mov|ogg)(?:\?.*)?$/i.test(mediaUrlItem);
                    const socialsItem = getSocials(item);

                    return (
                      <div key={item.id ?? idx} className="border rounded-lg bg-white shadow-sm overflow-hidden mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                          {/* Media */}
                          <div className="col-span-1">
                            <div className="w-full h-full rounded-md bg-gray-50 overflow-hidden flex items-center justify-center">
                              {mediaUrlItem ? (
                                isVideoItem ? (
                                  <video src={mediaUrlItem} controls className="w-full h-full object-cover" />
                                ) : (
                                  <img src={mediaUrlItem} alt="business media" className="w-full h-full object-cover" />
                                )
                              ) : (
                                <div className="text-gray-400 flex flex-col items-center gap-2">
                                  <ImageIcon className="h-8 w-8" />
                                  <span className="text-xs">No media uploaded</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Main info */}
                          <div className="col-span-1 md:col-span-2">
                            <div>
                              <p className="text-sm text-gray-500">Introduction</p>
                              <h4 className="text-sm font-semibold">{item.intro ?? item.introduction ?? "—"}</h4>
                            </div>

                            <div className="mt-3">
                              <p className="text-sm text-gray-500">Description</p>
                              <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">{item.description ?? item.desc ?? "—"}</p>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-3">
                              {item.website_link ? (
                                <div>
                                  <p className="text-sm text-gray-500 my-2">Website</p>
                                  <a href={item.website_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1 rounded-md border text-xs font-semibold hover:bg-gray-100">
                                    <LinkIcon className="h-4 w-4" /> {item.website_link}
                                  </a>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">No website</span>
                              )}
                            </div>

                            <div className="mt-4">
                              <p className="text-sm text-gray-500">Social links</p>
                              {socialsItem.length === 0 ? (
                                <p className="text-xs text-gray-400 mt-1">No social links</p>
                              ) : (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {socialsItem.map((s, i) => (
                                    <a key={i} href={s} target="_blank" rel="noopener noreferrer" className="px-3 py-1 border rounded-md text-xs font-semibold hover:bg-gray-100 break-words">
                                      {s}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}


            {activeTab === "Post a Job" && (
              <div className="space-y-4">
                <h3 className="font-semibold text-md">Job Listings</h3>

                {jobError && <div className="text-sm text-red-500">Error: {jobError}</div>}
                {!jobLoading && !jobError && jobData.length === 0 && (
                  <p className="text-sm text-gray-500">No job listings found.</p>
                )}

                <div className="space-y-4">
                  {jobData.map((job) => (
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
                      <div>
                        <strong className="text-xs">Types:</strong>
                        <div className="mt-1 flex flex-wrap">
                          {(job.types || []).map((t) => (
                            <Badge key={t.id ?? t.name}>{t.name}</Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <strong className="text-xs">Skills:</strong>
                        <div className="mt-1 flex flex-wrap">
                          {(job.skills || []).map((s) => (
                            <Badge key={s.id ?? s.name}>{s.name}</Badge>
                          ))}
                          {(job.unique_skills || []).map((s) => (
                            <Badge key={s.id ?? s.name} variant="indigo">{s.name}</Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <strong className="text-xs">Degrees:</strong>
                        <div className="mt-1 flex flex-wrap">
                          {(job.degrees || []).map((d) => (
                            <Badge key={d.id ?? d.degree} variant="green">{d.degree}</Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <strong className="text-xs">Demographics:</strong>
                        <div className="text-xs text-gray-700 mt-1">
                          {job.age_ranges && job.age_ranges.length > 0 && (
                            <div><strong>Age ranges:</strong> {job.age_ranges.map(a => a.range).join(", ")}</div>
                          )}
                          {job.genders && job.genders.length > 0 && (
                            <div><strong>Genders:</strong> {job.genders.map(g => g.gender).join(", ")}</div>
                          )}
                        </div>
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
              </div>
            )}

            {activeTab === "Uploaded Resume" && (
              <div className="py-4">
                {loading && (
                  <div className="p-4 border rounded-lg bg-white shadow-sm animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                    <div className="h-6 bg-gray-200 rounded w-1/2" />
                  </div>
                )}

                {!loading && error && (
                  <div className="p-4 border rounded-lg bg-red-50 text-red-700">
                    <p className="text-sm">No uploaded resume yet.</p>
                  </div>
                )}

                {!loading && !error && !resumeUrl && (
                  <div className="p-4 border rounded-lg bg-gray-50 text-gray-600">
                    <p className="text-sm">No uploaded resume yet.</p>
                  </div>
                )}

                {!loading && resumeUrl && (
                  <div className="p-5 border rounded-xl bg-white shadow-sm flex items-center justify-between hover:shadow-md transition">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 flex items-center justify-center bg-gray-100 rounded-md">
                        <FileText className="h-6 w-6 text-gray-500" />
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {getFileName(resumeUrl)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Uploaded Resume</div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-md hover:bg-blue-50 text-blue-600 transition"
                        title="View"
                      >
                        <Eye className="h-5 w-5" />
                      </a>

                      <a
                        href={resumeUrl}
                        download
                        className="p-2 rounded-md hover:bg-green-50 text-green-600 transition"
                        title="Download"
                      >
                        <Download className="h-5 w-5" />
                      </a>

                      <button
                        onClick={() => navigator.clipboard?.writeText(resumeUrl)}
                        className="p-2 rounded-md hover:bg-gray-50 text-gray-600 transition"
                        title="Copy Link"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
      <MessagePopupModal isOpen={isMessageOpen} onClose={() => setIsMessageOpen(false)} fullName={fullName} title={title} uuid={uuid} avatar={avatar} />
    </div>
  );
};

export default ViewProfilePopupModel;
