import {
    BriefcaseIcon,
    CameraIcon,
    PencilIcon,
    StarIcon,
  } from "@heroicons/react/24/outline";
  import { useState } from "react";
  import { BiCloudUpload, BiImage, BiSearch } from "react-icons/bi";
  import {
    FaArrowLeft,
    FaCheckCircle,
    FaChevronRight,
    FaCrown,
    FaRegCircle,
  } from "react-icons/fa";
  import { Link, useNavigate } from "react-router-dom";
  import { useTranslation } from "../contexts/LanguageProvider";
  import CreatePostPopupModel from "../modal/CreatePostPopupModel";
  
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
              <h1 className="text-lg sm:text-xl font-bold">
                {t("guest.welcome_message")}
              </h1>
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
                    <h2 className="text-base sm:text-lg font-bold">
                      {t("guest.guest_user")}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {t("guest.creative_professional")}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {t("guest.welcome_note")}
                    </p>
                  </div>
                </div>
  
                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 text-center mt-6 gap-4">
                  <div>
                    <p className="font-bold">0</p>
                    <p className="text-xs text-gray-500">
                      {t("guest.followers")}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold">0</p>
                    <p className="text-xs text-gray-500">
                      {t("guest.portfolio")}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold">0</p>
                    <p className="text-xs text-gray-500">
                      {t("guest.services")}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold">0</p>
                    <p className="text-xs text-gray-500">
                      {t("guest.years_exp")}
                    </p>
                  </div>
                </div>
              </div>
  
              {/* Profile Completion */}
              <div className="bg-white border rounded-lg p-6 mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                  <h3 className="font-semibold">
                    {t("guest.profile_completion")}
                  </h3>
                  <span className="text-xs bg-yellow-100 text-yellow-600 px-3 py-1 rounded-md w-fit">
                    {t("guest.incomplete_profile")}
                  </span>
                </div>
  
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-black h-2 rounded-full" style={{ width: "10%" }}></div>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  {t("guest.completion_status")}
                </p>
  
                <h4 className="font-semibold text-sm mb-3">
                  {t("guest.required_for_activation")}
                </h4>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center justify-between border border-green-500 bg-green-50 px-4 py-2 rounded-md">
                    <div className="flex items-start gap-3">
                      <FaCheckCircle className="text-green-500 mt-1 text-sm" />
                      <div>
                        <p className="text-sm font-medium">
                          {t("guest.basic_information")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {t("guest.basic_information_desc")}
                        </p>
                      </div>
                    </div>
                    <FaChevronRight className="text-gray-400 text-xs" />
                  </li>
                  <li className="flex items-center justify-between border px-4 py-2 rounded-md">
                    <div className="flex items-start gap-3">
                      <FaRegCircle className="text-gray-400 mt-1 text-sm" />
                      <div>
                        <p className="text-sm font-medium">
                          {t("guest.location_details")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {t("guest.location_details_desc")}
                        </p>
                      </div>
                    </div>
                    <FaChevronRight className="text-gray-400 text-xs" />
                  </li>
                </ul>
  
                <div className="bg-yellow-50 text-yellow-700 text-xs px-4 py-3 rounded-md">
                  {t("guest.footer_note")}
                </div>
              </div>
  
              {/* Activity & Blog */}
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
              </div>
  
              <CreatePostPopupModel isOpen={isOpen} setIsOpen={setIsOpen} />
  
              {/* Job Applications */}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default GuestDashboardPage;
  