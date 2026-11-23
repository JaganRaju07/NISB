import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Award,
  Layers,
  Cpu,
  BookOpen,
  CheckCircle2,
  Lock,
  Landmark,
  ExternalLink,
} from "lucide-react";
import { PageHeader, Footer } from "@/components/ui";
import { OFFICIAL_PUBLICATIONS } from "@/lib/official-roster";

export const metadata: Metadata = {
  title: "About NISB — NIE IEEE Student Branch",
  description:
    "Institutional mission, historical records, and stewardship of NIE IEEE Student Branch, Mysuru.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col bg-slate-950 text-slate-100">
      <PageHeader
        backLabel="Home"
        backHref="/"
        eyebrow="About the branch"
        title="About NISB"
        description="Our story, activities and role within the IEEE community."
      />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8 space-y-16">
        {/* Section 1: Institutional Heritage */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-sky-400">
                Institutional Heritage
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                NIE IEEE Student Branch (NISB)
              </h2>
            </div>
            <div className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 font-mono text-xs text-sky-400">
              EST. 25+ YEARS
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              <p>
                NIE IEEE Student Branch (NISB) is the official student branch of
                The National Institute of Engineering, Mysuru. Operating under the
                IEEE Bangalore Section and IEEE Mysuru Sub Section, NISB stands as
                one of the oldest, largest, and most active IEEE student branches
                in Karnataka.
              </p>
              <p>
                Over more than a quarter-century of continuous activity, NISB has
                fostered technical innovation, professional leadership, and ethical
                engineering practices. The branch has been honoured with numerous
                prestigious accolades, including the coveted{" "}
                <strong className="text-white">
                  &ldquo;The Best Student Chapter&rdquo;
                </strong>{" "}
                award of IEEE Region 10 (Asia-Pacific).
              </p>
            </div>

            <div className="md:col-span-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-3 font-mono text-xs shadow-inner">
              <div className="flex items-center gap-2 text-sky-400 font-semibold border-b border-slate-800 pb-2">
                <Landmark className="h-4 w-4" />
                <span>Institutional Affiliations</span>
              </div>
              <div className="space-y-2 text-slate-400">
                <div>
                  <span className="text-slate-500 block text-[10px]">COLLEGE</span>
                  <span className="text-slate-200">The National Institute of Engineering</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">SECTION</span>
                  <span className="text-slate-200">IEEE Bangalore Section</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">SUB-SECTION</span>
                  <span className="text-slate-200">IEEE Mysuru Sub Section</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">REGION</span>
                  <span className="text-slate-200">IEEE Region 10 (Asia-Pacific)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Technical Ecosystem & Activities */}
        <section className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <p className="font-mono text-xs uppercase tracking-widest text-sky-400">
              Operations &amp; Programs
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Branch Activities &amp; Signature Fests
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-sky-500/10 text-sky-400">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-white text-base">
                Focus Groups &amp; Meetups
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Peer-led engineering cohorts in Microcontrollers (AVR Atmega), Deep Learning,
                Web Development, and Python. Women in Engineering hosts weekly technical meetups.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-amber-500/10 text-amber-400">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-white text-base">
                Flagship Fests &amp; Contests
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Organizers of ANKURA (Odd Sem Fest), ADROIT (Even Sem Fest), and Electronika
                circuit hardware design competitions attracting participants across Karnataka.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-purple-500/10 text-purple-400">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-white text-base">
                Chronicles &amp; Publications
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Publisher of MANAS (half-yearly newsletter), JIJNASA (annual branch magazine),
                and technical writeups on the official NISB Engineering Blog.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2B: Publications */}
        <section id="collections" className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Publications
            </h2>
            <p className="text-sm text-slate-400 font-sans mt-1">
              The branch publications and periodicals.
            </p>
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
                        <span>Download PDF</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Branch Purpose */}
        <section className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <p className="font-mono text-xs uppercase tracking-widest text-sky-400">
              Data Integrity
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              About the branch
            </h2>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            <p>
              NISB brings students together for technical learning, leadership,
              professional development and community initiatives throughout the year.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <CheckCircle2 className="h-4 w-4" />
                <span>Accurate Branch Records</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every entry is aligned with official IEEE Student Branch rosters and documented committee appointments.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
              <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
                <ShieldCheck className="h-4 w-4" />
                <span>Documented History</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Branch milestones, publications, and awards reflect documented achievements across the branch&apos;s history.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
              <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
                <Lock className="h-4 w-4" />
                <span>Secure Digital Infrastructure</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Built on modern, reliable cloud infrastructure for public access to branch information.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                <Layers className="h-4 w-4" />
                <span>Official Asset Integration</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Member photographs and society emblems are mirrored from official NISB
                servers and local mirrors with deterministic monogram fallbacks derived
                from the officer&apos;s full name.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Fast Navigation Callouts */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-display text-xl font-bold text-white">
              Explore Members Directory
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Search all 21 official committee members and explore society chapters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/directory"
              className="rounded-md bg-sky-600 hover:bg-sky-500 px-4 py-2 text-xs font-semibold text-white transition-colors"
            >
              Member Directory
            </Link>
            <Link
              href="/societies"
              className="rounded-md border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
            >
              Societies &amp; Chapters
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
