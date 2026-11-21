import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { PageHeader, Footer, MemberAvatar } from "@/components/ui";
import {
  getPublicSocieties,
  getPublicMemberRoles,
  getPublicMembers,
} from "@/lib/archive";
import { formatTenure } from "@/lib/archive-helpers";

export const metadata: Metadata = {
  title: "Societies & Chapters — NISB People & Milestones",
  description:
    "Browse the societies, affinity groups, and chapters of NIE IEEE Student Branch.",
};

export default function SocietiesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        backLabel="Home"
        backHref="/"
        eyebrow="NIE IEEE Student Branch"
        title="Societies & Chapters"
        description="Affinity groups and society chapters under NIE IEEE Student Branch, Mysuru."
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10 md:px-12 space-y-12">
        <Suspense
          fallback={
            <div className="border border-border rounded-sm bg-paper p-10 text-center">
              <p className="font-mono text-sm text-muted">Loading societies...</p>
            </div>
          }
        >
          <SocietiesContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

async function SocietiesContent() {
  const [societiesRes, rolesRes, membersRes] = await Promise.all([
    getPublicSocieties(),
    getPublicMemberRoles(),
    getPublicMembers(),
  ]);

  const societies = societiesRes.data;
  const roles = rolesRes.data;
  const members = membersRes.data;
  const isConfigured = societiesRes.isConfigured;

  const memberMap = new Map(members.map((m) => [m.id, m]));

  // Extract branch-level roles (tier === 'branch')
  const branchRoles = roles
    .filter((r) => r.tier === "branch")
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

  // Group roles count by society_id
  const rolesBySociety = new Map<string, number>();
  roles.forEach((r) => {
    if (r.society_id) {
      const count = rolesBySociety.get(r.society_id) ?? 0;
      rolesBySociety.set(r.society_id, count + 1);
    }
  });

  return (
    <>
      {/* Branch-level Section */}
      <section aria-labelledby="branch-leadership-heading" className="space-y-4">
        <div className="flex items-baseline justify-between border-b border-border pb-3">
          <div>
            <h2
              id="branch-leadership-heading"
              className="font-display text-2xl font-semibold text-foreground tracking-tight"
            >
              Branch-level
            </h2>
            <p className="font-mono text-xs text-muted mt-0.5">
              Executive committee and branch office-bearers across tenures.
            </p>
          </div>
          <span className="font-mono text-xs text-muted">
            {branchRoles.length} indexed role{branchRoles.length === 1 ? "" : "s"}
          </span>
        </div>

        {branchRoles.length === 0 ? (
          <div className="border border-border rounded-sm bg-paper p-8 text-center">
            <p className="font-mono text-xs text-muted italic">
              Branch-level roles will appear here once indexed.
            </p>
            {!isConfigured && (
              <p className="font-mono text-[11px] text-muted/70 mt-1">
                Archive database client in standby mode.
              </p>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-border border-y border-border" role="list">
            {branchRoles.map((person) => {
              if (!person) return null;
              return (
                <li
                  key={person.roleId}
                  className="py-3 px-2 flex items-center justify-between gap-4 transition-colors hover:bg-black/[0.02]"
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

      {/* Societies & Technical Chapters Section */}
      <section aria-labelledby="technical-chapters-heading" className="space-y-4">
        <div className="flex items-baseline justify-between border-b border-border pb-3">
          <div>
            <h2
              id="technical-chapters-heading"
              className="font-display text-2xl font-semibold text-foreground tracking-tight"
            >
              Technical Chapters &amp; Affinity Groups
            </h2>
            <p className="font-mono text-xs text-muted mt-0.5">
              Specialized IEEE societies and affinity chapters operating within NISB.
            </p>
          </div>
          <span className="font-mono text-xs text-muted">
            {societies.length} indexed chapter{societies.length === 1 ? "" : "s"}
          </span>
        </div>

        {societies.length === 0 ? (
          <div className="border border-border rounded-sm bg-paper p-10 text-center">
            <p className="font-mono text-sm text-muted">
              Societies and chapter profiles will appear here once data is seeded.
            </p>
            {!isConfigured && (
              <p className="font-mono text-xs text-muted/70 mt-2">
                Archive database client in standby mode.
              </p>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-border border-y border-border" role="list">
            {societies.map((society) => {
              const roleCount = rolesBySociety.get(society.id) ?? 0;

              return (
                <li
                  key={society.id}
                  className="py-6 px-2 transition-colors hover:bg-black/[0.02] space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-xl font-semibold text-foreground tracking-tight">
                        <Link
                          href={`/societies/${society.slug}`}
                          className="hover:text-accent transition-colors"
                        >
                          {society.name}
                        </Link>
                      </h3>
                      {society.short_name && (
                        <span className="font-mono text-xs px-2 py-0.5 border border-border rounded-sm text-muted">
                          {society.short_name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs text-muted">
                      {society.established_year && (
                        <span>Est. {society.established_year}</span>
                      )}
                      {roleCount > 0 && (
                        <span>
                          {society.established_year ? "· " : ""}
                          {roleCount} indexed tenure{roleCount > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>

                  {society.description && (
                    <p className="font-sans text-sm text-muted leading-relaxed max-w-2xl">
                      {society.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <Link
                      href={`/societies/${society.slug}`}
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:underline"
                    >
                      View Chapter Archive
                      <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
                    </Link>

                    {society.website_url && (
                      <a
                        href={society.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-xs text-muted hover:text-foreground"
                      >
                        Official Website
                        <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
