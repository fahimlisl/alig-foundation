import AdmitCardClient from "./AdmitCardClient";
import { PageHero } from "@/components/page-hero";

export default function ScholarshipAdmitCardPage() {
  return (
    <main className="min-h-screen bg-secondary">
            <PageHero
              title="Scholarship Admit Card | ALIG Foundation"
              subtitle="Download your ALIG Foundation Scholarship Examination Admit Card."
            />

      <section className="mx-auto max-w-[1320px] px-0 py-4 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <AdmitCardClient />
      </section>
    </main>
  );
}
