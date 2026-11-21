import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MemberAvatar, Footer } from "@/components/ui";
import {
  getPublicMemberById,
  getPublicMemberRoles,
  getPublicSocieties,
  getPublicMilestones,
  getPublicMilestoneMembers,
} from "@/lib/archive";
import {
  formatRoleTierLabel,
  formatTenure,
  isMemberRecordEmpty,
} from "@/lib/archive-helpers";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface DirectoryRecordProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: DirectoryRecordProps): Promise<Metadata> {
  const { id } = await params;
  if (!UUID_REGEX.test(id)) {
    return { title: "Member Not Found — NISB Archive" };
  }

  const { data: member } = await getPublicMemberById(id);
  if (!member) {
    return { title: "Member Not Found — NISB Archive" };
  }

  return {
    title: `${member.full_name} — NISB Directory`,
    description: member.role
      ? `${member.full_name}, ${member.role} at NIE IEEE Student Branch.`
      : `Archival record for ${member.full_name} at NIE IEEE Student Branch.`,
  };
}

export default function DirectoryRecordPage({
  params,
}: DirectoryRecordProps) {
  return (
    <div className="flex flex-1 flex-col">
      <Suspense
        fallback={
          <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 md:px-12">
            <div className="border border-border rounded-sm bg-paper p-10 text-center">
              <p className="font-mono text-sm text-muted">Loading member record...</p>
            </div>
          </main>
        }
      >
        <DirectoryRecordContent params={params} />
      </Suspense>
      <Footer />
    </div>
  );
}

