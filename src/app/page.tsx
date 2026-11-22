import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Cpu,
  ExternalLink,
  HeartHandshake,
  MapPin,
  Users,
  BookOpen,
} from "lucide-react";
import { Footer, MemberAvatar, UniversalSearch, type UniversalSearchItem } from "@/components/ui";
import { getPublicMembers, getPublicMilestones } from "@/lib/archive";
import {
  OFFICIAL_PUBLICATIONS,
  OFFICIAL_ROSTER_MEMBERS,
  OFFICIAL_SOCIETIES,
} from "@/lib/official-roster";

export const instant = false;

export const metadata: Metadata = {
  title: "NIE IEEE Student Branch | NISB Mysuru",
  description:
    "NIE IEEE Student Branch (NISB) is a student-led IEEE community at The National Institute of Engineering, Mysuru.",
};

const activities = [
  {
    title: "Focus Groups",
    description:
      "Students work in peer-led groups on microcontrollers, deep learning, web development and Python, turning ideas into practical projects.",
    icon: Cpu,
  },
  {
    title: "WIE Weekly Meetups",
    description:
      "The Women in Engineering affinity group holds regular sessions to learn technical concepts and build small projects together.",
    icon: Users,
  },
  {
    title: "Industrial Visits",
    description:
      "Semester visits give members a closer look at how engineering teams work, including recent visits to ISRO, IISc, NOKIA, Cisco and Infosys.",
    icon: MapPin,
  },
  {
    title: "Social Initiatives",
    description:
      "NISB volunteers visit old-age homes and Divya Deepa to introduce children and elders to useful everyday technology.",
    icon: HeartHandshake,
  },
];

