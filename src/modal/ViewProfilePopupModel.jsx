import React, { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";

const ViewProfilePopupModel = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState("Portfolio");

    if (!isOpen) return null;

    const tabs = ["Portfolio", "Reviews", "Education", "Activity", "Pricing"];

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-xl shadow-lg relative border border-orange-600 scrollbar-hide">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div className="flex items-center gap-3">
                        <img
                            src="https://i.pravatar.cc/100"
                            alt="profile"
                            className="w-12 h-12 rounded-full"
                        />
                        <div>
                            <h2 className="font-bold text-lg flex items-center gap-2">
                                Aria Stone{" "}
                                <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-md">
                                    Featured
                                </span>
                            </h2>
                            <p className="text-sm text-gray-500">
                                Photography & Creative Direction
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
                            <span>Featured Creative</span>
                        </div>
                        <p className="text-sm text-orange-700 mt-1">
                            This creative is highlighted for their exceptional work and premium membership
                        </p>
                    </div>
                </div>

                {/* Profile Info Section */}
                <div className="grid grid-cols-3 gap-6 px-6 py-6">
                    {/* Left Column */}
                    <div className="col-span-1 flex flex-col items-center border rounded-lg p-4">
                        <img
                            src="https://i.pravatar.cc/300"
                            alt="profile"
                            className="w-40 h-48 rounded-lg object-cover"
                        />

                        {/* Stats */}
                        <div className="flex gap-6 text-center mt-4">
                            <div>
                                <p className="font-bold">3890</p>
                                <p className="text-sm text-gray-500">Followers</p>
                            </div>
                            <div>
                                <p className="font-bold">234</p>
                                <p className="text-sm text-gray-500">Following</p>
                            </div>
                            <div>
                                <p className="font-bold">8920</p>
                                <p className="text-sm text-gray-500">Likes</p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <button className="mt-4 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg w-full">
                            Book Now
                        </button>
                        <div className="flex gap-2 mt-3 w-full">
                            <button className="flex-1 border px-4 py-2 rounded-lg">Message</button>
                            <button className="flex-1 border px-4 py-2 rounded-lg">Video Call</button>
                        </div>

                        {/* Premium Upgrade */}
                        <div className="mt-4 w-full text-center">
                            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg w-full">
                                Upgrade
                            </button>
                            <p className="text-xs text-gray-500 mt-1">Premium features</p>

                            <button className="mt-3 border px-4 py-2 rounded-lg w-full">Follow</button>
                            <p className="text-xs text-gray-500">Premium feature</p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-span-2 space-y-4">
                        {/* Quick Info */}
                        <div className="flex flex-wrap gap-6 text-sm text-gray-700">
                            <span className="flex items-center gap-1">⭐ <b>4.9 rating</b></span>
                            <span className="flex items-center gap-1">📍 Miami, FL</span>
                            <span className="flex items-center gap-1">⏳ 8 years experience</span>
                            <span className="flex items-center gap-1 text-green-600">🟢 Available</span>
                        </div>

                        {/* About */}
                        <div>
                            <h3 className="font-semibold">About</h3>
                            <p className="text-gray-700 mt-1">
                                Professional photographer and creative director specializing in lifestyle and brand photography.
                            </p>
                        </div>

                        {/* Introduction */}
                        <div>
                            <h3 className="font-semibold flex items-center gap-2 text-teal-600">
                                <span>💬</span> Introduction
                            </h3>
                            <blockquote className="text-gray-600 italic border-l-4 border-teal-500 pl-3 mt-1">
                                "Photography, for me, is about capturing the essence of a moment that tells a larger story.
                                I'm drawn to the intersection of luxury and authenticity, where brands can be aspirational yet genuine."
                            </blockquote>
                        </div>

                        {/* Creative Vision */}
                        <div>
                            <h3 className="font-semibold flex items-center gap-2 text-orange-600">
                                <span>💡</span> Creative Vision
                            </h3>
                            <p className="text-gray-700 mt-1">
                                To redefine luxury photography by making it more inclusive and authentic.
                                I believe that true luxury isn't about perfection—it's about confidence, joy,
                                and genuine human connection.
                            </p>
                        </div>

                        {/* Services & Industries */}
                        <div className="">
                            <h3 className="font-semibold">Industries</h3>
                            <div className="flex gap-2 flex-wrap mt-2">
                                {["Fashion", "Lifestyle", "Beauty", "Hospitality"].map((i) => (
                                    <span
                                        key={i}
                                        className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-lg"
                                    >
                                        {i}
                                    </span>
                                ))}
                            </div>

                            <h3 className="font-semibold mt-4">Services</h3>
                            <div className="flex gap-2 flex-wrap mt-2">
                                {[
                                    "Photography",
                                    "Creative Direction",
                                    "Brand Photography",
                                    "Content Creation",
                                ].map((s) => (
                                    <span
                                        key={s}
                                        className="bg-teal-100 text-teal-700 text-sm px-3 py-1 rounded-lg"
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="px-6 py-4 border-t">
                    <h3 className="font-semibold">Connect</h3>
                    <div className="flex gap-3 mt-2">
                        <a href="#" className="border px-3 py-1 rounded-lg">
                            🌐 Website
                        </a>
                        <a href="#" className="border px-3 py-1 rounded-lg">
                            📷 Instagram
                        </a>
                        <a href="#" className="border px-3 py-1 rounded-lg">
                            💼 LinkedIn
                        </a>
                        <a href="#" className="border px-3 py-1 rounded-lg">
                            📸 500px
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
                                className={`flex-1 px-4 py-1 text-sm text-black m-1 font-medium rounded-full transition ${activeTab === tab
                                    ? "bg-white shadow"
                                    : "bg-gray-200"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="mt-4">
                        {activeTab === "Portfolio" && (
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    {
                                        img: "https://picsum.photos/300/200?1",
                                        title: "Chanel Spring Campaign",
                                        role: "Lead Photographer",
                                    },
                                    {
                                        img: "https://picsum.photos/300/200?2",
                                        title: "Four Seasons Global Campaign",
                                        role: "Creative Director",
                                    },
                                    {
                                        img: "https://picsum.photos/300/200?3",
                                        title: "Fashion Editorial",
                                        role: "Photographer",
                                    },
                                ].map((p, i) => (
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

                        {activeTab === "Reviews" && (
                            <div className="space-y-4">
                                {/* Header */}
                                <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg">
                                    <div>
                                        <h3 className="font-semibold text-lg">Client Reviews</h3>
                                        <p className="text-sm text-gray-500">Based on 2 reviews</p>
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
                                                    <h4 className="font-semibold">Chanel Creative Team</h4>
                                                    <p className="text-sm text-gray-500">Fashion Photography</p>
                                                </div>
                                            </div>
                                            <div className="text-right text-sm">
                                                <p className="text-orange-500">★★★★★</p>
                                                <p className="text-gray-400">7/5/2024</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm font-light">
                                            "Aria brought a fresh perspective to our campaign. Her ability to capture authentic
                                            moments while maintaining our brand luxury was exceptional."
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
                                                    <h4 className="font-semibold">Four Seasons Hotels</h4>
                                                    <p className="text-sm text-gray-500">Hospitality Photography</p>
                                                </div>
                                            </div>
                                            <div className="text-right text-sm">
                                                <p className="text-orange-500">★★★★★</p>
                                                <p className="text-gray-400">5/20/2024</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm font-light">
                                            "Aria's work perfectly captures the essence of luxury travel.
                                            Her images have become central to our global marketing strategy."
                                        </p>
                                        <span className="inline-block bg-teal-100 text-teal-700 text-xs font-medium px-3 py-1 rounded-full w-fit">
                                            ✅ Professional Endorsement
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}



                        {activeTab === "Education" && (
                            <div className="space-y-6">
                                {/* Education Section */}
                                <div>
                                    <h3 className="font-semibold flex items-center gap-2 text-green-600">
                                        🎓 Education
                                    </h3>

                                    <div className="mt-3 space-y-4">
                                        {[
                                            {
                                                degree: "Bachelor of Fine Arts in Photography",
                                                school: "Parsons School of Design",
                                                description:
                                                    "Concentrated in commercial and fine art photography with emphasis on lighting and composition.",
                                                achievements: [
                                                    "Photography Department Award",
                                                    "Dean's List",
                                                ],
                                                duration: "2012 – 2016",
                                            },
                                            {
                                                degree: "Master of Arts in Visual Arts",
                                                school: "School of Visual Arts, New York",
                                                description:
                                                    "Explored advanced techniques in storytelling through photography and mixed media.",
                                                achievements: ["Excellence in Research Award"],
                                                duration: "2016 – 2018",
                                            },
                                        ].map((edu, i) => (
                                            <div
                                                key={i}
                                                className="border rounded-lg p-4 bg-white shadow-sm"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800">
                                                            {edu.degree}
                                                        </h4>
                                                        <p className="text-sm text-gray-600">{edu.school}</p>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {edu.description}
                                                        </p>

                                                        {edu.achievements?.length > 0 && (
                                                            <div className="mt-3">
                                                                <h5 className="font-medium text-gray-700">
                                                                    Achievements
                                                                </h5>
                                                                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1 mt-1">
                                                                    {edu.achievements.map((a, j) => (
                                                                        <li key={j}>{a}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-sm text-gray-500">
                                                        {edu.duration}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Certifications Section */}
                                <div>
                                    <h3 className="font-semibold flex items-center gap-2 text-orange-600">
                                        🏅 Certifications
                                    </h3>

                                    <div className="mt-3 space-y-4">
                                        {[
                                            {
                                                title: "Certified Professional Photographer",
                                                org: "Professional Photographers of America",
                                                issued: "6/10/2019",
                                                expires: "6/10/2025",
                                            },
                                            {
                                                title: "Adobe Certified Expert (ACE)",
                                                org: "Adobe Systems",
                                                issued: "4/15/2020",
                                                expires: "4/15/2026",
                                            },
                                        ].map((cert, i) => (
                                            <div
                                                key={i}
                                                className="border rounded-lg p-4 bg-white shadow-sm"
                                            >
                                                <h4 className="font-semibold text-gray-800">{cert.title}</h4>
                                                <p className="text-sm text-gray-600">{cert.org}</p>
                                                <div className="mt-2 text-sm text-gray-500 space-y-1">
                                                    <p>Issued: {cert.issued}</p>
                                                    <p>Expires: {cert.expires}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}


                        {activeTab === "Activity" && (
                            <div className="space-y-6">
                                {/* Professional Experience */}
                                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                                    <h3 className="font-semibold text-lg">Professional Experience</h3>
                                    <div className="grid grid-cols-3 gap-6 text-sm">
                                        <div>
                                            <p className="text-gray-500">Career Level</p>
                                            <span className="inline-block bg-teal-100 text-teal-700 text-xs font-medium px-3 py-1 rounded-full">
                                                Senior Level
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Years Active</p>
                                            <p className="font-medium">8 years</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Availability</p>
                                            <p className="text-green-600 flex items-center gap-1">
                                                🟢 Available
                                            </p>
                                        </div>
                                    </div>

                                    {/* Notable Clients */}
                                    <div>
                                        <h4 className="font-semibold mt-4">Notable Clients</h4>
                                        <div className="flex gap-2 flex-wrap mt-2">
                                            {["Vogue", "Chanel", "Four Seasons", "Tesla"].map((c) => (
                                                <span
                                                    key={c}
                                                    className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-lg"
                                                >
                                                    {c}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Awards */}
                                    <div>
                                        <h4 className="font-semibold mt-4">Awards & Recognition</h4>
                                        <ul className="text-sm text-gray-700 mt-2 space-y-1">
                                            <li>⭐ Lucie Award</li>
                                            <li>⭐ International Photography Awards</li>
                                        </ul>
                                    </div>

                                    {/* Skills */}
                                    <div>
                                        <h4 className="font-semibold mt-4">Skills & Tools</h4>
                                        <div className="flex gap-2 flex-wrap mt-2">
                                            {[
                                                "Canon 5D Mark IV",
                                                "Adobe Lightroom",
                                                "Photoshop",
                                                "Studio Lighting",
                                                "Natural Light",
                                                "Retouching",
                                            ].map((s) => (
                                                <span
                                                    key={s}
                                                    className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-lg"
                                                >
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Activity & Blog Posts */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-4">Recent Activity & Blog Posts</h3>
                                    <div className="border rounded-lg p-4 flex gap-4">
                                        <img
                                            src="https://picsum.photos/100/100"
                                            alt="blog"
                                            className="w-24 h-24 rounded-lg object-cover"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-lg">Mastering Natural Light Photography</h4>
                                            <p className="text-gray-600 text-sm mt-1">
                                                A comprehensive guide to using natural light effectively in your photography work.
                                            </p>

                                            {/* Stats */}
                                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                                                <span>👁 445 views</span>
                                                <span>❤️ 67 likes</span>
                                                <span>📅 7/28/2024</span>
                                            </div>

                                            {/* Tags */}
                                            <div className="flex gap-2 flex-wrap mt-2">
                                                {["Photography", "Tutorial", "Lighting", "Natural Light"].map((t) => (
                                                    <span
                                                        key={t}
                                                        className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-lg"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Premium Section */}
                                        <div className="flex flex-col items-end justify-between">
                                            <span className="text-orange-500 text-xs font-medium bg-orange-50 px-2 py-1 rounded-md">
                                                tutorial
                                            </span>
                                            <div className="text-xs text-gray-500 text-center">
                                                <button className="text-gray-400 border rounded-lg px-3 py-1 mt-2">
                                                    ♥ Like
                                                </button>
                                                <p className="text-gray-400 mt-1">Premium feature</p>
                                                <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg mt-1">
                                                    Upgrade
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "Pricing" && (
                            <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                                {/* Header */}
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <span className="text-green-600 text-xl">💲</span> Pricing & Rates
                                </h3>

                                {/* Rates */}
                                <div className="grid grid-cols-3 gap-6 text-center">
                                    <div>
                                        <p className="text-teal-600 font-bold text-2xl">$125</p>
                                        <p className="text-gray-500 text-sm">Per Hour</p>
                                    </div>
                                    <div>
                                        <p className="text-teal-600 font-bold text-2xl">$1000</p>
                                        <p className="text-gray-500 text-sm">Per Day</p>
                                    </div>
                                    <div>
                                        <p className="text-teal-600 font-bold text-2xl">$5000</p>
                                        <p className="text-gray-500 text-sm">Per Project</p>
                                    </div>
                                </div>

                                {/* Additional Info */}
                                <div className="text-sm text-gray-600 space-y-2">
                                    <p>
                                        <span className="font-medium">Currency:</span> USD
                                    </p>
                                    <p>
                                        <span className="font-medium">Rates Negotiable:</span>{" "}
                                        <span className="text-green-600 font-medium">Yes</span>
                                    </p>
                                    <p>
                                        <span className="font-medium">Starting Rate:</span> $600
                                    </p>
                                </div>

                                {/* Note */}
                                <div className="bg-orange-50 border border-orange-200 text-orange-700 text-sm px-4 py-3 rounded-lg">
                                    <strong>Note:</strong> Rates may vary based on project scope, timeline,
                                    and specific requirements. Contact Aria Stone for a custom quote.
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
