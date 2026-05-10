import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Phone, Building2, ArrowRight } from 'lucide-react'
import { useLang } from '../App'
import { supabase } from '../lib/supabase'

const HERO_PHOTO = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80'

const STATS = [
  { value: '500+', label: 'Listings' },
  { value: '200+', label: 'Agents' },
  { value: '10+', label: 'Cities' },
]

function InputField({ icon: Icon, label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-stone-400 pointer-events-none">
          <Icon size={16} />
        </div>
        <input
          {...props}
          className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:bg-white focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all"
        />
      </div>
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
        if (err) { setError(t('login_error')); return }
        navigate('/dashboard')
      } else {
        const { data, error: err } = await supabase.auth.signUp({ email, password })
        if (err) { setError(t('register_error')); return }
        if (data.user) {
          await supabase.from('agents').insert({
            id: data.user.id,
            full_name: fullName,
            phone,
            agency_name: agencyName || null,
            whatsapp: phone,
          })
        }
        setSuccess('Account created! Please check your email to confirm, then sign in.')
        switchMode('login')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left branded panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col overflow-hidden">
        {/* Background photo */}
        <img
          src={HERO_PHOTO}
          alt="Luxury property"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900/90 via-terracotta/70 to-stone-900/80" />

        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="EthioHomes" className="h-9 w-auto brightness-0 invert" />
          </Link>

          {/* Center content */}
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="font-display text-4xl font-bold text-white leading-tight mb-4">
              Ethiopia's Premier<br />Property Marketplace
            </h2>
            <p className="text-white/70 text-base mb-10 leading-relaxed">
              Connect with verified agents, browse thousands of listings, and find your perfect home across Ethiopia.
            </p>

            {/* Stats */}
            <div className="flex gap-4 mb-10">
              {STATS.map((s) => (
                <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 text-center">
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-white/60 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
              <p className="text-white/90 text-sm leading-relaxed italic mb-3">
                "Found my dream apartment in Bole within a week. The WhatsApp contact made it so easy to reach the agent directly — no delays!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/80 flex items-center justify-center text-white font-bold text-sm">
                  S
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">Sara Tadesse</div>
                  <div className="text-white/50 text-xs">Addis Ababa · Tenant</div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-white/40 text-xs">
            Trusted by agents and home seekers across Ethiopia
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="w-full lg:w-1/2 flex flex-col">

        {/* Mobile header */}
        <div className="lg:hidden bg-terracotta px-6 py-8">
          <Link to="/">
            <img src="/logo.svg" alt="EthioHomes" className="h-9 w-auto brightness-0 invert mb-3" />
          </Link>
          <p className="text-white/80 text-sm">Ethiopia's Premier Property Marketplace</p>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 bg-white">
          <div className="w-full max-w-md">

            {/* Heading */}
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold text-stone-900 mb-1">
                {mode === 'login' ? 'Welcome back' : 'Create account'}
              </h1>
              <p className="text-stone-500 text-sm">
                {mode === 'login'
                  ? 'Sign in to manage your listings.'
                  : 'Register as an agent and start posting properties.'}
              </p>
            </div>

            {/* Tab toggle */}
            <div className="relative flex bg-stone-100 rounded-xl p-1 mb-8">
              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-transform duration-300 ${
                  mode === 'register' ? 'translate-x-[calc(100%+2px)]' : 'translate-x-0'
                }`}
              />
              <button
                onClick={() => switchMode('login')}
                className={`relative flex-1 py-2 text-sm font-semibold rounded-lg transition-colors z-10 ${
                  mode === 'login' ? 'text-stone-900' : 'text-stone-500'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => switchMode('register')}
                className={`relative flex-1 py-2 text-sm font-semibold rounded-lg transition-colors z-10 ${
                  mode === 'register' ? 'text-stone-900' : 'text-stone-500'
                }`}
              >
                Register
              </button>
            </div>

            {/* Alerts */}
            {error && (
              <div className="border-l-4 border-red-400 bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm mb-5">
                {error}
              </div>
            )}
            {success && (
              <div className="border-l-4 border-green-400 bg-green-50 text-green-700 rounded-xl px-4 py-3 text-sm mb-5">
                {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <InputField
                    icon={User}
                    label={t('full_name')}
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Abebe Girma"
                  />
                  <InputField
                    icon={Phone}
                    label={t('phone')}
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="912345678"
                  />
                  <InputField
                    icon={Building2}
                    label={t('agency_name')}
                    type="text"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    placeholder="Addis Real Estate (optional)"
                  />
                </>
              )}

              <InputField
                icon={Mail}
                label={t('email')}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent@example.com"
              />

              {/* Password with toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-stone-700">{t('password')}</label>
                  {mode === 'login' && (
                    <button type="button" className="text-xs text-terracotta hover:underline">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-stone-400 pointer-events-none">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:bg-white focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-terracotta hover:bg-orange-800 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors mt-2 text-sm"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    {t('loading')}
                  </span>
                ) : (
                  <>
                    {mode === 'login' ? t('login_submit') : t('register_submit')}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Switch mode */}
            <p className="text-center text-sm text-stone-500 mt-6">
              {mode === 'login' ? t('no_account') : t('have_account')}
              {' '}
              <button
                onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                className="text-terracotta font-semibold hover:underline"
              >
                {mode === 'login' ? 'Register →' : 'Sign In →'}
              </button>
            </p>

            {/* Back to site */}
            <p className="text-center mt-4">
              <Link to="/" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
                ← Back to EthioHomes
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
