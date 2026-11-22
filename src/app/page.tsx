import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Milestone,
  Landmark,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  BookOpen,
  Search,
} from "lucide-react";
import {
  Footer,
  MemberAvatar,
  UniversalSearch,
  type UniversalSearchItem,
} from "@/components/ui";
import {
  getPublicMembers,
  getPublicMilestones,
} from "@/lib/archive";
import {
  OFFICIAL_ROSTER_MEMBERS,
  OFFICIAL_SOCIETIES,
  OFFICIAL_PUBLICATIONS,
} from "@/lib/official-roster";

export const instant = false;

export const metadata: Metadata = {
  title: "NIE IEEE Student Branch — STB64141, Mysuru",
  description:
    "Official website and digital archive of NIE IEEE Student Branch (STB64141), The National Institute of Engineering, Mysuru.",
};

export default async function Home() {
  const [membersRes, milestonesRes] = await Promise.all([
    getPublicMembers(),
    getPublicMilestones(),
  ]);

  const publishedMembers = membersRes.data ?? [];
  const publishedMilestones = milestonesRes.data ?? [];

  // ── Build Structured Universal Search Index ──
  const searchIndex: UniversalSearchItem[] = [];
  const seenMemberIds = new Set<string>();

  // 1. All 21 official committee officers from official website roster
  OFFICIAL_ROSTER_MEMBERS.forEach((m) => {
    seenMemberIds.add(m.id);
    searchIndex.push({
      id: m.id,
      category: "members",
      categoryLabel: "People & Officers",
      title: m.fullName,
      subtitle: `${m.designation} · ${m.portfolio}`,
      meta: m.category,
      href: `/directory/${m.id}`,
      photoUrl: m.localPhotoUrl,
      badge: m.portfolio,
      provenance: "staged_roster",
    });
  });

  // 2. Any additional confirmed members from database
  publishedMembers.forEach((m) => {
    if (!seenMemberIds.has(m.id)) {
      seenMemberIds.add(m.id);
      searchIndex.push({
        id: m.id,
        category: "members",
        categoryLabel: "People & Officers",
        title: m.full_name,
        subtitle: m.role ?? "Member",
        meta: m.department ? `${m.department} · Batch ${m.batch_year ?? ""}` : "Archival Record",
        href: `/directory/${m.id}`,
        photoUrl: m.photo_url,
        badge: m.department ? m.department : undefined,
        provenance: "confirmed",
      });
    }
  });

  // 3. Official technical societies & chapters
  OFFICIAL_SOCIETIES.forEach((soc) => {
    searchIndex.push({
      id: soc.slug,
      category: "societies",
      categoryLabel: "Societies & Chapters",
      title: `${soc.name} (${soc.shortName})`,
      subtitle: soc.establishedYear ? `Established ${soc.establishedYear} at NISB` : "IEEE Technical Chapter",
      meta: "IEEE Technical Society",
      href: `/societies/${soc.slug}`,
      photoUrl: soc.logoUrl,
      badge: soc.shortName,
      provenance: "official",
    });
  });

  // 4. Confirmed public milestones from database
  publishedMilestones.forEach((mile) => {
    searchIndex.push({
      id: mile.id,
      category: "milestones",
      categoryLabel: "Milestones",
      title: mile.title,
      subtitle: mile.description ? mile.description.slice(0, 90) + "..." : "Archival Milestone",
      meta: mile.milestone_year ? String(mile.milestone_year) : (mile.date ?? "Archival"),
      href: `/milestones/${mile.id}`,
      badge: mile.category ?? "Milestone",
      provenance: "confirmed",
    });
  });

  // 5. Official publications & primary source collections
  OFFICIAL_PUBLICATIONS.forEach((pub) => {
    searchIndex.push({
      id: pub.title,
      category: "publications",
      categoryLabel: "Publications",
      title: pub.title,
      subtitle: pub.periodicity,
      meta: pub.type,
      href: pub.externalLink ?? "/about",
      isExternal: !!pub.externalLink,
      photoUrl: pub.coverImage,
      badge: pub.periodicity,
      provenance: "official",
    });
  });

  // Official team members for the leadership discovery section (all 21 official members)
  const officialMembers = OFFICIAL_ROSTER_MEMBERS;

  return (
    <div className="flex flex-1 flex-col bg-slate-950 text-slate-100">
      {/* ── Section 1: Archival Introduction & Universal Search ── */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950 py-16 sm:py-24 bg-blueprint-grid">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,98,155,0.22),rgba(255,255,255,0))]" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-8 text-center space-y-8">
          {/* Institutional Identifier Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-mono text-sky-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold tracking-wide">
              IEEE BRANCH CODE: STB64141 · IEEE BANGALORE SECTION · REGION 10
            </span>
          </div>

          {/* Editorial Headline */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              NIE IEEE Student Branch
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-sans">
              A people-centred, searchable repository preserving the verified
              leadership, society officers, milestones, and
              publications of NISB at The National Institute of Engineering, Mysuru.
            </p>
          </div>

          {/* ── Universal Archive Search Box (The Centerpiece of Discovery) ── */}
          <div className="pt-2 pb-4">
            <UniversalSearch items={searchIndex} />
          </div>

          {/* Archive Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto font-mono text-left pt-2">
            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3.5 shadow-sm">
              <div className="text-xs text-slate-400">Officers Cataloged</div>
              <div className="text-xl sm:text-2xl font-bold text-white mt-1">
                {OFFICIAL_ROSTER_MEMBERS.length}
              </div>
              <div className="text-[10px] text-sky-400 mt-0.5">2025–2026 Core</div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3.5 shadow-sm">
              <div className="text-xs text-slate-400">Technical Chapters</div>
              <div className="text-xl sm:text-2xl font-bold text-sky-400 mt-1">
                {OFFICIAL_SOCIETIES.length}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">CS, WIE, CASS...</div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3.5 shadow-sm">
              <div className="text-xs text-slate-400">Print Collections</div>
              <div className="text-xl sm:text-2xl font-bold text-amber-400 mt-1">
                {OFFICIAL_PUBLICATIONS.length}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">MANAS &amp; JIJNASA</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Archive Discovery Portals (Four Interconnected Entry Points) ── */}
      <section className="border-b border-slate-800 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 space-y-20">
          {/* ── Discovery Portal 1: Explore People & Leadership ── */}
          <div id="people" className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-sky-400 mb-1">
                  <Users className="h-3.5 w-3.5" />
                  <span>Team Leadership Register</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Branch Leadership &amp; Officers (2025–2026)
                </h2>
                <p className="mt-1 text-sm text-slate-400 max-w-2xl font-sans">
                  The executive committee, coordinators, and technical chapter officers of NIE IEEE Student Branch.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/directory"
                  className="inline-flex items-center gap-2 rounded-md bg-sky-600 hover:bg-sky-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>Explore All {OFFICIAL_ROSTER_MEMBERS.length} Officers</span>
                </Link>
              </div>
            </div>

            {/* Official Officers Grid (All 21 Members) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {officialMembers.map((member) => (
                <div
                  key={member.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-700 hover:shadow-lg hover:shadow-sky-950/30"
                >
                  <div className="flex items-start gap-4">
                    <MemberAvatar
                      name={member.fullName}
                      photoUrl={member.localPhotoUrl}
                      size="lg"
                      className="border border-slate-700 group-hover:border-sky-500 transition-colors shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <span className="inline-block rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300 mb-1.5 border border-slate-700/60 truncate max-w-full">
                        {member.portfolio}
                      </span>
                      <h3 className="font-semibold text-white text-sm truncate group-hover:text-sky-300 transition-colors">
                        {member.fullName}
                      </h3>
                      <p className="text-xs text-sky-400 font-mono mt-0.5 leading-snug">
                        {member.designation}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                    <Link
                      href={`/directory/${member.id}`}
                      className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold"
                    >
                      <span>Archival Profile</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Discovery Portal 2: Explore Societies & Chapters ── */}
          <div id="societies" className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber-400 mb-1">
                  <Landmark className="h-3.5 w-3.5" />
                  <span>Technical Affinity Ecosystem</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Societies &amp; Affinity Chapters
                </h2>
                <p className="mt-1 text-sm text-slate-400 max-w-2xl font-sans">
                  The six specialized IEEE technical societies hosted at NIE Mysuru, each driving domain research, student project cohorts, and conferences.
                </p>
              </div>

              <Link
                href="/societies"
                className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900 hover:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white transition-colors shrink-0"
              >
                <span>View All Chapters</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {OFFICIAL_SOCIETIES.map((soc) => {
                // Find officers for this society from official roster
                const societyOfficers = OFFICIAL_ROSTER_MEMBERS.filter(
                  (m) => m.societySlug === soc.slug || (soc.slug === "ieee-ras" && m.designation.includes("RAS"))
                );

                return (
                  <div
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
                      {societyOfficers.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1">
                          <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                            Current Chapter Officers
                          </p>
                          {societyOfficers.map((off) => (
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
                        <span>Chapter Archive</span>
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
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Discovery Portal 3: Explore Chronology & Milestones ── */}
          <div id="milestones" className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Milestones &amp; Institutional Achievements
                </h2>
                <p className="mt-1 text-sm text-slate-400 max-w-2xl font-sans">
                  A chronological archive of branch charters, Region 10 accolades, and major technical conclaves.
                </p>
              </div>

              <Link
                href="/milestones"
                className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900 hover:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white transition-colors shrink-0"
              >
                <span>Full Timeline Register</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {publishedMilestones.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publishedMilestones.slice(0, 3).map((m) => (
                  <div
                    key={m.id}
                    className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between hover:border-slate-700 transition-colors"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between font-mono text-xs">
                        <span className="text-sky-400 font-semibold">
                          {m.milestone_year ? `Year ${m.milestone_year}` : "Archival"}
                        </span>
                      </div>
                      <h3 className="font-semibold text-white text-base">
                        {m.title}
                      </h3>
                      {m.description && (
                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                          {m.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 pt-3 border-t border-slate-800/80">
                      <Link
                        href={`/milestones/${m.id}`}
                        className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium"
                      >
                        <span>Milestone Record Details</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Honest Curatorial State (No fabricated achievements) */
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Milestone className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-white">
                  Chronological Transcriptions in Progress
                </h3>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/milestones"
                    className="rounded-md bg-sky-600 hover:bg-sky-500 px-4 py-2 text-xs font-semibold text-white transition-colors"
                  >
                    View Timeline Status
                  </Link>
                  <Link
                    href="/about"
                    className="rounded-md border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    Read Verification Charter
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* ── Discovery Portal 4: Explore Archival Collections & Publications ── */}
          <div id="collections" className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Documented Collections &amp; Publications
                </h2>
                <p className="mt-1 text-sm text-slate-400 max-w-2xl font-sans">
                  Authentic periodicals, newsletters, and annual journals edited and published by NIE IEEE Student Branch editorial boards.
                </p>
              </div>

              <span className="font-mono text-xs text-slate-400">
                {OFFICIAL_PUBLICATIONS.length} Official Periodicals Preserved
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
              {OFFICIAL_PUBLICATIONS.map((pub) => (
                <div
                  key={pub.title}
                  className="flex flex-col sm:flex-row gap-6 rounded-xl border border-slate-800 bg-slate-900/60 p-6 items-center"
                >
                  <div className="relative h-44 w-32 shrink-0 overflow-hidden rounded-md border border-slate-700 bg-slate-950 shadow-md">
                    <Image
                      src={pub.coverImage}
                      alt={`${pub.title} Cover`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 128px, 128px"
                    />
                  </div>

                  <div className="space-y-3 text-center sm:text-left flex-1">
                    <span className="rounded bg-purple-500/10 px-2 py-0.5 font-mono text-[10px] text-purple-400 border border-purple-500/20">
                      {pub.periodicity}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-white">
                      {pub.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {pub.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                      {pub.externalLink && (
                        <a
                          href={pub.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-md bg-sky-600 hover:bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
                        >
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>View Issue</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {pub.downloadLink && (
                        <a
                          href={pub.downloadLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                        >
                          <span>Download Archive PDF</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Institutional Governance & Zero-Speculation Charter ── */}
      <section className="border-b border-slate-800 bg-slate-900/30 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>Institutional Data Governance Charter</span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
              Two-Dimensional Verification Invariant
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Unlike promotional websites, NIE IEEE Student Branch enforces a strict database-level check:
              no record can be published to public indexation unless its verification status is explicitly confirmed
              by authorized branch curators. Staged website entries remain labeled with their provenance status,
              and empty fields remain explicitly empty until confirmed by official branch records.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
              <Link
                href="/about"
                className="text-sky-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Read Governance &amp; Charter Specification</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
              <span className="text-slate-600">|</span>
              <Link
                href="/admin/login"
                className="text-slate-400 hover:text-amber-400 transition-colors"
              >
                Curator Authentication Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
