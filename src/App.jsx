import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { LangProvider } from './contexts/LangContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ToastContainer from './components/feedback/ToastContainer'
import Spinner from './components/ui/Spinner'

import Home from './pages/home/Home'
import Listings from './pages/Listings'
import PropertyDetail from './pages/PropertyDetail'
import AuthPage from './pages/auth/AuthPage'
import ResetPassword from './pages/auth/ResetPassword'
import AgentDashboard from './pages/dashboard/AgentDashboard'
import PostProperty from './pages/post/PostProperty'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Spinner fullscreen />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/listings" element={<Listings />} />
      <Route path="/property/:id" element={<PropertyDetail />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AgentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/post-property"
        element={
          <ProtectedRoute>
            <PostProperty />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <ToastContainer />
        </BrowserRouter>
      </AuthProvider>
    </LangProvider>
  )
}
