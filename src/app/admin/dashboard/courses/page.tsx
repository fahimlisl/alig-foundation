'use client'

import { useEffect, useState } from 'react'
import { Loader2, Plus, X, Pencil, Trash2 } from 'lucide-react'
import { adminFetch } from '@/src/lib/adminFetch'

type Highlight = { _id: string; title: string }

type Course = {
  _id: string
  title: string
  description: string
  overview?: string
  basePrice?: number
  finalPrice: number
  duration: string
  highlights?: Highlight[]
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<Course | 'new' | null>(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  async function fetchCourses() {
    setLoading(true)
    setError('')
    try {
      const res = await adminFetch('/api/course/fetch-all')
      const data = await res.json()
      if (data.success) {
        setCourses(data.data || [])
      } else {
        setError(data.message || 'Failed to load courses.')
      }
    } catch (err) {
      console.error('failed to fetch courses', err)
      setError('Failed to load courses. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(course: Course) {
    const confirmed = window.confirm(`Delete "${course.title}"? This cannot be undone.`)
    if (!confirmed) return

    try {
      const res = await adminFetch(`/api/course/delete/${course._id}`, { method: 'DELETE' })
      const data = await res.json()

      if (!res.ok || !data.success) {
        alert(data.message || 'Failed to delete course.')
        return
      }

      fetchCourses()
    } catch (err) {
      console.error('failed to delete course', err)
      alert('Something went wrong while deleting.')
    }
  }

  if (loading) return <CenteredLoader label="Loading courses…" />
  if (error) return <ErrorPanel message={error} onRetry={fetchCourses} />

  if (editing) {
    return (
      <CourseForm
        course={editing === 'new' ? null : editing}
        onCancel={() => setEditing(null)}
        onSaved={() => {
          setEditing(null)
          fetchCourses()
        }}
      />
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {courses.length} course{courses.length === 1 ? '' : 's'}
        </p>
        <button
          onClick={() => setEditing('new')}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
          New Course
        </button>
      </div>

      {courses.length === 0 ? (
        <EmptyState label="No courses yet. Create your first one." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <div key={c._id} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-heading text-base font-bold text-card-foreground">{c.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{c.description}</p>

              {!!c.highlights?.length && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {c.highlights.map((h) => (
                    <span
                      key={h._id}
                      className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {h.title}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="font-bold text-card-foreground">₹{c.finalPrice}</span>
                <span className="text-muted-foreground">{c.duration}</span>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setEditing(c)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-secondary"
                >
                  <Pencil className="size-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c)}
                  className="flex items-center justify-center rounded-lg border border-destructive/30 px-3 py-2 text-destructive transition-colors hover:bg-destructive/10"
                  aria-label={`Delete ${c.title}`}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CourseForm({
  course,
  onCancel,
  onSaved,
}: {
  course: Course | null
  onCancel: () => void
  onSaved: () => void
}) {
  const isNew = course === null

  const [title, setTitle] = useState(course?.title || '')
  const [description, setDescription] = useState(course?.description || '')
  const [overview, setOverview] = useState(course?.overview || '')
  const [basePrice, setBasePrice] = useState(course?.basePrice?.toString() || '')
  const [finalPrice, setFinalPrice] = useState(course?.finalPrice?.toString() || '')
  const [duration, setDuration] = useState(course?.duration || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // highlights are managed live against the backend once the course exists —
  // for a brand-new course, highlights can only be added after the course itself is created
  const [highlights, setHighlights] = useState<Highlight[]>(course?.highlights || [])
  const [newHighlight, setNewHighlight] = useState('')
  const [highlightBusy, setHighlightBusy] = useState(false)

  async function handleSave() {
    setError('')

    if (!title.trim() || !description.trim() || !finalPrice.trim() || !duration.trim()) {
      setError('Title, description, final price, and duration are required.')
      return
    }

    setSaving(true)

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        overview: overview.trim(),
        basePrice: basePrice ? Number(basePrice) : undefined,
        finalPrice: Number(finalPrice),
        duration: duration.trim(),
      }

      const res = await adminFetch(
        isNew ? '/api/course/create' : `/api/course/update/${course._id}`,
        {
          method: isNew ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.message || 'Failed to save course.')
        setSaving(false)
        return
      }

      onSaved()
    } catch (err) {
      console.error('failed to save course', err)
      setError('Something went wrong. Please try again.')
      setSaving(false)
    }
  }

  async function handleAddHighlight() {
    if (!newHighlight.trim() || !course) return
    setHighlightBusy(true)

    try {
      const res = await adminFetch(`/api/course/highlights/add/${course._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newHighlight.trim() }),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        alert(data.message || 'Failed to add highlight.')
        return
      }

      setHighlights(data.data || [])
      setNewHighlight('')
    } catch (err) {
      console.error('failed to add highlight', err)
      alert('Something went wrong while adding the highlight.')
    } finally {
      setHighlightBusy(false)
    }
  }

  async function handleRemoveHighlight(highlightId: string) {
    if (!course) return
    setHighlightBusy(true)

    try {
      const res = await adminFetch(`/api/course/highlights/remove/${course._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ highlightId }),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        alert(data.message || 'Failed to remove highlight.')
        return
      }

      setHighlights(data.data || [])
    } catch (err) {
      console.error('failed to remove highlight', err)
      alert('Something went wrong while removing the highlight.')
    } finally {
      setHighlightBusy(false)
    }
  }

  async function handleEditHighlight(highlightId: string, currentTitle: string) {
    if (!course) return
    const updatedTitle = window.prompt('Edit highlight', currentTitle)
    if (updatedTitle === null || !updatedTitle.trim() || updatedTitle.trim() === currentTitle) return

    setHighlightBusy(true)

    try {
      const res = await adminFetch(`/api/course/highlights/update/${course._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ highlightId, title: updatedTitle.trim() }),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        alert(data.message || 'Failed to update highlight.')
        return
      }

      setHighlights(data.data || [])
    } catch (err) {
      console.error('failed to update highlight', err)
      alert('Something went wrong while updating the highlight.')
    } finally {
      setHighlightBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="font-heading text-lg font-bold text-card-foreground">
        {isNew ? 'New Course' : `Edit: ${course?.title}`}
      </h2>

      <div className="mt-6 space-y-4">
        <FormField label="Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
          />
        </FormField>

        <FormField label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[80px] w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
          />
        </FormField>

        <FormField label="Overview (shown on course detail page)">
          <textarea
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            className="min-h-[100px] w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Base Price (₹)">
            <input
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
            />
          </FormField>

          <FormField label="Final Price (₹)">
            <input
              type="number"
              value={finalPrice}
              onChange={(e) => setFinalPrice(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
            />
          </FormField>

          <FormField label="Duration">
            <input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 1 year"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
            />
          </FormField>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-card-foreground transition-colors hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : isNew ? 'Create Course' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* highlights — only available once the course exists, since they're added
          via dedicated routes that need a real course id */}
      {!isNew && course && (
        <div className="mt-8 border-t border-border pt-6">
          <h3 className="font-heading text-sm font-bold text-card-foreground">Highlights</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Bullet points shown on the course detail page.
          </p>

          <div className="mt-4 space-y-2">
            {highlights.length === 0 && (
              <p className="text-sm text-muted-foreground">No highlights yet.</p>
            )}
            {highlights.map((h) => (
              <div
                key={h._id}
                className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2"
              >
                <span className="text-sm text-foreground">{h.title}</span>
                <div className="flex shrink-0 gap-1.5">
                  <button
                    onClick={() => handleEditHighlight(h._id, h.title)}
                    disabled={highlightBusy}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-50"
                    aria-label="Edit highlight"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    onClick={() => handleRemoveHighlight(h._id)}
                    disabled={highlightBusy}
                    className="rounded-md p-1.5 text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                    aria-label="Remove highlight"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <input
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddHighlight()
                }
              }}
              placeholder="Add a highlight…"
              className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              onClick={handleAddHighlight}
              disabled={highlightBusy || !newHighlight.trim()}
              className="flex items-center justify-center rounded-xl bg-primary px-4 text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              aria-label="Add highlight"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      {children}
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