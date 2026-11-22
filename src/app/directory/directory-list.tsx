"use client";

import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Search,
  ArrowRight,
  LayoutGrid,
  List,
  RotateCcw,
} from "lucide-react";
import type { PublicMember, MemberRole, Society } from "@/lib/validation";
import { MemberAvatar } from "@/components/ui/member-avatar";
import { Input } from "@/components/ui/input";
import { OFFICIAL_ROSTER_MEMBERS } from "@/lib/official-roster";

interface DirectoryListProps {
  initialMembers: PublicMember[];
  initialRoles?: MemberRole[];
  initialSocieties?: Society[];
  initialSearchParams?: { [key: string]: string | string[] | undefined };
  isConfigured: boolean;
}

export interface CombinedDirectoryItem {
  id: string;
  fullName: string;
  designation: string;
  category: string;
  portfolio: string;
  societySlug?: string;
  photoUrl: string;
  isPublished: boolean;
  publishedRecord?: PublicMember;
  roles?: MemberRole[];
}

export function DirectoryList({
  initialMembers,
  initialRoles = [],
  initialSearchParams = {},
}: DirectoryListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Helper to resolve parameter
  const getParam = (key: string, fallback = "all"): string => {
    const fromUrl = searchParams.get(key);
    if (fromUrl !== null) return fromUrl;
    const fromInitial = initialSearchParams[key];
    if (typeof fromInitial === "string") return fromInitial;
    return fallback;
  };

  const societyFilter = getParam("society", "all");
  const categoryFilter = getParam("category", "all");
  const roleFilter = getParam("role", "all");

  const [searchInput, setSearchInput] = useState(() => {
    const fromUrl = searchParams.get("search");
    if (fromUrl !== null) return fromUrl;
    const fromInitial = initialSearchParams.search;
    if (typeof fromInitial === "string") return fromInitial;
    return "";
  });

  const searchQuery = searchInput.trim().toLowerCase();

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

  // Build lookup maps
  const rolesByMember = useMemo(() => {
    const map = new Map<string, MemberRole[]>();
    initialRoles.forEach((role) => {
      const existing = map.get(role.member_id) ?? [];
      existing.push(role);
      map.set(role.member_id, existing);
    });
    return map;
  }, [initialRoles]);

  const publishedMap = useMemo(() => {
    return new Map<string, PublicMember>(initialMembers.map((m) => [m.id, m]));
  }, [initialMembers]);

  // Combine official 21 members + any additional published records
  const allDirectoryItems = useMemo<CombinedDirectoryItem[]>(() => {
    const items: CombinedDirectoryItem[] = [];
    const seenIds = new Set<string>();

    // 1. All 21 official committee members
    OFFICIAL_ROSTER_MEMBERS.forEach((m) => {
      seenIds.add(m.id);
      const pub = publishedMap.get(m.id);
      items.push({
        id: m.id,
        fullName: m.fullName,
        designation: m.designation,
        category: m.category,
        portfolio: m.portfolio,
        societySlug: m.societySlug,
        photoUrl: m.localPhotoUrl,
        isPublished: !!pub,
        publishedRecord: pub,
        roles: rolesByMember.get(m.id) ?? [],
      });
    });

    // 2. Any additional confirmed members from database
    initialMembers.forEach((pub) => {
      if (!seenIds.has(pub.id)) {
        seenIds.add(pub.id);
        items.push({
          id: pub.id,
          fullName: pub.full_name,
          designation: pub.role ?? "Member",
          category: "Verified Archive Record",
          portfolio: pub.department ? `${pub.department} · Batch ${pub.batch_year ?? ""}` : "Archive Record",
          photoUrl: pub.photo_url ?? "",
          isPublished: true,
          publishedRecord: pub,
          roles: rolesByMember.get(pub.id) ?? [],
        });
      }
    });

    return items;
  }, [publishedMap, rolesByMember, initialMembers]);

  // Filter items
  const filteredItems = useMemo(() => {
    return allDirectoryItems.filter((item) => {
      // Search query filter
      if (searchQuery) {
        const matchesName = item.fullName.toLowerCase().includes(searchQuery);
        const matchesRole = item.designation.toLowerCase().includes(searchQuery);
        const matchesPortfolio = item.portfolio.toLowerCase().includes(searchQuery);
        if (!matchesName && !matchesRole && !matchesPortfolio) {
          return false;
        }
      }

      // Society filter
      if (societyFilter !== "all") {
        if (societyFilter === "branch") {
          if (item.category === "Society Officers") return false;
        } else {
          if (item.societySlug !== societyFilter) return false;
        }
      }

      // Category filter
      if (categoryFilter !== "all") {
        if (item.category !== categoryFilter) return false;
      }

      // Role filter
      if (roleFilter !== "all") {
        const lowerDesig = item.designation.toLowerCase();
        if (roleFilter === "chair" && !lowerDesig.includes("chair")) return false;
        if (roleFilter === "secretary" && !lowerDesig.includes("secretary")) return false;
        if (roleFilter === "treasurer" && !lowerDesig.includes("treasurer")) return false;
        if (roleFilter === "coordinator" && !lowerDesig.includes("coordinator")) return false;
      }

      return true;
    });
  }, [allDirectoryItems, searchQuery, societyFilter, categoryFilter, roleFilter]);

  const hasActiveFilters =
    searchQuery !== "" ||
    societyFilter !== "all" ||
    categoryFilter !== "all" ||
    roleFilter !== "all";

  const clearAllFilters = () => {
    setSearchInput("");
    router.replace(pathname, { scroll: false });
  };

  return (
    <div className="space-y-8">
      {/* ── Search & Filter Controls ── */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search by member name, designation, or chapter..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                updateUrl({ search: e.target.value });
              }}
              className="pl-10 bg-slate-950/80 border-slate-700/80 text-white placeholder:text-slate-400 font-sans text-sm focus-visible:ring-sky-500 h-10"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950 p-1">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex h-8 w-8 items-center justify-center rounded ${
                  viewMode === "grid"
                    ? "bg-slate-800 text-sky-400 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex h-8 w-8 items-center justify-center rounded ${
                  viewMode === "list"
                    ? "bg-slate-800 text-sky-400 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Dropdowns Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80 font-mono text-xs">
          {/* Society Chapter Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Society:</span>
            <select
              value={societyFilter}
              onChange={(e) => updateUrl({ society: e.target.value })}
              className="h-8 rounded border border-slate-700 bg-slate-950 px-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
              aria-label="Filter by society"
            >
              <option value="all">All Societies &amp; Portfolios</option>
              <option value="branch">Branch Executive Only</option>
              <option value="ieee-cs">Computer Society (CS)</option>
              <option value="ieee-wie">Women in Engineering (WIE)</option>
              <option value="ieee-cass">Circuits &amp; Systems (CASS)</option>
              <option value="ieee-ras">Robotics &amp; Automation (RAS)</option>
              <option value="ieee-grss">Geoscience &amp; Remote (GRSS)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => updateUrl({ category: e.target.value })}
              className="h-8 rounded border border-slate-700 bg-slate-950 px-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              <option value="Executive Leadership">Executive Leadership</option>
              <option value="Coordination & Editorial">Coordination &amp; Editorial</option>
              <option value="Society Officers">Society Officers</option>
            </select>
          </div>

          {/* Role / Designation Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Designation:</span>
            <select
              value={roleFilter}
              onChange={(e) => updateUrl({ role: e.target.value })}
              className="h-8 rounded border border-slate-700 bg-slate-950 px-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
              aria-label="Filter by designation"
            >
              <option value="all">All Designations</option>
              <option value="chair">Chairs &amp; Vice Chairs</option>
              <option value="secretary">Secretaries</option>
              <option value="treasurer">Treasurers</option>
              <option value="coordinator">Coordinators &amp; Leads</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 text-sky-400 hover:text-sky-300 ml-auto cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Results Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 font-mono text-xs text-slate-400">
        <div>
          Showing <span className="font-semibold text-white">{filteredItems.length}</span>{" "}
          of {allDirectoryItems.length} official members &amp; indexed records
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
            <span>Executive Committee (2025–2026)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-sky-400 inline-block" />
            <span>Verified Profile</span>
          </span>
        </div>
      </div>

      {/* ── Content View: Grid or List ── */}
      {filteredItems.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-4">
          <p className="font-mono text-sm text-slate-300">
            No committee members or archive records matched your search query.
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-500 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Clear Active Filters</span>
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        /* Visual Card Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-700 hover:shadow-lg hover:shadow-sky-950/40"
            >
              <div>
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <MemberAvatar
                      name={item.fullName}
                      photoUrl={item.photoUrl}
                      size="lg"
                      className="border border-slate-700 group-hover:border-sky-500 transition-colors"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                      <span className="inline-block rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700/60 truncate max-w-full">
                        {item.portfolio}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white text-sm truncate group-hover:text-sky-300 transition-colors">
                      {item.fullName}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 leading-snug line-clamp-2">
                      {item.designation}
                    </p>
                  </div>
                </div>

                {item.publishedRecord?.bio && (
                  <p className="mt-3 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {item.publishedRecord.bio}
                  </p>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <Link
                  href={`/directory/${item.id}`}
                  className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold"
                >
                  <span>View Profile</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>

                {item.societySlug && (
                  <Link
                    href={`/societies/${item.societySlug}`}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {item.societySlug.replace("ieee-", "").toUpperCase()}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List / Ruled Indexed View */
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40">
          <ul className="divide-y divide-slate-800" role="list">
            {filteredItems.map((item, idx) => {
              const indexNumber = String(idx + 1).padStart(3, "0");

              return (
                <li
                  key={item.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="font-mono text-xs text-slate-400 tabular-nums w-7 shrink-0 text-right">
                      {indexNumber}
                    </span>

                    <MemberAvatar
                      name={item.fullName}
                      photoUrl={item.photoUrl}
                      size="sm"
                      className="shrink-0"
                    />

                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-white text-sm group-hover:text-sky-300 transition-colors truncate">
                          {item.fullName}
                        </span>
                        <span className="font-mono text-xs text-slate-400 truncate hidden sm:inline">
                          — {item.designation}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400 block sm:hidden">
                        {item.designation}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 ml-11 sm:ml-0 font-mono text-xs">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                      {item.portfolio}
                    </span>

                    <Link
                      href={`/directory/${item.id}`}
                      className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 text-xs font-semibold"
                    >
                      <span>Profile</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
