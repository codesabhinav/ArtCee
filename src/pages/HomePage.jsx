import { Link } from "react-router-dom";
import { FaSearch, FaUsers, FaHandshake, FaTrophy, FaPlayCircle, FaCrown, FaPaintBrush, FaArrowRight, FaBolt, FaBuilding, FaBookOpen, FaPalette } from "react-icons/fa";
import bannerImg from "../images/banner.avif";
import backgrpoundImg from "../images/background.jpg";
import { SiSpotlight } from "react-icons/si";
import { BiChevronLeft, BiChevronRight, BiStar } from "react-icons/bi";
import ViewProfilePopupModel from "../modal/ViewProfilePopupModel";
import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);

  const professionals = [
    {
      name: "Luna Solaris",
      role: "Digital Illustration & Brand Design",
      rating: 4.9,
      status: "Available",
      description:
        "Award-winning digital artist specializing in brand identity and illustration with 5+ years experience.",
      skills: ["Adobe Illustrator", "Figma", "+4"],
    },
    {
      name: "Marcus Chen",
      role: "Video Production & Motion Graphics",
      rating: 4.8,
      status: "Busy",
      description:
        "Creative director and videographer with expertise in storytelling and motion design.",
      skills: ["After Effects", "Cinema 4D", "+4"],
    },
    {
      name: "Aria Stone",
      role: "Photography & Creative Direction",
      rating: 4.9,
      status: "Available",
      description:
        "Professional photographer and creative director specializing in lifestyle and brand photography.",
      skills: ["Canon 5D Mark IV", "Adobe Lightroom", "+4"],
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content */}
        <div className="relative w-full max-w-3xl text-white">
          {/* Top Badge */}
          <button className="bg-orange-500 px-3 sm:px-4 py-2 rounded-md mb-6 shadow text-xs sm:text-sm flex items-center gap-2 justify-center mx-auto">
            <FaCrown className="text-white text-[12px]" />
            Join the Creative Revolution
          </button>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight">
            Where artsy people go to{" "}
            <span className="bg-gradient-to-r from-[#1FA29A] to-orange-400 bg-clip-text text-transparent">
              get discovered
            </span>
          </h1>

          {/* Subtext */}
          <p className="mt-4 text-sm sm:text-base max-w-2xl mx-auto text-gray-200 px-2 sm:px-0">
            Create stunning portfolios, connect with dream clients, and collaborate on amazing projects.
            The platform where creative talent meets opportunity.
          </p>

          {/* Founding Member Card */}
          <div className="mt-8 sm:mt-10 bg-white text-black p-4 sm:p-6 rounded-xl shadow-md w-full max-w-full sm:max-w-md mx-auto border-2 border-teal-500">
            <div className="font-bold text-start text-xs sm:text-sm flex flex-wrap justify-between items-center gap-2">
              Founding Member Program{" "}
              <span className="text-[10px] sm:text-xs bg-orange-500 text-white px-2 py-1 rounded-md flex items-center gap-1">
                <FaCrown className="text-[10px]" /> Lifetime Badge
              </span>
            </div>

            <div className="w-full bg-gray-200 h-3 rounded mt-3">
              <div className="bg-black h-3 rounded w-2/3"></div>
            </div>
            <p className="mt-2 text-black/50 text-[10px] sm:text-xs flex justify-between">
              673 joined <span>327 spots left</span>
            </p>

            <p className="text-teal-600 font-semibold mt-1 text-[10px] sm:text-xs">
              30 Days Premium Free + Exclusive Benefits
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center">
            <Link
              to="/creatives"
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-teal-600 text-white font-semibold flex items-center gap-2 transition hover:scale-105"
            >
              <FaPlayCircle className="text-base sm:text-lg" /> Explore Creatives
            </Link>
            <Link
              to="/featured"
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-white text-white font-semibold flex items-center gap-2 hover:bg-white hover:text-black transition"
            >
              <FaCrown className="text-base sm:text-lg" /> Get Featured
            </Link>
          </div>
        </div>
      </section>



      {/* Value Proposition */}
      <section className="relative py-20 bg-gray-50">
        {/* Background Image Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${backgrpoundImg})` }}
        ></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-center">
            Create, Connect, Collaborate
          </h2>
          <p className="text-center mt-4 text-gray-500 max-w-2xl mx-auto">
            Whether you're an artsy creative looking to get discovered, a company<br />
            seeking talent, or a business serving the creative industry, ArtCee provides <br />
            the platform to succeed.
          </p>

          {/* Grid Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {/* For Creatives */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-transparent hover:border-teal-500 hover:shadow-lg transition group">
              {/* Icon */}
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-teal-500 text-white shadow-md mb-4 
        transition-transform duration-300 group-hover:scale-110">
                <FaPalette className="text-lg transition-transform duration-300 group-hover:scale-110" />
              </div>

              <h3 className="font-bold text-xl">For Creatives</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Create stunning portfolios, connect with dream clients, and collaborate
                on amazing projects. Where artsy people go to build their creative careers.
              </p>

              <ul className="mt-4 space-y-2 text-gray-600 text-sm">
                <li>✔ Professional portfolio showcase</li>
                <li>✔ Direct client communication tools</li>
                <li>✔ Job matching and opportunities</li>
                <li>✔ Professional networking community</li>
              </ul>

              <Link
                to="/creatives"
                className="text-xs mt-6 w-full flex items-center justify-center gap-2 px-5 py-2 bg-teal-500 text-white rounded-md font-semibold hover:opacity-90 transition">
                Create & Connect <FaArrowRight />
              </Link>
            </div>

            {/* For Companies (Highlighted) */}
            <div className="bg-white p-8 rounded-xl shadow-md border-2 hover:border-orange-500 hover:shadow-lg transition group">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-500 text-white shadow-md mb-4 
        transition-transform duration-300 group-hover:scale-110">
                <FaBolt className="text-lg transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="font-bold text-xl">For Companies</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Find the perfect creative talent for your projects. From startups to
                enterprises, discover specialists who understand your vision and deliver
                exceptional results.
              </p>
              <ul className="mt-4 space-y-2 text-gray-600 text-sm">
                <li>✔ Vetted creative professionals</li>
                <li>✔ Advanced filtering and search</li>
                <li>✔ Project collaboration tools</li>
                <li>✔ Transparent pricing and reviews</li>
              </ul>
              <Link
                to="/creatives"
                className="text-xs mt-6 w-full flex items-center justify-center gap-2 px-5 py-2 border border-orange-400 text-orange-500 rounded-md font-semibold hover:bg-orange-500 hover:text-white transition">
                Find Talent <FaArrowRight />
              </Link>
            </div>

            {/* For Businesses */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-transparent hover:border-teal-500 hover:shadow-lg transition group">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-teal-500 text-white shadow-md mb-4 
        transition-transform duration-300 group-hover:scale-110">
                <FaBuilding className="text-lg transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="font-bold text-xl">For Businesses</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Connect with creative professionals as an industry service provider.
                From legal services to equipment rental, reach your target audience effectively.
              </p>
              <ul className="mt-4 space-y-2 text-gray-600 text-sm">
                <li>✔ Industry-specific directory</li>
                <li>✔ Professional networking opportunities</li>
                <li>✔ Service showcase and reviews</li>
                <li>✔ Direct client connections</li>
              </ul>
              <Link
                to="/business-directory"
                className="text-xs mt-6 w-full flex items-center justify-center gap-2 px-5 py-2 bg-teal-500 text-white rounded-md font-semibold hover:opacity-90 transition">
                Join Directory <FaArrowRight />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            How ArtCee Works
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            From creating your profile to collaborating on projects, we've made it
            simple for artsy people to get discovered and build their careers.
          </p>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-4 gap-10 mt-16">
            {/* Step 1 */}
            <div className="group">
              <div className="w-20 h-20 flex items-center justify-center mx-auto rounded-full bg-teal-500 text-white text-3xl shadow-md 
                        transition-transform duration-300 group-hover:scale-110">
                <FaSearch />
              </div>
              <h4 className="mt-6 font-bold text-lg">
                1. Discover
              </h4>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                Browse through curated profiles of creative professionals, businesses,
                and service providers tailored to your specific needs.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group">
              <div className="w-20 h-20 flex items-center justify-center mx-auto rounded-full bg-orange-500 text-white text-3xl shadow-md 
                        transition-transform duration-300 group-hover:scale-110">
                <FaUsers />
              </div>
              <h4 className="mt-6 font-bold text-lg">
                2. Connect
              </h4>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                Reach out directly through our messaging system, schedule video calls,
                and discuss your project requirements in detail.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group">
              <div className="w-20 h-20 flex items-center justify-center mx-auto rounded-full bg-teal-500 text-white text-3xl shadow-md 
                        transition-transform duration-300 group-hover:scale-110">
                <FaHandshake />
              </div>
              <h4 className="mt-6 font-bold text-lg">
                3. Collaborate
              </h4>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                Work together using our secure platform with built-in project management,
                file sharing, and milestone tracking features.
              </p>
            </div>

            {/* Step 4 */}
            <div className="group">
              <div className="w-20 h-20 flex items-center justify-center mx-auto rounded-full bg-orange-500 text-white text-3xl shadow-md 
                        transition-transform duration-300 group-hover:scale-110">
                <FaTrophy />
              </div>
              <h4 className="mt-6 font-bold text-lg">
                4. Succeed
              </h4>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                Deliver exceptional results, build lasting relationships, and grow
                your creative business through our review and referral system.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 bg-gradient-to-b from-cyan-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Heading */}
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Featured Creative Professionals
            </h2>
            <p className="mt-2 text-gray-600">
              Discover exceptional talent across all creative disciplines
            </p>
          </div>

          {/* Cards */}
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {professionals.map((pro, idx) => (
              <div
                key={idx}
                className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
              >
                {/* Image Placeholder */}
                <div className="relative h-44 bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="w-16 h-16 border-2 border-gray-400 rounded-md flex items-center justify-center text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4-4-4-4m6 8h10M10 4h10"
                      />
                    </svg>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-gray-900 text-white text-sm px-2 py-1 rounded-md flex items-center gap-1">
                    <BiStar className="w-4 h-4 text-yellow-400" />
                    {pro.rating}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 text-left">
                  <h4 className="text-sm text-gray-500">{pro.role}</h4>
                  <h3 className="text-lg font-semibold">{pro.name}</h3>

                  {/* Status */}
                  <p className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${pro.status === "Available" ? "bg-green-500" : "bg-red-500"
                        }`}
                    ></span>
                    {pro.status}
                  </p>

                  {/* Description */}
                  <p className="mt-3 text-gray-600 text-sm line-clamp-3">
                    {pro.description}
                  </p>

                  {/* Skills */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {pro.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Button */}
                  <button onClick={() => setOpen(true)} className="mt-5 w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-md font-medium shadow-md transition">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
          <ViewProfilePopupModel isOpen={open} onClose={() => setOpen(false)} />

          {/* Carousel Navigation */}
          <div className="absolute top-20 right-10 flex gap-3">
            <button className="p-2 bg-white shadow rounded-full hover:bg-gray-100">
              <BiChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white shadow rounded-full hover:bg-gray-100">
              <BiChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-center mt-10">
            <Link to='/creatives' className="inline-flex items-center gap-2 bg-white hover:bg-gray-200 text-xs text-black font-medium px-6 py-3 rounded-md shadow-md transition transform hover:scale-105">
              <FaSearch className="w-3 h-3" />
              Browse All Creatives
              <FaArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      <section className="relative w-full">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-pink-50 via-white to-cyan-50 -z-10" />

        <div className="max-w-5xl mx-auto px-6 py-20 space-y-24 text-center">
          {/* ArtCee Spotlight */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              ArtCee Spotlight
            </h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              Go behind the scenes with in-depth interviews, creative insights,
              and industry trends from the world’s most innovative professionals.
            </p>

            <button className="text-xs mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-medium px-6 py-2.5 rounded-md shadow-md transition transform hover:scale-105">
              <SiSpotlight className="w-4 h-4" />
              Explore Spotlight
              <FaArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* The Perspective */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              The Perspective
            </h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              Insights, stories, and perspectives from the creative community. Stay
              updated with industry trends, career advice, and inspiring content.
            </p>

            <button className="text-xs mt-6 inline-flex items-center gap-2 bg-teal-500 text-white font-medium px-6 py-2.5 rounded-md shadow-md transition transform hover:scale-105">
              <FaBookOpen className="w-4 h-4" />
              Read The Perspective
              <FaArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
