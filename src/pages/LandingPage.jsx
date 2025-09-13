import { StarIcon } from "@heroicons/react/24/outline";
import { FaPalette, FaUserFriends, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PolicyModal from "../modal/PolicyModal";
import { useState } from "react";

const LandingPage = () => {
    const navigate = useNavigate();
    const [showPolicy, setShowPolicy] = useState(false);

    return (
        <>
            <div className="min-h-screen p-10 flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4 text-center">
                <div className="bg-teal-500 text-white p-4 rounded-full mb-6">
                    <FaPalette size={36} />
                </div>

                {/* Title & Subtitle */}
                <h1 className="text-4xl font-bold text-gray-800">ArtCee</h1>
                <p className="text-teal-600 mt-2 text-lg font-medium">
                    "Where artsy people go to get discovered"
                </p>
                <p className="text-gray-500 mt-2 text-center max-w-lg">
                    Welcome to the ArtCee Premium Journey Prototype
                </p>

                <p className="text-gray-500 mt-2 text-center max-w-lg">
                    Click teal buttons and featured cards to explore the flow.
                </p>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 w-full max-w-4xl">
                    <div className="bg-white border rounded-xl p-6 text-center shadow-sm ">
                        <div className="h-12 w-12 mx-auto flex justify-center items-center bg-orange-500 text-white rounded-full mb-3">
                            <FaPalette size={24} />
                        </div>
                        <h3 className="text-medium font-regular">Create</h3>
                        <p className="text-gray-500 text-sm mt-2 text-sm font-light">
                            Showcase your artsy talents and build stunning portfolios
                        </p>
                    </div>

                    <div className="bg-white border rounded-xl p-6 text-center shadow-sm">
                        <div className="h-12 w-12 mx-auto flex justify-center items-center bg-teal-500 text-white rounded-full mb-3">
                            <FaUserFriends size={24} />
                        </div>
                        <h3 className="text-medium font-regular">Connect</h3>
                        <p className="text-gray-500 text-sm mt-2 text-sm font-light">
                            Network with clients, creators, and creative professionals
                        </p>
                    </div>

                    <div className="bg-white border rounded-xl p-6 text-center shadow-sm">
                        <div className="h-12 w-12 mx-auto flex justify-center items-center bg-orange-500 text-white rounded-full mb-3">
                            <StarIcon className="h-6 w-6" />
                        </div>
                        <h3 className="text-medium font-regular">Collaborate</h3>
                        <p className="text-gray-500 text-sm mt-2 text-sm font-light">
                            Work together on creative projects and get discovered
                        </p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col items-center mt-12 space-y-4">
                    <button onClick={() => navigate("/register")} className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-8 py-2 rounded-full shadow">
                        Join ArtCee
                    </button>
                    <button onClick={() => navigate("/home")} className="border border-orange-500  bg-white text-orange-500 hover:bg-orange-50 px-8 py-2 rounded-full text-sm font-semibold">
                        Skip to Browse
                    </button>
                </div>

                <button className="border border-orange-500 text-orange-500 mt-10 flex items-center gap-2 hover:bg-orange-50 px-6 py-3 rounded-full text-xs">
                    <StarIcon className="text-orange-400 h-4 w-4" /> Interactive Prototype Experience
                </button>

                {/* Footer */}
                <p className="text-gray-400 text-xs mt-8">
                    By continuing, you agree to our{" "}
                    <a href="#" className="underline text-teal-500">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <button onClick={() => setShowPolicy(true)} className="underline text-teal-500">
                        Privacy Policy
                    </button>
                </p>
            </div>
            <PolicyModal open={showPolicy} onClose={() => setShowPolicy(false)} />
        </>
    );
};

export default LandingPage;
