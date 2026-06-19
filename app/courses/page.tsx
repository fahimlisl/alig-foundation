import { PageHero } from '@/components/page-hero'
import { CoursesGrid } from '@/components/courses-grid'
import { CtaBanner } from '@/components/cta-banner'

export default function CoursesPage() {
  return (
    <>
      <PageHero
        title="Our Courses"
        subtitle="Choose from our specialised AMU entrance preparation programs, designed for online and offline learning."
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <CoursesGrid />
      </section>
      <CtaBanner />
    </>
  )
}
