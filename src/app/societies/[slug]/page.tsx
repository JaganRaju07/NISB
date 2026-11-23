import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { MemberAvatar, Footer } from "@/components/ui";
import {
  getPublicSocietyBySlug,
  getPublicMilestones,
} from "@/lib/archive";
import {
  OFFICIAL_SOCIETIES,
  OFFICIAL_ROSTER_MEMBERS,
} from "@/lib/official-roster";

interface SocietyDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: SocietyDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const staticSoc = OFFICIAL_SOCIETIES.find((s) => s.slug === slug);

  if (!staticSoc) {
    const { data: dbSoc } = await getPublicSocietyBySlug(slug);
    if (!dbSoc) {
      return { title: "Society Not Found — NISB Archive" };
    }
    return {
      title: `${dbSoc.name} — NISB Societies`,
      description: dbSoc.description?.slice(0, 160) ?? `Archival record for ${dbSoc.name} at NIE IEEE Student Branch.`,
    };
  }

  return {
    title: `${staticSoc.name} — NISB Societies & Chapters`,
    description: staticSoc.description.slice(0, 160),
  };
}

export default function SocietyDetailPage({
  params,
}: SocietyDetailProps) {
  return (
    <div className="flex flex-1 flex-col bg-slate-950 text-slate-100">
      <Suspense
        fallback={
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-8">
            <div className="border border-slate-800 rounded-lg bg-slate-900/40 p-12 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
              <p className="font-mono text-sm text-slate-400 mt-3">Loading society record...</p>
            </div>
          </main>
        }
      >
        <SocietyDetailContent params={params} />
      </Suspense>
      <Footer />
    </div>
  );
}

async function SocietyDetailContent({
  params,
}: SocietyDetailProps) {
  const { slug } = await params;

  const staticSoc = OFFICIAL_SOCIETIES.find((s) => s.slug === slug);
  const [societyRes, milestonesRes] = await Promise.all([
    getPublicSocietyBySlug(slug),
    getPublicMilestones(),
  ]);

  const dbSociety = societyRes.data;

  // If neither static official society nor db society exists, 404
  if (!staticSoc && !dbSociety) {
    notFound();
  }

  const name = staticSoc?.name || dbSociety?.name || "";
  const shortName = staticSoc?.shortName || dbSociety?.short_name || "";
  const description = staticSoc?.description || dbSociety?.description || "";
  const establishedYear = staticSoc?.establishedYear || dbSociety?.established_year || null;
  const websiteUrl = staticSoc?.websiteUrl || dbSociety?.website_url || "https://www.ieee.org";
  const logoUrl = staticSoc?.logoUrl || "/assets/images/Condensed---White-Circle.png";

  // Find official roster members associated with this society
  const rosterOfficers = OFFICIAL_ROSTER_MEMBERS.filter(
    (m) => m.societySlug === slug || (slug === "ieee-ras" && m.designation.includes("RAS"))
  );

  // Milestones associated with this society
  const societyMilestones = dbSociety
    ? milestonesRes.data.filter((m) => m.society_id === dbSociety.id)
    : [];

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8">
      {/* Back Link */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <Link
          href="/societies"
          className="group inline-flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-sky-400 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Societies &amp; Chapters</span>
        </Link>
      </nav>

      {/* Society Overview Card */}
      <article className="border border-slate-800 rounded-xl bg-slate-900/60 p-6 sm:p-10 shadow-lg backdrop-blur-sm space-y-10">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div className="flex items-center gap-5">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-xl border border-slate-700 bg-slate-950 p-2 flex items-center justify-center shrink-0 shadow-inner">
              <Image
                src={logoUrl}
                alt={`${name} emblem`}
                width={64}
                height={64}
                className="h-14 w-14 object-contain"
                priority
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="rounded bg-sky-500/10 px-2 py-0.5 text-sky-400 border border-sky-500/20">
                  {shortName}
                </span>
                {establishedYear && (
                  <span className="text-slate-400">
                    Est. {establishedYear} at NISB
                  </span>
                )}
              </div>

              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                {name}
              </h1>
            </div>
          </div>

          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-mono text-slate-300 hover:text-white hover:border-sky-500 transition-colors shrink-0"
          >
            <span>Global Society Site</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </header>

        {/* Description */}
        <section className="space-y-3">
          <h2 className="font-mono text-xs uppercase tracking-wider text-sky-400">
            About the Chapter
          </h2>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-3xl whitespace-pre-line">
            {description}
          </p>
        </section>

        {/* Current Chapter Officers */}
        <section className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-baseline justify-between">
            <h2 className="font-mono text-xs uppercase tracking-wider text-slate-400">
              Chapter Officers &amp; Committee Leads
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {rosterOfficers.map((person) => {
              return (
                <div
                  key={person.id}
                  className="flex items-center gap-3.5 rounded-lg border border-slate-800 bg-slate-950/60 p-3.5 hover:border-slate-700 transition-colors"
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
                    <p className="font-mono text-xs text-sky-400 truncate mt-0.5">
                      {person.designation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Society Milestones */}
        {societyMilestones.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-slate-800">
            <h2 className="font-mono text-xs uppercase tracking-wider text-slate-400">
              Chapter Milestones &amp; Events
            </h2>
            <div className="space-y-3">
              {societyMilestones.map((m) => (
                <div
                  key={m.id}
                  className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 space-y-1.5"
                >
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-sky-400">
                      {m.date || (m.milestone_year ? `Year ${m.milestone_year}` : "")}
                    </span>
                    <Link
                      href={`/milestones/${m.id}`}
                      className="text-slate-400 hover:text-white inline-flex items-center gap-1"
                    >
                      <span>Record</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                  <h3 className="font-semibold text-white text-base">
                    {m.title}
                  </h3>
                  {m.description && (
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {m.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
