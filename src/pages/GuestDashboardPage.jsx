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

const GuestDashboardPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="bg-white min-h-screen w-full">
            <div className="md:max-w-[80%] mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b gap-3 sm:gap-0">
                    <Link
                        to="/home"
                        className="text-black font-medium text-xs hover:bg-gray-200 rounded-md px-4 py-2 flex items-center w-fit"
                    >
                        <FaArrowLeft className="mr-2" /> Back to Home
                    </Link>

                    <div className="flex flex-col flex-1 text-start sm:ml-4">
                        <h1 className="text-lg sm:text-xl font-bold">Welcome, Guest User</h1>
                        <p className="text-sm font-light text-gray-600">
                            Manage your creative profile and content
                        </p>
                    </div>

                    <span className="px-4 py-1 text-xs bg-gray-100 text-gray-500 font-medium rounded-md w-fit sm:ml-auto">
                        Free Account
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
                                    src="https://i.pravatar.cc/100?img=3"
                                    alt="Guest User"
                                    className="w-16 h-16 rounded-full mx-auto sm:mx-0"
                                />
                                <div className="text-center sm:text-left">
                                    <h2 className="text-base sm:text-lg font-bold">Guest User</h2>
                                    <p className="text-gray-500 text-sm">Creative Professional</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Welcome to ArtCee! Complete your profile to get discovered.
                                    </p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 text-center mt-6 gap-4">
                                <div>
                                    <p className="font-bold">0</p>
                                    <p className="text-xs text-gray-500">Followers</p>
                                </div>
                                <div>
                                    <p className="font-bold">0</p>
                                    <p className="text-xs text-gray-500">Portfolio</p>
                                </div>
                                <div>
                                    <p className="font-bold">0</p>
                                    <p className="text-xs text-gray-500">Services</p>
                                </div>
                                <div>
                                    <p className="font-bold">0</p>
                                    <p className="text-xs text-gray-500">Years Exp</p>
                                </div>
                            </div>
                        </div>

                        {/* Profile Completion */}
                        <div className="bg-white border rounded-lg p-6 mt-6">
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                                <h3 className="font-semibold">Profile Completion</h3>
                                <span className="text-xs bg-yellow-100 text-yellow-600 px-3 py-1 rounded-md w-fit">
                                    Incomplete Profile
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
                                1/10 completed – 10%
                            </p>
                            <h4 className="font-semibold text-sm mb-3"> Required for Profile Activation </h4>
                            <ul className="space-y-2 mb-6">
                                {/* Completed Example */}
                                <li className="flex items-center justify-between border border-green-500 bg-green-50 px-4 py-2 rounded-md">
                                    <div className="flex items-start gap-3">
                                        <FaCheckCircle className="text-green-500 mt-1 text-sm" />
                                        <div> <p className="text-sm font-medium">Basic Information</p>
                                            <p className="text-xs text-gray-500"> Name, email, and creative specialty </p>
                                        </div>
                                    </div>
                                    <FaChevronRight className="text-gray-400 text-xs" />
                                </li>
                                {/* Pending Examples */}
                                <li className="flex items-center justify-between border px-4 py-2 rounded-md">
                                    <div className="flex items-start gap-3">
                                        <FaRegCircle className="text-gray-400 mt-1 text-sm" />
                                        <div> <p className="text-sm font-medium">Location Details</p>
                                            <p className="text-xs text-gray-500">City and state/province</p>
                                        </div>
                                    </div>
                                    <FaChevronRight className="text-gray-400 text-xs" /> </li>
                                <li className="flex items-center justify-between border px-4 py-2 rounded-md">
                                    <div className="flex items-start gap-3">
                                        <FaRegCircle className="text-gray-400 mt-1 text-sm" />
                                        <div>
                                            <p className="text-sm font-medium">Personal Intro & Vision</p>
                                            <p className="text-xs text-gray-500"> Introduction and creative vision
                                            </p> </div> </div>
                                    <FaChevronRight className="text-gray-400 text-xs" />
                                </li>
                                <li className="flex items-center justify-between border px-4 py-2 rounded-md">
                                    <div className="flex items-start gap-3">
                                        <FaRegCircle className="text-gray-400 mt-1 text-sm" />
                                        <div>
                                            <p className="text-sm font-medium">Profile Image/Video</p>
                                            <p className="text-xs text-gray-500"> Profile photo or showcase video </p>
                                        </div>
                                    </div>
                                    <FaChevronRight className="text-gray-400 text-xs" /> </li>
                                <li className="flex items-center justify-between border px-4 py-2 rounded-md">
                                    <div className="flex items-start gap-3">
                                        <FaRegCircle className="text-gray-400 mt-1 text-sm" /> <div>
                                            <p className="text-sm font-medium">Email Verification</p>
                                            <p className="text-xs text-gray-500">Verify your email address</p>
                                        </div>
                                    </div>
                                    <FaChevronRight className="text-gray-400 text-xs" /> </li>
                            </ul>
                            {/* Optional Enhancements */}
                            <h4 className="font-semibold text-sm mb-3">Optional Enhancements</h4>
                            <ul className="space-y-2 mb-4">
                                <li className="flex items-center justify-between border px-4 py-2 rounded-md">
                                    <div className="flex items-start gap-3">
                                        <FaRegCircle className="text-gray-400 mt-1 text-sm" />
                                        <div>
                                            <p className="text-sm font-medium">Professional Bio</p>
                                            <p className="text-xs text-gray-500"> Detailed professional biography </p> </div> </div> <FaChevronRight className="text-gray-400 text-xs" /> </li> <li className="flex items-center justify-between border px-4 py-2 rounded-md">
                                    <div className="flex items-start gap-3">
                                        <FaRegCircle className="text-gray-400 mt-1 text-sm" />
                                        <div>
                                            <p className="text-sm font-medium">Services & Skills</p>
                                            <p className="text-xs text-gray-500"> Services offered and skill categories </p>
                                        </div>
                                    </div>
                                    <FaChevronRight className="text-gray-400 text-xs" /> </li>
                                <li className="flex items-center justify-between border px-4 py-2 rounded-md">
                                    <div className="flex items-start gap-3"> <FaRegCircle className="text-gray-400 mt-1 text-sm" /> <div>
                                        <p className="text-sm font-medium">Portfolio Work</p>
                                        <p className="text-xs text-gray-500"> Showcase your best creative work </p> </div>
                                    </div> <FaChevronRight className="text-gray-400 text-xs" /> </li>
                                <li className="flex items-center justify-between border px-4 py-2 rounded-md">
                                    <div className="flex items-start gap-3"> <FaRegCircle className="text-gray-400 mt-1 text-sm" /> <div>
                                        <p className="text-sm font-medium">Social Media Links</p>
                                        <p className="text-xs text-gray-500"> Connect your social media profiles </p> </div> </div>
                                    <FaChevronRight className="text-gray-400 text-xs" /> </li>
                                <li className="flex items-center justify-between border px-4 py-2 rounded-md">
                                    <div className="flex items-start gap-3"> <FaRegCircle className="text-gray-400 mt-1 text-sm" /> <div>
                                        <p className="text-sm font-medium">Pricing Information</p>
                                        <p className="text-xs text-gray-500"> Your starting rates and pricing </p>
                                    </div>
                                    </div>
                                    <FaChevronRight className="text-gray-400 text-xs" />
                                </li>
                            </ul>
                            {/* Footer Note */}
                            <div className="bg-yellow-50 text-yellow-700 text-xs px-4 py-3 rounded-md"> Complete the required fields above to activate your profile and start getting discovered by potential clients.
                            </div>
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
                                <button
                                    onClick={() => setIsOpen(true)}
                                    className="bg-teal-500 text-white px-4 py-2 rounded-md text-xs w-full sm:w-auto"
                                >
                                    + Create Your First Post
                                </button>
                            </div>
                        </div>

                        <CreatePostPopupModel isOpen={isOpen} setIsOpen={setIsOpen} />

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
                                <p className="text-xs text-gray-500 mb-4">
                                    Start applying to creative jobs to track your progress here
                                </p>
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
                                <p className="text-xs text-gray-500 mb-4">
                                    Get featured placement and unlock follow/like interactions
                                </p>
                            </div>

                            {/* Features */}
                            <ul className="text-xs space-y-2 text-left">
                                <li className="text-green-600">✔ Featured in Directory</li>
                                <li className="text-green-600">✔ Follow Other Creatives</li>
                                <li className="text-green-600">✔ Like & Support Content</li>
                                <li className="text-green-600">✔ Story-First Spotlight</li>
                                <li className="text-orange-500">★ Founding Member Badge</li>
                            </ul>

                            {/* Pricing */}
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
                                <h3 className="font-normal text-sm">Current Plan: Free Account</h3>
                                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-xl">
                                    Active
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-6 text-xs">
                                {/* Billing Info */}
                                <div>
                                    <p className="text-black font-medium mb-2">Billing Information</p>
                                    <p className="text-gray-500">Price:</p>
                                    <p className="font-medium mb-2">$0</p>

                                    <p className="text-gray-500">Billing Cycle:</p>
                                    <p className="font-medium mb-2">Free</p>

                                    <p className="text-gray-500">Member Since:</p>
                                    <p className="font-medium">August 4, 2024</p>

                                    <button onClick={() => navigate("/featured")} className="w-full mt-4 bg-teal-500 text-white py-1.5 rounded-md text-xs font-semibold">
                                        Upgrade to Premium
                                    </button>
                                    <p className="text-[10px] text-gray-500 mt-1 text-center">
                                        Unlock social features and premium placement
                                    </p>
                                </div>

                                {/* Plan Features */}
                                <div>
                                    <p className="text-black font-medium mb-2">Plan Features</p>
                                    <ul className="space-y-2 text-xs">
                                        <li className="flex items-center gap-2 text-gray-700">
                                            <span className="text-green-500">✔</span> Basic Profile
                                        </li>
                                        <li className="flex items-center gap-2 text-gray-700">
                                            <span className="text-green-500">✔</span> Unlimited Portfolio Uploads
                                        </li>
                                        <li className="flex items-center gap-2 text-gray-700">
                                            <span className="text-green-500">✔</span> Job Applications
                                        </li>
                                        <li className="flex items-center gap-2 text-gray-700">
                                            <span className="text-green-500">✔</span> Basic Directory Listing
                                        </li>
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
                                    <p className="text-2xl font-bold text-teal-500">342</p>
                                    <p className="text-xs text-gray-500">Profile Views</p>
                                    <p className="text-[11px] text-orange-500 font-medium">+23 this month</p>
                                </div>
                                <div className="bg-gray-50 rounded-md py-4">
                                    <p className="text-2xl font-bold text-orange-500">89</p>
                                    <p className="text-xs text-gray-500">Portfolio Items</p>
                                    <p className="text-[11px] text-teal-400">Unlimited uploads</p>
                                </div>
                                <div className="bg-gray-50 rounded-md py-4">
                                    <p className="text-2xl font-bold text-teal-500">12</p>
                                    <p className="text-xs text-gray-500">Job Applications</p>
                                    <p className="text-[11px] text-orange-500 font-medium">+3 this week</p>
                                </div>
                            </div>
                        </div>


                        {/* Profile Stats */}
                        <div className="bg-white border rounded-lg p-6">
                            <h3 className="font-semibold text-sm mb-3">Profile Stats</h3>
                            <ul className="space-y-2 text-xs font-light">
                                <li className="flex justify-between"><span>Profile Views</span><span className="font-bold">42</span></li>
                                <li className="flex justify-between"><span>Portfolio Items</span><span className="font-bold">0</span></li>
                                <li className="flex justify-between"><span>Blog Posts</span><span className="font-bold">0</span></li>
                                <li className="flex justify-between"><span>Job Applications</span><span className="font-bold">0</span></li>
                                <li className="flex justify-between"><span>Member Since</span><span className="font-bold">Aug 2024</span></li>
                            </ul>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white border rounded-lg p-6">
                            <h3 className="font-semibold mb-3">Quick Actions</h3>
                            <ul className="space-y-2 text-xs font-bold">
                                <li className="flex items-center justify-between border px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
                                    <span className="flex items-center gap-2">
                                        <BiCloudUpload className="h-4 w-4" /> Upload New Work
                                    </span>
                                </li>
                                <li onClick={() => setIsOpen(true)} className="flex items-center justify-between border px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
                                    <span className="flex items-center gap-2">
                                        <PencilIcon className="h-4 w-4" /> Write Blog Post
                                    </span>
                                </li>
                                <li onClick={() => navigate("/jobs")} className="flex items-center justify-between border px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
                                    <span className="flex items-center gap-2">
                                        <BriefcaseIcon className="h-4 w-4" /> Browse Jobs
                                    </span>
                                </li>
                                <li className="flex items-center justify-between border px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
                                    <span className="flex items-center gap-2">
                                        <CameraIcon className="h-4 w-4" /> Update Profile Photo
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
