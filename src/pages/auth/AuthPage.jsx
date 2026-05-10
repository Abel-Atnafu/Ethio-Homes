import { useEffect } from 'react'
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/feedback/useToast'
import AuthBgShapes from './AuthBgShapes'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import ForgotPassword from './ForgotPassword'

const STATS = [['500+', 'Listings'], ['200+', 'Agents'], ['10+', 'Cities']]

export default function AuthPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const mode = searchParams.get('tab') || 'login'
  const from = location.state?.from?.pathname || '/dashboard'

  useEffect(() => {
    if (user) navigate(from, { replace: true })
  }, [user, navigate, from])

  function switchMode(m) {
    setSearchParams({ tab: m })
  }

  function handleLoginSuccess() {
    toast.success('Welcome back!')
    navigate(from, { replace: true })
  }

  function handleRegisterSuccess() {
    toast.success('Account created! Welcome to EthioHomes.')
    navigate(from, { replace: true })
  }

  function handleVerificationNeeded() {
    toast.info('Check your email to confirm your account, then sign in.')
    switchMode('login')
  }

  const titles = {
    login: { heading: 'Welcome back', sub: 'Sign in to manage your listings' },
    register: { heading: 'Join EthioHomes', sub: "Create your agent account — it's free" },
    forgot: { heading: 'Reset Password', sub: "We'll send a link to your email" },
  }

  const { heading, sub } = titles[mode] || titles.login

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-[#5a1208] to-stone-900 flex flex-col items-center justify-center p-4 relative">
      <AuthBgShapes />

      <div className="absolute top-5 left-5 z-10">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs font-medium transition-colors"
        >
          <Home size={13} /> EthioHomes
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="EthioHomes" className="h-10 w-auto mx-auto mb-4 brightness-0 invert" />
          <h1 className="font-display text-3xl font-bold text-white">{heading}</h1>
          <p className="text-white/50 text-sm mt-1.5">{sub}</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Tab switcher — only for login / register */}
          {mode !== 'forgot' && (
            <div className="flex bg-white/10 rounded-2xl p-1 mb-7">
              {['login', 'register'].map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    mode === m
                      ? 'bg-terracotta text-white shadow-lg shadow-terracotta/30'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {m === 'login' ? 'Sign In' : 'Register'}
                </button>
              ))}
            </div>
          )}

          {mode === 'login' && (
            <LoginForm
              onSuccess={handleLoginSuccess}
              onForgotPassword={() => switchMode('forgot')}
            />
          )}

          {mode === 'register' && (
            <RegisterForm
              onSuccess={handleRegisterSuccess}
              onVerificationNeeded={handleVerificationNeeded}
            />
          )}

          {mode === 'forgot' && (
            <ForgotPassword onBack={() => switchMode('login')} />
          )}
        </div>

        {/* Footer link */}
        {mode !== 'forgot' && (
          <p className="text-center text-sm text-white/40 mt-5">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            {' '}
            <button
              onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
              className="text-gold font-semibold hover:text-gold/80 transition-colors"
            >
              {mode === 'login' ? 'Register →' : 'Sign In →'}
            </button>
          </p>
        )}

        {/* Stats */}
        <div className="flex justify-center gap-8 mt-8">
          {STATS.map(([val, lbl]) => (
            <div key={lbl} className="text-center">
              <div className="text-white font-bold text-lg">{val}</div>
              <div className="text-white/40 text-xs">{lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
