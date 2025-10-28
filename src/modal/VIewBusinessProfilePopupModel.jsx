import React, { useEffect, useState, useCallback } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { useTranslation } from "../contexts/LanguageProvider";
import { fetchBusinessListing, fetchResume, followUnfollowMethod, getPostJobData, getProfileData } from "../Hooks/useSeller";
import SpinnerProvider from "../components/SpinnerProvider";
import { FaCalendarAlt, FaClock, FaStar, FaUniversity } from "react-icons/fa";
import { CalendarRange, Copy, Crown, Download, Eye, FileText, Heart, LinkIcon, LocationEdit, Mail, MessageCircle, Phone, Share, Share2, Star, Timer, Video } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import MessagePopupModal from "./MessagePopupModal";

const DEFAULT_AVATAR =
  "https://static.vecteezy.com/system/resources/previews/021/548/095/non_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg";

const ViewBusinessProfilePopupModel = ({ isOpen, onClose, uuid }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profilePayload, setProfilePayload] = useState(null);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
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
    if (!Cookies.get("artcee_token")) {
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
    const token = Cookies.get("artcee_token");
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
    const token = Cookies.get("artcee_token");
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

  if (!isOpen) return null;

  const fullName = profilePayload?.full_name ?? profilePayload?.user?.full_name ?? "Unknown";
  const title = profilePayload?.profile?.title ?? profilePayload?.title ?? t("profile.role_photography");
  const bio = profilePayload?.profile?.bio ?? profilePayload?.personal_intro ?? "Not provided.";
  const avatar = profilePayload?.profile?.profile_picture ?? DEFAULT_AVATAR;
  const rating = profilePayload?.seller.user?.rating ?? profilePayload?.user?.rating ?? 0;
  const email = profilePayload?.email ?? '-';
  const phone = profilePayload?.profile?.phone ?? '-';
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
  const progress_percentage = profilePayload?.progress_percentage ?? 0;

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
  const userId = Cookies.get("userId");
  const shouldShowBox = userId === uuid && progress_percentage < 100;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[800px] max-h-[80vh] overflow-y-auto rounded-xl shadow-lg relative border border-orange-600 scrollbar-hide">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
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
        <div className="px-6 py-2">
          {loading && <SpinnerProvider />}
        </div>

        {shouldShowBox && (
          <div className="border border-orange-300 px-6 py-2 text-orange-800 p-2 rounded-md shadow-md mx-6 flex flex-row gap-2 items-center justify-between italic">
            <h3 className="font-semibold text-sm">Please Complete Your Profile</h3>
            <button onClick={() => navigate('/profile')} className="text-xs font-medium bg-yellow-100 text-yellow-600 px-3 py-1 rounded-md w-fit">
              Complete Profile Now
            </button>
          </div>
        )}

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
                  disabled={loading || !Cookies.get("artcee_token") || !hasActiveSubscription}
                  className={`inline-flex items-center justify-center text-xs border font-semibold px-4 py-2 rounded-lg gap-2
    ${(!Cookies.get("artcee_token") || !hasActiveSubscription) ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <MessageCircle className="h-3 w-3" /> {t("profile.message")}
                </button>

                <button
                  onClick={handleVideoClick}
                  disabled={loading || !Cookies.get("artcee_token") || !hasActiveSubscription}
                  className={`inline-flex items-center justify-center text-xs border font-semibold px-4 py-2 rounded-lg gap-2
    ${(!Cookies.get("artcee_token") || !hasActiveSubscription) ? "opacity-50 cursor-not-allowed" : ""}`}
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
                <Phone className="h-4 w-4 text-orange-600" /> <b>{phone}</b>
              </div>

              <div className="flex items-center gap-2 font-light">
                <LocationEdit className="h-4 w-4 text-orange-600" /> <b>{city}, {state}, {country}</b>
              </div>

              <div className="flex items-center gap-2 font-light">
                <Mail className="h-4 w-4 text-orange-600" /> <b>{email}</b>
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
                {profilePayload?.seller?.personal_intro ?? profilePayload?.profile?.personal_intro ?? "Not provided."}
              </div>
            </div>

            {/* Creative Vision */}
            <div>
              <h3 className="font-semibold flex items-center gap-2 text-black">
                <span>💡</span> {t("profile.vision_title")}
              </h3>
              <p className="text-gray-600 font-light mt-1 text-sm line-clamp-4">{profilePayload?.seller?.exp_vision ?? "Not provided"}</p>
            </div>

            {/* Services & Industries (use skills/categories from API) */}
            <div>
              <h3 className="font-semibold text-sm">{t("profile.industries_title")}</h3>
              <div className="flex gap-2 flex-wrap mt-2">
                {skills.length === 0 && <span className="text-xs text-gray-500">Not Added</span>}
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
        <div className="p-4 border-t">
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
                      <div className="h-full w-full rounded-md bg-gray-50 overflow-hidden flex items-center justify-center">
                        {mediaUrlItem ? (
                          isVideoItem ? (
                            <video src={mediaUrlItem} controls className="w-full h-full object-contain" />
                          ) : (
                            <img src={mediaUrlItem} alt="business media" className="w-full h-full object-contain" />
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
      </div>
      <MessagePopupModal isOpen={isMessageOpen} onClose={() => setIsMessageOpen(false)} fullName={fullName} title={title} uuid={uuid} avatar={avatar} />
    </div>
  );
};

export default ViewBusinessProfilePopupModel;
