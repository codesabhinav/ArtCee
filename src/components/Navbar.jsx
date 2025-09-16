// import { Link } from "react-router-dom";
// import { FaUser, FaBriefcase, FaBuilding, FaSearch, FaStar, FaBookOpen, FaBars, FaTimes } from "react-icons/fa";
// import { useAuth } from "../contexts/AuthContext";
// import LoginPage from "../pages/LoginPage";
// import { useState, useRef, useEffect } from "react";

// const languages = [
//   {
//     code: "en",
//     name: "English",
//     flag: "https://flagcdn.com/64x48/us.png",
//   },
//   {
//     code: "es",
//     name: "Spanish",
//     flag: "https://flagcdn.com/64x48/es.png",
//   },
//   {
//     code: "pt",
//     name: "Portuguese",
//     flag: "https://flagcdn.com/64x48/br.png",
//   },
//   {
//     code: "hi",
//     name: "Hindi",
//     flag: "https://flagcdn.com/64x48/in.png",
//   },
//   {
//     code: "tl",
//     name: "Tagalog",
//     flag: "https://flagcdn.com/64x48/ph.png",
//   },
//   {
//     code: "ko",
//     name: "Korean",
//     flag: "https://flagcdn.com/64x48/kr.png",
//   },
//   {
//     code: "zh",
//     name: "Chinese",
//     flag: "https://flagcdn.com/64x48/cn.png",
//   },
//   {
//     code: "fr",
//     name: "French",
//     flag: "https://flagcdn.com/64x48/fr.png",
//   },
//   {
//     code: "ja",
//     name: "Japanese",
//     flag: "https://flagcdn.com/64x48/jp.png",
//   },
//   {
//     code: "ar",
//     name: "Arabic",
//     flag: "https://flagcdn.com/64x48/sa.png",
//   },
//   {
//     code: "de",
//     name: "German",
//     flag: "https://flagcdn.com/64x48/de.png",
//   },
//   {
//     code: "it",
//     name: "Italian",
//     flag: "https://flagcdn.com/64x48/it.png",
//   },
// ];

// const Navbar = () => {
//   const { currentUser } = useAuth();
//   const [showModal, setShowModal] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);

//   // initialize from localStorage if available, else default to languages[0]
//   const getInitialLang = () => {
//     try {
//       const saved = localStorage.getItem("siteLang");
//       if (saved) {
//         const match = languages.find((l) => l.code === saved);
//         if (match) return match;
//       }
//     } catch (e) {
//       /* ignore localStorage errors */
//     }
//     return languages[0];
//   };

//   const [selectedLang, setSelectedLang] = useState(getInitialLang());
//   const [langDropdownOpen, setLangDropdownOpen] = useState(false);
//   const langDropdownRef = useRef(null);

//   // Persist selected language code to localStorage whenever it changes
//   useEffect(() => {
//     try {
//       if (selectedLang && selectedLang.code) {
//         localStorage.setItem("siteLang", selectedLang.code);
//       }
//     } catch (e) {
//       console.warn("Could not save language to localStorage", e);
//     }
//   }, [selectedLang]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
//         setLangDropdownOpen(false);
//       }
//     }
//     if (langDropdownOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [langDropdownOpen]);

//   return (
//     <nav className="bg-white border-b border-gray-200 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between lg:justify-around items-center h-16">

//           {/* Logo */}
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center">
//               <img src="logo.png" alt="ArtCee" className="w-10 h-10" />
//               <span className="ml-2 text-xl font-bold text-gray-800">
//                 <span className="bg-gradient-to-r from-[#1FA29A] to-orange-400 bg-clip-text text-transparent">ArtCee</span>
//               </span>
//             </Link>
//           </div>

