'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, AlertCircle, ShieldCheck } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState('') 
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!identifier.trim() || !password) {
      setError('Please enter your email/phone and password.')
      return
    }

    setSubmitting(true)

    try {
      const isEmail = identifier.includes('@')

      const res = await fetch('/api/admin/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: isEmail ? identifier.trim() : undefined,
          phoneNumber: !isEmail ? identifier.trim() : undefined,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.message || 'Login failed. Please check your credentials.')
        setSubmitting(false)
        return
      }

      router.push('/admin/dashboard')
      router.refresh()
    } catch (err) {
      console.error('admin login failed', err)
      setError('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <h1 className="font-heading text-lg font-bold text-card-foreground">Admin Login</h1>
            <p className="text-xs text-muted-foreground">Alig Foundation Dashboard</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Email or Phone Number
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/40"
              placeholder="you@example.com"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/40"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-heading text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Signing in…
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}