async function DirectoryRecordContent({
  params,
}: DirectoryRecordProps) {
  const { id } = await params;

  if (!UUID_REGEX.test(id)) {
    notFound();
  }

  const [
    memberRes,
    rolesRes,
    societiesRes,
    milestonesRes,
    milestoneMembersRes,
  ] = await Promise.all([
    getPublicMemberById(id),
    getPublicMemberRoles(id),
    getPublicSocieties(),
    getPublicMilestones(),
    getPublicMilestoneMembers({ memberId: id }),
  ]);

  // Handle standby state when database is unconfigured
  if (!memberRes.isConfigured) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 md:px-12">
        <Link
          href="/directory"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
          Directory
        </Link>
        <div className="border border-border rounded-sm bg-paper p-10 text-center">
          <p className="font-mono text-sm text-muted">
            Archive database client in standby mode. Member records will appear here once connected.
          </p>
        </div>
      </main>
    );
  }

  const member = memberRes.data;
  if (!member) {
    notFound();
  }

  const roles = rolesRes.data;
  const societies = societiesRes.data;
  const societyMap = new Map(societies.map((s) => [s.id, s]));

  // Resolve associated milestones for this member
  const memberMilestoneIds = new Set(
    milestoneMembersRes.data.map((mm) => mm.milestone_id)
  );
  const milestoneRoleMap = new Map(
    milestoneMembersRes.data.map((mm) => [mm.milestone_id, mm.role_in_milestone])
  );
  const memberMilestones = milestonesRes.data.filter((m) =>
    memberMilestoneIds.has(m.id)
  );

  const tenureDisplay = formatTenure(member.tenure_start, member.tenure_end);
  const showQuietEmptyLine = isMemberRecordEmpty(member);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 md:px-12">
      {/* Back Link */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <Link
          href="/directory"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted hover:text-accent transition-colors"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
          Directory
        </Link>
      </nav>

      {/* Record Sheet Card */}
      <article className="border border-border rounded-sm bg-paper p-6 sm:p-10">
        {/* Header Row: Portrait on Left, Name & Role on Right */}
        <header className="flex flex-col sm:flex-row items-start gap-6 pb-8 border-b border-border">
          <div className="shrink-0">
            <MemberAvatar
              name={member.full_name}
              photoUrl={member.photo_url}
              size="lg"
              className="w-24 h-24 sm:w-28 sm:h-28 text-2xl"
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-mono text-[10px] tracking-widest text-muted uppercase">
              Archival Record Sheet
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mt-1">
              {member.full_name}
            </h1>

            {member.role && (
              <p className="font-mono text-xs uppercase tracking-wider text-muted font-medium mt-1.5">
                {member.role}
              </p>
            )}

            {(member.department || member.batch_year) && (
              <p className="font-mono text-xs text-muted/80 mt-1">
                {[
                  member.department,
                  member.batch_year ? `Batch of ${member.batch_year}` : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
          </div>
        </header>

        {/* Ruled Rows with Mono Labels */}
        <dl className="divide-y divide-border">
          {/* Society / Portfolio Row (from member_roles, label tier as Branch or Society) */}
          {roles.length > 0 && (
            <div className="py-4 flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-6">
              <dt className="font-mono text-xs text-muted uppercase tracking-wider shrink-0 w-36 sm:w-44">
                Society / portfolio
              </dt>
              <dd className="flex-1 space-y-1.5">
                {roles.map((r) => {
                  const soc = r.society_id ? societyMap.get(r.society_id) : null;
                  const tierLabel = formatRoleTierLabel(
                    r.tier,
                    soc?.short_name || soc?.name
                  );
                  const roleTenure = formatTenure(r.start_year, r.end_year);

                  return (
                    <div
                      key={r.id}
                      className="font-mono text-xs text-foreground/90 flex flex-wrap items-center gap-1.5"
                    >
                      <span className="font-semibold text-accent/90 uppercase tracking-wide">
                        {tierLabel}
                      </span>
                      <span>·</span>
                      <span>{r.role_title}</span>
                      {roleTenure && (
                        <span className="text-muted">({roleTenure})</span>
                      )}
                    </div>
                  );
                })}
              </dd>
            </div>
          )}

          {/* Tenure Row */}
          {tenureDisplay && (
            <div className="py-4 flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-6">
              <dt className="font-mono text-xs text-muted uppercase tracking-wider shrink-0 w-36 sm:w-44">
                Tenure
              </dt>
              <dd className="flex-1 font-mono text-xs text-foreground/90 tabular-nums">
                {tenureDisplay}
              </dd>
            </div>
          )}

          {/* Bio Row (rendered only when present) */}
          {member.bio && member.bio.trim() && (
            <div className="py-4 flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-6">
              <dt className="font-mono text-xs text-muted uppercase tracking-wider shrink-0 w-36 sm:w-44">
                Biography
              </dt>
              <dd className="flex-1 font-sans text-sm leading-relaxed text-foreground/90 max-w-xl">
                {member.bio}
              </dd>
            </div>
          )}

          {/* Technical Interests Row */}
          {member.interests && member.interests.length > 0 && (
            <div className="py-4 flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-6">
              <dt className="font-mono text-xs text-muted uppercase tracking-wider shrink-0 w-36 sm:w-44">
                Technical interests
              </dt>
              <dd className="flex-1 flex flex-wrap gap-1.5">
                {member.interests.map((interest) => (
                  <span
                    key={interest}
                    className="font-mono text-[11px] px-2 py-0.5 border border-border rounded-sm bg-black/[0.02] text-foreground/80"
                  >
                    {interest}
                  </span>
                ))}
              </dd>
            </div>
          )}

          {/* Contributions Row */}
          {member.contributions && member.contributions.trim() && (
            <div className="py-4 flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-6">
              <dt className="font-mono text-xs text-muted uppercase tracking-wider shrink-0 w-36 sm:w-44">
                Contributions
              </dt>
              <dd className="flex-1 font-sans text-sm leading-relaxed whitespace-pre-line text-foreground/90 max-w-xl">
                {member.contributions}
              </dd>
            </div>
          )}

          {/* Milestones Row */}
          {memberMilestones.length > 0 && (
            <div className="py-4 flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-6">
              <dt className="font-mono text-xs text-muted uppercase tracking-wider shrink-0 w-36 sm:w-44">
                Milestones
              </dt>
              <dd className="flex-1 space-y-2">
                {memberMilestones.map((m) => {
                  const roleInMilestone = milestoneRoleMap.get(m.id);
                  return (
                    <div key={m.id} className="text-sm">
                      <Link
                        href={`/milestones/${m.id}`}
                        className="font-display font-medium text-foreground hover:text-accent underline underline-offset-4 transition-colors"
                      >
                        {m.title}
                      </Link>
                      {roleInMilestone && (
                        <span className="font-mono text-xs text-muted ml-2">
                          ({roleInMilestone})
                        </span>
                      )}
                      {(m.date || m.milestone_year) && (
                        <span className="font-mono text-xs text-muted ml-2">
                          · {m.date || `Year ${m.milestone_year}`}
                        </span>
                      )}
                    </div>
                  );
                })}
              </dd>
            </div>
          )}
        </dl>

        {/* Quiet fallback line when bio, interests, contributions and tenure are all empty */}
        {showQuietEmptyLine && (
          <p className="font-mono text-xs text-muted italic pt-6 pb-2 border-t border-border mt-2">
            Further details will be added by the committee.
          </p>
        )}
      </article>
    </main>
  );
}
