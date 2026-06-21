'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Clock, Loader2, GraduationCap } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { CtaBanner } from '@/components/cta-banner'

type Highlight = { _id: string; title: string }

type Course = {
  _id: string
  title: string
  description: string
  basePrice?: number
  finalPrice: number
  duration: string
  highlights?: Highlight[]
}

export default function CoursesPage() {
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

  return (
    <>
      <PageHero
        title="Our Courses"
        subtitle="Choose from our specialised AMU entrance preparation programs, designed for online and offline learning."
      />

      <section className="mx-auto max-w-screen-2xl px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        {loading && (
          <div className="flex items-center justify-center gap-3 py-24 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            <span className="text-sm">Loading courses…</span>
          </div>
        )}

        {!loading && error && (
          <div className="mx-auto max-w-md rounded-2xl border border-destructive/30 bg-destructive/5 py-12 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
            No courses available right now. Check back soon.
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="grid gap-8 lg:grid-cols-2">
            {courses.map((course) => {
              const hasDiscount = !!course.basePrice && course.basePrice > course.finalPrice

              return (
                <Link
                  key={course._id}
                  href={`/courses/${course._id}`}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary hover:shadow-xl"
                >
                  {/* top banner strip */}
                  <div className="flex items-center justify-between gap-4 bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_50%,#312e81_100%)] px-7 py-5 text-white sm:px-8">
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-white/70">
                      <GraduationCap className="size-4" />
                      AMU Entrance Prep
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-white/80">
                      <Clock className="size-3.5" />
                      {course.duration}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col px-7 py-7 sm:px-8 sm:py-8">
                    <h2 className="font-heading text-2xl font-extrabold leading-tight text-card-foreground sm:text-[1.7rem]">
                      {course.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {course.description}
                    </p>

                    {!!course.highlights?.length && (
                      <ul className="mt-6 grid flex-1 gap-2.5 sm:grid-cols-2">
                        {course.highlights.slice(0, 6).map((h) => (
                          <li
                            key={h._id}
                            className="flex items-start gap-2 text-sm text-foreground"
                          >
                            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                            <span className="leading-snug">{h.title}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-7 flex items-center justify-between gap-4 border-t border-border pt-6">
                      <div className="flex items-baseline gap-2">
                        <span className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
                          ₹{course.finalPrice}
                        </span>
                        {hasDiscount && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{course.basePrice}
                          </span>
                        )}
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-opacity group-hover:opacity-90">
                        View Details
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      <CtaBanner />
    </>
  )
}