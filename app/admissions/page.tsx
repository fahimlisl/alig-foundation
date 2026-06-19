import { CalendarDays, FileText, PhoneCall, UserCheck } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { RegistrationForm } from '@/components/registration-form'

const STEPS = [
  {
    icon: FileText,
    title: 'Fill the Form',
    desc: 'Complete the registration form with your details and chosen course.',
  },
  {
    icon: PhoneCall,
    title: 'Counselling Call',
    desc: 'Our team connects with you to understand your goals and guide you.',
  },
  {
    icon: UserCheck,
    title: 'Confirm Enrolment',
    desc: 'Complete the fee payment and reserve your seat in the batch.',
  },
  {
    icon: CalendarDays,
    title: 'Start Learning',
    desc: 'Get access to classes, study material, and your mentor dashboard.',
  },
]

const DATES = [
  { label: 'Registration Opens', value: 'Open Now' },
  { label: 'Next Batch Starts', value: '1st of Every Month' },
  { label: 'Mode', value: 'Online & Offline' },
  { label: 'Seats per Batch', value: 'Limited (40)' },
]

export default function AdmissionsPage() {
  return (
    <>
      <PageHero
        title="Admissions & Registration"
        subtitle="Admissions are open for online and offline classroom coaching. Secure your seat today."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="text-center font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
          How Admission Works
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.title} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <s.icon className="size-6" />
                </span>
                <span className="font-heading text-3xl font-extrabold text-border">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-4 font-heading text-lg font-bold text-card-foreground">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-20">
          <div>
            <h2 className="font-heading text-2xl font-extrabold text-foreground">
              Admission Details
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Join a community of focused aspirants and learn from mentors who have helped
              hundreds of students secure admission into AMU. Register now to reserve your
              seat.
            </p>
            <dl className="mt-8 space-y-3">
              {DATES.map((d) => (
                <div
                  key={d.label}
                  className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4"
                >
                  <dt className="text-sm font-medium text-muted-foreground">{d.label}</dt>
                  <dd className="font-heading text-sm font-bold text-foreground">
                    {d.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <RegistrationForm />
        </div>
      </section>
    </>
  )
}