//           {/* Desktop Nav Links */}
//           <div className="hidden md:flex items-center space-x-4 text-xs font-semibold">
//             <Link to="/creatives" className="text-gray-700 hover:text-black rounded-md flex items-center hover:bg-gray-100 transition px-3 py-1.5">
//               <FaSearch className="mr-3" /> Browse Creatives
//             </Link>
//             <Link to="/business-directory" className="text-gray-700 hover:text-black rounded-md flex items-center hover:bg-gray-100 transition px-3 py-1.5">
//               <FaBuilding className="mr-3" /> Business Directory
//             </Link>
//             <Link to="/jobs" className="text-gray-700 hover:text-black rounded-md flex items-center hover:bg-gray-100 transition px-3 py-1.5">
//               <FaBriefcase className="mr-3" /> Find Jobs
//             </Link>
//             <Link to="/spotlight" className="text-gray-700 hover:text-black flex rounded-md items-center hover:bg-gray-100 transition px-3 py-1.5">
//               <FaStar className="mr-3" /> Spotlight
//             </Link>
//             <Link to="/perspective" className="text-gray-700 hover:text-black flex rounded-md items-center hover:bg-gray-100 transition px-3 py-1.5">
//               <FaBookOpen className="mr-3" /> The Perspective
//             </Link>

//             {/* Language Dropdown */}
//             <div className="relative" ref={langDropdownRef}>
//               <button
//                 className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition text-xs font-semibold focus:outline-none"
//                 onClick={() => setLangDropdownOpen((open) => !open)}
//                 aria-haspopup="listbox"
//                 aria-expanded={langDropdownOpen}
//               >
//                 <img
//                   src={selectedLang.flag}
//                   alt={selectedLang.name}
//                   className="w-5 h-5 mr-2 rounded-sm object-cover"
//                 />
//                 {selectedLang.name}
//                 <svg
//                   className="ml-2 w-3 h-3"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   aria-hidden="true"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </button>
//               {langDropdownOpen && (
//                 <ul className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1">
//                   {languages.map((lang) => (
//                     <li
//                       key={lang.code}
//                       className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 text-xs ${
//                         selectedLang.code === lang.code ? "bg-gray-100 font-bold" : ""
//                       }`}
//                       onClick={() => {
//                         setSelectedLang(lang);
//                         setLangDropdownOpen(false);
//                       }}
//                       role="option"
//                       aria-selected={selectedLang.code === lang.code}
//                     >
//                       <img
//                         src={lang.flag}
//                         alt={lang.name}
//                         className="w-5 h-5 mr-2 rounded-sm object-cover"
//                       />
//                       {lang.name}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             {currentUser ? (
//               <Link to="/dashboard" className="flex items-center px-3 py-1.5 rounded-md bg-teal-500 text-white hover:bg-teal-600 transition text-xs font-semibold">
//                 <FaUser className="mr-2" /> Dashboard
//               </Link>
//             ) : (
//               <button
//                 onClick={() => setShowModal(true)}
//                 className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition text-xs font-semibold"
//               >
//                 <FaUser className="mr-2" /> Sign In
//               </button>
//             )}
//           </div>

//           {/* Mobile Hamburger */}
//           <div className="md:hidden">
//             <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 hover:text-black focus:outline-none">
//               {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {showModal && <LoginPage onClose={() => setShowModal(false)} />}
//       {/* Mobile Menu */}
//       {menuOpen && (
//         <div className="md:hidden px-4 pb-4 space-y-2 text-xs font-semibold">
//           <Link to="/creatives" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition">
//             <FaSearch className="mr-3" /> Browse Creatives
//           </Link>
//           <Link to="/business-directory" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition">
//             <FaBuilding className="mr-3" /> Business Directory
//           </Link>
//           <Link to="/jobs" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition">
//             <FaBriefcase className="mr-3" /> Find Jobs
//           </Link>
//           <Link to="/spotlight" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition">
//             <FaStar className="mr-3" /> Spotlight
//           </Link>
//           <Link to="/perspective" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition">
//             <FaBookOpen className="mr-3" /> The Perspective
//           </Link>

