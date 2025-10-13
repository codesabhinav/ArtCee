import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "../contexts/LanguageProvider";
import Cookies from "js-cookie";
import { BookOpen, Briefcase, Building2, Search, Spotlight, Users } from "lucide-react";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { t, languages, lang, setLang } = useTranslation();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);

  const [showComingSoon, setShowComingSoon] = useState(false);
  const modalRef = useRef(null); 

  const navigate = useNavigate();

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


  useEffect(() => {
    if (!showComingSoon) return;

    function handleModalClick(e) {
      const btn = e.target.closest && e.target.closest("button");
      if (!btn) return;

      const text = (btn.textContent || "").trim().toLowerCase();

      if (text.includes("go back")) {
        e.preventDefault();
        setShowComingSoon(false);
      }
    }

    const el = modalRef.current;
    if (el) el.addEventListener("click", handleModalClick);

    return () => {
      if (el) el.removeEventListener("click", handleModalClick);
    };
  }, [showComingSoon, navigate]);

  const selectedLang = languages.find((l) => l.code === lang) || languages[0];

  useEffect(() => {
    if (showComingSoon) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showComingSoon]);

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

          <div className="hidden [@media(min-width:999px)]:flex items-center space-x-2 text-xs font-semibold">
            <Link
              to="/creatives"
              className="text-gray-700 hover:text-black rounded-md flex items-center hover:bg-gray-200 transition px-3 py-2"
            >
              <Search className="mr-2 h-4 w-4" /> {t("nav.browse_creatives")}
            </Link>
            <Link
              to="/jobs"
              className="text-gray-700 hover:text-black rounded-md flex items-center hover:bg-gray-200 transition px-3 py-2"
            >
              <Briefcase className="mr-2 h-4 w-4" /> {t("nav.find_jobs")}
            </Link>
            <Link
              to="/business-directory"
              className="text-gray-700 hover:text-black rounded-md flex items-center hover:bg-gray-200 transition px-3 py-2"
            >
              <Building2 className="mr-2 h-4 w-4" /> {t("nav.business_directory")}
            </Link>
            <button
              onClick={() => setShowComingSoon(true)}
              className="text-gray-700 hover:text-black flex rounded-md items-center hover:bg-gray-200 transition px-3 py-2"
              aria-pressed={showComingSoon}
              type="button"
            >
              <Spotlight className="mr-2 h-4 w-4" /> {t("nav.spotlight")}
            </button>

            <button
              onClick={() => setShowComingSoon(true)}
              className="text-gray-700 hover:text-black flex rounded-md items-center hover:bg-gray-200 transition px-3 py-2"
              type="button"
            >
              <BookOpen className="mr-2 h-4 w-4" /> {t("nav.perspective")}
            </button>

            <button
              onClick={() => setShowComingSoon(true)}
              className="text-gray-700 hover:text-black flex rounded-md items-center hover:bg-gray-200 transition px-3 py-2"
              type="button"
            >
              <Users className="mr-2 h-4 w-4" /> Groups
            </button>

            <div className="relative" ref={langDropdownRef}>
              <button
                className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200 transition text-xs font-semibold focus:outline-none"
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
                      <img src={l.flag} alt={l.name} className="w-5 h-5 mr-2 rounded-sm object-cover" />
                      {l.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {isAuthenticated ? (
              <Link
                to="/profile"
                className="flex items-center px-3 py-2 rounded-md bg-teal-500 text-white hover:bg-teal-600 transition text-xs font-semibold"
              >
                <FaUser className="mr-2" /> {t("nav.my_account")}
              </Link>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center px-3 py-2 border border-gray-400 rounded-md text-gray-700 hover:bg-gray-100 transition text-xs font-semibold"
              >
                <FaUser className="mr-2" /> {t("nav.sign_in")}
              </button>
            )}
          </div>

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
            <Search className="mr-3 h-4 w-4" /> {t("nav.browse_creatives")}
          </Link>
          <Link to="/jobs" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition">
            <Briefcase className="mr-3 h-4 w-4" /> {t("nav.find_jobs")}
          </Link>
          <Link to="/business-directory" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition">
            <Building2 className="mr-3 h-4 w-4" /> {t("nav.business_directory")}
          </Link>

          <button
            onClick={() => {
              setShowComingSoon(true);
              setMenuOpen(false);
            }}
            className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition w-full text-left"
            type="button"
          >
            <Spotlight className="mr-3 h-4 w-4" /> {t("nav.spotlight")}
          </button>

          <button
            onClick={() => {
              setShowComingSoon(true);
              setMenuOpen(false);
            }}
            className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition w-full text-left"
            type="button"
          >
            <BookOpen className="mr-3 h-4 w-4" /> {t("nav.perspective")}
          </button>

          <button
            onClick={() => {
              setShowComingSoon(true);
              setMenuOpen(false);
            }}
            className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition w-full text-left"
            type="button"
          >
            <Users className="mr-3 h-4 w-4" /> Groups
          </button>

          <div className="border-t border-gray-200 pt-3">
            <button
              onClick={() => setMobileLangOpen((s) => !s)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 transition text-left"
              aria-expanded={mobileLangOpen}
            >
              <div className="flex items-center">
                <img src={selectedLang.flag} alt={selectedLang.name} className="w-5 h-5 mr-2 rounded-sm object-cover" />
                <span className="text-gray-700 text-xs font-semibold">{selectedLang.name}</span>
              </div>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileLangOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
              </svg>
            </button>

            {mobileLangOpen && (
              <ul className="mt-2 space-y-1">
                {languages.map((l) => (
                  <li
                    key={l.code}
                    className={`flex items-center px-3 py-2 cursor-pointer rounded-md hover:bg-gray-100 text-xs ${lang === l.code ? "bg-gray-100 font-bold" : ""}`}
                    onClick={() => {
                      setLang(l.code);
                      setMobileLangOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    <img src={l.flag} alt={l.name} className="w-5 h-5 mr-2 rounded-sm object-cover" />
                    {l.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {isAuthenticated ? (
            <Link
              to="/profile"
              className="flex items-center px-3 py-2 w-[120px] rounded-md bg-teal-500 text-white hover:bg-teal-600 transition text-xs font-semibold"
            >
              <FaUser className="mr-2" /> {t("nav.my_account")}
            </Link>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
                setMenuOpen(false);
              }}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
            >
              <FaUser className="mr-2" /> {t("nav.sign_in")}
            </button>
          )}
        </div>
      )}

      {showComingSoon && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl p-6" ref={modalRef}>
            <div className="relative bg-transparent rounded-2xl overflow-hidden">

              <div className="rounded-2xl overflow-hidden">
                <NotFoundPage />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
