import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function LoginForm({ onSuccess, onForgotPassword }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) {
        setError(
          err.message.includes('Invalid') || err.message.includes('invalid')
            ? 'Incorrect email or password. Please try again.'
            : err.message
        )
        return
      }
      onSuccess()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <Input
        darkMode
        label="Password"
        icon={Lock}
        type={showPw ? 'text' : 'password'}
        required
        minLength={6}
        autoComplete="current-password"
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

      <div className="flex justify-end -mt-1">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-xs text-gold/80 hover:text-gold transition-colors font-medium"
        >
          Forgot password?
        </button>
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
        size="lg"
        className="mt-2"
      >
        Sign In <ArrowRight size={16} />
      </Button>
    </form>
  )
}