//           {/* Language Dropdown for Mobile */}
//           <div className="relative" ref={langDropdownRef}>
//             <button
//               className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition text-xs font-semibold w-full"
//               onClick={() => setLangDropdownOpen((open) => !open)}
//               aria-haspopup="listbox"
//               aria-expanded={langDropdownOpen}
//             >
//               <img
//                 src={selectedLang.flag}
//                 alt={selectedLang.name}
//                 className="w-5 h-5 mr-2 rounded-sm object-cover"
//               />
//               {selectedLang.name}
//               <svg
//                 className="ml-2 w-3 h-3"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 aria-hidden="true"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//               </svg>
//             </button>
//             {langDropdownOpen && (
//               <ul className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1">
//                 {languages.map((lang) => (
//                   <li
//                     key={lang.code}
//                     className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 text-xs ${
//                       selectedLang.code === lang.code ? "bg-gray-100 font-bold" : ""
//                     }`}
//                     onClick={() => {
//                       setSelectedLang(lang);
//                       setLangDropdownOpen(false);
//                       setMenuOpen(false); // close mobile menu after selecting
//                     }}
//                     role="option"
//                     aria-selected={selectedLang.code === lang.code}
//                   >
//                     <img
//                       src={lang.flag}
//                       alt={lang.name}
//                       className="w-5 h-5 mr-2 rounded-sm object-cover"
//                     />
//                     {lang.name}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {currentUser ? (
//             <Link to="/dashboard" className="flex items-center px-3 py-2 rounded-md bg-teal-500 text-white hover:bg-teal-600 transition">
//               <FaUser className="mr-2" /> Dashboard
//             </Link>
//           ) : (
//             <button
//               onClick={() => {
//                 setShowModal(true);
//                 setMenuOpen(false);
//               }}
//               className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
//             >
//               <FaUser className="mr-2" /> Sign In
//             </button>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;


// import { Link } from "react-router-dom";
// import {
//   FaUser,
//   FaBriefcase,
//   FaBuilding,
//   FaSearch,
//   FaStar,
//   FaBookOpen,
//   FaBars,
//   FaTimes
// } from "react-icons/fa";
// import { useAuth } from "../contexts/AuthContext";
// import LoginPage from "../pages/LoginPage";
// import { useState, useRef, useEffect } from "react";
// import { useTranslation } from "../contexts/LanguageProvider";

// const Navbar = () => {
//   const { currentUser } = useAuth();
//   const [showModal, setShowModal] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);

//   const { t, languages, lang, setLang } = useTranslation();
//   const [langDropdownOpen, setLangDropdownOpen] = useState(false);
//   const langDropdownRef = useRef(null);

//   useEffect(() => {
//     function onClick(e) {
//       if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
//         setLangDropdownOpen(false);
//       }
//     }
//     if (langDropdownOpen) document.addEventListener("mousedown", onClick);
//     return () => document.removeEventListener("mousedown", onClick);
//   }, [langDropdownOpen]);

//   const selectedLang = languages.find((l) => l.code === lang) || languages[0];

//   return (
//     <nav className="bg-white border-b border-gray-200 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between lg:justify-around items-center h-16">
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center">
//               <img src="logo.png" alt="ArtCee" className="w-10 h-10" />
//               <span className="ml-2 text-xl font-bold text-gray-800">
//                 <span className="bg-gradient-to-r from-[#1FA29A] to-orange-400 bg-clip-text text-transparent">ArtCee</span>
//               </span>
//             </Link>
//           </div>

//           <div className="hidden md:flex items-center space-x-4 text-xs font-semibold">
//             <Link to="/creatives" className="text-gray-700 hover:text-black rounded-md flex items-center hover:bg-gray-100 transition px-3 py-1.5">
//               <FaSearch className="mr-3" /> {t("nav.browse_creatives")}
//             </Link>
//             <Link to="/business-directory" className="text-gray-700 hover:text-black rounded-md flex items-center hover:bg-gray-100 transition px-3 py-1.5">
//               <FaBuilding className="mr-3" /> {t("nav.business_directory")}
//             </Link>
//             <Link to="/jobs" className="text-gray-700 hover:text-black rounded-md flex items-center hover:bg-gray-100 transition px-3 py-1.5">
//               <FaBriefcase className="mr-3" /> {t("nav.find_jobs")}
//             </Link>
//             <Link to="/spotlight" className="text-gray-700 hover:text-black flex rounded-md items-center hover:bg-gray-100 transition px-3 py-1.5">
//               <FaStar className="mr-3" /> {t("nav.spotlight")}
//             </Link>
//             <Link to="/perspective" className="text-gray-700 hover:text-black flex rounded-md items-center hover:bg-gray-100 transition px-3 py-1.5">
//               <FaBookOpen className="mr-3" /> {t("nav.perspective")}
//             </Link>

