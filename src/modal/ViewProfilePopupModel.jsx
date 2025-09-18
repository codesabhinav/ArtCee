import React, { useEffect, useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { useTranslation } from "../contexts/LanguageProvider";
import { getProfileData } from "../Hooks/useSeller";
import SpinnerProvider from "../components/SpinnerProvider";
import { FaCalendarAlt, FaClock, FaCrown, FaHeart, FaLocationArrow, FaShare, FaStar, FaUniversity, FaVideo } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { VideoCameraIcon } from "@heroicons/react/24/outline";
import { CalendarRange, Crown, Heart, LocateFixed, LocateIcon, LocationEdit, MessageCircle, Share, Share2, Star, Timer, TimerIcon, Video } from "lucide-react";

const DEFAULT_AVATAR =
  "https://img.freepik.com/premium-photo/memoji-emoji-handsome-smiling-man-white-background_826801-6987.jpg?semt=ais_hybrid&w=740&q=80";

const ViewProfilePopupModel = ({ isOpen, onClose, uuid }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(t("profile.tabs.portfolio"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profilePayload, setProfilePayload] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    if (!uuid) {
      setError("No profile id provided.");
      return;
    }

    let mounted = true;
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const res = await getProfileData(uuid);
        const payload = res?.data ?? res;
        if (mounted) setProfilePayload(payload?.data ?? payload);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchProfile();
    return () => {
      mounted = false;
    };
  }, [isOpen, uuid]);

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
  const city = profilePayload?.seller.user.location?.city?.name ?? "";
  const state = profilePayload?.seller.user.location?.state?.name ?? "";
  const country = profilePayload?.seller.user.location?.country?.name ?? "";

  const tabs = [
    t("profile.tabs.portfolio"),
    t("profile.tabs.reviews"),
    t("profile.tabs.education"),
    t("profile.tabs.activity"),
    t("profile.tabs.pricing"),
  ];

  function formatDateShort(dateStr) {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      // if input is "2025-09-17T07:35:07.000000Z" or "2018-09-01"
      if (isNaN(d)) return dateStr;
      return d.toLocaleString(undefined, { month: "short", year: "numeric" }); // e.g. "Sep 2018"
    } catch {
      return dateStr;
    }
  }

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
            }} className="w-12 h-12 rounded-full object-cover" />
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
          {error && <div className="text-sm text-red-500">Error: {error}</div>}
        </div>

        <div className="border bg-orange-50 border-orange-500 px-4 py-4 rounded-md mx-6 flex gap-3 items-center">
          <Crown className="h-6 w-6 text-orange-500" />
          <div className="flex flex-col gap-1">
            <div className="text-orange-500 text-sm font-semibold">Featured Creative</div>
            <div className="text-xs text-gray-600">This creative is highlighted for their exceptional work and premium membership</div>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 py-6">
          {/* Left Column */}
          <div className="col-span-1 flex flex-col items-center rounded-lg">
            <img src={avatar} alt={DEFAULT_AVATAR} onError={(e) => {
              if (e.currentTarget.src !== DEFAULT_AVATAR) {
                e.currentTarget.src = DEFAULT_AVATAR;
              }
            }} className="h-48 rounded-lg object-cover" />

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

            {/* Buttons */}
            <button className="mt-4 text-xs font-semibold bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg w-full">
              {t("profile.book_now")}
            </button>
            <div className="flex gap-2 mt-3 w-full justify-center items-center">
              <button className="inline-flex items-center justify-center text-xs border text-gray-400 font-semibold px-4 py-2 rounded-lg gap-2">
                <MessageCircle className="h-3 w-3" /> {t("profile.message")}
              </button>

              <button className="inline-flex items-center justify-center text-xs border text-gray-400 font-semibold px-4 py-2 rounded-lg gap-2">
                <Video className="h-4 w-3" /> {t("profile.video_call")}
              </button>
            </div>


            {/* Premium Upgrade */}
            <div className="mt-2 w-full text-center items-center justify-center flex flex-col">
              <p className="text-[10px] text-gray-500 mb-1">{t("profile.premium_features")}</p>

              <button className="text-[10px] font-semibold bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg items-center justify-center flex gap-2">
                <Crown className="h-3 w-3" /> {t("profile.upgrade")}
              </button>

              <button className="text-xs text-gray-400 font-semibold mt-2 border px-4 py-2 rounded-lg w-full">{t("profile.follow")}</button>
              <p className="text-[10px] mt-1 text-gray-500">{t("profile.premium_feature_note")}</p>
            </div>

            <button className="text-[10px] mt-2 w-full font-semibold bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg items-center justify-center flex gap-2">
              <Crown className="h-3 w-3" /> Upgarde to Follow
            </button>

            <button className="text-xs mt-2 w-full font-semibold bg-white hover:bg-gray-100 border text-black px-4 py-2 rounded-lg items-center justify-center flex gap-2">
              <Share2 className="h-3 w-4" /> Share Profile
            </button>

            <div className="w-full mt-4">
              <h3 className="font-semibold">{t("profile.connect_title")}</h3>
              <div className="flex gap-2 mt-2 grid grid-cols-2 flex-wrap">
                {socials.length === 0 && (
                  <>
                    <a className="border px-3 py-1 rounded-lg text-sm">{t("profile.social.website")}</a>
                    <a className="border px-3 py-1 rounded-lg text-sm">{t("profile.social.instagram")}</a>
                  </>
                )}
                {socials.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noreferrer" className="border px-3 py-1 rounded-lg text-sm font-semibold text-center hover:bg-gray-100">
                    {s.platform}
                  </a>
                ))}
              </div>
            </div>
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
                {/* You can map services from seller or fallback to translations */}
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
                    <img src={p.media?.[0]?.url ?? p.project_url ?? "https://picsum.photos/300/200"} alt={p.title} className="w-full h-40 object-cover rounded-lg transform transition-transform duration-300 ease-out hover:scale-110" />
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

            {activeTab === t("profile.tabs.activity") && (
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
                <h3 className="font-semibold text-sm mb-4">Recent Activity & Blog Posts</h3>

                {(!profilePayload?.posts || profilePayload.posts.length === 0) ? (
                  <div className="text-sm text-gray-500">No recent posts</div>
                ) : (
                  <div className="space-y-4">
                    {profilePayload.posts.map((post) => (
                      <article key={post.id} className="flex gap-4 bg-white rounded-lg p-4 items-center border">
                        {/* LEFT: image */}
                        <div className="w-28 flex-shrink-0">
                          <img
                            src={post.image || post.image_url || "https://picsum.photos/200/140"}
                            alt={post.title}
                            className="w-full h-20 object-cover rounded-md"
                            onError={(e) => { e.currentTarget.src = "https://picsum.photos/200/140"; }}
                          />
                        </div>

                        {/* MIDDLE: title + description */}
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{post.title}</h4>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{post.dsc ?? post.content ?? "-"}</p>

                          <div className="flex items-center gap-3 text-xs text-gray-400 mt-3">
                            {/* created date (use existing formatDateShort to show month year) */}
                            <span>{new Date(post.created_at || post.updated_at || Date.now()).toLocaleDateString()}</span>

                            {/* optional: status or type badge */}
                            {post.type && (
                              <span className="inline-block text-[11px] border rounded-full px-2 py-0.5 bg-white">
                                {post.type.toLowerCase()}
                              </span>
                            )}
                          </div>

                          {/* tags */}
                          <div className="flex gap-2 flex-wrap mt-3">
                            {(post.tags || []).slice(0, 4).map((tag) => (
                              <span key={tag.id ?? tag.name} className="text-[10px] font-semibold px-2 py-1 rounded-md border">
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* RIGHT: optional meta / action */}
                        <div className="flex-shrink-0 text-right ">
                          <button className="text-xs text-gray-600 font-semibold border px-3 py-1 rounded-md bg-white flex flex-row items-center gap-2"><Heart className="h-3 w-3" /> Like</button>
                          <div className="text-[10px] text-gray-400 mt-2">Premium Feature</div>
                          <button className="text-[10px] font-semibold bg-orange-500 hover:bg-orange-600 text-white px-2 py-1.5 rounded-lg items-center justify-center flex gap-2">
                            <Crown className="h-3 w-3" /> {t("profile.upgrade")}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfilePopupModel;
