import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import AuthBgShapes from './AuthBgShapes'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Supabase appends #access_token=... to the URL after clicking the reset link.
    // onAuthStateChange fires with RECOVERY event when the token is valid.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      const { error: err } = await supabase.auth.updateUser({ password })
      if (err) {
        setError(err.message)
        return
      }
      setDone(true)
      setTimeout(() => navigate('/dashboard', { replace: true }), 2500)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-[#5a1208] to-stone-900 flex flex-col items-center justify-center p-4 relative">
      <AuthBgShapes />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="EthioHomes" className="h-10 w-auto mx-auto mb-4 brightness-0 invert" />
          <h1 className="font-display text-3xl font-bold text-white">Reset Password</h1>
          <p className="text-white/50 text-sm mt-1.5">Choose a new password for your account</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {done ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={32} className="text-green-400" />
              </div>
              <h3 className="text-white font-semibold text-lg">Password updated!</h3>
              <p className="text-white/60 text-sm">Redirecting you to your dashboard…</p>
            </div>
          ) : !ready ? (
            <div className="text-center py-8">
              <p className="text-white/60 text-sm">Verifying reset link…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2.5 bg-red-500/20 border border-red-400/30 text-red-300 rounded-xl px-4 py-3 text-sm">
                  <span className="mt-0.5 shrink-0">⚠</span> {error}
                </div>
              )}

              <Input
                darkMode
                label="New Password"
                icon={Lock}
                type={showPw ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                disabled={loading}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              />

              <Input
                darkMode
                label="Confirm New Password"
                icon={Lock}
                type={showPw ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                disabled={loading}
              />

              <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">
                Update Password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
