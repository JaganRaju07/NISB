import type { Metadata } from "next";
import { PageHeader, Footer } from "@/components/ui";

export const metadata: Metadata = {
  title: "Societies & Chapters — NISB People & Milestones",
  description: "Browse the societies, affinity groups, and chapters of NIE IEEE Student Branch.",
};

export default function SocietiesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        backLabel="Home"
        backHref="/"
        eyebrow="NIE IEEE Student Branch"
        title="Societies & Chapters"
        description="Affinity groups and society chapters under NIE IEEE Student Branch, Mysuru."
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10 md:px-12">
        <div className="border border-border rounded-sm">
          <div className="px-4 py-8 text-center">
            <p className="font-mono text-sm text-muted">
              Societies and chapter profiles will appear here once data is seeded.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
