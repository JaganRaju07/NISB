import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader, Footer } from "@/components/ui";
import {
  getPublicMilestones,
  getPublicSocieties,
  getPublicMilestoneMembers,
  getPublicMembers,
} from "@/lib/archive";

export const metadata: Metadata = {
  title: "Milestones — NISB People & Milestones",
  description: "Key events and achievements in NISB's institutional history.",
};

export default async function MilestonesPage() {
  const [milestonesRes, societiesRes, milestoneMembersRes, membersRes] =
    await Promise.all([
      getPublicMilestones(),
      getPublicSocieties(),
      getPublicMilestoneMembers(),
      getPublicMembers(),
    ]);

  const milestones = milestonesRes.data;
  const societies = societiesRes.data;
  const milestoneMembers = milestoneMembersRes.data;
  const members = membersRes.data;
  const isConfigured = milestonesRes.isConfigured;

  // Map society_id to society details for contextual labeling
  const societyMap = new Map(societies.map((s) => [s.id, s]));

  // Map member_id to member record
  const memberMap = new Map(members.map((m) => [m.id, m]));

  // Group milestone participants by milestone_id
  const participantsByMilestone = new Map<
    string,
    Array<{ name: string; role?: string | null }>
  >();

  milestoneMembers.forEach((mm) => {
    const member = memberMap.get(mm.member_id);
    if (!member) return;

    const list = participantsByMilestone.get(mm.milestone_id) ?? [];
    list.push({
      name: member.full_name,
      role: mm.role_in_milestone,
    });
    participantsByMilestone.set(mm.milestone_id, list);
  });

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        backLabel="Home"
        backHref="/"
        eyebrow="NIE IEEE Student Branch"
        title="Milestones"
        description="Key events and achievements in the branch's history. Chronological institutional record."
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10 md:px-12">
        {milestones.length === 0 ? (
          <div className="border border-border rounded-sm bg-paper p-10 text-center">
            <p className="font-mono text-sm text-muted">
              Milestones timeline will appear here once data is seeded.
            </p>
            {!isConfigured && (
              <p className="font-mono text-xs text-muted/70 mt-2">
                Archive database client in standby mode.
              </p>
            )}
          </div>
        ) : (
          <div className="relative border-l border-border pl-6 ml-3 space-y-10">
            {milestones.map((milestone) => {
              const society = milestone.society_id
                ? societyMap.get(milestone.society_id)
                : null;
              const participants =
                participantsByMilestone.get(milestone.id) ?? [];

              return (
                <article
                  key={milestone.id}
                  className="relative group space-y-2"
                >
                  {/* Timeline Node */}
                  <span
                    className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full border border-border bg-paper"
                    aria-hidden="true"
                  />

                  {/* Header, Year & Date */}
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
                      <span className="font-mono text-[11px] px-2 py-0.5 border border-accent/40 text-accent rounded-sm">
                        {society.short_name || society.name}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="font-display text-xl font-semibold text-foreground tracking-tight">
                    {milestone.title}
                  </h2>

                  {/* Description */}
                  {milestone.description && (
                    <p className="font-sans text-sm text-muted leading-relaxed max-w-2xl">
                      {milestone.description}
                    </p>
                  )}

                  {/* Optional Image */}
                  {milestone.image_url && (
                    <div className="pt-2">
                      <Image
                        src={milestone.image_url}
                        alt={milestone.title}
                        width={640}
                        height={360}
                        className="rounded-sm border border-border max-w-md max-h-60 object-cover"
                        unoptimized
                      />
                    </div>
                  )}

                  {/* Associated Verified Participants */}
                  {participants.length > 0 && (
                    <div className="pt-2 flex flex-wrap items-center gap-1.5">
                      <span className="font-mono text-[11px] text-muted uppercase tracking-wider">
                        Personnel:
                      </span>
                      {participants.map((p, idx) => (
                        <span
                          key={`${p.name}-${idx}`}
                          className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 border border-border rounded-sm bg-black/[0.02] text-foreground/85"
                        >
                          <span>{p.name}</span>
                          {p.role && (
                            <span className="text-muted">({p.role})</span>
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
