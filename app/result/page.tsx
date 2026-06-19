import { PageHero } from '@/components/page-hero'
import { ResultLookup } from '@/components/result-lookup'
import { SectionHeading } from '@/components/section-heading'

const RECENT = [
  { name: 'Areeb Khan', exam: 'AMU BA LLB 2024', rank: 'AIR 4' },
  { name: 'Unnati Sharma', exam: 'AMU BA LLB 2024', rank: 'AIR 7' },
  { name: 'Saba Khanam', exam: 'AMU BA 2024', rank: 'AIR 3' },
  { name: 'Faizan Ahmad', exam: 'AMU MBA 2024', rank: 'AIR 12' },
  { name: 'Zoya Iqbal', exam: 'AMU BAFL 2024', rank: 'AIR 9' },
  { name: 'Rohit Mehra', exam: 'AMU MBA 2024', rank: 'AIR 15' },
]

export default function ResultPage() {
  return (
    <>
      <PageHero
        title="Results"
        subtitle="Check your entrance result and celebrate the achievements of our top performers."
      />

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <ResultLookup />
      </section>

      <section className="bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Hall of Fame"
            title="Our Recent Top Rankers"
            description="Proud results from the 2024 AMU entrance examinations."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RECENT.map((r) => (
              <div
                key={r.name}
                className="flex items-center justify-between rounded-2xl border border-border bg-card p-5"
              >
                <div>
                  <p className="font-heading font-bold text-card-foreground">{r.name}</p>
                  <p className="text-sm text-muted-foreground">{r.exam}</p>
                </div>
                <span className="rounded-full bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground">
                  {r.rank}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
