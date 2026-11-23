import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/ui/footer";
import { CircuitTrace } from "@/components/ui/circuit-trace";
import { Reveal } from "@/components/ui/reveal";
import { StatCount } from "@/components/ui/stat-count";
import { ActivityTile } from "@/components/ui/activity-spotlights";
import { SocietyAccordion } from "@/components/ui/society-accordion";
import { getPublicMilestones } from "@/lib/archive";
import {
  OFFICIAL_ACTIVITIES,
  OFFICIAL_PUBLICATIONS,
  OFFICIAL_ROSTER_MEMBERS,
} from "@/lib/official-roster";

export const instant = false;

export const metadata: Metadata = {
  title: "NIE IEEE Student Branch | NISB Mysuru",
  description:
    "NIE IEEE Student Branch (NISB) is a student-led IEEE community at The National Institute of Engineering, Mysuru.",
};

export default async function Home() {
  const milestonesRes = await getPublicMilestones();
  const publishedMilestones = milestonesRes.data ?? [];
  const nonSocietyOfficers = OFFICIAL_ROSTER_MEMBERS.filter(
    (member) => member.category !== "Society Officers"
  );
  const chairperson = OFFICIAL_ROSTER_MEMBERS.find((member) => member.designation === "Chairperson");

  return (
    <main id="main-content" className="bg-[var(--background)]">
      <section className="crosshair section-rule relative">
        <div className="hero-backdrop absolute inset-x-0 top-[72px] h-[680px] -z-10 lg:h-[760px]" />
        <div className="hero-content site-container hairline-grid">
          <div className="grid min-h-[680px] items-center gap-8 px-0 py-16 lg:grid-cols-12 lg:py-20">
            <Reveal className="lg:col-span-7">
              <p className="mono-label">IEEE STUDENT BRANCH · STB64141 · BANGALORE SECTION · REGION 10</p>
              <h1 className="mt-8 max-w-[900px]">
                NIE IEEE <em>Student</em> Branch
              </h1>
              <p className="body-copy mt-8 max-w-[620px]">
                A student-led IEEE community for hands-on learning, technical events,
                leadership and community impact.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/directory" className="button-primary">Meet the team <span aria-hidden="true">→</span></Link>
                <Link href="/#contact" className="button-secondary">Contact us <span aria-hidden="true">↗</span></Link>
              </div>
            </Reveal>
            <Reveal className="lg:col-span-5" delay={120}>
              <CircuitTrace />
            </Reveal>
          </div>

          <div className="section-rule grid grid-cols-2 border-b border-[var(--line)] md:grid-cols-4">
            {[
              [21, "Officers"],
              [6, "Societies & chapters"],
              [2, "Publications"],
              [23000, "Bangalore Section members"],
            ].map(([value, label]) => (
              <div key={label} className="border-r border-[var(--line)] px-5 py-7 last:border-r-0">
                <p className="font-mono tabular-nums text-3xl"><StatCount value={Number(value)} suffix={value === 23000 ? "+" : ""} /></p>
                <p className="mono-label mt-2 text-[10px] text-[var(--muted)]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="section-rule py-24 lg:py-32">
        <div className="site-container hairline-grid">
          <Reveal className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="mono-label">01 / About</p>
              <h2 className="mt-5">What is NISB</h2>
            </div>
            <div className="body-copy lg:col-span-7 lg:col-start-6">
              <p>
                NIE IEEE Student Branch is the official student branch of The National
                Institute of Engineering, Mysuru. For more than 25 years, it has
                organised technical workshops and events, including ANKURA, ADROIT,
                Electronika and IPL.
              </p>
              <h3 className="mt-10 font-display text-3xl">Why NISB</h3>
              <p className="mt-3">
                NISB connects students with workshops, seminars, webinars, talks,
                competitions and hackathons. Members build technical confidence,
                practical experience and professional connections.
              </p>
              <p className="mt-8 border-l border-[var(--accent)] pl-5">
                IEEE Bangalore Section was established in 1977 and has grown to more
                than 23,000 members.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-rule py-24 lg:py-32">
        <div className="site-container hairline-grid">
          <Reveal className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="mono-label">02 / Activities</p>
              <h2 className="mt-5">Learn by doing</h2>
            </div>
            <div className="grid gap-4 lg:col-span-8 md:grid-cols-2">
              {OFFICIAL_ACTIVITIES.map((activity, index) => (
                <ActivityTile key={activity.title} className="grid gap-4 p-6">
                  <span className="mono-label text-[var(--accent)]">0{index + 1}</span>
                  <h3 className="font-display text-2xl">{activity.title}</h3>
                  <p className="body-copy text-sm">{activity.description}</p>
                  <span className="justify-self-end text-[var(--accent)]" aria-hidden="true">→</span>
                </ActivityTile>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="leadership" className="section-rule py-24 lg:py-32">
        <div className="site-container hairline-grid">
          <Reveal className="flex items-end justify-between gap-6">
            <div>
              <p className="mono-label">03 / Leadership</p>
              <h2 className="mt-5">The 2025–2026 team</h2>
            </div>
            <Link href="/directory" className="link-slide hidden text-sm md:inline">View all 21 officers ↗</Link>
          </Reveal>

          {chairperson && (
            <Reveal className="mt-12 grid gap-8 md:grid-cols-12">
              <Link href={`/directory/${chairperson.id}`} className="group md:col-span-5" aria-label={`View ${chairperson.fullName}`}>
                <div className="relative aspect-[4/5] overflow-hidden border border-[var(--line)] bg-[var(--surface)]">
                  <Image
                    src={chairperson.localPhotoUrl}
                    alt={chairperson.fullName}
                    fill
                    sizes="(max-width: 768px) 100vw, 416px"
                    className="photo-tone object-cover object-top"
                    priority
                  />
                  <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[var(--background)] to-transparent" />
                </div>
              </Link>
              <div className="md:col-span-6 md:col-start-7 md:self-end">
                <p className="mono-label text-[var(--accent)]">Chairperson</p>
                <h3 className="mt-4 text-5xl">{chairperson.fullName}</h3>
                <Link href={`/directory/${chairperson.id}`} className="link-slide mt-6 inline-block text-sm">View profile ↗</Link>
              </div>
            </Reveal>
          )}

          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
            {nonSocietyOfficers.filter((member) => member.id !== chairperson?.id).map((member) => (
              <Reveal key={member.id}>
                <Link href={`/directory/${member.id}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden border border-[var(--line)] bg-[var(--surface)]">
                    <Image
                      src={member.localPhotoUrl}
                      alt={member.fullName}
                      fill
                      sizes="(max-width: 768px) 50vw, 280px"
                      className="photo-tone object-cover object-top"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[var(--background)] to-transparent" />
                  </div>
                  <h3 className="mt-4 text-2xl">{member.fullName}</h3>
                  <p className="mono-label mt-1 text-[10px] text-[var(--muted)]">{member.designation}</p>
                </Link>
              </Reveal>
            ))}
          </div>
          <Link href="/directory" className="link-slide mt-8 inline-block text-sm md:hidden">View all 21 officers ↗</Link>
        </div>
      </section>

      <section id="societies" className="section-rule py-24 lg:py-32">
        <div className="site-container hairline-grid">
          <Reveal className="flex items-end justify-between gap-6">
            <div>
              <p className="mono-label">04 / Societies</p>
              <h2 className="mt-5">Technical chapters</h2>
            </div>
            <Link href="/societies" className="link-slide hidden text-sm md:inline">View chapters ↗</Link>
          </Reveal>
          <SocietyAccordion />
        </div>
      </section>

      <section id="publications" className="section-rule py-24 lg:py-32">
        <div className="site-container hairline-grid">
          <Reveal>
            <p className="mono-label">05 / Publications</p>
            <h2 className="mt-5">Stories from NISB</h2>
          </Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {OFFICIAL_PUBLICATIONS.map((publication) => (
              <Reveal key={publication.title} className="card publication-cover">
                <div className="relative h-[420px] bg-[var(--surface-2)]">
                  <Image
                    src={publication.coverImage}
                    alt={`${publication.title} publication cover`}
                    fill
                    sizes="(max-width: 768px) 100vw, 384px"
                    className="object-contain p-8"
                  />
                </div>
                <div className="border-t border-[var(--line)] p-6">
                  <p className="mono-label text-[10px] text-[var(--accent)]">{publication.periodicity}</p>
                  <h3 className="mt-2 text-3xl">{publication.title}</h3>
                  <p className="body-copy mt-3 text-sm">{publication.description}</p>
                  <div className="mt-5 flex flex-wrap gap-5 text-sm">
                    {publication.externalLink && <a href={publication.externalLink} target="_blank" rel="noopener noreferrer" className="link-slide">Read issue ↗</a>}
                    {publication.downloadLink && <a href={publication.downloadLink} target="_blank" rel="noopener noreferrer" className="link-slide">Download PDF ↗</a>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {publishedMilestones.length > 0 && (
        <section id="milestones" className="section-rule py-24 lg:py-32">
          <div className="site-container hairline-grid">
            <Reveal className="flex items-end justify-between">
              <div>
                <p className="mono-label">06 / Milestones</p>
                <h2 className="mt-5">Recent moments</h2>
              </div>
              <Link href="/milestones" className="link-slide text-sm">View timeline ↗</Link>
            </Reveal>
            <div className="mt-12 border-l border-[var(--line)]">
              {publishedMilestones.slice(0, 5).map((milestone) => (
                <Reveal key={milestone.id} className="relative ml-5 border-b border-[var(--line)] py-6">
                  <span className="absolute -left-[25px] top-[38px] h-2 w-2 rounded-full bg-[var(--accent)]" />
                  <p className="mono-label text-[10px] text-[var(--muted)]">{milestone.milestone_year ?? milestone.date}</p>
                  <Link href={`/milestones/${milestone.id}`} className="mt-2 block">
                    <h3 className="text-2xl">{milestone.title}</h3>
                    {milestone.description && <p className="body-copy mt-2 text-sm">{milestone.description}</p>}
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
