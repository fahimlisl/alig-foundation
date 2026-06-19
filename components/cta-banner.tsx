import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="rounded-3xl bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_50%,#312e81_100%)] text-white px-6 py-12 text-center text-primary-foreground sm:px-12 lg:py-16">
          {/* <div className="bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_50%,#312e81_100%)] text-white"> */}
        <h2 className="mx-auto max-w-2xl font-heading text-2xl font-extrabold text-balance sm:text-3xl lg:text-4xl">
          Ready to begin your AMU journey?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base font-medium text-primary-foreground/80 text-white">
          Take the first step today. Register now for online or offline classes and learn
          from mentors who have produced top rankers year after year.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            render={<Link href="/admissions" />}
            nativeButton={false}
            size="lg"
            className="rounded-full bg-background px-7 font-bold text-foreground hover:bg-background/90"
          >
            Register Now
          </Button>
          <Button
            render={<Link href="/contact" />}
            nativeButton={false}
            size="lg"
            variant="outline"
            className="rounded-full border-black bg-transparent px-7 font-bold text-primary-foreground hover:bg-foreground/10 hover:text-primary-foreground text-white"
          >
            Talk to a Counsellor
          </Button>
        </div>
      </div>
    </section>
  )
}
