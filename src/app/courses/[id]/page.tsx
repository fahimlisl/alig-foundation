'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, CheckCircle2, Clock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

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

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await fetch(`/api/course/fetch-one/${params.id}`)
        const data = await res.json()

        if (data.success) {
          setCourse(data.data)
        } else {
          setError(data.message || 'Course not found.')
        }
      } catch (err) {
        console.error('failed to fetch course', err)
        setError('Failed to load this course. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) fetchCourse()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-32 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
        <span className="text-sm">Loading course…</span>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-muted-foreground">{error || 'Course not found.'}</p>
        <Link
          href="/courses"
          className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
        >
          ← Back to all courses
        </Link>
      </div>
    )
  }

  const hasDiscount = !!course.basePrice && course.basePrice > course.finalPrice

  return (
    <>
      <section className="bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_50%,#312e81_100%)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <Link
            href="/courses"
            className="text-sm font-semibold text-white/80 hover:text-white"
          >
            ← All Courses
          </Link>
          <h1 className="mt-4 font-heading text-3xl font-extrabold text-balance sm:text-4xl lg:text-5xl">
            {course.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base font-medium text-white/80 leading-relaxed">
            {course.description}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            {course.overview && (
              <>
                <h2 className="font-heading text-2xl font-extrabold text-foreground">
                  Course Overview
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {course.overview}
                </p>
              </>
            )}

            {!!course.highlights?.length && (
              <>
                <h3 className="mt-10 font-heading text-xl font-bold text-foreground">
                  Programme Highlights
                </h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {course.highlights.map((h) => (
                    <li key={h._id} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                      {h.title}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
              <p className="text-sm text-muted-foreground">Course Fee</p>
              <div className="flex items-baseline gap-2">
                <p className="font-heading text-3xl font-extrabold text-foreground">
                  ₹{course.finalPrice}
                </p>
                {hasDiscount && (
                  <p className="text-base text-muted-foreground line-through">
                    ₹{course.basePrice}
                  </p>
                )}
              </div>

              <ul className="mt-6 space-y-4 text-sm">
                <li className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="size-5 text-primary" />
                  <span className="font-medium text-foreground">{course.duration}</span>
                </li>
                {!!course.highlights?.length && (
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <BookOpen className="size-5 text-primary" />
                    <span className="font-medium text-foreground">
                      {course.highlights.length} key highlight{course.highlights.length === 1 ? '' : 's'}
                    </span>
                  </li>
                )}
              </ul>

              <Button
                render={<Link href="/admissions" />}
                nativeButton={false}
                size="lg"
                className="mt-6 w-full rounded-full font-bold"
              >
                Enroll Now
              </Button>
              <Button
                render={<Link href="/contact" />}
                nativeButton={false}
                variant="outline"
                size="lg"
                className="mt-3 w-full rounded-full font-semibold"
              >
                Ask a Question
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}