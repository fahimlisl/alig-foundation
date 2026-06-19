import { Award, BookOpen, GraduationCap, Quote, Target, Users, Video } from 'lucide-react'

const STATS = [
  { value: '5000+', label: 'Students Mentored' },
  { value: '500+', label: 'Selections in AMU' },
  { value: '12+', label: 'Years of Experience' },
  { value: '50+', label: 'Expert Faculty' },
]

const FEATURES = [
  {
    icon: Video,
    title: 'Online & Offline Classes',
    desc: 'Learn the way that suits you with live and recorded classroom coaching.',
  },
  {
    icon: Users,
    title: 'Expert Mentors',
    desc: 'Experienced faculty who understand the AMU entrance pattern inside out.',
  },
  {
    icon: Target,
    title: 'Regular Mock Tests',
    desc: 'Weekly tests and detailed analysis to track and improve your performance.',
  },
  {
    icon: BookOpen,
    title: 'Updated Study Material',
    desc: 'Curated notes and practice sets aligned with the latest syllabus.',
  },
  {
    icon: Award,
    title: 'Proven Results',
    desc: 'A consistent track record of top rankers across AMU entrance exams.',
  },
  {
    icon: GraduationCap,
    title: 'Personal Guidance',
    desc: 'One-on-one doubt sessions and counselling for every student.',
  },
]

const TESTIMONIALS = [
  {
    quote:
      'The mentors at Alig Foundation made tough concepts simple. The mock tests were exactly like the real exam. I cleared AMU BA LLB in my first attempt!',
    name: 'Areeb Khan',
    detail: 'AMU Law Entrance, Rank 4',
  },
  {
    quote:
      'Structured classes, regular tests, and constant motivation. The faculty genuinely cares about each student. Highly recommended for AMU aspirants.',
    name: 'Unnati Sharma',
    detail: 'AMU Law Entrance, Rank 7',
  },
  {
    quote:
      'The MBA program covered everything from quant to interviews. The personal guidance helped me stay consistent throughout my preparation.',
    name: 'Faizan Ahmad',
    detail: 'AMU MBA Entrance, Rank 12',
  },
]

export function HomeStats() {
  return (
    <section className="border-y border-border bg-secondary">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-heading text-3xl font-extrabold text-primary sm:text-4xl">
              {s.value}
            </p>
            <p className="mt-1 text-sm font-medium text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function HomeFeatures() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {FEATURES.map((f) => (
        <div
          key={f.title}
          className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary"
        >
          <span className="inline-flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <f.icon className="size-6" />
          </span>
          <h3 className="mt-4 font-heading text-lg font-bold text-card-foreground">
            {f.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
        </div>
      ))}
    </div>
  )
}

export function HomeTestimonials() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {TESTIMONIALS.map((t) => (
        <figure
          key={t.name}
          className="flex flex-col rounded-2xl border border-border bg-card p-6"
        >
          <Quote className="size-8 text-primary" />
          <blockquote className="mt-4 flex-1 text-sm text-card-foreground leading-relaxed">
            {t.quote}
          </blockquote>
          <figcaption className="mt-5 border-t border-border pt-4">
            <p className="font-heading font-bold text-foreground">{t.name}</p>
            <p className="text-sm text-muted-foreground">{t.detail}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
