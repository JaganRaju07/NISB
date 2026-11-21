import type { Metadata } from "next";
import { PageHeader, Footer } from "@/components/ui";

export const metadata: Metadata = {
  title: "Milestones — NISB People & Milestones",
  description: "Key events and achievements in NISB's history.",
};

export default function MilestonesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        backLabel="Home"
        backHref="/"
        eyebrow="NIE IEEE Student Branch"
        title="Milestones"
        description="Key events and achievements in the branch's history."
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10 md:px-12">
        {/* Milestones timeline will be populated from milestones table */}
        <div className="border border-border rounded-sm">
          <div className="px-4 py-8 text-center">
            <p className="font-mono text-sm text-muted">
              Milestones timeline will appear here once data is seeded.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
