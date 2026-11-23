import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink } from "lucide-react";
import { PageHeader, Footer, MemberAvatar } from "@/components/ui";
import {
  OFFICIAL_SOCIETIES,
  OFFICIAL_ROSTER_MEMBERS,
} from "@/lib/official-roster";

export const metadata: Metadata = {
  title: "Societies & Chapters — NISB",
  description:
    "Explore the IEEE technical societies and student affinity groups operating under NIE IEEE Student Branch, Mysuru.",
};

export default function SocietiesPage() {
  return (
    <div className="flex flex-1 flex-col bg-slate-950 text-slate-100">
      <PageHeader
        backLabel="Home"
        backHref="/"
        eyebrow="Technical Chapters &amp; Affinity Groups"
        title="Societies &amp; Chapters"
        description="The six official IEEE technical societies and student affinity groups hosted under NIE IEEE Student Branch, The National Institute of Engineering, Mysuru."
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-8 space-y-16">
        <Suspense
          fallback={
            <div className="border border-slate-800 rounded-lg bg-slate-900/40 p-12 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
              <p className="font-mono text-sm text-slate-400 mt-3">Loading societies...</p>
            </div>
          }
        >
          <SocietiesContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

async function SocietiesContent() {
  // Branch Executive leadership from official roster
  const branchExecOfficers = OFFICIAL_ROSTER_MEMBERS.filter(
    (m) => m.category === "Executive Leadership" || m.category === "Coordination & Editorial"
  );

  return (
    <>
      {/* ── Section 1: Branch Executive Leadership ── */}
      <section aria-labelledby="branch-leadership-heading" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-800 pb-4 gap-2">
          <div>
            <h2
              id="branch-leadership-heading"
              className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight"
            >
              Branch Executive Leadership
            </h2>
            <p className="font-mono text-xs text-slate-400 mt-1">
              Executive committee officers and coordinators of NIE IEEE Student Branch.
            </p>
          </div>
          <span className="font-mono text-xs text-sky-400">
            {branchExecOfficers.length} Officers
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {branchExecOfficers.map((person) => {
            return (
              <div
                key={person.id}
                className="group flex items-center gap-3.5 rounded-lg border border-slate-800 bg-slate-900/50 p-3.5 hover:border-slate-700 transition-colors"
              >
                <MemberAvatar
                  name={person.fullName}
                  photoUrl={person.localPhotoUrl}
                  size="md"
                  className="border border-slate-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/directory/${person.id}`}
                    className="font-medium text-white text-sm hover:text-sky-300 transition-colors truncate block"
                  >
                    {person.fullName}
                  </Link>
                  <p className="font-mono text-xs text-slate-400 truncate mt-0.5">
                    {person.designation}
                  </p>
                  <span className="font-mono text-[10px] text-sky-400/90 block truncate mt-0.5">
                    {person.portfolio}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Section 2: All 6 Official Societies & Chapters ── */}
      <section aria-labelledby="societies-heading" className="space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h2
            id="societies-heading"
            className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight"
          >
            Technical Chapters &amp; Affinity Groups
          </h2>
          <p className="font-mono text-xs text-slate-400 mt-1">
            Active IEEE student branch chapters at The National Institute of Engineering, Mysuru.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {OFFICIAL_SOCIETIES.map((soc) => {
            // Find officers from official roster for this society
            const officers = OFFICIAL_ROSTER_MEMBERS.filter(
              (m) => m.societySlug === soc.slug || (soc.slug === "ieee-ras" && m.designation.includes("RAS"))
            );

            return (
              <article
                key={soc.slug}
                className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-700"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative h-12 w-12 rounded-lg bg-slate-950 border border-slate-800 p-1.5 flex items-center justify-center">
                      <Image
                        src={soc.logoUrl}
                        alt={`${soc.name} logo`}
                        width={40}
                        height={40}
                        sizes="40px"
                        className="h-9 w-9 object-contain"
                      />
                    </div>
                    <span className="rounded bg-sky-500/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-sky-400 border border-sky-500/20">
                      {soc.shortName}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-white group-hover:text-sky-300 transition-colors">
                    {soc.name}
                  </h3>

                  {soc.establishedYear && (
                    <p className="font-mono text-xs text-slate-400 mt-1">
                      Established {soc.establishedYear} at NISB
                    </p>
                  )}

                  <p className="mt-3 text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {soc.description}
                  </p>

                  {/* Society Officers on Official Roster */}
                  {officers.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                        Current Officers
                      </p>
                      {officers.map((off) => (
                        <div
                          key={off.id}
                          className="flex items-center justify-between text-xs font-mono"
                        >
                          <Link
                            href={`/directory/${off.id}`}
                            className="text-slate-200 hover:text-sky-300 transition-colors truncate pr-2 font-medium"
                          >
                            {off.fullName}
                          </Link>
                          <span className="text-slate-400 shrink-0 text-[11px]">
                            {off.designation}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <Link
                    href={`/societies/${soc.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    <span>View Chapter Page</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <a
                    href={soc.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white transition-colors"
                    title={`Visit ${soc.name} Global Website`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
