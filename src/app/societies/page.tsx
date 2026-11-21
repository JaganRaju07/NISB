import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { PageHeader, Footer } from "@/components/ui";
import { getPublicSocieties, getPublicMemberRoles } from "@/lib/archive";

export const metadata: Metadata = {
  title: "Societies & Chapters — NISB People & Milestones",
  description: "Browse the societies, affinity groups, and chapters of NIE IEEE Student Branch.",
};

export default async function SocietiesPage() {
  const [societiesRes, rolesRes] = await Promise.all([
    getPublicSocieties(),
    getPublicMemberRoles(),
  ]);

  const societies = societiesRes.data;
  const roles = rolesRes.data;
  const isConfigured = societiesRes.isConfigured;

  // Group roles by society_id
  const rolesBySociety = new Map<string, number>();
  roles.forEach((r) => {
    if (r.society_id) {
      const count = rolesBySociety.get(r.society_id) ?? 0;
      rolesBySociety.set(r.society_id, count + 1);
    }
  });

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        backLabel="Home"
        backHref="/"
        eyebrow="NIE IEEE Student Branch"
        title="Societies & Chapters"
        description="Affinity groups and society chapters under NIE IEEE Student Branch, Mysuru."
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10 md:px-12">
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
                  className="py-6 px-2 transition-colors hover:bg-black/[0.02] space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <h2 className="font-display text-xl font-semibold text-foreground tracking-tight">
                        {society.name}
                      </h2>
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

                  {society.website_url && (
                    <div className="pt-1">
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
                </li>
              );
            })}
          </ul>
        )}
      </main>

      <Footer />
    </div>
  );
}
