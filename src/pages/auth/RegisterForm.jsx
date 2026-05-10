import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, User, Phone, Building2, ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function RegisterForm({ onSuccess, onVerificationNeeded }) {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [agencyName, setAgencyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
      const { data, error: signUpErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone.replace(/\D/g, ''),
            agency_name: agencyName || null,
          },
        },
      })

      if (signUpErr) {
        setError(signUpErr.message)
        return
      }

      if (data?.session) {
        onSuccess()
      } else {
        onVerificationNeeded()
      }
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
        label="Full Name"
        icon={User}
        type="text"
        required
        autoComplete="name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Abebe Girma"
        disabled={loading}
      />

      <Input
        darkMode
        label="Phone Number"
        hint="without country code"
        icon={Phone}
        type="tel"
        required
        autoComplete="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="912 345 678"
        disabled={loading}
      />

      <Input
        darkMode
        label="Agency Name"
        hint="optional"
        icon={Building2}
        type="text"
        value={agencyName}
        onChange={(e) => setAgencyName(e.target.value)}
        placeholder="Addis Real Estate"
        disabled={loading}
      />

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
        label="Confirm Password"
        icon={Lock}
        type={showPw ? 'text' : 'password'}
        required
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Repeat password"
        disabled={loading}
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
        size="lg"
        className="mt-2"
      >
        Create Account <ArrowRight size={16} />
      </Button>
    </form>
  )
}
