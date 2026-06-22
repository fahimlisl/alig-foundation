import { PageHero } from '@/components/page-hero'
import { RegistrationForm } from '@/components/registration-form'
import dbConnect from '@/src/lib/dbConnect'
import applicationPermissionModel from '@/src/models/application.permission.model'


async function getAdmissionStatus() {
  await dbConnect()
  const app = await applicationPermissionModel.findOne({ key: 'global' }).lean()
  console.log("log of app lets see what does it returns in my production",app)
  return {
    admissionOpen: app?.admissionOpen ?? true,
    admissionFee: app?.admissionFee ?? 100,
  }
}
export const dynamic = 'force-dynamic'

export default async function AdmissionsPage() {
  const { admissionOpen, admissionFee } = await getAdmissionStatus()

  return (
    <>
      <PageHero
        title="REGISTRATION FORM"
        subtitle={
          admissionOpen
            ? 'Alig Foundation offers  online live interactive classes and a personalized mentorship program for BALLB, B.A. (Hons), and B.A.(Hons) Foreign Language, MBA (CAT) aspirants preparing for AMU entrance exams.'
            : 'Admissions are currently closed. Please check back soon or contact us for the next batch.'
        }
      />

      <section className="bg-secondary">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-1 lg:gap-14 lg:px-8 lg:py-20">

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