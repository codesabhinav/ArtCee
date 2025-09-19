import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const MainLayout = () => {
  const location = useLocation()
  const hideLayoutRoutes = ['/register', '/creatives', '/business-directory', '/jobs', '/featured', '/profile']
  const hideLayout = hideLayoutRoutes.includes(location.pathname)

  return (
    <div className="min-h-screen flex flex-col">
      {!hideLayout && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideLayout && <Footer />}
    </div>
  )
}

export default MainLayout
