import type { Metadata } from "next";
import { PageHeader, Footer } from "@/components/ui";

export const metadata: Metadata = {
  title: "About — NISB People & Milestones",
  description: "About this archive and NIE IEEE Student Branch.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        backLabel="Home"
        backHref="/"
        eyebrow="NIE IEEE Student Branch"
        title="About"
        description="About this archive and NIE IEEE Student Branch, Mysuru."
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10 md:px-12">
        <div className="prose prose-sm max-w-none">
          <p className="text-muted leading-relaxed">
            This platform serves as an institutional archive for the NIE IEEE
            Student Branch (NISB), documenting the people who have contributed
            to the branch and the milestones that mark its journey.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
