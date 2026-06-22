'use client'

import { useEffect, useState } from 'react'
import { Users, ArrowLeft, Loader2, Phone, MapPin, School, Hash } from 'lucide-react'
import { adminFetch } from '@/src/lib/adminFetch'

type Applicant = {
  _id: string
  applicationId: string
  name: string
  email: string
  gurdianName: string
  phoneNumber: string
  gurdianPhoneNumber: string
  gender: string
  course: { _id: string; title: string } | string
  schoolBoardName: string
  permanentAddress: string
  state: string
  district: string
  pin: string
  razorpayOrderId?: string
  createdAt: string
}

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<Applicant | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchApplicants()
  }, [])

  async function fetchApplicants() {
    setLoading(true)
    setError('')
    try {
      // adminFetch handles the 401 -> refresh -> retry -> (or redirect to login) flow internally,
      // so no manual res.status === 401 check is needed here anymore
      const res = await adminFetch('/api/application/fetch-all')

      const data = await res.json()
      if (data.success) {
        setApplicants(data.data || [])
      } else {
        setError(data.message || 'Failed to load applicants.')
      }
    } catch (err) {
      console.error('failed to fetch applicants', err)
      setError('Failed to load applicants. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <CenteredLoader label="Loading applicants…" />
  if (error) return <ErrorPanel message={error} onRetry={fetchApplicants} />
  if (selected) return <ApplicantDetail applicant={selected} onBack={() => setSelected(null)} />

  const filtered = applicants.filter((a) => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      a.name.toLowerCase().includes(q) ||
      a.applicationId.toLowerCase().includes(q) ||
      a.phoneNumber.includes(q)
    )
  })

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {applicants.length} total applicant{applicants.length === 1 ? '' : 's'}
        </p>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, ID, or phone…"
          className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/40 sm:w-72"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState label="No applicants found." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="hidden sm:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-secondary/50 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Application ID</th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Course</th>
                  <th className="px-5 py-3">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((a) => (
                  <tr
                    key={a._id}
                    onClick={() => setSelected(a)}
                    className="cursor-pointer transition-colors hover:bg-secondary/50"
                  >
                    <td className="px-5 py-3.5 font-medium text-card-foreground">{a.applicationId}</td>
                    <td className="px-5 py-3.5 text-card-foreground">{a.name}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{a.phoneNumber}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{a?.email}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {typeof a.course === 'object' ? a.course?.title : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {new Date(a.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-border sm:hidden">
            {filtered.map((a) => (
              <button
                key={a._id}
                onClick={() => setSelected(a)}
                className="flex w-full items-center justify-between px-4 py-4 text-left transition-colors active:bg-secondary/50"
              >
                <div>
                  <p className="font-medium text-card-foreground">{a.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {a.applicationId} · {a.phoneNumber}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {typeof a.course === 'object' ? a.course?.title : ''}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ApplicantDetail({ applicant, onBack }: { applicant: Applicant; onBack: () => void }) {
  const courseTitle = typeof applicant.course === 'object' ? applicant.course?.title : null

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to applicants
      </button>

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="font-heading text-xl font-bold text-card-foreground">{applicant.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{applicant.applicationId}</p>
          </div>
          {courseTitle && (
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
              {courseTitle}
            </span>
          )}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <DetailRow icon={Phone} label="Student Phone" value={applicant.phoneNumber} />
          <DetailRow icon={Phone} label="Student Email" value={applicant?.email} />
          <DetailRow icon={Phone} label="Guardian Phone" value={applicant.gurdianPhoneNumber} />
          <DetailRow icon={Users} label="Guardian Name" value={applicant.gurdianName} />
          <DetailRow icon={Hash} label="Gender" value={applicant.gender} />
          <DetailRow icon={School} label="School Board" value={applicant.schoolBoardName} />
          <DetailRow
            icon={Hash}
            label="Registered On"
            value={new Date(applicant.createdAt).toLocaleString('en-IN')}
          />
        </div>

        <div className="mt-6 border-t border-border pt-6">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <MapPin className="size-3.5" />
            Address
          </p>
          <p className="text-sm text-card-foreground">
            {applicant.permanentAddress}, {applicant.district}, {applicant.state} — {applicant.pin}
          </p>
        </div>

        {applicant.razorpayOrderId && (
          <div className="mt-6 border-t border-border pt-6">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Payment Reference
            </p>
            <p className="font-mono text-sm text-muted-foreground">{applicant.razorpayOrderId}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof Phone; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-card-foreground">{value || '—'}</p>
      </div>
    </div>
  )
}

function CenteredLoader({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
      <Loader2 className="size-6 animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

function ErrorPanel({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 py-16 text-center">
      <p className="text-sm text-destructive">{message}</p>
      <button
        onClick={onRetry}
        className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-secondary"
      >
        Try again
      </button>
    </div>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center rounded-2xl border border-dashed border-border py-16 text-sm text-muted-foreground">
      {label}
    </div>
  )
}