//             <div className="relative" ref={langDropdownRef}>
//               <button
//                 className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition text-xs font-semibold focus:outline-none"
//                 onClick={() => setLangDropdownOpen((s) => !s)}
//                 aria-haspopup="listbox"
//                 aria-expanded={langDropdownOpen}
//               >
//                 <img src={selectedLang.flag} alt={selectedLang.name} className="w-5 h-5 mr-2 rounded-sm object-cover" />
//                 {selectedLang.name}
//                 <svg className="ml-2 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </button>

//               {langDropdownOpen && (
//                 <ul className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1">
//                   {languages.map((l) => (
//                     <li
//                       key={l.code}
//                       className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 text-xs ${lang === l.code ? "bg-gray-100 font-bold" : ""}`}
//                       onClick={() => { setLang(l.code); setLangDropdownOpen(false); }}
//                       role="option"
//                       aria-selected={lang === l.code}
//                     >
//                       <img src={l.flag} alt={l.name} className="w-5 h-5 mr-2 rounded-sm object-cover" />
//                       {l.name}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             {currentUser ? (
//               <Link to="/dashboard" className="flex items-center px-3 py-1.5 rounded-md bg-teal-500 text-white hover:bg-teal-600 transition text-xs font-semibold">
//                 <FaUser className="mr-2" /> {t("nav.dashboard")}
//               </Link>
//             ) : (
//               <button onClick={() => setShowModal(true)} className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition text-xs font-semibold">
//                 <FaUser className="mr-2" /> {t("nav.sign_in")}
//               </button>
//             )}
//           </div>

//           <div className="md:hidden">
//             <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 hover:text-black focus:outline-none">
//               {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {showModal && <LoginPage onClose={() => setShowModal(false)} />}

//       {menuOpen && (
//         <div className="md:hidden px-4 pb-4 space-y-2 text-xs font-semibold">
//           <Link to="/creatives" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition">
//             <FaSearch className="mr-3" /> {t("nav.browse_creatives")}
//           </Link>
//           <Link to="/business-directory" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition">
//             <FaBuilding className="mr-3" /> {t("nav.business_directory")}
//           </Link>
//           <Link to="/jobs" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition">
//             <FaBriefcase className="mr-3" /> {t("nav.find_jobs")}
//           </Link>
//           <Link to="/spotlight" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition">
//             <FaStar className="mr-3" /> {t("nav.spotlight")}
//           </Link>
//           <Link to="/perspective" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition">
//             <FaBookOpen className="mr-3" /> {t("nav.perspective")}
//           </Link>

//           <div className="relative" ref={langDropdownRef}>
//             <button
//               className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition text-xs font-semibold w-full"
//               onClick={() => setLangDropdownOpen((s) => !s)}
//             >
//               <img src={selectedLang.flag} alt={selectedLang.name} className="w-5 h-5 mr-2 rounded-sm object-cover" />
//               {selectedLang.name}
//               <svg className="ml-2 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//               </svg>
//             </button>
//             {langDropdownOpen && (
//               <ul className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1">
//                 {languages.map((l) => (
//                   <li
//                     key={l.code}
//                     className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 text-xs ${lang === l.code ? "bg-gray-100 font-bold" : ""}`}
//                     onClick={() => { setLang(l.code); setLangDropdownOpen(false); setMenuOpen(false); }}
//                   >
//                     <img src={l.flag} alt={l.name} className="w-5 h-5 mr-2 rounded-sm object-cover" />
//                     {l.name}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {currentUser ? (
//             <Link to="/dashboard" className="flex items-center px-3 py-2 rounded-md bg-teal-500 text-white hover:bg-teal-600 transition">
//               <FaUser className="mr-2" /> {t("nav.dashboard")}
//             </Link>
//           ) : (
//             <button onClick={() => { setShowModal(true); setMenuOpen(false); }} className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition">
//               <FaUser className="mr-2" /> {t("nav.sign_in")}
//             </button>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;



