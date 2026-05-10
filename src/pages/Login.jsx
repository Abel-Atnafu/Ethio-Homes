import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Eye, EyeOff, Mail, Lock, User, Phone,
  Building2, ArrowRight, Home,
} from 'lucide-react'
import { useLang } from '../App'
import { supabase } from '../lib/supabase'

/* ─── tiny reusable input ─── */
function Field({ icon: Icon, label, hint, right, ...props }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-white/70 uppercase tracking-widest">
          {label}
        </label>
        {hint && <span className="text-xs text-white/40">{hint}</span>}
        {right}
      </div>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
          <Icon size={15} />
        </span>
        <input
          {...props}
          className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold focus:bg-white/15 transition-all"
        />
      </div>
    </div>
  )
}

/* ─── animated background shapes ─── */
function BgShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gold/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 -right-32 w-80 h-80 bg-terracotta/30 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
      <div className="absolute -bottom-32 left-1/3 w-72 h-72 bg-orange-900/40 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '30px 30px',
        }}
      />
    </div>
  )
}

export default function Login() {
  const { t } = useLang()
  const navigate = useNavigate()

  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [agencyName, setAgencyName] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function switchMode(m) {
    setMode(m)
    setError('')
    setSuccess('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password })
        if (err) {
          setError(err.message.includes('Invalid') ? 'Incorrect email or password.' : err.message)
          return
        }
        navigate('/dashboard')
      } else {
        // Sign up
        const { data, error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        })
        if (signUpErr) {
          setError(signUpErr.message)
          return
        }

        // Insert agent profile — works even before email confirmation
        if (data?.user?.id) {
          const { error: agentErr } = await supabase.from('agents').upsert({
            id: data.user.id,
            full_name: fullName,
            phone: phone.replace(/\D/g, ''),
            agency_name: agencyName || null,
            whatsapp: phone.replace(/\D/g, ''),
          })
          // non-fatal — agent row can be created on first login if this fails
          if (agentErr) console.warn('Agent profile insert:', agentErr.message)
        }

        // If session exists → auto-confirmed, go straight to dashboard
        if (data?.session) {
          navigate('/dashboard')
        } else {
          setSuccess('Account created! Check your email for a confirmation link, then sign in.')
          switchMode('login')
        }
      }
    } catch (e) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isLogin = mode === 'login'

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-[#5a1208] to-stone-900 flex flex-col items-center justify-center p-4 relative">
      <BgShapes />

      {/* Back link */}
      <div className="absolute top-5 left-5 z-10">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs font-medium transition-colors"
        >
          <Home size={13} /> EthioHomes
        </Link>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="EthioHomes" className="h-10 w-auto mx-auto mb-4 brightness-0 invert" />
          <h1 className="font-display text-3xl font-bold text-white">
            {isLogin ? 'Welcome back' : 'Join EthioHomes'}
          </h1>
          <p className="text-white/50 text-sm mt-1.5">
            {isLogin
              ? 'Sign in to manage your listings'
              : 'Create your agent account — it\'s free'}
          </p>
        </div>

        {/* Glass card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">

          {/* Tab toggle */}
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

          {/* Alert */}
          {error && (
            <div className="flex items-start gap-2.5 bg-red-500/20 border border-red-400/30 text-red-300 rounded-xl px-4 py-3 text-sm mb-5">
              <span className="mt-0.5 shrink-0">⚠</span> {error}
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2.5 bg-green-500/20 border border-green-400/30 text-green-300 rounded-xl px-4 py-3 text-sm mb-5">
              <span className="mt-0.5 shrink-0">✓</span> {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <Field
                  icon={User}
                  label="Full Name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Abebe Girma"
                />
                <Field
                  icon={Phone}
                  label="Phone Number"
                  hint="without country code"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="912 345 678"
                />
                <Field
                  icon={Building2}
                  label="Agency Name"
                  hint="optional"
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  placeholder="Addis Real Estate"
                />
              </>
            )}

            <Field
              icon={Mail}
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent@example.com"
            />

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-white/70 uppercase tracking-widest">
                  Password
                </label>
                {isLogin && (
                  <button
                    type="button"
                    className="text-xs text-gold/80 hover:text-gold transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                  <Lock size={15} />
                </span>
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-12 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold focus:bg-white/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-terracotta hover:bg-orange-800 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-terracotta/30 hover:shadow-terracotta/50 hover:-translate-y-0.5 active:translate-y-0 mt-2 text-sm"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Switch mode */}
        <p className="text-center text-sm text-white/40 mt-5">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          {' '}
          <button
            onClick={() => switchMode(isLogin ? 'register' : 'login')}
            className="text-gold font-semibold hover:text-gold/80 transition-colors"
          >
            {isLogin ? 'Register →' : 'Sign In →'}
          </button>
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-6 mt-8 text-center">
          {[['500+', 'Listings'], ['200+', 'Agents'], ['10+', 'Cities']].map(([val, lbl]) => (
            <div key={lbl}>
              <div className="text-white font-bold text-lg">{val}</div>
              <div className="text-white/40 text-xs">{lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
