import {
  BriefcaseIcon,
  CameraIcon,
  PencilIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
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
  FaRegCircle,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import CreatePostPopupModel from "../modal/CreatePostPopupModel";
import { useTranslation } from "../contexts/LanguageProvider";

const GuestDashboardPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="bg-white min-h-screen w-full">
      <div className="md:max-w-[80%] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b gap-3 sm:gap-0">
          <Link
            to="/home"
            className="text-black font-medium text-xs hover:bg-gray-200 rounded-md px-4 py-2 flex items-center w-fit"
          >
            <FaArrowLeft className="mr-2" /> {t("guest.back_to_home")}
          </Link>

          <div className="flex flex-col flex-1 text-start sm:ml-4">
            <h1 className="text-lg sm:text-xl font-bold">{t("guest.welcome_message")}</h1>
            <p className="text-sm font-light text-gray-600">
              {t("guest.manage_profile")}
            </p>
          </div>

          <span className="px-4 py-1 text-xs bg-gray-100 text-gray-500 font-medium rounded-md w-fit sm:ml-auto">
            {t("guest.free_account")}
          </span>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Left Side */}
          <div className="col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white border rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <img
                  src={t("guest.profile_image")}
                  alt={t("guest.guest_user")}
                  className="w-16 h-16 rounded-full mx-auto sm:mx-0"
                />
                <div className="text-center sm:text-left">
                  <h2 className="text-base sm:text-lg font-bold">{t("guest.guest_user")}</h2>
                  <p className="text-gray-500 text-sm">{t("guest.creative_professional")}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {t("guest.welcome_note")}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 text-center mt-6 gap-4">
                <div>
                  <p className="font-bold">0</p>
                  <p className="text-xs text-gray-500">{t("guest.followers")}</p>
                </div>
                <div>
                  <p className="font-bold">0</p>
                  <p className="text-xs text-gray-500">{t("guest.portfolio")}</p>
                </div>
                <div>
                  <p className="font-bold">0</p>
                  <p className="text-xs text-gray-500">{t("guest.services")}</p>
                </div>
                <div>
                  <p className="font-bold">0</p>
                  <p className="text-xs text-gray-500">{t("guest.years_exp")}</p>
                </div>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-white border rounded-lg p-6 mt-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                <h3 className="font-semibold">{t("guest.profile_completion")}</h3>
                <span className="text-xs bg-yellow-100 text-yellow-600 px-3 py-1 rounded-md w-fit">
                  {t("guest.incomplete_profile")}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-black h-2 rounded-full"
                  style={{ width: "10%" }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                {t("guest.completion_status")}
              </p>
              <h4 className="font-semibold text-sm mb-3">{t("guest.required_for_activation")}</h4>
              <ul className="space-y-2 mb-6">
                {/* Completed Example */}
                <li className="flex items-center justify-between border border-green-500 bg-green-50 px-4 py-2 rounded-md">
                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-500 mt-1 text-sm" />
                    <div>
                      <p className="text-sm font-medium">{t("guest.basic_information")}</p>
                      <p className="text-xs text-gray-500">{t("guest.basic_information_desc")}</p>
                    </div>
                  </div>
                  <FaChevronRight className="text-gray-400 text-xs" />
                </li>

                {/* Pending Examples */}
                <li className="flex items-center justify-between border px-4 py-2 rounded-md">
                  <div className="flex items-start gap-3">
                    <FaRegCircle className="text-gray-400 mt-1 text-sm" />
                    <div>
                      <p className="text-sm font-medium">{t("guest.location_details")}</p>
                      <p className="text-xs text-gray-500">{t("guest.location_details_desc")}</p>
                    </div>
                  </div>
                  <FaChevronRight className="text-gray-400 text-xs" />
                </li>

                <li className="flex items-center justify-between border px-4 py-2 rounded-md">
                  <div className="flex items-start gap-3">
                    <FaRegCircle className="text-gray-400 mt-1 text-sm" />
                    <div>
                      <p className="text-sm font-medium">{t("guest.personal_intro")}</p>
                      <p className="text-xs text-gray-500">{t("guest.personal_intro_desc")}</p>
                    </div>
                  </div>
                  <FaChevronRight className="text-gray-400 text-xs" />
                </li>

                <li className="flex items-center justify-between border px-4 py-2 rounded-md">
                  <div className="flex items-start gap-3">
                    <FaRegCircle className="text-gray-400 mt-1 text-sm" />
                    <div>
                      <p className="text-sm font-medium">{t("guest.profile_media")}</p>
                      <p className="text-xs text-gray-500">{t("guest.profile_media_desc")}</p>
                    </div>
                  </div>
                  <FaChevronRight className="text-gray-400 text-xs" />
                </li>

                <li className="flex items-center justify-between border px-4 py-2 rounded-md">
                  <div className="flex items-start gap-3">
                    <FaRegCircle className="text-gray-400 mt-1 text-sm" />
                    <div>
                      <p className="text-sm font-medium">{t("guest.email_verification")}</p>
                      <p className="text-xs text-gray-500">{t("guest.email_verification_desc")}</p>
                    </div>
                  </div>
                  <FaChevronRight className="text-gray-400 text-xs" />
                </li>
              </ul>

              {/* Optional Enhancements */}
              <h4 className="font-semibold text-sm mb-3">{t("guest.optional_enhancements_title")}</h4>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center justify-between border px-4 py-2 rounded-md">
                  <div className="flex items-start gap-3">
                    <FaRegCircle className="text-gray-400 mt-1 text-sm" />
                    <div>
                      <p className="text-sm font-medium">{t("guest.professional_bio")}</p>
                      <p className="text-xs text-gray-500">{t("guest.professional_bio_desc")}</p>
                    </div>
                  </div>
                  <FaChevronRight className="text-gray-400 text-xs" />
                </li>

                <li className="flex items-center justify-between border px-4 py-2 rounded-md">
                  <div className="flex items-start gap-3">
                    <FaRegCircle className="text-gray-400 mt-1 text-sm" />
                    <div>
                      <p className="text-sm font-medium">{t("guest.services_skills")}</p>
                      <p className="text-xs text-gray-500">{t("guest.services_skills_desc")}</p>
                    </div>
                  </div>
                  <FaChevronRight className="text-gray-400 text-xs" />
                </li>

                <li className="flex items-center justify-between border px-4 py-2 rounded-md">
                  <div className="flex items-start gap-3">
                    <FaRegCircle className="text-gray-400 mt-1 text-sm" />
                    <div>
                      <p className="text-sm font-medium">{t("guest.portfolio_work")}</p>
                      <p className="text-xs text-gray-500">{t("guest.portfolio_work_desc")}</p>
                    </div>
                  </div>
                  <FaChevronRight className="text-gray-400 text-xs" />
                </li>

                <li className="flex items-center justify-between border px-4 py-2 rounded-md">
                  <div className="flex items-start gap-3">
                    <FaRegCircle className="text-gray-400 mt-1 text-sm" />
                    <div>
                      <p className="text-sm font-medium">{t("guest.social_links")}</p>
                      <p className="text-xs text-gray-500">{t("guest.social_links_desc")}</p>
                    </div>
                  </div>
                  <FaChevronRight className="text-gray-400 text-xs" />
                </li>

                <li className="flex items-center justify-between border px-4 py-2 rounded-md">
                  <div className="flex items-start gap-3">
                    <FaRegCircle className="text-gray-400 mt-1 text-sm" />
                    <div>
                      <p className="text-sm font-medium">{t("guest.pricing_info")}</p>
                      <p className="text-xs text-gray-500">{t("guest.pricing_info_desc")}</p>
                    </div>
                  </div>
                  <FaChevronRight className="text-gray-400 text-xs" />
                </li>
              </ul>

              {/* Footer Note */}
              <div className="bg-yellow-50 text-yellow-700 text-xs px-4 py-3 rounded-md">
                {t("guest.footer_note")}
              </div>
            </div>

            {/* Activity & Blog Section */}
            <div className="bg-white border rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3 sm:gap-0">
                <h3 className="text-sm flex items-center gap-2">
                  <PencilIcon className="h-5 w-5" /> {t("guest.activity_blog")}
                </h3>
                <button
                  onClick={() => setIsOpen(true)}
                  className="bg-teal-500 text-white px-4 py-2 text-xs rounded-md hover:bg-teal-600 w-full sm:w-auto"
                >
                  {t("guest.create_post")}
                </button>
              </div>

              <div className="text-center py-6">
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-gray-100">
                  <PencilIcon className="h-7 w-7" />
                </div>
                <p className="text-sm font-medium">
                  {t("guest.start_sharing")}
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  {t("guest.create_blog_note")}
                </p>
                <button
                  onClick={() => setIsOpen(true)}
                  className="bg-teal-500 text-white px-4 py-2 rounded-md text-xs w-full sm:w-auto"
                >
                  {t("guest.create_first_post")}
                </button>
              </div>
            </div>

            <CreatePostPopupModel isOpen={isOpen} setIsOpen={setIsOpen} />

            {/* Job Applications Section */}
            <div className="bg-white border rounded-lg p-6 mt-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3 sm:gap-0">
                <h3 className="text-sm flex items-center gap-2">
                  <BriefcaseIcon className="h-5 w-5" /> {t("guest.job_applications")}
                </h3>
                <button
                  onClick={() => navigate("/jobs")}
                  className="border px-3 py-1 text-xs rounded-md hover:bg-gray-100 w-full sm:w-auto"
                >
                  {t("guest.browse_jobs")}
                </button>
              </div>

              <div className="text-center py-6">
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-gray-100">
                  <BriefcaseIcon className="h-7 w-7" />
                </div>
                <p className="text-sm font-medium">{t("guest.no_applications")}</p>
                <p className="text-xs text-gray-500 mb-4">
                  {t("guest.apply_jobs_note")}
                </p>
                <button
                  onClick={() => navigate("/jobs")}
                  className="bg-teal-500 text-white px-4 py-2 rounded-md text-xs w-full sm:w-auto"
                >
                  {t("guest.browse_available_jobs")}
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
                <h3 className="font-bold text-md mb-1">{t("guest.unlock_social_features_title")}</h3>
                <p className="text-xs text-gray-500 mb-4">
                  {t("guest.unlock_social_features_desc")}
                </p>
              </div>

              {/* Features */}
              <ul className="text-xs space-y-2 text-left">
                <li className="text-green-600">✔ {t("guest.featured_in_directory")}</li>
                <li className="text-green-600">✔ {t("guest.follow_other_creatives")}</li>
                <li className="text-green-600">✔ {t("guest.like_support_content")}</li>
                <li className="text-green-600">✔ {t("guest.story_spotlight")}</li>
                <li className="text-orange-500">★ {t("guest.founding_member_badge")}</li>
              </ul>

              {/* Pricing */}
              <div className="mt-4 text-xs bg-orange-50 text-orange-600 border border-orange-600 px-3 py-2 rounded-md">
                {t("guest.founding_pricing_note")}
              </div>

              <button onClick={() => navigate("/featured")} className="w-full text-xs mt-3 bg-orange-500 text-white py-2 rounded-md font-medium">
                {t("guest.become_founding")}
              </button>
              <button onClick={() => navigate("/featured")} className="w-full text-xs mt-3 border border-teal-500 text-teal-600 py-2 rounded-md font-medium hover:bg-gray-200">
                {t("guest.premium_monthly")}
              </button>
            </div>

            {/* Account Includes */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-normal text-sm mb-3">{t("guest.account_includes_title")}</h3>
              <ul className="space-y-3 text-xs">
                <li className="flex justify-between items-center">
                  <span className="flex items-center  gap-2">
                    <BiCloudUpload className="text-teal-500 h-4 w-4" /> {t("guest.portfolio_uploads")}
                  </span>
                  <span className="bg-green-100 text-green-600 font-semibold text-xs px-2 py-1 rounded-md">{t("guest.unlimited")}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <BiImage className="text-teal-500 h-4 w-4" /> {t("guest.images_videos")}
                  </span>
                  <span className="bg-green-100 text-green-600 font-semibold text-xs px-2 py-1 rounded-md">{t("guest.unlimited")}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <PencilIcon className="text-teal-500 h-4 w-4" /> {t("guest.blog_posts")}
                  </span>
                  <span className="bg-green-100 text-green-600 font-semibold text-xs px-2 py-1 rounded-md">{t("guest.unlimited")}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <BriefcaseIcon className="text-teal-500 h-4 w-4" /> {t("guest.job_applications")}
                  </span>
                  <span className="bg-green-100 text-green-600 font-semibold text-xs px-2 py-1 rounded-md">{t("guest.unlimited")}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <BiSearch className="text-teal-500 h-4 w-4" /> {t("guest.directory_listing")}
                  </span>
                  <span className="bg-green-100 text-green-600 font-semibold text-xs px-2 py-1 rounded-md">{t("guest.included")}</span>
                </li>
              </ul>
            </div>

            {/* Current Plan */}
            <div className="bg-white border rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-normal text-sm">{t("guest.current_plan_label")}</h3>
                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-xl">
                  {t("guest.active")}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6 text-xs">
                {/* Billing Info */}
                <div>
                  <p className="text-black font-medium mb-2">{t("guest.billing_information")}</p>
                  <p className="text-gray-500">{t("guest.price_label")}</p>
                  <p className="font-medium mb-2">$0</p>

                  <p className="text-gray-500">{t("guest.billing_cycle_label")}</p>
                  <p className="font-medium mb-2">{t("guest.free_label")}</p>

                  <p className="text-gray-500">{t("guest.member_since_label")}</p>
                  <p className="font-medium">August 4, 2024</p>

                  <button onClick={() => navigate("/featured")} className="w-full mt-4 bg-teal-500 text-white py-1.5 rounded-md text-xs font-semibold">
                    {t("guest.upgrade_to_premium")}
                  </button>
                  <p className="text-[10px] text-gray-500 mt-1 text-center">
                    {t("guest.upgrade_note")}
                  </p>
                </div>

                {/* Plan Features */}
                <div>
                  <p className="text-black font-medium mb-2">{t("guest.plan_features_label")}</p>
                  <ul className="space-y-2 text-xs">
                    <li className="flex items-center gap-2 text-gray-700">
                      <span className="text-green-500">✔</span> {t("guest.basic_profile")}
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <span className="text-green-500">✔</span> {t("guest.unlimited_portfolio_uploads")}
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <span className="text-green-500">✔</span> {t("guest.job_applications")}
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <span className="text-green-500">✔</span> {t("guest.basic_directory_listing")}
                    </li>
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

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 rounded-md py-4">
                  <p className="text-2xl font-bold text-teal-500">342</p>
                  <p className="text-xs text-gray-500">{t("guest.profile_views")}</p>
                  <p className="text-[11px] text-orange-500 font-medium">+23 {t("guest.this_month")}</p>
                </div>
                <div className="bg-gray-50 rounded-md py-4">
                  <p className="text-2xl font-bold text-orange-500">89</p>
                  <p className="text-xs text-gray-500">{t("guest.portfolio_items")}</p>
                  <p className="text-[11px] text-teal-400">{t("guest.unlimited_uploads")}</p>
                </div>
                <div className="bg-gray-50 rounded-md py-4">
                  <p className="text-2xl font-bold text-teal-500">12</p>
                  <p className="text-xs text-gray-500">{t("guest.job_applications")}</p>
                  <p className="text-[11px] text-orange-500 font-medium">+3 {t("guest.this_week")}</p>
                </div>
              </div>
            </div>

            {/* Profile Stats */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-semibold text-sm mb-3">{t("guest.profile_stats_title")}</h3>
              <ul className="space-y-2 text-xs font-light">
                <li className="flex justify-between"><span>{t("guest.profile_views")}</span><span className="font-bold">42</span></li>
                <li className="flex justify-between"><span>{t("guest.portfolio_items")}</span><span className="font-bold">0</span></li>
                <li className="flex justify-between"><span>{t("guest.blog_posts")}</span><span className="font-bold">0</span></li>
                <li className="flex justify-between"><span>{t("guest.job_applications")}</span><span className="font-bold">0</span></li>
                <li className="flex justify-between"><span>{t("guest.member_since")}</span><span className="font-bold">Aug 2024</span></li>
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-semibold mb-3">{t("guest.quick_actions")}</h3>
              <ul className="space-y-2 text-xs font-bold">
                <li className="flex items-center justify-between border px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <BiCloudUpload className="h-4 w-4" /> {t("guest.upload_new_work")}
                  </span>
                </li>
                <li onClick={() => setIsOpen(true)} className="flex items-center justify-between border px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <PencilIcon className="h-4 w-4" /> {t("guest.write_blog_post")}
                  </span>
                </li>
                <li onClick={() => navigate("/jobs")} className="flex items-center justify-between border px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <BriefcaseIcon className="h-4 w-4" /> {t("guest.browse_jobs")}
                  </span>
                </li>
                <li className="flex items-center justify-between border px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <CameraIcon className="h-4 w-4" /> {t("guest.update_profile_photo")}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestDashboardPage;
