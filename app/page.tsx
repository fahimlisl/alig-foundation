import { HomeHero } from '@/components/home-hero'
import { HomeStats, HomeFeatures, HomeTestimonials } from '@/components/home-sections'
import { CoursesGrid } from '@/components/courses-grid'
import { SectionHeading } from '@/components/section-heading'
import { CtaBanner } from '@/components/cta-banner'

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeStats />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeading
          eyebrow="Our Programs"
          title="Courses We Offer"
          description="Targeted preparation programs for every major AMU entrance examination, built around your goals."
        />
        <div className="mt-10">
          <CoursesGrid />
        </div>
      </section>

      <section className="bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Why Alig Foundation"
            title="Why Students Choose Us"
            description="Everything you need to prepare smarter and perform better in your entrance exam."
          />
          <div className="mt-10">
            <HomeFeatures />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeading
          eyebrow="Testimonials"
          title="What Our Students Say"
          description="Real stories from students who turned their AMU dreams into reality with us."
        />
        <div className="mt-10">
          <HomeTestimonials />
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
