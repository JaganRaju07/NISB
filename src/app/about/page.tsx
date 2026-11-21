import type { Metadata } from "next";
import { PageHeader, Footer } from "@/components/ui";

export const metadata: Metadata = {
  title: "About — NISB People & Milestones",
  description: "About the institutional archive of NIE IEEE Student Branch, Mysuru.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        backLabel="Home"
        backHref="/"
        eyebrow="NIE IEEE Student Branch"
        title="About the Archive"
        description="Institutional record, preservation policy, and historical stewardship of NIE IEEE Student Branch."
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10 md:px-12">
        <div className="space-y-8 font-sans text-sm leading-relaxed text-foreground/90">
          <section className="space-y-3">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Institutional Heritage
            </h2>
            <p className="text-muted leading-relaxed">
              The NIE IEEE Student Branch (NISB) at The National Institute of
              Engineering, Mysuru, stands as one of the premier IEEE student
              organizations in the region. Since its inception, the branch has
              fostered technical excellence, professional development, and community
              outreach across engineering disciplines.
            </p>
            <p className="text-muted leading-relaxed">
              This digital archive serves as an authoritative institutional ledger,
              documenting the students, office bearers, faculty advisors, and mentors
              who have contributed to the branch&apos;s sustained journey.
            </p>
          </section>

          <section className="space-y-3 border-t border-border pt-8">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Archival Standards &amp; Data Integrity
            </h2>
            <p className="text-muted leading-relaxed">
              The archive operates under rigorous record-keeping principles:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted">
              <li>
                <strong className="text-foreground">Verifiable Provenance:</strong>{" "}
                Records are populated strictly from audited institutional rosters and
                verified publications as published on nisb.in.
              </li>
              <li>
                <strong className="text-foreground">Zero Synthetic Data:</strong>{" "}
                No placeholder personnel, speculative affiliations, or invented
                biographies exist within the repository.
              </li>
              <li>
                <strong className="text-foreground">Defense-in-Depth Privacy:</strong>{" "}
                Public directory views selectively expose verified professional
                information through database-level security barriers, isolating internal
                curatorial annotations and private audit metadata.
              </li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-border pt-8">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Design &amp; Archival Philosophy
            </h2>
            <p className="text-muted leading-relaxed">
              The platform embraces a restrained editorial design:
            </p>
            <div className="border border-border rounded-sm p-4 bg-paper space-y-2 font-mono text-xs text-muted">
              <div className="flex justify-between py-1 border-b border-border">
                <span>Color Palette</span>
                <span className="text-foreground">Paper (#F4F1EA) · Ink (#141414) · Accent (#00629B)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border">
                <span>Typography</span>
                <span className="text-foreground">Newsreader (Editorial) · Geist (UI) · Geist Mono (Data)</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Presentation</span>
                <span className="text-foreground">Ruled Indexed Lists · Fine Hairlines · Monogram Placeholders</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
