import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import { useLang } from '../App'

export default function Login() {
  const { t } = useLang()
  const navigate = useNavigate()

  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [agencyName, setAgencyName] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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

        setSuccess('Account created! Please check your email to confirm, then log in.')
        setMode('login')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
            {/* Toggle */}
            <div className="flex rounded-xl overflow-hidden border border-stone-200 mb-8">
              <button
                onClick={() => { setMode('login'); setError('') }}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                  mode === 'login' ? 'bg-terracotta text-white' : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                {t('login')}
              </button>
              <button
                onClick={() => { setMode('register'); setError('') }}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                  mode === 'register' ? 'bg-terracotta text-white' : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                {t('register')}
              </button>
            </div>

            <h1 className="font-display text-2xl font-bold text-stone-800 mb-6">
              {mode === 'login' ? t('login') : t('register')}
            </h1>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">{t('full_name')}</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                      placeholder="Abebe Girma"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">{t('phone')}</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                      placeholder="912345678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">{t('agency_name')}</label>
                    <input
                      type="text"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                      placeholder="Addis Real Estate"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{t('email')}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                  placeholder="agent@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{t('password')}</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-terracotta hover:bg-orange-800 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors mt-2"
              >
                {loading
                  ? t('loading')
                  : mode === 'login'
                  ? t('login_submit')
                  : t('register_submit')}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