// import { Link } from "react-router-dom";
// import {
//   FaUser,
//   FaBriefcase,
//   FaBuilding,
//   FaSearch,
//   FaStar,
//   FaBookOpen,
//   FaBars,
//   FaTimes
// } from "react-icons/fa";
// import { useAuth } from "../contexts/AuthContext";
// import LoginPage from "../pages/LoginPage";
// import { useState, useRef, useEffect } from "react";
// import { useTranslation } from "../contexts/LanguageProvider";

// const Navbar = () => {
//   const { currentUser } = useAuth();
//   const [showModal, setShowModal] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);

//   const { t, languages, lang, setLang } = useTranslation();
//   const [langDropdownOpen, setLangDropdownOpen] = useState(false);
//   const langDropdownRef = useRef(null);

//   useEffect(() => {
//     function onClick(e) {
//       if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
//         setLangDropdownOpen(false);
//       }
//     }
//     if (langDropdownOpen) document.addEventListener("mousedown", onClick);
//     return () => document.removeEventListener("mousedown", onClick);
//   }, [langDropdownOpen]);

//   const selectedLang = languages.find((l) => l.code === lang) || languages[0];

//   return (
//     <nav className="bg-white border-b border-gray-200 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between [@media(min-width:999px)]:justify-around items-center h-16">
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center">
//               <img src="logo.png" alt="ArtCee" className="w-10 h-10" />
//               <span className="ml-2 text-xl font-bold text-gray-800">
//                 <span className="bg-gradient-to-r from-[#1FA29A] to-orange-400 bg-clip-text text-transparent">ArtCee</span>
//               </span>
//             </Link>
//           </div>

//           <div className="hidden [@media(min-width:999px)]:flex items-center space-x-4 text-xs font-semibold">
//             <Link to="/creatives" className="text-gray-700 hover:text-black rounded-md flex items-center hover:bg-gray-100 transition px-3 py-1.5">
//               <FaSearch className="mr-3" /> {t("nav.browse_creatives")}
//             </Link>
//             <Link to="/business-directory" className="text-gray-700 hover:text-black rounded-md flex items-center hover:bg-gray-100 transition px-3 py-1.5">
//               <FaBuilding className="mr-3" /> {t("nav.business_directory")}
//             </Link>
//             <Link to="/jobs" className="text-gray-700 hover:text-black rounded-md flex items-center hover:bg-gray-100 transition px-3 py-1.5">
//               <FaBriefcase className="mr-3" /> {t("nav.find_jobs")}
//             </Link>
//             <Link to="/spotlight" className="text-gray-700 hover:text-black flex rounded-md items-center hover:bg-gray-100 transition px-3 py-1.5">
//               <FaStar className="mr-3" /> {t("nav.spotlight")}
//             </Link>
//             <Link to="/perspective" className="text-gray-700 hover:text-black flex rounded-md items-center hover:bg-gray-100 transition px-3 py-1.5">
//               <FaBookOpen className="mr-3" /> {t("nav.perspective")}
//             </Link>

//             <div className="relative" ref={langDropdownRef}>
//               <button
//                 className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition text-xs font-semibold focus:outline-none"
//                 onClick={() => setLangDropdownOpen((s) => !s)}
//                 aria-haspopup="listbox"
//                 aria-expanded={langDropdownOpen}
//               >
//                 <img src={selectedLang.flag} alt={selectedLang.name} className="w-5 h-5 mr-2 rounded-sm object-cover" />
//                 {selectedLang.name}
//                 <svg className="ml-2 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </button>

//               {langDropdownOpen && (
//                 <ul className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1">
//                   {languages.map((l) => (
//                     <li
//                       key={l.code}
//                       className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 text-xs ${lang === l.code ? "bg-gray-100 font-bold" : ""}`}
//                       onClick={() => { setLang(l.code); setLangDropdownOpen(false); }}
//                       role="option"
//                       aria-selected={lang === l.code}
//                     >
//                       <img src={l.flag} alt={l.name} className="w-5 h-5 mr-2 rounded-sm object-cover" />
//                       {l.name}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             {currentUser ? (
//               <Link to="/dashboard" className="flex items-center px-3 py-1.5 rounded-md bg-teal-500 text-white hover:bg-teal-600 transition text-xs font-semibold">
//                 <FaUser className="mr-2" /> {t("nav.dashboard")}
//               </Link>
//             ) : (
//               <button onClick={() => setShowModal(true)} className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition text-xs font-semibold">
//                 <FaUser className="mr-2" /> {t("nav.sign_in")}
//               </button>
//             )}
//           </div>

