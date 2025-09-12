import { Link } from "react-router-dom"
import { FaUser, FaBriefcase, FaBuilding, FaSearch, FaStar, FaBookOpen, FaBars, FaTimes } from "react-icons/fa"
import { useAuth } from "../contexts/AuthContext"
import LoginPage from "../pages/LoginPage"
import { useState } from "react"

const Navbar = () => {
  const { currentUser } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between lg:justify-around items-center h-16">

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/src/images/logo.png" alt="ArtCee" className="w-10 h-10" />
              <span className="ml-2 text-xl font-bold text-gray-800">
                <span className="bg-gradient-to-r from-[#1FA29A] to-orange-400 bg-clip-text text-transparent">ArtCee</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-4 text-xs font-semibold">
            <Link to="/creatives" className="text-gray-700 hover:text-black rounded-md flex items-center hover:bg-gray-100 transition px-3 py-1.5">
              <FaSearch className="mr-3" /> Browse Creatives
            </Link>
            <Link to="/business-directory" className="text-gray-700 hover:text-black rounded-md flex items-center hover:bg-gray-100 transition px-3 py-1.5">
              <FaBuilding className="mr-3" /> Business Directory
            </Link>
            <Link to="/jobs" className="text-gray-700 hover:text-black rounded-md flex items-center hover:bg-gray-100 transition px-3 py-1.5">
              <FaBriefcase className="mr-3" /> Find Jobs
            </Link>
            <Link to="/spotlight" className="text-gray-700 hover:text-black flex rounded-md items-center hover:bg-gray-100 transition px-3 py-1.5">
              <FaStar className="mr-3" /> Spotlight
            </Link>
            <Link to="/perspective" className="text-gray-700 hover:text-black flex rounded-md items-center hover:bg-gray-100 transition px-3 py-1.5">
              <FaBookOpen className="mr-3" /> The Perspective
            </Link>
            {currentUser ? (
              <Link to="/dashboard" className="flex items-center px-3 py-1.5 rounded-md bg-teal-500 text-white hover:bg-teal-600 transition text-xs font-semibold">
                <FaUser className="mr-2" /> Dashboard
              </Link>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition text-xs font-semibold"
              >
                <FaUser className="mr-2" /> Sign In
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 hover:text-black focus:outline-none">
              {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

{showModal && <LoginPage onClose={() => setShowModal(false)} />}
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 text-xs font-semibold">
          <Link to="/creatives" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition">
            <FaSearch className="mr-3" /> Browse Creatives
          </Link>
          <Link to="/business-directory" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition">
            <FaBuilding className="mr-3" /> Business Directory
          </Link>
          <Link to="/jobs" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition">
            <FaBriefcase className="mr-3" /> Find Jobs
          </Link>
          <Link to="/spotlight" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition">
            <FaStar className="mr-3" /> Spotlight
          </Link>
          <Link to="/perspective" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition">
            <FaBookOpen className="mr-3" /> The Perspective
          </Link>
          {currentUser ? (
            <Link to="/dashboard" className="flex items-center px-3 py-2 rounded-md bg-teal-500 text-white hover:bg-teal-600 transition">
              <FaUser className="mr-2" /> Dashboard
            </Link>
          ) : (
            <button
              onClick={() => {
                setShowModal(true)
                setMenuOpen(false)
              }}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
            >
              <FaUser className="mr-2" /> Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
