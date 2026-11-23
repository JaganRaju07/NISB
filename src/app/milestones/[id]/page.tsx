import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import { MemberAvatar, Footer } from "@/components/ui";
import {
  getPublicMilestoneById,
  getPublicSocieties,
  getPublicMilestoneMembers,
  getPublicMembers,
} from "@/lib/archive";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface MilestoneDetailProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: MilestoneDetailProps): Promise<Metadata> {
  const { id } = await params;
  if (!UUID_REGEX.test(id)) {
    return { title: "Milestone Not Found — NISB" };
  }

  const { data: milestone } = await getPublicMilestoneById(id);
  if (!milestone) {
    return { title: "Milestone Not Found — NISB" };
  }

  return {
    title: `${milestone.title} — NISB Milestones`,
    description: milestone.description
      ? milestone.description.slice(0, 160)
      : `${milestone.title} at NIE IEEE Student Branch.`,
  };
}

export default function MilestoneDetailPage({
  params,
}: MilestoneDetailProps) {
  return (
    <div className="flex flex-1 flex-col bg-slate-950 text-slate-100">
      <Suspense
        fallback={
          <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-8">
            <div className="border border-slate-800 rounded-lg bg-slate-900/40 p-12 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
              <p className="font-mono text-sm text-slate-400 mt-3">Loading milestone record...</p>
            </div>
          </main>
        }
      >
        <MilestoneDetailContent params={params} />
      </Suspense>
      <Footer />
    </div>
  );
}

async function MilestoneDetailContent({
  params,
}: MilestoneDetailProps) {
  const { id } = await params;

  if (!UUID_REGEX.test(id)) {
    notFound();
  }

  const [milestoneRes, societiesRes, milestoneMembersRes, membersRes] =
    await Promise.all([
      getPublicMilestoneById(id),
      getPublicSocieties(),
      getPublicMilestoneMembers(id),
      getPublicMembers(),
    ]);

  if (!milestoneRes.isConfigured) {
    return (
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-8">
        <Link
          href="/milestones"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-400 hover:text-sky-400 transition-colors mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Milestones</span>
        </Link>
        <div className="border border-slate-800 rounded-lg bg-slate-900/40 p-12 text-center space-y-3">
          <p className="font-mono text-sm text-slate-300">
            The database is not configured. Published milestones will appear here when connected.
          </p>
        </div>
      </main>
    );
  }

  const milestone = milestoneRes.data;
  if (!milestone) {
    notFound();
  }

  const societies = societiesRes.data;
  const society = milestone.society_id
    ? societies.find((s) => s.id === milestone.society_id)
    : null;

  const milestoneMembers = milestoneMembersRes.data;
  const memberMap = new Map(membersRes.data.map((m) => [m.id, m]));

  const participants = milestoneMembers
    .map((mm) => {
      const member = memberMap.get(mm.member_id);
      if (!member) return null;
      return {
        memberId: member.id,
        fullName: member.full_name,
        photoUrl: member.photo_url,
        roleInMilestone: mm.role_in_milestone,
      };
    })
    .filter(Boolean);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-8">
      {/* Back Link */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <Link
          href="/milestones"
          className="group inline-flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-sky-400 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Milestones</span>
        </Link>
      </nav>

      {/* Record Sheet Card */}
      <article className="border border-slate-800 rounded-xl bg-slate-900/60 p-6 sm:p-10 shadow-lg backdrop-blur-sm space-y-8">
        <header className="border-b border-slate-800 pb-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-2">
              {society ? (
                <Link
                  href={`/societies/${society.slug}`}
                  className="rounded bg-sky-500/10 px-2.5 py-0.5 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 transition-colors"
                >
                  {society.short_name || society.name}
                </Link>
              ) : (
                <span className="rounded bg-slate-800 px-2.5 py-0.5 text-slate-300 border border-slate-700">
                  Branch Milestone
                </span>
              )}

              {(milestone.date || milestone.milestone_year) && (
                <span className="text-slate-400 inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-sky-400" />
                  <span>{milestone.date || `Year ${milestone.milestone_year}`}</span>
                </span>
              )}
            </div>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {milestone.title}
          </h1>
        </header>

        {milestone.description && (
          <div className="space-y-2">
            <h2 className="font-mono text-xs uppercase tracking-wider text-slate-400">
              Overview &amp; Context
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-3xl whitespace-pre-line">
              {milestone.description}
            </p>
          </div>
        )}

        {/* People Behind This Milestone */}
        {participants.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-slate-800">
            <h2 className="font-mono text-xs uppercase tracking-wider text-slate-400">
              People Behind This Milestone
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {participants.map((p) => {
                if (!p) return null;
                return (
                  <div
                    key={p.memberId}
                    className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/60 p-3 hover:border-slate-700 transition-colors"
                  >
                    <MemberAvatar
                      name={p.fullName}
                      photoUrl={p.photoUrl}
                      size="md"
                    />
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/directory/${p.memberId}`}
                        className="font-medium text-white text-sm hover:text-sky-300 transition-colors truncate block"
                      >
                        {p.fullName}
                      </Link>
                      {p.roleInMilestone && (
                        <p className="font-mono text-xs text-sky-400">
                          {p.roleInMilestone}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
