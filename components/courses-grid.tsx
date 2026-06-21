'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Loader2 } from 'lucide-react'

type Highlight = { _id: string; title: string }

type Course = {
  _id: string
  title: string
  description: string
  finalPrice: number
  basePrice?: number
  duration: string
  highlights?: Highlight[]
}

export function CoursesGrid() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('/api/course/fetch-all')
        const data = await res.json()

        if (data.success) {
          setCourses(data.data || [])
        } else {
          setError(data.message || 'Failed to load courses.')
        }
      } catch (err) {
        console.error('failed to load courses', err)
        setError('Failed to load courses. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-16 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
        <span className="text-sm">Loading courses…</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 py-12 text-center text-sm text-destructive">
        {error}
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
        No courses available right now. Check back soon.
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {courses.map((course) => {
        const hasDiscount = !!course.basePrice && course.basePrice > course.finalPrice

        return (
          <Link
            key={course._id}
            href={`/courses/${course._id}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg"
          >
            <div className="flex items-baseline justify-between gap-3 border-b border-border bg-secondary/40 px-6 py-4">
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-2xl font-extrabold text-foreground">
                  ₹{course.finalPrice}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{course.basePrice}
                  </span>
                )}
              </div>
              <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                {course.duration}
              </span>
            </div>

            <div className="flex flex-1 flex-col px-6 py-5">
              <h3 className="font-heading text-lg font-bold leading-snug text-card-foreground">
                {course.title}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground line-clamp-1">
                {course.description}
              </p>

              {!!course.highlights?.length && (
                <ul className="mt-4 flex-1 space-y-2">
                  {course.highlights.slice(0, 4).map((h) => (
                    <li key={h._id} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="leading-snug">{h.title}</span>
                    </li>
                  ))}
                </ul>
              )}

              <span className="mt-5 flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-opacity group-hover:opacity-90">
                View Details
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}