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

  const subtitle = scholarshipOpen ? (
    <div className="space-y-3">
      <p>
        Alig Foundation offers Offline &amp; Online Scholarship Tests for
        aspirants preparing for AMU Entrance Examinations for:
      </p>

      <ul className="list-disc space-y-1 pl-5">
        <li>B.A. LL.B. (BALLB)</li>
        <li>B.A. (Hons.)</li>
        <li>B.A. (Hons.) Foreign Languages</li>
      </ul>

      <p className="font-semibold">Total Seats: 40</p>

      <div className="space-y-2">
        <p>
          🎓 <span className="font-semibold">20 Seats – 100% Scholarship</span>
          <br />
          Based on the Offline Scholarship Test
        </p>
        <p>
          🎓 <span className="font-semibold">20 Seats – 50% Scholarship</span>
          <br />
          Based on the Online Scholarship Test
        </p>
      </div>

      {scholarshipFee > 0 ? (
        <p className="text-sm opacity-80">
          Registration fee: ₹{scholarshipFee}.
        </p>
      ) : (
        <p className="text-sm opacity-80">Registration is free.</p>
      )}
    </div>
  ) : (
    'Scholarship registrations are currently closed. Please check back soon or contact us for the next test date.'
  )

  return (
    <>
      <PageHero title="SCHOLARSHIP TEST" subtitle={subtitle} />

      <section className="bg-secondary">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-1 lg:gap-14 lg:px-8 lg:py-20">
          {scholarshipOpen ? (
            <ScholarshipForm fee={scholarshipFee} lastDate={lastDate} />
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