import { HomeHero } from '@/components/home-hero'
import { 
  HomeFeatures, 
  HomeTestimonials,
  FoundersSection
} from '@/components/home-sections'
import { CoursesGrid } from '@/components/courses-grid'
import { SectionHeading } from '@/components/section-heading'
import { CtaBanner } from '@/components/cta-banner'

export default function HomePage() {
  return (
    <>
      <HomeHero />
      
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeading
          eyebrow="Our Programs"
          title=""
          description="Our programs are designed to make online learning simple, structured, and effective for students preparing for competitive university entrance examinations. With expert guidance, comprehensive study material, regular practice, and exam-focused strategies."
        />
        <div className="mt-10">
          <CoursesGrid />
        </div>
      </section>

      <section className="bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Why Students Choose Alig Foundation?"
            title=""
            description=""
          />
          <div className="mt-10">
            <HomeFeatures />
          </div>
        </div>
      </section>
      <FoundersSection />

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