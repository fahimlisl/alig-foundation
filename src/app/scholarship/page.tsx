import { PageHero } from '@/components/page-hero'
import { ScholarshipForm } from '@/components/scholarship-form'
import dbConnect from '@/src/lib/dbConnect'
import scholarshipPermissionModel from '@/src/models/scholarship.permission.model'

async function getScholarshipStatus() {
  await dbConnect()
  const app = await scholarshipPermissionModel
    .findOne({ key: 'scholarship' })
    .lean()

  return {
    scholarshipOpen: app?.scholarshipOpen ?? true,
    scholarshipFee: app?.scholarshipFee ?? 0,
    lastDate: app?.scholarshipLastDate ?? null,
  }
}

export const dynamic = 'force-dynamic'

export default async function ScholarshipPage() {
  const { scholarshipOpen, scholarshipFee, lastDate } =
    await getScholarshipStatus()

  return (
    <>
      <PageHero
        title="SCHOLARSHIP TEST"
        subtitle={
          scholarshipOpen
            ? `Alig Foundation offers an online scholarship test for BALLB, B.A. (Hons), B.A. (Hons) Foreign Language, and MBA (CAT) aspirants preparing for AMU entrance exams.${
                scholarshipFee
                  ? ` Registration fee: ₹${scholarshipFee}.`
                  : ' Registration is free.'
              }`
            : 'Scholarship registrations are currently closed. Please check back soon or contact us for the next test date.'
        }
      />

      <section className="bg-secondary">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-1 lg:gap-14 lg:px-8 lg:py-20">
          {scholarshipOpen ? (
            <ScholarshipForm
              fee={scholarshipFee}
              lastDate={lastDate}
            />
          ) : (
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <div>
                <p className="font-heading text-lg font-bold text-card-foreground">
                  Registrations Closed
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  The scholarship test form will reopen for the next batch.
                  Check back soon!
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}