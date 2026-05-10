import { createContext, useContext, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { strings } from './i18n/strings'

import Home from './pages/Home'
import Listings from './pages/Listings'
import PropertyDetail from './pages/PropertyDetail'
import Login from './pages/Login'
import AgentDashboard from './pages/AgentDashboard'
import PostProperty from './pages/PostProperty'

export const LangContext = createContext()

export function useLang() {
  return useContext(LangContext)
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const [lang, setLang] = useState('en')
  const t = (key) => strings[lang][key] ?? strings.en[key] ?? key

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/login" element={<Login />} />
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
      </BrowserRouter>
    </LangContext.Provider>
  )
}
