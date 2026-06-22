'use client'

import { useState } from 'react'
import { KeyRound, Eye, EyeOff } from 'lucide-react'
import { adminFetch } from '@/src/lib/adminFetch'

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.')
      return
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.')
      return
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from current password.')
      return
    }

    setSaving(true)
    try {
      const res = await adminFetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()

      if (data.success) {
        setSuccess('Password changed successfully.')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setError(data.message || 'Failed to change password.')
      }
    } catch (err) {
      console.error('failed to change password', err)
      setError('Failed to change password. Check your connection.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="flex items-center gap-2">
        <KeyRound className="size-5 text-muted-foreground" />
        <h2 className="font-heading text-xl font-bold text-foreground">Change Password</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Update your admin account password. You&#x2019;ll stay logged in on this device.
      </p>

      {error && (
        <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-600">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-2xl border border-border bg-card p-6">
        <PasswordField
          id="currentPassword"
          label="Current Password"
          value={currentPassword}
          onChange={setCurrentPassword}
          show={showCurrent}
          onToggleShow={() => setShowCurrent((v) => !v)}
          autoComplete="current-password"
        />

        <PasswordField
          id="newPassword"
          label="New Password"
          value={newPassword}
          onChange={setNewPassword}
          show={showNew}
          onToggleShow={() => setShowNew((v) => !v)}
          autoComplete="new-password"
        />

        <PasswordField
          id="confirmPassword"
          label="Confirm New Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          show={showNew}
          onToggleShow={() => setShowNew((v) => !v)}
          autoComplete="new-password"
        />

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-heading font-bold text-primary-foreground transition-opacity disabled:opacity-60"
        >
          {saving ? 'Updating…' : 'Update Password'}
        </button>
      </form>
    </div>
  )
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  show,
  onToggleShow,
  autoComplete,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  show: boolean
  onToggleShow: () => void
  autoComplete: string
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-card-foreground">
        {label}
      </label>
      <div className="relative mt-2">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pr-10 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/40"
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
          tabIndex={-1}
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  )
}