export default async function Home() {
  const [membersRes, milestonesRes] = await Promise.all([
    getPublicMembers(),
    getPublicMilestones(),
  ]);

  const publishedMembers = membersRes.data ?? [];
  const publishedMilestones = milestonesRes.data ?? [];
  const seenMemberIds = new Set<string>();
  const searchIndex: UniversalSearchItem[] = [];

  OFFICIAL_ROSTER_MEMBERS.forEach((member) => {
    seenMemberIds.add(member.id);
    searchIndex.push({
      id: member.id,
      category: "members",
      categoryLabel: "People & Officers",
      title: member.fullName,
      subtitle: `${member.designation} · ${member.portfolio}`,
      meta: member.category,
      href: `/directory/${member.id}`,
      photoUrl: member.localPhotoUrl,
      badge: member.portfolio,
      provenance: "staged_roster",
    });
  });

  publishedMembers.forEach((member) => {
    if (!seenMemberIds.has(member.id)) {
      searchIndex.push({
        id: member.id,
        category: "members",
        categoryLabel: "People & Officers",
        title: member.full_name,
        subtitle: member.role ?? "Member",
        meta: member.department ?? "Verified record",
        href: `/directory/${member.id}`,
        photoUrl: member.photo_url,
        provenance: "confirmed",
      });
    }
  });

  OFFICIAL_SOCIETIES.forEach((society) => {
    searchIndex.push({
      id: society.slug,
      category: "societies",
      categoryLabel: "Societies & Chapters",
      title: `${society.name} (${society.shortName})`,
      subtitle: society.establishedYear ? `Established ${society.establishedYear} at NISB` : "IEEE Technical Chapter",
      meta: "IEEE Technical Society",
      href: `/societies/${society.slug}`,
      photoUrl: society.logoUrl,
      badge: society.shortName,
      provenance: "official",
    });
  });

  publishedMilestones.forEach((milestone) => {
    searchIndex.push({
      id: milestone.id,
      category: "milestones",
      categoryLabel: "Milestones",
      title: milestone.title,
      subtitle: milestone.description ?? "Institutional milestone",
      meta: milestone.milestone_year ? String(milestone.milestone_year) : (milestone.date ?? "NISB"),
      href: `/milestones/${milestone.id}`,
      badge: milestone.category ?? "Milestone",
      provenance: "confirmed",
    });
  });

  OFFICIAL_PUBLICATIONS.forEach((publication) => {
    searchIndex.push({
      id: publication.title,
      category: "publications",
      categoryLabel: "Publications",
      title: publication.title,
      subtitle: publication.periodicity,
      meta: publication.type,
      href: publication.externalLink ?? "/about",
      isExternal: !!publication.externalLink,
      photoUrl: publication.coverImage,
      badge: publication.periodicity,
      provenance: "official",
    });
  });

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <main id="main-content">
        <section className="relative isolate overflow-hidden border-b border-border">
          <div className="hero-grid absolute inset-0 -z-10" />
          <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.15fr_.85fr] lg:py-20">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-sky-300">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                STB64141 · IEEE Bangalore Section
              </div>
              <h1 className="font-display text-5xl leading-[0.98] font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Build skills.
                <br />
                <span className="text-sky-400">Shape what&apos;s next.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
                NISB is the IEEE student branch of The National Institute of Engineering,
                Mysuru. We bring students together for hands-on learning, technical events,
                leadership and community impact.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/directory" className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-950/30 transition hover:bg-sky-500">
                  Meet the team <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="#about" className="inline-flex items-center rounded-md border border-border bg-card px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-sky-400">
                  Explore NISB
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card/75 p-4 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="mb-3 flex items-center justify-between px-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Find people and chapters</p>
                <span className="rounded border border-border px-2 py-1 font-mono text-[10px] text-slate-400">Cmd / Ctrl + K</span>
              </div>
              <UniversalSearch items={searchIndex} />
            </div>
          </div>

          <div className="border-t border-border bg-slate-950/70">
            <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border px-5 sm:px-8 lg:grid-cols-5">
              {[
                ["25+", "years of NISB"],
                ["21", "officers"],
                ["6", "societies & chapters"],
                ["2", "publications"],
                ["23,000+", "Bangalore Section members"],
              ].map(([value, label]) => (
                <div key={label} className="px-3 py-5 sm:px-5">
                  <div className="font-display text-2xl font-semibold text-white sm:text-3xl">{value}</div>
                  <div className="mt-1 text-xs leading-5 text-slate-400">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="border-b border-border py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr]">
              <div>
                <p className="section-eyebrow">About NISB</p>
                <h2 className="mt-3 max-w-xl font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  One of Karnataka&apos;s oldest and most active IEEE student branches.
                </h2>
              </div>
              <div className="grid gap-6 text-base leading-8 text-slate-300 sm:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-white">What is NISB?</h3>
                  <p>
                    NISB is the IEEE student branch of National Institute of Engineering.
                    For more than 25 years, it has hosted technical workshops and events,
                    including signature programs such as ANKURA, ADROIT, Electronika and IPL.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-white">Why NISB?</h3>
                  <p>
                    NISB connects students with workshops, seminars, webinars, talks,
                    competitions and hackathons. Members build technical confidence,
                    practical experience and lasting professional connections.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-14 rounded-xl border border-border bg-card p-6 sm:p-8">
              <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-sm font-semibold text-sky-400">A Part of IEEE Bangalore Section</p>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">
                    IEEE Bangalore Section was established in 1977 and is one of the
                    most vibrant IEEE sections. Its membership has grown to more than 23,000.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    ["/assets/ieee-white.png", "IEEE"],
                    ["/assets/BS_white.png", "IEEE Bangalore Section"],
                    ["/assets/MSS-Logo-White.png", "IEEE Mysuru Sub-Section"],
                    ["/assets/NISB short white.png", "NISB"],
                  ].map(([src, label]) => (
                    <div key={label} className="flex h-20 items-center justify-center rounded-lg border border-border bg-slate-950 px-3">
                      <Image src={src} alt={label} width={100} height={56} className="max-h-14 w-auto object-contain" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="section-heading">
              <div>
                <p className="section-eyebrow">Activities</p>
                <h2>Learn by doing</h2>
              </div>
              <p>Technical learning and community work, throughout the year.</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {activities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <article key={activity.title} className={`activity-card ${index === 0 ? "md:col-span-2" : ""}`}>
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-sky-400/20 bg-sky-400/10 text-sky-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3>{activity.title}</h3>
                      <p>{activity.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="publications" className="border-b border-border py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="section-heading">
              <div>
                <p className="section-eyebrow">Publications</p>
                <h2>Stories from NISB</h2>
              </div>
              <p>Two official publications documenting the branch and its community.</p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {OFFICIAL_PUBLICATIONS.map((publication) => (
                <article key={publication.title} className="publication-card">
                  <div className="relative h-72 w-full overflow-hidden rounded-lg bg-slate-950 md:h-80">
                    <Image
                      src={publication.coverImage}
                      alt={`${publication.title} publication cover`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-sky-400">{publication.periodicity}</p>
                    <h3 className="mt-2 font-display text-3xl font-semibold text-white">{publication.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-300">{publication.description}</p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      {publication.externalLink && (
                        <a href={publication.externalLink} target="_blank" rel="noopener noreferrer" className="text-link">
                          <BookOpen className="h-4 w-4" /> Read {publication.title} <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {publication.downloadLink && (
                        <a href={publication.downloadLink} target="_blank" rel="noopener noreferrer" className="text-link">
                          Download PDF <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="leadership" className="border-b border-border py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="section-heading">
              <div>
                <p className="section-eyebrow">Leadership</p>
                <h2>Meet the 2025–2026 team</h2>
              </div>
              <Link href="/directory" className="text-link">View all 21 officers <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {OFFICIAL_ROSTER_MEMBERS.slice(0, 8).map((member) => (
                <Link key={member.id} href={`/directory/${member.id}`} className="officer-card">
                  <MemberAvatar name={member.fullName} photoUrl={member.localPhotoUrl} size="lg" className="border border-border" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-400">{member.portfolio}</p>
                    <h3 className="mt-1 truncate text-base font-semibold text-white">{member.fullName}</h3>
                    <p className="mt-1 text-sm text-slate-400">{member.designation}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-500" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="societies" className="border-b border-border py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="section-heading">
              <div>
                <p className="section-eyebrow">Societies & Affinity Groups</p>
                <h2>Explore our technical chapters</h2>
              </div>
              <Link href="/societies" className="text-link">View all chapters <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {OFFICIAL_SOCIETIES.map((society) => (
                <Link key={society.slug} href={`/societies/${society.slug}`} className="society-card">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-slate-950 p-2">
                    <Image src={society.logoUrl} alt={`${society.name} logo`} width={40} height={40} className="h-8 w-8 object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-sky-400">{society.shortName}</p>
                    <h3 className="mt-1 text-lg font-semibold text-white">{society.name}</h3>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-500" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {publishedMilestones.length > 0 && (
          <section id="events" className="border-b border-border py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <div className="section-heading">
                <div>
                  <p className="section-eyebrow">Events & Milestones</p>
                  <h2>Recent institutional milestones</h2>
                </div>
                <Link href="/milestones" className="text-link">View timeline <ArrowRight className="h-4 w-4" /></Link>
              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {publishedMilestones.slice(0, 3).map((milestone) => (
                  <Link key={milestone.id} href={`/milestones/${milestone.id}`} className="publication-card p-6">
                    <p className="text-xs font-semibold text-sky-400">{milestone.milestone_year ?? "Milestone"}</p>
                    <h3 className="mt-3 text-lg font-semibold text-white">{milestone.title}</h3>
                    {milestone.description && <p className="mt-2 text-sm leading-6 text-slate-400">{milestone.description}</p>}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
