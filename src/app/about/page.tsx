import { CheckCircle2, Eye, Target } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { CtaBanner } from '@/components/cta-banner'
import { SITE } from '@/lib/site'

const VALUES = [
  'Student-first approach in everything we do',
  'Affordable, high-quality coaching for all',
  'Disciplined and structured learning environment',
  'Mentorship that goes beyond the classroom',
]

const TEAM = [
  {
    name: 'Mohammad Shahrukh',
    role: 'B.A. (Hons) Economics & LLB (DU), B.A. (Hons) Turkish Language (JMI)',
    exp: 'Faculty: General Awareness',
  },
  {
    name: 'Gufran Chaudhary',
    role: 'MBA (AMU), AMU RCA Alumni',
    exp: 'Faculty: English',
  },
  {
    name: 'Insaf Ali Khan',
    role: 'B.Tech, AMU Alumnus & Selected in Indian Railway',
    exp: 'Faculty: Mathematics & Reasoning',
  },
  {
    name: 'Mohd Aaqil',
    role: 'Research Scholar, AMU',
    exp: 'Faculty: Teaching Aptitude',
  },
  {
    name: 'Divyanshu Purwar',
    role: 'LLM (JMI), Judiciary Aspirant',
    exp: 'Faculty: Legal Language',
  },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Alig Foundation"
        subtitle="An initiative to initiate — empowering students to achieve their dreams of studying at Aligarh Muslim University."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="mx-auto w-full max-w-md">
          <div className="aspect-square w-full overflow-hidden rounded-full bg-secondary/20 p-8 shadow-xl">
            <img 
              src={SITE.logo} 
              alt="Alig Foundation logo"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
          <div>
            <SectionHeading
              align="left"
              eyebrow="Who We Are"
              title="Building futures, one aspirant at a time"
            />
            <div className="mt-5 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Alig Foundation is a dedicated coaching institute focused on helping
                students crack AMU entrance examinations. With a team of experienced
                mentors and a results-driven approach, we have guided thousands of
                students towards admission into their dream courses.
              </p>
              <p>
                Our programs combine concept clarity, consistent practice, and personal
                mentorship — available through both online and offline classroom modes,
                so every student can learn in the way that works best for them.
              </p>
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {VALUES.map((v) => (
                <li key={v} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeading
          eyebrow="Our Team"
          title="Meet Our Mentors"
          description="A passionate team of educators committed to your success."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m) => (
            <div
              key={m.name}
              className="rounded-2xl border border-border bg-card p-6 text-center"
            >
              <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-accent font-heading text-2xl font-extrabold text-accent-foreground">
                {m.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
              </span>
              <h3 className="mt-4 font-heading font-bold text-card-foreground">
                {m.name}
              </h3>
              <p className="text-sm font-medium text-primary">{m.role}</p>
              <p className="mt-1 text-xs text-muted-foreground">{m.exp}</p>
            </div>
          ))}
        </div>
      </section>

      <CtaBanner />
    </>
  )
}