//          <div className="[@media(min-width:999px)]:hidden"> <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 hover:text-black focus:outline-none"> {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />} </button> </div>
//         </div>
//       </div>

//       {showModal && <LoginPage onClose={() => setShowModal(false)} />}

//       {menuOpen && (
//         <div className="[@media(min-width:999px)]:hidden px-4 pb-4 space-y-2 text-xs font-semibold w-full box-border">
//           <Link to="/creatives" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition">
//             <FaSearch className="mr-3" /> {t("nav.browse_creatives")}
//           </Link>
//           <Link to="/business-directory" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition">
//             <FaBuilding className="mr-3" /> {t("nav.business_directory")}
//           </Link>
//           <Link to="/jobs" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition">
//             <FaBriefcase className="mr-3" /> {t("nav.find_jobs")}
//           </Link>
//           <Link to="/spotlight" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition">
//             <FaStar className="mr-3" /> {t("nav.spotlight")}
//           </Link>
//           <Link to="/perspective" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition">
//             <FaBookOpen className="mr-3" /> {t("nav.perspective")}
//           </Link>

//           <div className="relative" ref={langDropdownRef}>
//             <button
//               className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition text-xs font-semibold "
//               onClick={() => setLangDropdownOpen((s) => !s)}
//             >
//               <img src={selectedLang.flag} alt={selectedLang.name} className="w-5 h-5 mr-2 rounded-sm object-cover" />
//               {selectedLang.name}
//               <svg className="ml-2 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//               </svg>
//             </button>
//             {langDropdownOpen && (
//               <ul className="absolute left-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1">
//                 {languages.map((l) => (
//                   <li
//                     key={l.code}
//                     className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 text-xs ${lang === l.code ? "bg-gray-100 font-bold" : ""}`}
//                     onClick={() => { setLang(l.code); setLangDropdownOpen(false); setMenuOpen(false); }}
//                   >
//                     <img src={l.flag} alt={l.name} className="w-5 h-5 mr-2 rounded-sm object-cover" />
//                     {l.name}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {currentUser ? (
//             <Link to="/dashboard" className="flex items-center px-3 py-2 rounded-md bg-teal-500 text-white hover:bg-teal-600 transition">
//               <FaUser className="mr-2" /> {t("nav.dashboard")}
//             </Link>
//           ) : (
//             <button onClick={() => { setShowModal(true); setMenuOpen(false); }} className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition">
//               <FaUser className="mr-2" /> {t("nav.sign_in")}
//             </button>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };
 
// export default Navbar;


