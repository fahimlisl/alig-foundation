import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ToppersCarousel } from '@/components/toppers-carousel'

export function HomeHero() {
  return (
    <section className="bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_50%,#312e81_100%)] text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-20">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">
            Admission Open
          </p>

          <h1 className="mt-4 font-heading text-3xl font-extrabold leading-tight text-balance sm:text-4xl lg:text-5xl">
            Best Coaching for AMU BA LLB | AMU BA | AMU BAFL | AMU MBA Entrance
          </h1>

          <p className="mt-5 max-w-md text-base font-medium leading-relaxed text-white/80">
            Admissions are open for Online and Offline Classroom Coaching. Learn from
            expert mentors and join Aligarh&apos;s most trusted entrance preparation
            family.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              render={<Link href="/admissions" />}
              nativeButton={false}
              size="lg"
              className="rounded-full bg-white px-7 font-bold text-blue-900 hover:bg-white/90"
            >
              Enroll Today
            </Button>

            <Button
              render={<Link href="/courses" />}
              nativeButton={false}
              size="lg"
              variant="outline"
              className="rounded-full border-white/20 bg-transparent px-7 font-bold text-white hover:bg-white/10 hover:text-white"
            >
              Explore Courses
            </Button>
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-center font-heading text-2xl font-extrabold text-white sm:text-3xl">
            Top Ranked Students are from here
          </h2>

          <ToppersCarousel />
        </div>
      </div>
    </section>
  )
}