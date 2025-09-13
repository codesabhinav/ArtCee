import React, { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { useTranslation } from "../contexts/LanguageProvider";

const ViewProfilePopupModel = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("portfolio");

  if (!isOpen) return null;

  const tabs = [
    t("profile.tabs.portfolio"),
    t("profile.tabs.reviews"),
    t("profile.tabs.education"),
    t("profile.tabs.activity"),
    t("profile.tabs.pricing"),
  ];

  // sample portfolio & content remain static arrays — only labels are translated
  const samplePortfolio = [
    {
      img: "https://picsum.photos/300/200?1",
      title: t("profile.sample_portfolio.chanel_title"),
      role: t("profile.sample_portfolio.chanel_role"),
    },
    {
      img: "https://picsum.photos/300/200?2",
      title: t("profile.sample_portfolio.fourseasons_title"),
      role: t("profile.sample_portfolio.fourseasons_role"),
    },
    {
      img: "https://picsum.photos/300/200?3",
      title: t("profile.sample_portfolio.fashion_title"),
      role: t("profile.sample_portfolio.fashion_role"),
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-xl shadow-lg relative border border-orange-600 scrollbar-hide">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/100"
              alt={t("profile.profile_alt")}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h2 className="font-bold text-lg flex items-center gap-2">
                Aria Stone{" "}
                <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-md">
                  {t("profile.featured_tag")}
                </span>
              </h2>
              <p className="text-sm text-gray-500">
                {t("profile.role_photography")}
              </p>
            </div>
          </div>
          <button onClick={onClose}>
            <IoCloseCircle className="w-6 h-6 text-gray-500 hover:text-black" />
          </button>
        </div>

        {/* Featured Tag */}
        <div className="px-6 py-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2 text-orange-600 font-medium">
              <span className="text-lg">👑</span>
              <span>{t("profile.featured_creative")}</span>
            </div>
            <p className="text-sm text-orange-700 mt-1">
              {t("profile.featured_description")}
            </p>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="grid grid-cols-3 gap-6 px-6 py-6">
          {/* Left Column */}
          <div className="col-span-1 flex flex-col items-center border rounded-lg p-4">
            <img
              src="https://i.pravatar.cc/300"
              alt={t("profile.profile_alt")}
              className="w-40 h-48 rounded-lg object-cover"
            />

            {/* Stats */}
            <div className="flex gap-6 text-center mt-4">
              <div>
                <p className="font-bold">3890</p>
                <p className="text-sm text-gray-500">{t("profile.followers")}</p>
              </div>
              <div>
                <p className="font-bold">234</p>
                <p className="text-sm text-gray-500">{t("profile.following")}</p>
              </div>
              <div>
                <p className="font-bold">8920</p>
                <p className="text-sm text-gray-500">{t("profile.likes")}</p>
              </div>
            </div>

            {/* Buttons */}
            <button className="mt-4 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg w-full">
              {t("profile.book_now")}
            </button>
            <div className="flex gap-2 mt-3 w-full">
              <button className="flex-1 border px-4 py-2 rounded-lg">{t("profile.message")}</button>
              <button className="flex-1 border px-4 py-2 rounded-lg">{t("profile.video_call")}</button>
            </div>

            {/* Premium Upgrade */}
            <div className="mt-4 w-full text-center">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg w-full">
                {t("profile.upgrade")}
              </button>
              <p className="text-xs text-gray-500 mt-1">{t("profile.premium_features")}</p>

              <button className="mt-3 border px-4 py-2 rounded-lg w-full">{t("profile.follow")}</button>
              <p className="text-xs text-gray-500">{t("profile.premium_feature_note")}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-2 space-y-4">
            {/* Quick Info */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-700">
              <span className="flex items-center gap-1">
                ⭐ <b>{t("profile.rating_text")}</b>
              </span>
              <span className="flex items-center gap-1">{t("profile.location_text")}</span>
              <span className="flex items-center gap-1">{t("profile.experience_text")}</span>
              <span className="flex items-center gap-1 text-green-600">{t("profile.available_text")}</span>
            </div>

            {/* About */}
            <div>
              <h3 className="font-semibold">{t("profile.about_title")}</h3>
              <p className="text-gray-700 mt-1">
                {t("profile.about_text")}
              </p>
            </div>

            {/* Introduction */}
            <div>
              <h3 className="font-semibold flex items-center gap-2 text-teal-600">
                <span>💬</span> {t("profile.introduction_title")}
              </h3>
              <blockquote className="text-gray-600 italic border-l-4 border-teal-500 pl-3 mt-1">
                {t("profile.introduction_quote")}
              </blockquote>
            </div>

            {/* Creative Vision */}
            <div>
              <h3 className="font-semibold flex items-center gap-2 text-orange-600">
                <span>💡</span> {t("profile.vision_title")}
              </h3>
              <p className="text-gray-700 mt-1">
                {t("profile.vision_text")}
              </p>
            </div>

            {/* Services & Industries */}
            <div className="">
              <h3 className="font-semibold">{t("profile.industries_title")}</h3>
              <div className="flex gap-2 flex-wrap mt-2">
                {["Fashion", "Lifestyle", "Beauty", "Hospitality"].map((i) => (
                  <span key={i} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-lg">
                    {i}
                  </span>
                ))}
              </div>

              <h3 className="font-semibold mt-4">{t("profile.services_title")}</h3>
              <div className="flex gap-2 flex-wrap mt-2">
                {[
                  t("profile.service.photography"),
                  t("profile.service.creative_direction"),
                  t("profile.service.brand_photography"),
                  t("profile.service.content_creation"),
                ].map((s) => (
                  <span key={s} className="bg-teal-100 text-teal-700 text-sm px-3 py-1 rounded-lg">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="px-6 py-4 border-t">
          <h3 className="font-semibold">{t("profile.connect_title")}</h3>
          <div className="flex gap-3 mt-2">
            <a href="#" className="border px-3 py-1 rounded-lg">
              {t("profile.social.website")}
            </a>
            <a href="#" className="border px-3 py-1 rounded-lg">
              {t("profile.social.instagram")}
            </a>
            <a href="#" className="border px-3 py-1 rounded-lg">
              {t("profile.social.linkedin")}
            </a>
            <a href="#" className="border px-3 py-1 rounded-lg">
              {t("profile.social.500px")}
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 py-4">
          <div className="flex justify-between border-b bg-gray-200 rounded-full">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-1 text-sm text-black m-1 font-medium rounded-full transition ${activeTab === tab ? "bg-white shadow" : "bg-gray-200"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-4">
            {activeTab === t("profile.tabs.portfolio") && (
              <div className="grid grid-cols-3 gap-4">
                {samplePortfolio.map((p, i) => (
                  <div key={i} className="rounded-lg overflow-hidden shadow">
                    <img src={p.img} alt={p.title} className="w-full h-40 object-cover" />
                    <div className="p-3">
                      <h4 className="font-semibold">{p.title}</h4>
                      <p className="text-sm text-gray-500">{p.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === t("profile.tabs.reviews") && (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-lg">{t("profile.reviews.client_reviews")}</h3>
                    <p className="text-sm text-gray-500">{t("profile.reviews.based_on_reviews", { count: 2 })}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl">4.9</p>
                    <p className="text-orange-500">★★★★★</p>
                  </div>
                </div>

                {/* Review Cards */}
                <div className="space-y-4">
                  {/* Review 1 */}
                  <div className="border rounded-lg p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://i.pravatar.cc/50?u=chanel"
                          alt="Chanel Creative Team"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold">{t("profile.reviews.chanel_team")}</h4>
                          <p className="text-sm text-gray-500">{t("profile.reviews.fashion_photography")}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-orange-500">★★★★★</p>
                        <p className="text-gray-400">7/5/2024</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm font-light">
                      {t("profile.reviews.chanel_quote")}
                    </p>
                  </div>

                  {/* Review 2 */}
                  <div className="border rounded-lg p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://i.pravatar.cc/50?u=fourseasons"
                          alt="Four Seasons Hotels"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold">{t("profile.reviews.fourseasons")}</h4>
                          <p className="text-sm text-gray-500">{t("profile.reviews.hospitality_photography")}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-orange-500">★★★★★</p>
                        <p className="text-gray-400">5/20/2024</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm font-light">
                      {t("profile.reviews.fourseasons_quote")}
                    </p>
                    <span className="inline-block bg-teal-100 text-teal-700 text-xs font-medium px-3 py-1 rounded-full w-fit">
                      {t("profile.reviews.professional_endorsement")}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === t("profile.tabs.education") && (
              <div className="space-y-6">
                {/* Education Section */}
                <div>
                  <h3 className="font-semibold flex items-center gap-2 text-green-600">
                    🎓 {t("profile.education_title")}
                  </h3>

                  <div className="mt-3 space-y-4">
                    {[
                      {
                        degree: t("profile.education.bfa"),
                        school: t("profile.education.parsons"),
                        description: t("profile.education.bfa_desc"),
                        achievements: [
                          t("profile.education.award_dept"),
                          t("profile.education.deans_list"),
                        ],
                        duration: "2012 – 2016",
                      },
                      {
                        degree: t("profile.education.ma_visual"),
                        school: t("profile.education.sva"),
                        description: t("profile.education.ma_desc"),
                        achievements: [t("profile.education.excellence_research")],
                        duration: "2016 – 2018",
                      },
                    ].map((edu, i) => (
                      <div key={i} className="border rounded-lg p-4 bg-white shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-800">{edu.degree}</h4>
                            <p className="text-sm text-gray-600">{edu.school}</p>
                            <p className="text-sm text-gray-500 mt-1">{edu.description}</p>

                            {edu.achievements?.length > 0 && (
                              <div className="mt-3">
                                <h5 className="font-medium text-gray-700">{t("profile.education.achievements")}</h5>
                                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1 mt-1">
                                  {edu.achievements.map((a, j) => (
                                    <li key={j}>{a}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">{edu.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications Section */}
                <div>
                  <h3 className="font-semibold flex items-center gap-2 text-orange-600">🏅 {t("profile.certifications_title")}</h3>
                  <div className="mt-3 space-y-4">
                    {[
                      {
                        title: t("profile.certifications.cpp_title"),
                        org: t("profile.certifications.ppoa"),
                        issued: "6/10/2019",
                        expires: "6/10/2025",
                      },
                      {
                        title: t("profile.certifications.ace_title"),
                        org: t("profile.certifications.adobe"),
                        issued: "4/15/2020",
                        expires: "4/15/2026",
                      },
                    ].map((cert, i) => (
                      <div key={i} className="border rounded-lg p-4 bg-white shadow-sm">
                        <h4 className="font-semibold text-gray-800">{cert.title}</h4>
                        <p className="text-sm text-gray-600">{cert.org}</p>
                        <div className="mt-2 text-sm text-gray-500 space-y-1">
                          <p>{t("profile.certifications.issued")}: {cert.issued}</p>
                          <p>{t("profile.certifications.expires")}: {cert.expires}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === t("profile.tabs.activity") && (
              <div className="space-y-6">
                {/* Professional Experience */}
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-lg">{t("profile.activity.professional_experience")}</h3>
                  <div className="grid grid-cols-3 gap-6 text-sm">
                    <div>
                      <p className="text-gray-500">{t("profile.activity.career_level")}</p>
                      <span className="inline-block bg-teal-100 text-teal-700 text-xs font-medium px-3 py-1 rounded-full">
                        {t("profile.activity.senior_level")}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-500">{t("profile.activity.years_active")}</p>
                      <p className="font-medium">8 {t("profile.activity.years")}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">{t("profile.activity.availability")}</p>
                      <p className="text-green-600 flex items-center gap-1">{t("profile.available_text")}</p>
                    </div>
                  </div>

                  {/* Notable Clients */}
                  <div>
                    <h4 className="font-semibold mt-4">{t("profile.activity.notable_clients")}</h4>
                    <div className="flex gap-2 flex-wrap mt-2">
                      {["Vogue", "Chanel", "Four Seasons", "Tesla"].map((c) => (
                        <span key={c} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-lg">{c}</span>
                      ))}
                    </div>
                  </div>

                  {/* Awards */}
                  <div>
                    <h4 className="font-semibold mt-4">{t("profile.activity.awards")}</h4>
                    <ul className="text-sm text-gray-700 mt-2 space-y-1">
                      <li>⭐ {t("profile.activity.lucie_award")}</li>
                      <li>⭐ {t("profile.activity.ip_award")}</li>
                    </ul>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="font-semibold mt-4">{t("profile.activity.skills_tools")}</h4>
                    <div className="flex gap-2 flex-wrap mt-2">
                      {[
                        "Canon 5D Mark IV",
                        "Adobe Lightroom",
                        "Photoshop",
                        "Studio Lighting",
                        "Natural Light",
                        "Retouching",
                      ].map((s) => (
                        <span key={s} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-lg">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Activity & Blog Posts */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">{t("profile.activity.recent_posts_title")}</h3>
                  <div className="border rounded-lg p-4 flex gap-4">
                    <img src="https://picsum.photos/100/100" alt="blog" className="w-24 h-24 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{t("profile.activity.blog_title")}</h4>
                      <p className="text-gray-600 text-sm mt-1">{t("profile.activity.blog_excerpt")}</p>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                        <span>👁 445 {t("profile.activity.views")}</span>
                        <span>❤️ 67 {t("profile.activity.likes")}</span>
                        <span>📅 7/28/2024</span>
                      </div>

                      {/* Tags */}
                      <div className="flex gap-2 flex-wrap mt-2">
                        {["Photography", "Tutorial", "Lighting", "Natural Light"].map((tTag) => (
                          <span key={tTag} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-lg">{tTag}</span>
                        ))}
                      </div>
                    </div>

                    {/* Premium Section */}
                    <div className="flex flex-col items-end justify-between">
                      <span className="text-orange-500 text-xs font-medium bg-orange-50 px-2 py-1 rounded-md">{t("profile.activity.tutorial_tag")}</span>
                      <div className="text-xs text-gray-500 text-center">
                        <button className="text-gray-400 border rounded-lg px-3 py-1 mt-2">{t("profile.activity.like")}</button>
                        <p className="text-gray-400 mt-1">{t("profile.premium_feature_note")}</p>
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg mt-1">{t("profile.upgrade")}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === t("profile.tabs.pricing") && (
              <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                {/* Header */}
                <h3 className="font-semibold text-lg flex items-center gap-2"><span className="text-green-600 text-xl">💲</span> {t("profile.pricing.title")}</h3>

                {/* Rates */}
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-teal-600 font-bold text-2xl">{t("profile.pricing.per_hour_amount")}</p>
                    <p className="text-gray-500 text-sm">{t("profile.pricing.per_hour")}</p>
                  </div>
                  <div>
                    <p className="text-teal-600 font-bold text-2xl">{t("profile.pricing.per_day_amount")}</p>
                    <p className="text-gray-500 text-sm">{t("profile.pricing.per_day")}</p>
                  </div>
                  <div>
                    <p className="text-teal-600 font-bold text-2xl">{t("profile.pricing.per_project_amount")}</p>
                    <p className="text-gray-500 text-sm">{t("profile.pricing.per_project")}</p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="text-sm text-gray-600 space-y-2">
                  <p><span className="font-medium">{t("profile.pricing.currency_label")}:</span> {t("profile.pricing.currency")}</p>
                  <p><span className="font-medium">{t("profile.pricing.rates_negotiable_label")}:</span> <span className="text-green-600 font-medium">{t("profile.pricing.yes")}</span></p>
                  <p><span className="font-medium">{t("profile.pricing.starting_rate_label")}:</span> {t("profile.pricing.starting_rate")}</p>
                </div>

                {/* Note */}
                <div className="bg-orange-50 border border-orange-200 text-orange-700 text-sm px-4 py-3 rounded-lg">
                  <strong>{t("profile.pricing.note_strong")}</strong> {t("profile.pricing.note_text")}
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
