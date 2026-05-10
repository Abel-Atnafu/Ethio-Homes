import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Home, List, PlusCircle, LogIn, LayoutDashboard, LogOut } from 'lucide-react'
import { useLang } from '../App'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const { lang, setLang, t } = useLang()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const linkClass = (path) =>
    `flex items-center gap-1.5 text-sm font-medium transition-colors ${
      isActive(path)
        ? 'text-terracotta'
        : 'text-stone-700 hover:text-terracotta'
    }`

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
    setOpen(false)
  }

  function toggleLang() {
    setLang(lang === 'en' ? 'am' : 'en')
  }

  const navLinks = (
    <>
      <Link to="/" className={linkClass('/')} onClick={() => setOpen(false)}>
        <Home size={16} /> {t('nav_home')}
      </Link>
      <Link to="/listings" className={linkClass('/listings')} onClick={() => setOpen(false)}>
        <List size={16} /> {t('nav_listings')}
      </Link>
      {user && (
        <Link to="/post-property" className={linkClass('/post-property')} onClick={() => setOpen(false)}>
          <PlusCircle size={16} /> {t('nav_post')}
        </Link>
      )}
    </>
  )

  return (
    <nav className="sticky top-0 z-50 bg-cream border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="EthioHomes" className="h-9 w-auto" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks}
          </div>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="text-xs font-semibold px-2.5 py-1 rounded-full border border-stone-300 text-stone-600 hover:border-terracotta hover:text-terracotta transition-colors"
            >
              {lang === 'en' ? 'አማ' : 'EN'}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 text-sm font-medium text-stone-700 hover:text-terracotta transition-colors"
                >
                  <LayoutDashboard size={16} /> {t('nav_dashboard')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-terracotta transition-colors"
                >
                  <LogOut size={16} /> {t('nav_logout')}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 bg-terracotta text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-orange-800 transition-colors"
              >
                <LogIn size={16} /> {t('nav_login')}
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleLang}
              className="text-xs font-semibold px-2 py-1 rounded-full border border-stone-300 text-stone-600"
            >
              {lang === 'en' ? 'አማ' : 'EN'}
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 text-stone-700 hover:text-terracotta transition-colors"
              aria-label="Toggle menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-cream border-t border-stone-200 px-4 pb-4">
          <div className="flex flex-col gap-4 pt-4">
            {navLinks}
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 text-sm font-medium text-stone-700 hover:text-terracotta"
                  onClick={() => setOpen(false)}
                >
                  <LayoutDashboard size={16} /> {t('nav_dashboard')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-terracotta text-left"
                >
                  <LogOut size={16} /> {t('nav_logout')}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center gap-1.5 bg-terracotta text-white text-sm font-semibold px-4 py-2 rounded-lg"
                onClick={() => setOpen(false)}
              >
                <LogIn size={16} /> {t('nav_login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
