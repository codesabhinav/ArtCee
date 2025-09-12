import { AiOutlineEye } from "react-icons/ai";
import { FaArrowLeft, FaCrown, FaUsers, FaHeart, FaEye, FaChartLine, FaBolt } from "react-icons/fa";
import { Link } from "react-router-dom";
import PurchasePopupModel from "../modal/PurchasePopupModel";
import { useState } from "react";

const FeaturePremiumPage = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    return (
        <div className="bg-white min-h-screen w-full">
            <div className="md:max-w-[80%] mx-auto">
                {/* Header */}
                <div className="flex items-center px-6 py-4">
                    <Link
                        to="/guest-dashboard"
                        className="text-black font-medium text-xs hover:bg-gray-200 rounded-md px-6 py-2 flex items-center"
                    >
                        <FaArrowLeft className="mr-2" /> Back to Dashboard
                    </Link>
                    <h1 className="flex-1 text-center text-xl font-bold">
                        Upgrade to Premium
                    </h1>
                    <button className="px-4 py-2 text-xs bg-orange-500 text-white font-bold rounded-md">
                        Limited Time
                    </button>
                </div>

                {/* Crown Icon */}
                <div className="flex justify-center mt-20">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-orange-400 flex items-center justify-center">
                        <FaCrown className="text-white text-4xl" />
                    </div>
                </div>

                {/* Title & Subtitle */}
                <div className="text-center mt-6">
                    <h2 className="text-2xl md:text-3xl font-bold">
                        Create, Connect, Collaborate - Premium Style
                    </h2>
                    <p className="mt-2 font-light text-gray-600 max-w-xl mx-auto">
                        Join our founding members and unlock premium features to help artsy
                        people like you get discovered faster and build lasting creative
                        connections.
                    </p>
                </div>

                {/* Founding Member Status */}
                <div className="mt-10 bg-white text-black p-6 rounded-xl shadow-md max-w-md w-full mx-auto border border-[#1FA29A]">
                    <div className="font-bold text-start text-sm justify-between flex items-center">
                        Founding Member Status{" "}
                        <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-1 rounded flex items-center gap-1">
                            <FaCrown className="text-[10px]" /> Badge Forever
                        </span>
                    </div>

                    <div className="w-full bg-gray-200 h-3 rounded mt-3">
                        <div className="bg-black h-3 rounded w-2/3"></div>
                    </div>
                    <p className="mt-2 text-black/50 text-xs justify-between flex">
                        347 joined <span>153 spots left</span>
                    </p>

                    <p className="text-[#1FA29A] font-light mt-1 text-xs text-center">
                        Permanent founding member recognition
                    </p>
                </div>

                {/* Free vs Premium */}
                <div className="grid md:grid-cols-2 gap-6 m-10 md:ml-20 md:mr-20">
                    {/* Free */}
                    <div className="border rounded-lg p-6 shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="font-ligh font-md">Free Account</h4>
                            <span className=" text-xs font-semibold px-2 py-1 border-gray-400 border rounded-md">
                                Current Plan
                            </span>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li>✔ Unlimited portfolio uploads</li>
                            <li>✔ Unlimited images & videos</li>
                            <li>✔ Unlimited blog posts & activity</li>
                            <li>✔ Directory listing</li>
                            <li>✔ Job applications</li>
                            <li>✔ Basic profile analytics</li>
                        </ul>

                    </div>

                    {/* Premium */}
                    <div className="border-2 border-orange-400 rounded-lg p-6 shadow-lg relative">
                        <h4 className="font-light mb-4">Premium Account</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="line-through text-gray-400">✔ Everything in Free</li>
                            <li>👑 Featured directory placement</li>
                            <li>👥 Follow other creatives</li>
                            <li>❤️ Like & support content</li>
                            <li>📈 Enhanced social analytics</li>
                            <li>📌 Premium job posting</li>
                            <li>🏅 Permanent founding member badge</li>
                        </ul>
                        <button className="absolute top-4 right-4 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                            Upgrade Now
                        </button>
                    </div>
                </div>

                {/* Connect & Collaborate */}
                <div className="m-10 md:ml-20 md:mr-20 bg-[#F9F8FF] rounded-xl p-10 text-center shadow-sm">
                    {/* Title & Subtitle */}
                    <h3 className="text-2xl font-bold mb-2">Connect & Collaborate</h3>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-sm font-light">
                        Premium members can create lasting connections and collaborate with other artsy people in our community
                    </p>

                    {/* Features */}
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-[#1FA29A] flex items-center justify-center">
                                <FaUsers className="text-white text-2xl" />
                            </div>
                            <h4 className="font-semibold mt-3 text-sm">Follow & Connect</h4>
                            <p className="text-xs font-light text-gray-600 mt-1 text-center max-w-xs">
                                Follow your favorite creatives and stay updated with their latest work and insights
                            </p>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-orange-400 flex items-center justify-center">
                                <FaHeart className="text-white text-2xl" />
                            </div>
                            <h4 className="font-semibold mt-3 text-sm">Show Appreciation</h4>
                            <p className="text-xs font-light text-gray-600 mt-1 text-center max-w-xs">
                                Like and support content from other creatives in the community
                            </p>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-[#1FA29A] flex items-center justify-center">
                                <AiOutlineEye className="text-white text-2xl" />
                            </div>
                            <h4 className="font-semibold mt-3 text-sm">Get Discovered</h4>
                            <p className="text-xs font-light text-gray-600 mt-1 text-center max-w-xs">
                                Premium placement means 3x more profile views and better client discovery
                            </p>
                        </div>
                    </div>
                </div>

                {/* Pricing Section */}
                <div className="flex justify-center">
                    <div className="grid md:grid-cols-2 gap-10 m-10 max-w-6xl justify-items-center">
                        {/* Founding Member */}
                        <div className="border-2 border-orange-400 rounded-xl p-8 shadow-sm flex flex-col w-full md:w-[400px]">
                            <div className="flex justify-between items-center">
                                <h4 className="flex items-center font-light text-md text-black">
                                    <span className="mr-4 text-orange-400"><FaCrown /></span> Founding Member
                                </h4>
                                <span className="bg-orange-400 text-white text-xs px-2 py-1 rounded-md font-semibold">
                                    Limited Time
                                </span>
                            </div>

                            <div className="mt-4 items-center flex flex-col">
                                <p className="text-3xl font-bold text-gray-900">
                                    $47 <span className="line-through text-gray-400 font-light text-xs">$97</span>
                                </p>
                                <p className="text-xs font-light text-gray-500">
                                    One-time payment • Forever access
                                </p>
                                <p className="text-xs text-orange-500 font-light mt-1">
                                    Save $50 with founding member pricing!
                                </p>
                            </div>

                            <ul className="mt-6 space-y-2 text-xs text-gray-700 text-left">
                                <li>✅ Everything in Premium</li>
                                <li>⭐ Permanent Founding Member Badge</li>
                                <li>👑 Forever Premium Access</li>
                                <li>⚡ Early Access to New Features</li>
                                <li>🤝 Exclusive Founding Member Community</li>
                            </ul>

                            <div className="mt-6 bg-orange-50 text-orange-400 border border-orange-400 text-xs text-center py-3 rounded-md font-light">
                                Only 153 of 500 spots remaining!
                            </div>

                            <button onClick={() => setSelectedPlan("founding")} className="mt-4 bg-orange-500 hover:bg-orange-600 text-xs text-white w-full py-3 rounded-md font-semibold flex items-center justify-center">
                                <span className="mr-4"><FaCrown /></span> Become Founding Member
                            </button>
                        </div>

                        {/* Premium Monthly */}
                        <div className="border-2 border-teal-400 rounded-xl p-8 shadow-sm flex flex-col w-full md:w-[400px]">
                            <div className="flex justify-between items-center">
                                <h4 className="flex items-center font-bold text-md text-black font-light">
                                    <span className="mr-4 text-teal-400"><FaCrown /></span> Premium Monthly
                                </h4>
                            </div>

                            <div className="mt-4 flex flex-col items-center">
                                <p className="text-3xl font-bold text-gray-900">$29</p>
                                <p className="text-xs font-light text-gray-500">per month • Cancel anytime</p>
                            </div>

                            <ul className="mt-6 space-y-2 text-xs text-gray-700 text-left">
                                <li>📌 Featured Profile Placement</li>
                                <li>👥 Follow Other Creatives</li>
                                <li>❤️ Like & Support Content</li>
                                <li>💼 Premium Job Posting</li>
                                <li>📊 Analytics Dashboard</li>
                            </ul>

                            <div className="mt-4 bg-blue-50 text-black font-light border border-teal-400 text-xs text-center p-2 rounded-md">
                                ✅ 30-day money back guarantee
                            </div>

                            <button onClick={() => setSelectedPlan("premium")} className="mt-6 bg-teal-500 hover:bg-teal-600 text-white w-full py-3 rounded-md font-bold text-xs flex items-center justify-center">
                                <span className="mr-4 "><FaCrown /></span> Start Premium Monthly
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center m-10 md:ml-20 md:mr-20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full px-6">

                        {/* Instant Access */}
                        <div className="border rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
                            <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-teal-500 text-white text-xl mb-3">
                                <FaBolt />
                            </div>
                            <h4 className="font-semibold text-md">Instant Access</h4>
                            <p className="text-xs font-light text-gray-600 mt-1">
                                Premium features activate immediately after upgrade
                            </p>
                        </div>

                        {/* Growing Community */}
                        <div className="border rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
                            <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-orange-500 text-white text-xl mb-3">
                                <FaUsers />
                            </div>
                            <h4 className="font-semibold text-md">Growing Community</h4>
                            <p className="text-xs font-light text-gray-600 mt-1">
                                Connect with 1,200+ creative professionals
                            </p>
                        </div>

                        {/* Proven Results */}
                        <div className="border rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
                            <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-teal-500 text-white text-xl mb-3">
                                <FaChartLine />
                            </div>
                            <h4 className="font-semibold text-md">Proven Results</h4>
                            <p className="text-xs font-light text-gray-600 mt-1">
                                Premium members get 3x more profile views
                            </p>
                        </div>

                        {/* Exclusive Status */}
                        <div className="border rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
                            <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-orange-500 text-white text-xl mb-3">
                                <FaCrown />
                            </div>
                            <h4 className="font-semibold text-md">Exclusive Status</h4>
                            <p className="text-xs font-light text-gray-600 mt-1">
                                Limited to first 500 founding members only
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            <PurchasePopupModel
                isOpen={!!selectedPlan}
                onClose={() => setSelectedPlan(null)}
                planType={selectedPlan}
            />
        </div>
    );
};

export default FeaturePremiumPage;
