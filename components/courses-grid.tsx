import Link from 'next/link'
import { ArrowRight, Clock, Laptop } from 'lucide-react'
import { COURSES } from '@/lib/site'

export function CoursesGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {COURSES.map((course) => (
        <Link
          key={course.slug}
          href={`/courses/${course.slug}`}
          className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg"
        >
          <span className="inline-flex w-fit rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground">
            {course.short}
          </span>
          <h3 className="mt-4 font-heading text-lg font-bold text-card-foreground">
            {course.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{course.full}</p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              {course.duration}
            </span>
            <span className="flex items-center gap-2">
              <Laptop className="size-4 text-primary" />
              {course.mode}
            </span>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <span className="font-heading text-lg font-extrabold text-foreground">
              {course.fee}
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Details
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
