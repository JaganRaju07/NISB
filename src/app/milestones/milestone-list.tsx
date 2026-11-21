"use client";

import { useMemo, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type {
  PublicMilestone,
  Society,
  MilestoneMember,
  PublicMember,
} from "@/lib/validation";
import { filterPublicMilestones } from "@/lib/archive-helpers";

interface MilestoneListProps {
  initialMilestones: PublicMilestone[];
  initialSocieties: Society[];
  initialMilestoneMembers: MilestoneMember[];
  initialMembers: PublicMember[];
  initialSearchParams?: { [key: string]: string | string[] | undefined };
  isConfigured: boolean;
}

export function MilestoneList({
  initialMilestones,
  initialSocieties,
  initialMilestoneMembers,
  initialMembers,
  initialSearchParams = {},
  isConfigured,
}: MilestoneListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const getParam = (key: string): string => {
    const fromUrl = searchParams.get(key);
    if (fromUrl !== null) return fromUrl;
    const fromInitial = initialSearchParams[key];
    if (typeof fromInitial === "string") return fromInitial;
    return "all";
  };

  // Derive filters directly from URL searchParams
  const societyFilter = getParam("society");
  const yearFilter = getParam("year");

  const updateUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    startTransition(() => {
      router.replace(newUrl, { scroll: false });
    });
  };

  const societyMap = useMemo(() => {
    return new Map<string, Society>(initialSocieties.map((s) => [s.id, s]));
  }, [initialSocieties]);

  const memberMap = useMemo(() => {
    return new Map<string, PublicMember>(initialMembers.map((m) => [m.id, m]));
  }, [initialMembers]);

  // Group participants by milestone_id
  const participantsByMilestone = useMemo(() => {
    const map = new Map<
      string,
      Array<{ name: string; role?: string | null }>
    >();

    initialMilestoneMembers.forEach((mm) => {
      const member = memberMap.get(mm.member_id);
      if (!member) return;

      const list = map.get(mm.milestone_id) ?? [];
      list.push({
        name: member.full_name,
        role: mm.role_in_milestone,
      });
      map.set(mm.milestone_id, list);
    });

    return map;
  }, [initialMilestoneMembers, memberMap]);

  // Extract unique years from milestones
  const availableYears = useMemo(() => {
    const set = new Set<number>();
    initialMilestones.forEach((m) => {
      if (m.milestone_year) {
        set.add(m.milestone_year);
      } else if (m.date) {
        const y = parseInt(m.date.slice(0, 4), 10);
        if (!isNaN(y)) set.add(y);
      }
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [initialMilestones]);

  // Filter milestones with pure helper
  const filteredMilestones = useMemo(() => {
    return filterPublicMilestones(initialMilestones, {
      society: societyFilter,
      year: yearFilter,
      societyMap,
    });
  }, [initialMilestones, societyFilter, yearFilter, societyMap]);

  const hasActiveFilters = societyFilter !== "all" || yearFilter !== "all";

  const clearFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  // Base Empty State: when no milestones exist at all
  if (initialMilestones.length === 0) {
    return (
      <div className="border border-border rounded-sm bg-paper p-10 text-center">
        <p className="font-mono text-sm text-foreground">
          No milestones published yet.
        </p>
        {!isConfigured && (
          <p className="font-mono text-xs text-muted/70 mt-2">
            Archive database client in standby mode.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filters Bar: Society Chips & Year Dropdown */}
      <div className="border-b border-border pb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Society Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by society">
            <span className="font-mono text-[11px] text-muted uppercase tracking-wider mr-1">
              Society:
            </span>
            <button
              onClick={() => {
                updateUrl({ society: "all" });
              }}
              className={`font-mono text-xs px-2.5 py-1 border rounded-sm transition-colors cursor-pointer ${
                societyFilter === "all"
                  ? "border-foreground bg-foreground text-paper font-semibold"
                  : "border-border bg-paper text-muted hover:border-foreground/40 hover:text-foreground"
              }`}
            >
              All
            </button>

            {initialSocieties.map((s) => {
              const isActive = societyFilter === s.slug;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    const next = isActive ? "all" : s.slug;
                    updateUrl({ society: next });
                  }}
                  className={`font-mono text-xs px-2.5 py-1 border rounded-sm transition-colors cursor-pointer ${
                    isActive
                      ? "border-accent bg-accent text-white font-semibold"
                      : "border-border bg-paper text-muted hover:border-accent/50 hover:text-foreground"
                  }`}
                >
                  {s.short_name || s.name}
                </button>
              );
            })}
          </div>

          {/* Year Filter */}
          {availableYears.length > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              <label htmlFor="year-filter" className="font-mono text-[11px] text-muted uppercase tracking-wider">
                Year:
              </label>
              <select
                id="year-filter"
                value={yearFilter}
                onChange={(e) => {
                  updateUrl({ year: e.target.value });
                }}
                className="h-8 px-2.5 bg-paper border border-border rounded-sm font-mono text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="all">All Years</option>
                {availableYears.map((yr) => (
                  <option key={yr} value={String(yr)}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Results Counter & Clear Action */}
        <div className="flex items-center justify-between text-xs font-mono text-muted pt-1">
          <span>
            Showing {filteredMilestones.length} of {initialMilestones.length} milestone records
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-accent hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Filtered Empty State */}
      {filteredMilestones.length === 0 ? (
        <div className="border border-border rounded-sm bg-paper p-10 text-center space-y-2">
          <p className="font-mono text-sm text-foreground">
            No milestones found matching the selected society or year.
          </p>
          <button
            onClick={clearFilters}
            className="font-mono text-xs text-accent hover:underline cursor-pointer"
          >
            Clear active filters
          </button>
        </div>
      ) : (
        /* Timeline Items */
        <div className="relative border-l border-border pl-6 ml-3 space-y-10">
          {filteredMilestones.map((milestone) => {
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
                  className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full border border-border bg-paper group-hover:border-accent transition-colors"
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

                {/* Title (Link to Detail Page) */}
                <h2 className="font-display text-xl font-semibold text-foreground tracking-tight">
                  <Link
                    href={`/milestones/${milestone.id}`}
                    className="hover:text-accent transition-colors focus-visible:outline-accent"
                  >
                    {milestone.title}
                  </Link>
                </h2>

                {/* Description Snippet */}
                {milestone.description && (
                  <p className="font-sans text-sm text-muted leading-relaxed max-w-2xl line-clamp-2">
                    {milestone.description}
                  </p>
                )}

                {/* Optional Image */}
                {milestone.image_url && (
                  <div className="pt-2">
                    <Link href={`/milestones/${milestone.id}`} tabIndex={-1}>
                      <Image
                        src={milestone.image_url}
                        alt={milestone.title}
                        width={640}
                        height={360}
                        className="rounded-sm border border-border max-w-md max-h-60 object-cover"
                        unoptimized
                      />
                    </Link>
                  </div>
                )}

                {/* Personnel Preview */}
                {participants.length > 0 && (
                  <div className="pt-2 flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-[11px] text-muted uppercase tracking-wider">
                      Personnel:
                    </span>
                    {participants.slice(0, 5).map((p, idx) => (
                      <span
                        key={`${p.name}-${idx}`}
                        className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 border border-border rounded-sm bg-black/[0.02] text-foreground/85"
                      >
                        <span>{p.name}</span>
                        {p.role && <span className="text-muted">({p.role})</span>}
                      </span>
                    ))}
                    {participants.length > 5 && (
                      <span className="font-mono text-[11px] text-muted">
                        +{participants.length - 5} more
                      </span>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
