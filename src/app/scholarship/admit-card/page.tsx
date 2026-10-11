import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import AdmitCardClient from "./AdmitCardClient";

export const metadata: Metadata = {
  title: "Scholarship Admit Card | ALIG Foundation",
  description: "Generate and download your ALIG Foundation scholarship test admit card.",
  robots: { index: false, follow: false },
};

export default function ScholarshipAdmitCardPage() {
  return (
    <>
      <PageHero
        title="SCHOLARSHIP ADMIT CARD"
        subtitle="Enter the mobile number or email address used during your ALIG Foundation scholarship registration. Your admit card will be generated immediately in your browser."
      />

      <section className="bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <AdmitCardClient />
        </div>
      </section>
    </>
  );
}
