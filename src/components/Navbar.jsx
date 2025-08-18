import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FaUser, FaSignInAlt } from 'react-icons/fa'

const Navbar = () => {
  const { currentUser } = useAuth()

  return (
    <nav className="bg-white shadow-medium border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold gradient-text">ArtCee</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/about" className="nav-link">
              About
            </Link>
            <Link to="/services" className="nav-link">
              Services
            </Link>
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
            
            {currentUser ? (
              <Link to="/dashboard" className="btn-primary">
                <FaUser className="mr-2" />
                Dashboard
              </Link>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="nav-link flex items-center">
                  <FaSignInAlt className="mr-1" />
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
