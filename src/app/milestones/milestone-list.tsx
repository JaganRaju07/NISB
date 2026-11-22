"use client";

import { useMemo, useTransition } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Milestone as MilestoneIcon,
  Users,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
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
      if (m.milestone_year) set.add(m.milestone_year);
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [initialMilestones]);

  const filteredMilestones = useMemo(() => {
    return filterPublicMilestones(initialMilestones, {
      society: societyFilter,
      year: yearFilter,
    });
  }, [initialMilestones, societyFilter, yearFilter]);

  const hasActiveFilters = societyFilter !== "all" || yearFilter !== "all";

  const clearAllFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  // Dedicated institutional empty state when no milestones published yet
  if (initialMilestones.length === 0) {
    return (
      <div className="space-y-8">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <MilestoneIcon className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Branch Milestones Timeline
            </h2>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
            The archive is curating historical events, Region 10 awards, chapter establishments, and landmark editions of ANKURA, ADROIT, and Electronika from the past 25+ years.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/directory"
              className="rounded-md bg-sky-600 hover:bg-sky-500 px-4 py-2.5 text-xs font-semibold text-white transition-colors"
            >
              Browse Member Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Filter Controls ── */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            {/* Society Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Chapter:</span>
              <select
                value={societyFilter}
                onChange={(e) => updateUrl({ society: e.target.value })}
                className="h-8 rounded border border-slate-700 bg-slate-950 px-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
                aria-label="Filter by chapter"
              >
                <option value="all">All Chapters</option>
                <option value="branch">Branch Only</option>
                {initialSocieties.map((s) => (
                  <option key={s.id} value={s.slug}>
                    {s.short_name || s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            {availableYears.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Year:</span>
                <select
                  value={yearFilter}
                  onChange={(e) => updateUrl({ year: e.target.value })}
                  className="h-8 rounded border border-slate-700 bg-slate-950 px-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  aria-label="Filter by year"
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

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 text-sky-400 hover:text-sky-300 ml-2 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div className="font-mono text-xs text-slate-400">
            Showing <span className="font-semibold text-white">{filteredMilestones.length}</span>{" "}
            of {initialMilestones.length} milestone records
          </div>
        </div>
      </div>

      {/* ── Milestones Timeline Cards ── */}
      {filteredMilestones.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-3">
          <p className="font-mono text-sm text-slate-300">
            No milestones found matching the selected filter criteria.
          </p>
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-500 transition-colors"
          >
            Clear Active Filters
          </button>
        </div>
      ) : (
        <div className="relative border-l-2 border-slate-800 pl-6 sm:pl-8 space-y-8 ml-3">
          {filteredMilestones.map((m) => {
            const society = m.society_id ? societyMap.get(m.society_id) : null;
            const participants = participantsByMilestone.get(m.id) ?? [];

            return (
              <div
                key={m.id}
                className="group relative rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 hover:border-slate-700 transition-all shadow-sm"
              >
                {/* Node marker on timeline */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-7 h-4 w-4 rounded-full border-2 border-slate-950 bg-sky-500 shadow-sm" />

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-800/80 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {society ? (
                      <span className="rounded bg-sky-500/10 px-2 py-0.5 font-mono text-xs text-sky-400 border border-sky-500/20">
                        {society.short_name || society.name}
                      </span>
                    ) : (
                      <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-xs text-slate-300 border border-slate-700">
                        Branch Milestone
                      </span>
                    )}

                    <span className="font-mono text-xs text-slate-400">
                      {m.date || (m.milestone_year ? `Year ${m.milestone_year}` : "")}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <h3 className="font-display text-2xl font-bold text-white group-hover:text-sky-300 transition-colors">
                    <Link href={`/milestones/${m.id}`}>
                      {m.title}
                    </Link>
                  </h3>

                  {m.description && (
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {m.description}
                    </p>
                  )}
                </div>

                {/* People Behind This Milestone */}
                {participants.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-slate-800/80">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400 mb-2">
                      People Behind This Milestone
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {participants.map((p, pIdx) => (
                        <span
                          key={pIdx}
                          className="font-mono text-xs bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-slate-300 inline-flex items-center gap-1.5"
                        >
                          <Users className="h-3 w-3 text-sky-400" />
                          <span className="font-semibold text-white">{p.name}</span>
                          {p.role && <span className="text-slate-400">({p.role})</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <Link
                    href={`/milestones/${m.id}`}
                    className="inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-semibold"
                  >
                    <span>View Record Details</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
