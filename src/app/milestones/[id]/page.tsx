import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
    return { title: "Milestone Not Found — NISB Archive" };
  }

  const { data: milestone } = await getPublicMilestoneById(id);
  if (!milestone) {
    return { title: "Milestone Not Found — NISB Archive" };
  }

  return {
    title: `${milestone.title} — NISB Milestones`,
    description: milestone.description
      ? milestone.description.slice(0, 160)
      : `Archival milestone record for ${milestone.title}.`,
  };
}

export default function MilestoneDetailPage({
  params,
}: MilestoneDetailProps) {
  return (
    <div className="flex flex-1 flex-col">
      <Suspense
        fallback={
          <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 md:px-12">
            <div className="border border-border rounded-sm bg-paper p-10 text-center">
              <p className="font-mono text-sm text-muted">Loading milestone...</p>
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

  // Handle standby state when database is unconfigured
  if (!milestoneRes.isConfigured) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 md:px-12">
        <Link
          href="/milestones"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
          Milestones
        </Link>
        <div className="border border-border rounded-sm bg-paper p-10 text-center">
          <p className="font-mono text-sm text-muted">
            Archive database client in standby mode. Milestone records will appear here once connected.
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

  const members = membersRes.data;
  const memberMap = new Map(members.map((m) => [m.id, m]));

  const participants = milestoneMembersRes.data
    .map((mm) => {
      const member = memberMap.get(mm.member_id);
      return member
        ? {
            id: member.id,
            name: member.full_name,
            photoUrl: member.photo_url,
            roleInMilestone: mm.role_in_milestone,
          }
        : null;
    })
    .filter(Boolean);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 md:px-12">
      {/* Back Link */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <Link
          href="/milestones"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted hover:text-accent transition-colors"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
          Milestones
        </Link>
      </nav>

      {/* Milestone Detail Article */}
      <article className="border border-border rounded-sm bg-paper p-6 sm:p-10 space-y-8">
        {/* Header */}
        <header className="space-y-3 pb-6 border-b border-border">
          <div className="flex flex-wrap items-center gap-2">
            {milestone.date && (
              <time className="font-mono text-xs text-muted tracking-wider uppercase">
                {milestone.date}
              </time>
            )}
            {milestone.milestone_year && !milestone.date && (
              <time className="font-mono text-xs text-muted tracking-wider">
                Year {milestone.milestone_year}
              </time>
            )}
            {milestone.category && (
              <span className="font-mono text-[11px] px-2 py-0.5 border border-border rounded-sm text-muted">
                {milestone.category}
              </span>
            )}
            {society && (
              <Link
                href={`/societies/${society.slug}`}
                className="font-mono text-[11px] px-2 py-0.5 border border-accent/40 text-accent rounded-sm hover:bg-accent/10 transition-colors"
              >
                {society.short_name || society.name}
              </Link>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            {milestone.title}
          </h1>
        </header>

        {/* Description */}
        {milestone.description && (
          <div className="prose prose-sm max-w-2xl font-sans text-base leading-relaxed text-foreground/90">
            <p>{milestone.description}</p>
          </div>
        )}

        {/* Optional Milestone Image */}
        {milestone.image_url && (
          <div className="pt-2">
            <Image
              src={milestone.image_url}
              alt={milestone.title}
              width={800}
              height={450}
              className="rounded-sm border border-border max-w-full h-auto object-cover"
              unoptimized
            />
          </div>
        )}

        {/* People Behind This Milestone Section */}
        <section className="pt-4 border-t border-border" aria-labelledby="people-heading">
          <h2
            id="people-heading"
            className="font-display text-xl font-semibold text-foreground tracking-tight"
          >
            People behind this milestone
          </h2>

          {participants.length === 0 ? (
            <p className="font-mono text-xs text-muted italic mt-4">
              No individual contributors indexed for this milestone.
            </p>
          ) : (
            <ul className="divide-y divide-border border-y border-border mt-4" role="list">
              {participants.map((p) => {
                if (!p) return null;
                return (
                  <li
                    key={p.id}
                    className="py-3 px-2 flex items-center justify-between gap-4 transition-colors hover:bg-black/[0.02]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <MemberAvatar
                        name={p.name}
                        photoUrl={p.photoUrl}
                        size="sm"
                        className="shrink-0"
                      />
                      <Link
                        href={`/directory/${p.id}`}
                        className="font-display font-medium text-foreground hover:text-accent transition-colors truncate"
                      >
                        {p.name}
                      </Link>
                    </div>

                    {p.roleInMilestone && (
                      <span className="font-mono text-xs text-muted shrink-0">
                        {p.roleInMilestone}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </article>
    </main>
  );
}
