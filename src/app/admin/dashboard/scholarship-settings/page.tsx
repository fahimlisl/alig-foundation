'use client'

import { useEffect, useState } from 'react'
import { Loader2, Save, AlertCircle, CheckCircle2 } from 'lucide-react'
import { adminFetch } from '@/src/lib/adminFetch'

type Permission = {
  scholarshipOpen: boolean
  scholarshipFee: number
  scholarshipLastDate: string | null
}

export default function ScholarshipSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [permission, setPermission] = useState<Permission>({
    scholarshipOpen: true,
    scholarshipFee: 0,
    scholarshipLastDate: null,
  })
  const [status, setStatus] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  useEffect(() => {
    fetchPermission()
  }, [])

  async function fetchPermission() {
    setLoading(true)
    try {
      const res = await adminFetch('/api/scholarship/permission/fetch')
      const data = await res.json()
      if (data.success) {
        setPermission({
          scholarshipOpen: data.data?.scholarshipOpen ?? true,
          scholarshipFee: data.data?.scholarshipFee ?? 0,
          scholarshipLastDate: data.data?.scholarshipLastDate ?? null,
        })
      } else {
        setStatus({ type: 'error', message: data.message || 'Failed to load' })
      }
    } catch (err) {
      console.error('failed to fetch scholarship permission', err)
      setStatus({ type: 'error', message: 'Failed to load settings.' })
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setStatus(null)
    try {
      const res = await adminFetch('/api/scholarship/permission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scholarshipOpen: permission.scholarshipOpen,
          scholarshipFee: Number(permission.scholarshipFee) || 0,
          scholarshipLastDate: permission.scholarshipLastDate || null,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus({ type: 'success', message: 'Scholarship settings updated.' })
      } else {
        setStatus({ type: 'error', message: data.message || 'Failed to save' })
      }
    } catch (err) {
      console.error('failed to save scholarship permission', err)
      setStatus({ type: 'error', message: 'Failed to save settings.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
        <p className="text-sm">Loading settings…</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-card-foreground">
          Scholarship Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Control scholarship registrations, fee, and last date.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="space-y-6">
          {/* Toggle */}
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-secondary/40 p-4">
            <div>
              <p className="text-sm font-medium text-card-foreground">
                Scholarship Registrations
              </p>
              <p className="text-xs text-muted-foreground">
                {permission.scholarshipOpen
                  ? 'Open — users can register'
                  : 'Closed — form is hidden'}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setPermission((p) => ({ ...p, scholarshipOpen: !p.scholarshipOpen }))
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                permission.scholarshipOpen ? 'bg-emerald-600' : 'bg-muted'
              }`}
              aria-pressed={permission.scholarshipOpen}
            >
              <span
                className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow transition-transform ${
                  permission.scholarshipOpen ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Fee */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Scholarship Fee (₹)
            </label>
            <input
              type="number"
              min={0}
              value={permission.scholarshipFee}
              onChange={(e) =>
                setPermission((p) => ({
                  ...p,
                  scholarshipFee: Number(e.target.value) || 0,
                }))
              }
              placeholder="0"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/40"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Set to 0 for free registration. Payment is skipped when fee is 0.
            </p>
          </div>

          {/* Last Date */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Last Date to Apply
            </label>
            <input
              type="date"
              value={
                permission.scholarshipLastDate
                  ? new Date(permission.scholarshipLastDate)
                      .toISOString()
                      .slice(0, 10)
                  : ''
              }
              onChange={(e) =>
                setPermission((p) => ({
                  ...p,
                  scholarshipLastDate: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : null,
                }))
              }
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/40"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Leave empty to hide the deadline on the form.
            </p>
          </div>

          {status && (
            <div
              className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
                status.type === 'success'
                  ? 'border-emerald-600/30 bg-emerald-600/10 text-emerald-700'
                  : 'border-destructive/30 bg-destructive/10 text-destructive'
              }`}
            >
              {status.type === 'success' ? (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              ) : (
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
              )}
              <span>{status.message}</span>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="size-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}