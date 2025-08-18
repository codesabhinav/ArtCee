import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  FaHome, 
  FaProjectDiagram, 
  FaUser, 
  FaPlus, 
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa'
import { useState } from 'react'

const Sidebar = () => {
  const { currentUser, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FaHome },
    { name: 'Projects', href: '/dashboard/projects', icon: FaProjectDiagram },
    { name: 'Create Project', href: '/dashboard/projects/create', icon: FaPlus },
    { name: 'Profile', href: '/dashboard/profile', icon: FaUser },
  ]

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-blue-600 text-white"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 bg-blue-600 text-white">
            <span className="text-xl font-bold">ArtCee</span>
          </div>
          
          <div className="flex-1 px-4 py-6">
            <div className="mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentUser?.email || 'user@example.com'}
                  </p>
                </div>
              </div>
            </div>
            
            <nav className="space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `sidebar-link ${
                      isActive
                        ? 'sidebar-link-active'
                        : 'sidebar-link-inactive'
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="sidebar-link sidebar-link-inactive w-full"
            >
              <FaSignOutAlt className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar
