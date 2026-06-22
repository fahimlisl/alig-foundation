import { CalendarDays, FileText, PhoneCall, UserCheck } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { RegistrationForm } from '@/components/registration-form'
import dbConnect from '@/src/lib/dbConnect'
import applicationPermissionModel from '@/src/models/application.permission.model'

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

async function getAdmissionStatus() {
  await dbConnect()
  const app = await applicationPermissionModel.findOne({ key: 'global' }).lean()
  console.log("log of app lets see what does it returns in my production",app)
  return {
    admissionOpen: app?.admissionOpen ?? true,
    admissionFee: app?.admissionFee ?? 100,
  }
}

export default async function AdmissionsPage() {
  const { admissionOpen, admissionFee } = await getAdmissionStatus()

  return (
    <>
      <PageHero
        title="Admissions & Registration"
        subtitle={
          admissionOpen
            ? 'Admissions are open for online and offline classroom coaching. Secure your seat today.'
            : 'Admissions are currently closed. Please check back soon or contact us for the next batch.'
        }
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
            {admissionOpen ? (
              <>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Join a community of focused aspirants and learn from mentors who have helped
                  hundreds of students secure admission into AMU. Register now to reserve your
                  seat.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Registration Fee
                  </span>
                  <span className="font-heading text-sm font-bold text-foreground">
                    ₹{admissionFee}
                  </span>
                </div>
              </>
            ) : (
              <p className="mt-3 text-muted-foreground leading-relaxed">
                We&#x2019;re not accepting new registrations right now. Follow our announcements
                or reach out to us directly to be notified when the next batch opens.
              </p>
            )}
          </div>

          {admissionOpen ? (
            <RegistrationForm />
          ) : (
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <div>
                <p className="font-heading text-lg font-bold text-card-foreground">
                  Admissions Closed
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  The registration form will reopen for the next batch. Check back soon!
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}