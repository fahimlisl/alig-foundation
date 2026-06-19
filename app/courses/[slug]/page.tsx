import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BookOpen, CheckCircle2, Clock, IndianRupee, Laptop } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { COURSES } from '@/lib/site'

export function generateStaticParams() {
  return COURSES.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const course = COURSES.find((c) => c.slug === slug)
  if (!course) return {}
  return {
    title: `${course.title} | Alig Foundation`,
    description: course.description,
  }
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const course = COURSES.find((c) => c.slug === slug)
  if (!course) notFound()

  return (
    <>
      {/* <section className="bg-primary text-primary-foreground">*/}
      <section className="bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_50%,#312e81_100%)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <Link
            href="/courses"
            className="text-sm font-semibold text-primary-foreground/80 hover:text-black text-white"
          >
            ← All Courses
          </Link>
          <span className="mt-4 inline-flex rounded-full bg-foreground/10 px-3 py-1 text-xs font-bold uppercase tracking-wide">
            {course.short}
          </span>
          <h1 className="mt-3 font-heading text-3xl font-extrabold text-balance sm:text-4xl lg:text-5xl">
            {course.title}
          </h1>
          <p className="mt-3 text-base font-medium text-primary-foreground/80">
            {course.full}
          </p>
          <p className="mt-2 max-w-2xl text-lg font-semibold">{course.tagline}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <h2 className="font-heading text-2xl font-extrabold text-foreground">
              Course Overview
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {course.description}
            </p>

            <h3 className="mt-10 font-heading text-xl font-bold text-foreground">
              Programme Highlights
            </h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {course.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                  {h}
                </li>
              ))}
            </ul>

            <h3 className="mt-10 font-heading text-xl font-bold text-foreground">
              What You&apos;ll Study
            </h3>
            <ul className="mt-4 space-y-3">
              {course.syllabus.map((s, i) => (
                <li
                  key={s}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent font-heading text-sm font-bold text-accent-foreground">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-card-foreground">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
              <p className="text-sm text-muted-foreground">Course Fee</p>
              <p className="font-heading text-3xl font-extrabold text-foreground">
                {course.fee}
              </p>
              <ul className="mt-6 space-y-4 text-sm">
                <li className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="size-5 text-primary" />
                  <span className="font-medium text-foreground">{course.duration}</span>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <Laptop className="size-5 text-primary" />
                  <span className="font-medium text-foreground">{course.mode}</span>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <BookOpen className="size-5 text-primary" />
                  <span className="font-medium text-foreground">
                    {course.syllabus.length} core subjects
                  </span>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <IndianRupee className="size-5 text-primary" />
                  <span className="font-medium text-foreground">Easy EMI available</span>
                </li>
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