import { Link } from "react-router-dom";
import {
  FaUser,
  FaBriefcase,
  FaBuilding,
  FaSearch,
  FaStar,
  FaBookOpen,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import LoginPage from "../pages/LoginPage";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "../contexts/LanguageProvider";
import Cookies from "js-cookie";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { t, languages, lang, setLang } = useTranslation();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);

  
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get("token"));

  useEffect(() => {
    const checkAuth = () => setIsAuthenticated(!!Cookies.get("token"));
    checkAuth();

    window.addEventListener("authChanged", checkAuth);
    window.addEventListener("storage", checkAuth); 

    return () => {
      window.removeEventListener("authChanged", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    window.dispatchEvent(new Event("authChanged"));
  };

  useEffect(() => {
    function onClick(e) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    }
    if (langDropdownOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [langDropdownOpen]);

  const selectedLang = languages.find((l) => l.code === lang) || languages[0];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between [@media(min-width:999px)]:justify-around items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="logo.png" alt="ArtCee" className="w-10 h-10" />
              <span className="ml-2 text-xl font-bold text-gray-800">
                <span className="bg-gradient-to-r from-[#1FA29A] to-orange-400 bg-clip-text text-transparent">
                  ArtCee
                </span>
              </span>
            </Link>
          </div>

          
          <div className="hidden [@media(min-width:999px)]:flex items-center space-x-4 text-xs font-semibold">
            <Link
              to="/creatives"
              className="text-gray-700 hover:text-black rounded-md flex items-center hover:bg-gray-100 transition px-3 py-1.5"
            >
              <FaSearch className="mr-3" /> {t("nav.browse_creatives")}
            </Link>
            <Link
              to="/business-directory"
              className="text-gray-700 hover:text-black rounded-md flex items-center hover:bg-gray-100 transition px-3 py-1.5"
            >
              <FaBuilding className="mr-3" /> {t("nav.business_directory")}
            </Link>
            <Link
              to="/jobs"
              className="text-gray-700 hover:text-black rounded-md flex items-center hover:bg-gray-100 transition px-3 py-1.5"
            >
              <FaBriefcase className="mr-3" /> {t("nav.find_jobs")}
            </Link>
            <Link
              to="/spotlight"
              className="text-gray-700 hover:text-black flex rounded-md items-center hover:bg-gray-100 transition px-3 py-1.5"
            >
              <FaStar className="mr-3" /> {t("nav.spotlight")}
            </Link>
            <Link
              to="/perspective"
              className="text-gray-700 hover:text-black flex rounded-md items-center hover:bg-gray-100 transition px-3 py-1.5"
            >
              <FaBookOpen className="mr-3" /> {t("nav.perspective")}
            </Link>

            
            <div className="relative" ref={langDropdownRef}>
              <button
                className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition text-xs font-semibold focus:outline-none"
                onClick={() => setLangDropdownOpen((s) => !s)}
                aria-haspopup="listbox"
                aria-expanded={langDropdownOpen}
              >
                <img
                  src={selectedLang.flag}
                  alt={selectedLang.name}
                  className="w-5 h-5 mr-2 rounded-sm object-cover"
                />
                {selectedLang.name}
                <svg
                  className="ml-2 w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {langDropdownOpen && (
                <ul className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1">
                  {languages.map((l) => (
                    <li
                      key={l.code}
                      className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 text-xs ${
                        lang === l.code ? "bg-gray-100 font-bold" : ""
                      }`}
                      onClick={() => {
                        setLang(l.code);
                        setLangDropdownOpen(false);
                      }}
                      role="option"
                      aria-selected={lang === l.code}
                    >
                      <img
                        src={l.flag}
                        alt={l.name}
                        className="w-5 h-5 mr-2 rounded-sm object-cover"
                      />
                      {l.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-1.5 rounded-md bg-red-500 text-white hover:bg-red-600 transition text-xs font-semibold"
              >
                <FaUser className="mr-2" /> {t("nav.logout")}
              </button>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition text-xs font-semibold"
              >
                <FaUser className="mr-2" /> {t("nav.sign_in")}
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="[@media(min-width:999px)]:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 hover:text-black focus:outline-none"
            >
              {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      
      {showModal && <LoginPage onClose={() => setShowModal(false)} />}

      
      {menuOpen && (
        <div className="[@media(min-width:999px)]:hidden px-4 pb-4 space-y-2 text-xs font-semibold w-full box-border">
          <Link to="/creatives" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition">
            <FaSearch className="mr-3" /> {t("nav.browse_creatives")}
          </Link>
          <Link to="/business-directory" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition">
            <FaBuilding className="mr-3" /> {t("nav.business_directory")}
          </Link>
          <Link to="/jobs" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition">
            <FaBriefcase className="mr-3" /> {t("nav.find_jobs")}
          </Link>
          <Link to="/spotlight" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition">
            <FaStar className="mr-3" /> {t("nav.spotlight")}
          </Link>
          <Link to="/perspective" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition">
            <FaBookOpen className="mr-3" /> {t("nav.perspective")}
          </Link>

          
          {isAuthenticated ? (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="flex items-center px-3 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
            >
              <FaUser className="mr-2" /> {t("nav.logout")}
            </button>
          ) : (
            <button
              onClick={() => {
                setShowModal(true);
                setMenuOpen(false);
              }}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
            >
              <FaUser className="mr-2" /> {t("nav.sign_in")}
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
