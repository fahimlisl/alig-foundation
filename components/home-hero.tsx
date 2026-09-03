import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ToppersCarousel, TOPPERS_BA_LLB, TOPPERS_BA } from '@/components/toppers-carousel'

export function HomeHero() {
  return (
    <section className="bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_50%,#312e81_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">
              REGISTRATIONS OPEN
            </p>

            <h1 className="mt-4 font-heading text-2xl font-extrabold leading-tight text-balance sm:text-3xl lg:text-4xl">
              An affordable online learning platform for AMU BA LLB | AMU BA | AMU BA FL | AMU MBA (CAT) Entrance Examinations.
            </h1>

            <p className="mt-5 max-w-md text-base font-medium leading-relaxed text-white/80">
              Registrations are now open for Live Interactive Online Classes for the AMU Entrance Preparation Session 2027–28.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                render={<Link href="/admissions" />}
                nativeButton={false}
                size="lg"
                className="rounded-full bg-white px-7 font-bold text-blue-900 hover:bg-white/90"
              >
                Register Now
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
            <h2 className="mb-4 text-center font-heading text-xl font-extrabold text-white sm:text-2xl lg:text-3xl">
              Top-100 AMU BALLB RANKERS
              <span className="block text-sm font-normal text-white/60">(GENERAL CATEGORY)</span>
            </h2>
            <ToppersCarousel toppers={TOPPERS_BA_LLB} />
          </div>
        </div>

        <div className="mt-12 lg:hidden">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#1e3a8a] px-4 text-xs font-semibold uppercase tracking-wider text-white/60">
                BA / BAFL Achievers
              </span>
            </div>
          </div>
          <h2 className="mb-4 text-center font-heading text-xl font-extrabold text-white sm:text-2xl">
            Top-20 AMU BA/BAFL RANKERS
            <span className="block text-sm font-normal text-white/60">(GENERAL CATEGORY)</span>
          </h2>
          <ToppersCarousel toppers={TOPPERS_BA} />
        </div>
      </div>
    </section>
  )
}