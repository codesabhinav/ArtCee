import { Link } from "react-router-dom";
import {
  FaSearch,
  FaUsers,
  FaHandshake,
  FaTrophy,
  FaPlayCircle,
  FaCrown,
  FaArrowRight,
  FaBolt,
  FaBuilding,
  FaBookOpen,
  FaPalette,
} from "react-icons/fa";
import bannerImg from "../images/banner.avif";
import backgrpoundImg from "../images/background.jpg";
import { SiSpotlight } from "react-icons/si";
import { BiChevronLeft, BiChevronRight, BiStar } from "react-icons/bi";
import ViewProfilePopupModel from "../modal/ViewProfilePopupModel";
import { useEffect, useState } from "react";
import { useTranslation } from "../contexts/LanguageProvider";
import { getCreativeData } from "../Hooks/useSeller";

const DEFAULT_AVATAR =
  "https://img.freepik.com/premium-photo/memoji-emoji-handsome-smiling-man-white-background_826801-6987.jpg?semt=ais_hybrid&w=740&q=80";

export default function Home() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [professionals, setProfessionals] = useState([]);
  const [selectedUuid, setSelectedUuid] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // call same hook used in CreativeDirectory
        const data = await getCreativeData();
        // the CreativeDirectory expects the API to return an array (it does in your sample)
        if (Array.isArray(data)) {
          setProfessionals(data.slice(0, 3)); // only first 3
        } else if (data?.data && Array.isArray(data.data)) {
          // in case getCreativeData returns the full response
          setProfessionals(data.data.slice(0, 3));
        } else {
          setProfessionals([]);
        }
      } catch (err) {
        console.error("Failed to fetch creatives:", err);
        setProfessionals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getAvailabilityBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "online") return { label: t("creative.available"), badge: "bg-green-100 text-green-700" };
    if (s === "busy") return { label: t("creative.busy"), badge: "bg-yellow-100 text-yellow-700" };
    if (s === "booked") return { label: t("creative.booked"), badge: "bg-orange-100 text-orange-700" };
    return { label: t("creative.offline"), badge: "bg-gray-100 text-gray-700" };
  };


  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative w-full max-w-3xl text-white">
          {/* Top Badge */}
          <button className="bg-orange-500 px-3 sm:px-4 py-2 rounded-md mb-6 shadow text-xs sm:text-sm flex items-center gap-2 justify-center mx-auto">
            <FaCrown className="text-white text-[12px]" />
            {t("home.join_revolution")}
          </button>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight">
            {t("home.title")}{" "}
            <span className="bg-gradient-to-r from-[#1FA29A] to-orange-400 bg-clip-text text-transparent">
              {t("home.get_discovered")}
            </span>
          </h1>

          {/* Subtext */}
          <p className="mt-4 text-sm sm:text-base max-w-2xl mx-auto text-gray-200 px-2 sm:px-0">
            {t("home.subtitle")}
          </p>

          {/* Founding Member Card */}
          <div className="mt-8 sm:mt-10 bg-white text-black p-4 sm:p-6 rounded-xl shadow-md w-full max-w-full sm:max-w-md mx-auto border-2 border-teal-500">
            <div className="font-bold text-start text-xs sm:text-sm flex flex-wrap justify-between items-center gap-2">
              {t("home.founding_program")}{" "}
              <span className="text-[10px] sm:text-xs bg-orange-500 text-white px-2 py-1 rounded-md flex items-center gap-1">
                <FaCrown className="text-[10px]" /> {t("home.lifetime_badge")}
              </span>
            </div>

            <div className="w-full bg-gray-200 h-3 rounded mt-3">
              <div className="bg-black h-3 rounded w-2/3"></div>
            </div>
            <p className="mt-2 text-black/50 text-[10px] sm:text-xs flex justify-between">
              {t("home.progress_joined", { joined: 673 })}{" "}
              <span>{t("home.progress_left", { left: 327 })}</span>
            </p>

            <p className="text-teal-600 font-semibold mt-1 text-[10px] sm:text-xs">
              {t("home.premium_offer")}
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center">
            <Link
              to="/creatives"
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-teal-600 text-white font-semibold flex items-center gap-2 transition hover:scale-105"
            >
              <FaPlayCircle className="text-base sm:text-lg" />{" "}
              {t("home.explore_creatives")}
            </Link>
            <Link
              to="/featured"
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-white text-white font-semibold flex items-center gap-2 hover:bg-white hover:text-black transition"
            >
              <FaCrown className="text-base sm:text-lg" /> {t("home.get_featured")}
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="relative py-20 bg-gray-50">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${backgrpoundImg})` }}
        ></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <h2 className=" text-2xl lg:text-3xl font-extrabold text-center">
            {t("home.value_title")}
          </h2>
          <p className="text-center mt-4 text-gray-500 max-w-2xl mx-auto">
            {t("home.value_subtitle")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {/* For Creatives */}
            <div className="bg-white p-8 rounded-xl shadow-md border hover:border-teal-500 hover:shadow-lg transition group">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-teal-500 text-white shadow-md mb-4">
                <FaPalette />
              </div>
              <h3 className="font-bold text-xl">{t("home.for_creatives_title")}</h3>
              <p className="mt-2 text-gray-600 text-sm">
                {t("home.for_creatives_desc")}
              </p>
              <ul className="mt-4 space-y-2 text-gray-600 text-sm">
                <li>{t("home.for_creatives_list1")}</li>
                <li>{t("home.for_creatives_list2")}</li>
                <li>{t("home.for_creatives_list3")}</li>
                <li>{t("home.for_creatives_list4")}</li>
              </ul>
              <Link
                to="/creatives"
                className="text-xs mt-6 w-full flex items-center justify-center gap-2 px-5 py-2 bg-teal-500 text-white rounded-md font-semibold hover:opacity-90 transition"
              >
                {t("home.for_creatives_btn")} <FaArrowRight />
              </Link>
            </div>

            {/* For Companies */}
            <div className="bg-white p-8 rounded-xl shadow-md border-2 hover:border-orange-500 hover:shadow-lg transition group">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-500 text-white shadow-md mb-4">
                <FaBolt />
              </div>
              <h3 className="font-bold text-xl">{t("home.for_companies_title")}</h3>
              <p className="mt-2 text-gray-600 text-sm">
                {t("home.for_companies_desc")}
              </p>
              <ul className="mt-4 space-y-2 text-gray-600 text-sm">
                <li>{t("home.for_companies_list1")}</li>
                <li>{t("home.for_companies_list2")}</li>
                <li>{t("home.for_companies_list3")}</li>
                <li>{t("home.for_companies_list4")}</li>
              </ul>
              <Link
                to="/creatives"
                className="text-xs mt-6 w-full flex items-center justify-center gap-2 px-5 py-2 border border-orange-400 text-orange-500 rounded-md font-semibold hover:bg-orange-500 hover:text-white transition"
              >
                {t("home.for_companies_btn")} <FaArrowRight />
              </Link>
            </div>

            {/* For Businesses */}
            <div className="bg-white p-8 rounded-xl shadow-md border hover:border-teal-500 hover:shadow-lg transition group">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-teal-500 text-white shadow-md mb-4">
                <FaBuilding />
              </div>
              <h3 className="font-bold text-xl">{t("home.for_businesses_title")}</h3>
              <p className="mt-2 text-gray-600 text-sm">
                {t("home.for_businesses_desc")}
              </p>
              <ul className="mt-4 space-y-2 text-gray-600 text-sm">
                <li>{t("home.for_businesses_list1")}</li>
                <li>{t("home.for_businesses_list2")}</li>
                <li>{t("home.for_businesses_list3")}</li>
                <li>{t("home.for_businesses_list4")}</li>
              </ul>
              <Link
                to="/business-directory"
                className="text-xs mt-6 w-full flex items-center justify-center gap-2 px-5 py-2 bg-teal-500 text-white rounded-md font-semibold hover:opacity-90 transition"
              >
                {t("home.for_businesses_btn")} <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-14  lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            {t("home.how_it_works_title")}
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            {t("home.how_it_works_subtitle")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-16">
            <div className="group">
              <div className="w-20 h-20 flex items-center justify-center mx-auto rounded-full bg-teal-500 text-white text-3xl shadow-md">
                <FaSearch />
              </div>
              <h4 className="mt-6 font-bold text-lg">{t("home.step1_title")}</h4>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                {t("home.step1_desc")}
              </p>
            </div>

            <div className="group">
              <div className="w-20 h-20 flex items-center justify-center mx-auto rounded-full bg-orange-500 text-white text-3xl shadow-md">
                <FaUsers />
              </div>
              <h4 className="mt-6 font-bold text-lg">{t("home.step2_title")}</h4>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                {t("home.step2_desc")}
              </p>
            </div>

            <div className="group">
              <div className="w-20 h-20 flex items-center justify-center mx-auto rounded-full bg-teal-500 text-white text-3xl shadow-md">
                <FaHandshake />
              </div>
              <h4 className="mt-6 font-bold text-lg">{t("home.step3_title")}</h4>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                {t("home.step3_desc")}
              </p>
            </div>

            <div className="group">
              <div className="w-20 h-20 flex items-center justify-center mx-auto rounded-full bg-orange-500 text-white text-3xl shadow-md">
                <FaTrophy />
              </div>
              <h4 className="mt-6 font-bold text-lg">{t("home.step4_title")}</h4>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                {t("home.step4_desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Professionals */}
      <section className="py-14  lg:py-20 bg-gradient-to-b from-cyan-50 via-white to-pink-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">
              {t("home.featured_title")}
            </h2>
            <p className="mt-2 text-gray-600">{t("home.featured_subtitle")}</p>
          </div>

          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <p className="text-center py-10 text-gray-500">{t("creative.loading") || "Loading..."}</p>
            ) : professionals.length === 0 ? (
              <p className="text-center py-10 text-gray-500">{t("creative.no_creatives")}</p>
            ) : (
              professionals.map((pro) => {
                const profileSrc = pro?.user?.profile?.profile_picture || DEFAULT_AVATAR;
                const name = pro?.user?.full_name || t("creative.anonymous");
                const title = pro?.user?.profile?.title || "—";
                const availability = getAvailabilityBadge(pro?.status);
                const uuid = pro?.user?.uuid || "";

                return (
                  <div
                    key={pro.id ?? pro.uuid ?? name}
                    className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
                  >
                    <div className="relative h-44 bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center">
                      <img
                        src={profileSrc}
                        alt={name}
                        className="object-cover max-h-[180px] w-full"
                        onError={(e) => {
                          if (e.currentTarget.src !== DEFAULT_AVATAR) {
                            e.currentTarget.src = DEFAULT_AVATAR;
                          }
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-gray-900 text-white text-sm px-2 py-1 rounded-md flex items-center gap-1">
                        <BiStar className="w-4 h-4 text-yellow-400" />
                        {typeof pro.user.rating === "number" ? pro.user.rating.toFixed(1) : pro.user.rating ?? "—"}
                      </div>
                    </div>

                    <div className="p-5 text-left">
                      <h4 className="text-sm text-gray-500">{title}</h4>
                      <h3 className="text-lg font-semibold">{name}</h3>

                      <p className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${availability.label === t("creative.available") ? "bg-green-500" : "bg-red-500"
                            }`}
                        ></span>
                        {availability.label}
                      </p>

                      <p className="mt-3 text-gray-600 text-sm line-clamp-3">
                        {pro.personal_intro || pro.user?.profile?.bio || t("creative.no_intro")}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {Array.isArray(pro.user?.skills) && pro.user.skills.slice(0, 5).map((skill) => (
                          <span key={skill.id ?? skill.name} className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md">
                            {skill.name}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          setSelectedUuid(uuid);
                          setOpen(true);
                        }}

                        className="mt-5 w-full bg-teal-500 hover:bg-teal-600 text-xs text-white py-2 rounded-md font-medium shadow-md transition"
                      >
                        {t("home.view_profile")}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <ViewProfilePopupModel isOpen={open} onClose={() => {
            setOpen(false);
            setSelectedUuid(null);
          }} uuid={selectedUuid} />

          <div className="flex justify-center mt-10">
            <Link
              to="/creatives"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-200 text-xs text-black font-medium px-6 py-3 rounded-md shadow-md transition transform hover:scale-105"
            >
              <FaSearch className="w-3 h-3" />
              {t("home.browse_all_creatives")}
              <FaArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Spotlight & Perspective */}
      <section className="relative w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-50 via-white to-cyan-50 -z-10" />

        <div className="max-w-5xl mx-auto px-6 py-14 lg:py-20 space-y-24 text-center">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {t("home.spotlight_title")}
            </h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              {t("home.spotlight_desc")}
            </p>
            <button className="text-xs mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-medium px-6 py-2.5 rounded-md shadow-md transition transform hover:scale-105">
              <SiSpotlight className="w-4 h-4" />
              {t("home.spotlight_btn")}
              <FaArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t("home.perspective_title")}
            </h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              {t("home.perspective_desc")}
            </p>
            <button className="text-xs mt-6 inline-flex items-center gap-2 bg-teal-500 text-white font-medium px-6 py-2.5 rounded-md shadow-md transition transform hover:scale-105">
              <FaBookOpen className="w-4 h-4" />
              {t("home.perspective_btn")}
              <FaArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
