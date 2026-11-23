import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Milestone as MilestoneIcon,
  Landmark,
} from "lucide-react";
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
import { OFFICIAL_ROSTER_MEMBERS } from "@/lib/official-roster";

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
    return { title: "Member Not Found — NISB" };
  }

  const staticMember = OFFICIAL_ROSTER_MEMBERS.find((m) => m.id === id);
  if (staticMember) {
    return {
      title: `${staticMember.fullName} — NISB Directory`,
      description: `${staticMember.fullName}, ${staticMember.designation} (${staticMember.portfolio}) at NIE IEEE Student Branch.`,
    };
  }

  const { data: member } = await getPublicMemberById(id);
  if (!member) {
    return { title: "Member Not Found — NISB" };
  }

  return {
    title: `${member.full_name} — NISB Directory`,
    description: member.role
      ? `${member.full_name}, ${member.role} at NIE IEEE Student Branch.`
      : `Profile for ${member.full_name} at NIE IEEE Student Branch.`,
  };
}

export default function DirectoryRecordPage({
  params,
}: DirectoryRecordProps) {
  return (
    <div className="flex flex-1 flex-col bg-slate-950 text-slate-100">
      <Suspense
        fallback={
          <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-8">
            <div className="border border-slate-800 rounded-lg bg-slate-900/40 p-12 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
              <p className="font-mono text-sm text-slate-400 mt-3">Loading member record...</p>
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

  const staticMember = OFFICIAL_ROSTER_MEMBERS.find((m) => m.id === id);

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

  const member = memberRes.data;

  // If neither published DB member nor official static member exists, 404
  if (!member && !staticMember) {
    notFound();
  }

  // If member is not yet published in DB, display official verified roster profile
  if (!member && staticMember) {
    return (
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-8">
        {/* Back Link */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            href="/directory"
            className="group inline-flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-sky-400 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Directory</span>
          </Link>
        </nav>

        {/* Record Sheet Card */}
        <article className="border border-slate-800 rounded-xl bg-slate-900/60 p-6 sm:p-10 shadow-lg backdrop-blur-sm space-y-8">
          {/* Header Row */}
          <header className="flex flex-col sm:flex-row items-start gap-6 pb-8 border-b border-slate-800">
            <div className="shrink-0">
              <MemberAvatar
                name={staticMember.fullName}
                photoUrl={staticMember.localPhotoUrl}
                size="2xl"
                className="border border-slate-700 shadow-md"
                priority
              />
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="rounded bg-amber-500/10 px-2.5 py-0.5 text-amber-400 border border-amber-500/20">
                  Executive Committee
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
                {staticMember.fullName}
              </h1>

              <p className="font-mono text-sm tracking-wide text-sky-300 font-medium">
                {staticMember.designation}
              </p>

              <p className="font-mono text-xs text-slate-400 pt-1">
                {staticMember.portfolio} · NIE IEEE Student Branch
              </p>
            </div>
          </header>

          {/* Details Definition List */}
          <dl className="divide-y divide-slate-800/80">
            <div className="py-4 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8">
              <dt className="font-mono text-xs text-slate-400 uppercase tracking-wider shrink-0 w-36 sm:w-44">
                Committee Category
              </dt>
              <dd className="font-mono text-xs text-slate-200">
                {staticMember.category}
              </dd>
            </div>

            <div className="py-4 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8">
              <dt className="font-mono text-xs text-slate-400 uppercase tracking-wider shrink-0 w-36 sm:w-44">
                Portfolio Focus
              </dt>
              <dd className="font-mono text-xs text-sky-400 font-medium">
                {staticMember.portfolio}
              </dd>
            </div>

            {staticMember.societyName && (
              <div className="py-4 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8">
                <dt className="font-mono text-xs text-slate-400 uppercase tracking-wider shrink-0 w-36 sm:w-44">
                  Affiliated Chapter
                </dt>
                <dd className="font-mono text-xs text-slate-200 flex items-center gap-2">
                  <Landmark className="h-3.5 w-3.5 text-amber-400" />
                  {staticMember.societySlug ? (
                    <Link
                      href={`/societies/${staticMember.societySlug}`}
                      className="text-sky-300 hover:underline"
                    >
                      {staticMember.societyName}
                    </Link>
                  ) : (
                    <span>{staticMember.societyName}</span>
                  )}
                </dd>
              </div>
            )}

          </dl>
        </article>
      </main>
    );
  }

  // Published DB member view
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

  const tenureDisplay = formatTenure(member!.tenure_start, member!.tenure_end);
  const showQuietEmptyLine = isMemberRecordEmpty(member!);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-8">
      {/* Back Link */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <Link
          href="/directory"
          className="group inline-flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-sky-400 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Directory</span>
        </Link>
      </nav>

      {/* Record Sheet Card */}
      <article className="border border-slate-800 rounded-xl bg-slate-900/60 p-6 sm:p-10 shadow-lg backdrop-blur-sm">
        {/* Header Row: Portrait on Left, Name & Role on Right */}
        <header className="flex flex-col sm:flex-row items-start gap-6 pb-8 border-b border-slate-800">
          <div className="shrink-0">
            <MemberAvatar
              name={member!.full_name}
              photoUrl={member!.photo_url}
              size="2xl"
              className="border border-slate-700 shadow-md"
              priority
            />
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
              {member!.full_name}
            </h1>

            {member!.role && (
              <p className="font-mono text-sm tracking-wide text-sky-300 font-medium">
                {member!.role}
              </p>
            )}

            {(member!.department || member!.batch_year) && (
              <p className="font-mono text-xs text-slate-400 pt-1">
                {[
                  member!.department,
                  member!.batch_year ? `Batch of ${member!.batch_year}` : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
          </div>
        </header>

        {/* Ruled Rows with Mono Labels */}
        <dl className="divide-y divide-slate-800/80">
          {/* Society / Portfolio Row (from member_roles, label tier as Branch or Society) */}
          {roles.length > 0 && (
            <div className="py-5 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8">
              <dt className="font-mono text-xs text-slate-400 uppercase tracking-wider shrink-0 w-36 sm:w-44">
                Society / Portfolio
              </dt>
              <dd className="flex-1 space-y-2">
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
                      className="font-mono text-xs text-slate-200 flex flex-wrap items-center gap-2"
                    >
                      <span className="font-semibold text-sky-400 uppercase tracking-wide">
                        {tierLabel}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span>{r.role_title}</span>
                      {roleTenure && (
                        <span className="text-slate-400 font-normal">({roleTenure})</span>
                      )}
                    </div>
                  );
                })}
              </dd>
            </div>
          )}

          {/* Tenure Row */}
          {tenureDisplay && (
            <div className="py-5 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8">
              <dt className="font-mono text-xs text-slate-400 uppercase tracking-wider shrink-0 w-36 sm:w-44">
                Tenure
              </dt>
              <dd className="flex-1 font-mono text-xs text-slate-200 tabular-nums">
                {tenureDisplay}
              </dd>
            </div>
          )}

          {/* Bio Row (rendered only when present) */}
          {member!.bio && member!.bio.trim() && (
            <div className="py-5 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8">
              <dt className="font-mono text-xs text-slate-400 uppercase tracking-wider shrink-0 w-36 sm:w-44">
                Biography
              </dt>
              <dd className="flex-1 text-sm leading-relaxed text-slate-200 max-w-xl">
                {member!.bio}
              </dd>
            </div>
          )}

          {/* Technical Interests Row */}
          {member!.interests && member!.interests.length > 0 && (
            <div className="py-5 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8">
              <dt className="font-mono text-xs text-slate-400 uppercase tracking-wider shrink-0 w-36 sm:w-44">
                Technical Interests
              </dt>
              <dd className="flex-1 flex flex-wrap gap-2">
                {member!.interests.map((interest) => (
                  <span
                    key={interest}
                    className="font-mono text-xs px-2.5 py-1 border border-slate-700 rounded bg-slate-950 text-slate-300"
                  >
                    {interest}
                  </span>
                ))}
              </dd>
            </div>
          )}

          {/* Contributions Row */}
          {member!.contributions && member!.contributions.trim() && (
            <div className="py-5 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8">
              <dt className="font-mono text-xs text-slate-400 uppercase tracking-wider shrink-0 w-36 sm:w-44">
                Contributions
              </dt>
              <dd className="flex-1 text-sm leading-relaxed whitespace-pre-line text-slate-200 max-w-xl">
                {member!.contributions}
              </dd>
            </div>
          )}

          {/* Milestones Row */}
          {memberMilestones.length > 0 && (
            <div className="py-5 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8">
              <dt className="font-mono text-xs text-slate-400 uppercase tracking-wider shrink-0 w-36 sm:w-44">
                Linked Milestones
              </dt>
              <dd className="flex-1 space-y-2.5">
                {memberMilestones.map((m) => {
                  const roleInMilestone = milestoneRoleMap.get(m.id);
                  return (
                    <div key={m.id} className="text-sm flex items-baseline gap-2">
                      <MilestoneIcon className="h-3.5 w-3.5 text-sky-400 shrink-0 self-center" />
                      <Link
                        href={`/milestones/${m.id}`}
                        className="font-medium text-white hover:text-sky-300 underline underline-offset-4 transition-colors"
                      >
                        {m.title}
                      </Link>
                      {roleInMilestone && (
                        <span className="font-mono text-xs text-slate-400">
                          ({roleInMilestone})
                        </span>
                      )}
                      {(m.date || m.milestone_year) && (
                        <span className="font-mono text-xs text-slate-400">
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
          <p className="font-mono text-xs text-slate-400 italic pt-6 pb-2 border-t border-slate-800/80 mt-2">
            Further profile details will appear when they are confirmed.
          </p>
        )}
      </article>
    </main>
  );
}
