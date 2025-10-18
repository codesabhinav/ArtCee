import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProjectProvider } from './contexts/ProjectContext'
import MainLayout from './layouts/MainLayout'
import DashboardLayout from './layouts/DashboardLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import ProfilePage from './pages/ProfilePage'
import CreateProjectPage from './pages/CreateProjectPage'
import NotFoundPage from './pages/NotFoundPage'
import CreativeDirectory from './pages/CreativeDirectory'
import BusinessDirectory from './pages/BusinessDirectory'
import JobsOpportunities from './pages/JobsOpportunities'
import FeaturePremiumPage from './pages/FeaturePremiumPage'
import ToastProvider from "./components/ToastProvider";
import GuestDashboardPage from './pages/GuestDashboardPage'
import LandingPage from './pages/LandingPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import PaymentCancelPage from './pages/PaymentCancelPage'
import ForgotPasswordModal from './modal/ForgotPasswordModal'
import ChatList from './pages/ChatListScreen'

function App() {
  return (
    <AuthProvider>
      <ToastProvider />
      <ProjectProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/home" replace state={{ showLanding: true }} />} />
              <Route path='home' element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="forgot-password" element={<ForgotPasswordModal />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="creatives" element={<CreativeDirectory />} />
              <Route path="business-directory" element={<BusinessDirectory />} />
              <Route path="jobs" element={<JobsOpportunities />} />
              <Route path="featured" element={<FeaturePremiumPage />} />
              <Route path="profile" element={<GuestDashboardPage />} />
              <Route path="inbox" element={<ChatList />} />
            </Route>

            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="projects/create" element={<CreateProjectPage />} />
              <Route path="projects/:projectId" element={<ProjectDetailPage />} />
              {/* <Route path="profile" element={<ProfilePage />} /> */}

            </Route>

            <Route path="/payment">
              <Route path="success" element={<PaymentSuccessPage />} />
              <Route path="cancel" element={<PaymentCancelPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage/>} />
            {/* <Route index element={<LandingPage />}></Route> */}
            {/* <Route index element={<HomePage />} /> */}
          </Routes>
        </Router>
      </ProjectProvider>
    </AuthProvider>
  )
}

export default App
