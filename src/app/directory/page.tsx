import type { Metadata } from "next";
import { PageHeader, Footer } from "@/components/ui";

export const metadata: Metadata = {
  title: "Directory — NISB People & Milestones",
  description: "Browse the indexed list of NISB members, past and present.",
};

export default function DirectoryPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        backLabel="Home"
        backHref="/"
        eyebrow="NIE IEEE Student Branch"
        title="Directory"
        description="An indexed list of NISB members, past and present."
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10 md:px-12">
        {/* Directory list will be populated from public_members view */}
        <div className="border border-border rounded-sm">
          <div className="px-4 py-8 text-center">
            <p className="font-mono text-sm text-muted">
              Member directory will appear here once data is seeded.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
