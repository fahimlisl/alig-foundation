'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { adminFetch } from '@/src/lib/adminFetch'

type Permission = {
  admissionOpen: boolean
  admissionFee?: number
}

export default function AdmissionSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [admissionOpen, setAdmissionOpen] = useState(true)
  const [admissionFee, setAdmissionFee] = useState(100)

  useEffect(() => {
    fetchPermission()
  }, [])

  async function fetchPermission() {
    setLoading(true)
    setError('')
    try {
      const res = await adminFetch('/api/application/permission/fetch')
      const data = await res.json()

      if (data.success && data.data) {
        const permission: Permission = data.data
        setAdmissionOpen(permission.admissionOpen)
        setAdmissionFee(permission.admissionFee ?? 100)
      } else {
        setError(data.message || 'Failed to load admission settings.')
      }
    } catch (err) {
      console.error('failed to fetch admission permission', err)
      setError('Failed to load admission settings. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await adminFetch('/api/application/permission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admissionOpen, admissionFee }),
      })
      const data = await res.json()

      if (data.success) {
        if (data.data) {
          setAdmissionOpen(data.data.admissionOpen)
          setAdmissionFee(data.data.admissionFee ?? 100)
        }
      } else {
        setError(data.message || 'Failed to update admission settings.')
      }
    } catch (err) {
      console.error('failed to update admission permission', err)
      setError('Failed to update admission settings. Check your connection.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
        <p className="text-sm">Loading admission settings…</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl">
      <h2 className="font-heading text-xl font-bold text-foreground">Admission Settings</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Control whether new registrations are accepted on the public admissions page.
      </p>

      {error && (
        <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-6 rounded-2xl border border-border bg-card p-6">
        {/* Toggle */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-card-foreground">Admissions Open</p>
            <p className="text-sm text-muted-foreground">
              {admissionOpen
                ? 'Public registration form is visible and accepting submissions.'
                : 'Public page shows a closed message; registration form is hidden.'}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={admissionOpen}
            onClick={() => setAdmissionOpen((v) => !v)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
              admissionOpen ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <span
              className={`inline-block size-5 transform rounded-full bg-white transition-transform ${
                admissionOpen ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div>
          <label htmlFor="admissionFee" className="block text-sm font-medium text-card-foreground">
            Admission Fee (₹)
          </label>
          <input
            id="admissionFee"
            type="number"
            min={0}
            value={admissionFee}
            onChange={(e) => setAdmissionFee(Number(e.target.value))}
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-heading font-bold text-primary-foreground transition-opacity disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}