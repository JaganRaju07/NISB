import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { MemberAvatar, Footer } from "@/components/ui";
import {
  getPublicSocietyBySlug,
  getPublicMemberRoles,
  getPublicMembers,
  getPublicMilestones,
} from "@/lib/archive";
import { formatTenure } from "@/lib/archive-helpers";

interface SocietyDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: SocietyDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: society } = await getPublicSocietyBySlug(slug);

  if (!society) {
    return { title: "Society Not Found — NISB Archive" };
  }

  return {
    title: `${society.name} — NISB Societies`,
    description: society.description
      ? society.description.slice(0, 160)
      : `Archival record for ${society.name} at NIE IEEE Student Branch.`,
  };
}

export default function SocietyDetailPage({
  params,
}: SocietyDetailProps) {
  return (
    <div className="flex flex-1 flex-col">
      <Suspense
        fallback={
          <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10 md:px-12">
            <div className="border border-border rounded-sm bg-paper p-10 text-center">
              <p className="font-mono text-sm text-muted">Loading society record...</p>
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

  const [societyRes, rolesRes, membersRes, milestonesRes] = await Promise.all([
    getPublicSocietyBySlug(slug),
    getPublicMemberRoles(),
    getPublicMembers(),
    getPublicMilestones(),
  ]);

  if (!societyRes.isConfigured) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 md:px-12">
        <Link
          href="/societies"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
          Societies & Chapters
        </Link>
        <div className="border border-border rounded-sm bg-paper p-10 text-center">
          <p className="font-mono text-sm text-muted">
            Archive database client in standby mode. Society records will appear here once connected.
          </p>
        </div>
      </main>
    );
  }

  const society = societyRes.data;
  if (!society) {
    notFound();
  }

  const memberMap = new Map(membersRes.data.map((m) => [m.id, m]));

  // Find people associated with this society via member_roles
  const societyRoles = rolesRes.data.filter(
    (r) => r.society_id === society.id
  );

  const people = societyRoles
    .map((role) => {
      const member = memberMap.get(role.member_id);
      if (!member) return null;
      return {
        roleId: role.id,
        memberId: member.id,
        fullName: member.full_name,
        photoUrl: member.photo_url,
        roleTitle: role.role_title,
        tenure: formatTenure(role.start_year, role.end_year),
        isCurrent: role.is_current,
      };
    })
    .filter(Boolean);

  // Find milestones associated with this society
  const societyMilestones = milestonesRes.data.filter(
    (m) => m.society_id === society.id
  );

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10 md:px-12">
      {/* Back Link */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <Link
          href="/societies"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted hover:text-accent transition-colors"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
          Societies & Chapters
        </Link>
      </nav>

      {/* Society Overview Article */}
      <article className="border border-border rounded-sm bg-paper p-6 sm:p-10 space-y-10">
        {/* Header */}
        <header className="space-y-3 pb-8 border-b border-border">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] tracking-widest text-muted uppercase">
              Society Chapter Archive
            </span>
            {society.short_name && (
              <span className="font-mono text-xs px-2 py-0.5 border border-border rounded-sm text-muted">
                {society.short_name}
              </span>
            )}
            {society.established_year && (
              <span className="font-mono text-xs text-muted">
                Est. {society.established_year}
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            {society.name}
          </h1>

          {society.description && (
            <p className="font-sans text-base leading-relaxed text-foreground/90 max-w-2xl pt-2">
              {society.description}
            </p>
          )}

          {society.website_url && (
            <div className="pt-2">
              <a
                href={society.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:underline"
              >
                Visit Chapter Website
                <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
              </a>
            </div>
          )}
        </header>

        {/* People Behind This Society (via member_roles) */}
        <section aria-labelledby="chapter-people-heading" className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2
              id="chapter-people-heading"
              className="font-display text-2xl font-semibold text-foreground tracking-tight"
            >
              Leadership &amp; Members
            </h2>
            <span className="font-mono text-xs text-muted">
              {people.length} indexed tenure{people.length === 1 ? "" : "s"}
            </span>
          </div>

          {people.length === 0 ? (
            <div className="border border-border rounded-sm p-6 text-center">
              <p className="font-mono text-xs text-muted italic">
                No committee members indexed yet for this society.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border border-y border-border" role="list">
              {people.map((person) => {
                if (!person) return null;
                return (
                  <li
                    key={person.roleId}
                    className="py-3.5 px-2 flex items-center justify-between gap-4 transition-colors hover:bg-black/[0.02]"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <MemberAvatar
                        name={person.fullName}
                        photoUrl={person.photoUrl}
                        size="sm"
                        className="shrink-0"
                      />
                      <div className="min-w-0">
                        <Link
                          href={`/directory/${person.memberId}`}
                          className="font-display font-medium text-foreground hover:text-accent transition-colors truncate block"
                        >
                          {person.fullName}
                        </Link>
                        <span className="font-mono text-xs text-muted block mt-0.5">
                          {person.roleTitle}
                        </span>
                      </div>
                    </div>

                    {person.tenure && (
                      <span className="font-mono text-xs text-muted tabular-nums shrink-0">
                        {person.tenure}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Society Milestones */}
        <section aria-labelledby="chapter-milestones-heading" className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2
              id="chapter-milestones-heading"
              className="font-display text-2xl font-semibold text-foreground tracking-tight"
            >
              Chapter Milestones
            </h2>
            <span className="font-mono text-xs text-muted">
              {societyMilestones.length} milestone{societyMilestones.length === 1 ? "" : "s"}
            </span>
          </div>

          {societyMilestones.length === 0 ? (
            <div className="border border-border rounded-sm p-6 text-center">
              <p className="font-mono text-xs text-muted italic">
                No milestones recorded for this chapter yet.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border border-y border-border" role="list">
              {societyMilestones.map((m) => (
                <li
                  key={m.id}
                  className="py-4 px-2 space-y-1.5 transition-colors hover:bg-black/[0.02]"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {m.date && (
                      <time className="font-mono text-xs text-muted tracking-wider uppercase">
                        {m.date}
                      </time>
                    )}
                    {m.milestone_year && !m.date && (
                      <time className="font-mono text-xs text-muted tracking-wider">
                        Year {m.milestone_year}
                      </time>
                    )}
                    {m.category && (
                      <span className="font-mono text-[10px] px-2 py-0.5 border border-border rounded-sm text-muted">
                        {m.category}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-lg font-medium text-foreground">
                    <Link
                      href={`/milestones/${m.id}`}
                      className="hover:text-accent transition-colors"
                    >
                      {m.title}
                    </Link>
                  </h3>

                  {m.description && (
                    <p className="font-sans text-sm text-muted leading-relaxed max-w-2xl line-clamp-2">
                      {m.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </article>
    </main>
  );
}
