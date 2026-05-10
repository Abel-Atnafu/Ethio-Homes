import { useState } from 'react'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (err) {
        setError(err.message)
        return
      }
      setSent(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={32} className="text-green-400" />
        </div>
        <h3 className="text-white font-semibold text-lg">Check your inbox</h3>
        <p className="text-white/60 text-sm leading-relaxed">
          We sent a password reset link to <span className="text-white font-medium">{email}</span>.
          It expires in 1 hour.
        </p>
        <button
          onClick={onBack}
          className="text-gold font-semibold hover:text-gold/80 text-sm transition-colors"
        >
          ← Back to sign in
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-2">
        <p className="text-white/60 text-sm leading-relaxed">
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 bg-red-500/20 border border-red-400/30 text-red-300 rounded-xl px-4 py-3 text-sm">
          <span className="mt-0.5 shrink-0">⚠</span> {error}
        </div>
      )}

      <Input
        darkMode
        label="Email Address"
        icon={Mail}
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="agent@example.com"
        disabled={loading}
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
        size="lg"
      >
        Send Reset Link
      </Button>

      <button
        type="button"
        onClick={onBack}
        className="w-full flex items-center justify-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors py-1"
      >
        <ArrowLeft size={14} /> Back to sign in
      </button>
    </form>
  )
}
