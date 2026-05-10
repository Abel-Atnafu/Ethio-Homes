import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Home, List, PlusCircle, LogIn, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react'
import { useLang } from '../contexts/LangContext'
import { useAuth } from '../hooks/useAuth'
import { useToast } from './feedback/useToast'

export default function Navbar() {
  const { lang, setLang, t } = useLang()
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const mobileRef = useRef(null)

  const isActive = (path) => location.pathname === path

  const linkClass = (path) =>
    `flex items-center gap-1.5 text-sm font-medium transition-colors ${
      isActive(path) ? 'text-terracotta' : 'text-stone-700 hover:text-terracotta'
    }`

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleLogout() {
    await signOut()
    setDropdownOpen(false)
    setMobileOpen(false)
    toast.info(t('toast_logout'))
    navigate('/')
  }

  function toggleLang() {
    setLang(lang === 'en' ? 'am' : 'en')
  }

  const userInitial = user?.email?.[0]?.toUpperCase() ?? '?'

  const navLinks = (
    <>
      <Link to="/" className={linkClass('/')} onClick={() => setMobileOpen(false)}>
        <Home size={16} /> {t('nav_home')}
      </Link>
      <Link to="/listings" className={linkClass('/listings')} onClick={() => setMobileOpen(false)}>
        <List size={16} /> {t('nav_listings')}
      </Link>
      {user && (
        <Link to="/post-property" className={linkClass('/post-property')} onClick={() => setMobileOpen(false)}>
          <PlusCircle size={16} /> {t('nav_post')}
        </Link>
      )}
    </>
  )

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-stone-100 shadow-sm" ref={mobileRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.svg" alt="EthioHomes" className="h-9 w-auto" />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="text-xs font-bold px-3 py-1.5 rounded-full border border-stone-200 text-stone-600 hover:border-terracotta hover:text-terracotta transition-colors"
            >
              {lang === 'en' ? 'አማ' : 'EN'}
            </button>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-stone-200 hover:border-terracotta transition-colors group"
                  aria-expanded={dropdownOpen}
                >
                  <div className="w-8 h-8 rounded-full bg-terracotta flex items-center justify-center text-white font-bold text-sm">
                    {userInitial}
                  </div>
                  <span className="text-sm font-medium text-stone-700 group-hover:text-terracotta max-w-[120px] truncate">
                    {user.email?.split('@')[0]}
                  </span>
                  <ChevronDown size={14} className={`text-stone-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-stone-100 rounded-2xl shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-3 bg-stone-50 border-b border-stone-100">
                      <p className="text-xs text-stone-400 font-medium">Signed in as</p>
                      <p className="text-sm text-stone-700 font-semibold truncate">{user.email}</p>
                    </div>
                    <div className="py-1.5">
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 hover:text-terracotta transition-colors"
                      >
                        <LayoutDashboard size={16} /> {t('nav_dashboard')}
                      </Link>
                      <Link
                        to="/post-property"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 hover:text-terracotta transition-colors"
                      >
                        <PlusCircle size={16} /> {t('nav_post')}
                      </Link>
                      <div className="my-1 border-t border-stone-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} /> {t('nav_logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 bg-terracotta text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-orange-800 transition-colors shadow-sm shadow-terracotta/20"
              >
                <LogIn size={16} /> {t('nav_login')}
              </Link>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleLang}
              className="text-xs font-bold px-2.5 py-1.5 rounded-full border border-stone-200 text-stone-600"
            >
              {lang === 'en' ? 'አማ' : 'EN'}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-stone-700 hover:text-terracotta transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 px-4 pb-5">
          <div className="flex flex-col gap-1 pt-3">
            {user && (
              <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-stone-50 rounded-xl">
                <div className="w-9 h-9 rounded-full bg-terracotta flex items-center justify-center text-white font-bold">
                  {userInitial}
                </div>
                <div>
                  <p className="text-xs text-stone-400">Signed in as</p>
                  <p className="text-sm font-semibold text-stone-700 truncate max-w-[180px]">{user.email}</p>
                </div>
              </div>
            )}
            {navLinks}
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-stone-700 hover:text-terracotta hover:bg-stone-50 rounded-xl transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <LayoutDashboard size={16} /> {t('nav_dashboard')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left"
                >
                  <LogOut size={16} /> {t('nav_logout')}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center gap-1.5 bg-terracotta text-white text-sm font-semibold px-4 py-3 rounded-xl mt-1"
                onClick={() => setMobileOpen(false)}
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
