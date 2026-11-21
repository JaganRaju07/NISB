"use client";

import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import type { PublicMember, MemberRole, Society } from "@/lib/validation";
import { MemberAvatar } from "@/components/ui";
import { Input } from "@/components/ui/input";
import {
  filterDirectoryMembers,
  extractSocietyCodes,
} from "@/lib/archive-helpers";

interface DirectoryListProps {
  initialMembers: PublicMember[];
  initialRoles?: MemberRole[];
  initialSocieties?: Society[];
  initialSearchParams?: { [key: string]: string | string[] | undefined };
  isConfigured: boolean;
}

export function DirectoryList({
  initialMembers,
  initialRoles = [],
  initialSocieties = [],
  initialSearchParams = {},
  isConfigured,
}: DirectoryListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Helper to resolve parameter from URL searchParams, fallback to initialSearchParams, then fallback value
  const getParam = (key: string, fallback = "all"): string => {
    const fromUrl = searchParams.get(key);
    if (fromUrl !== null) return fromUrl;
    const fromInitial = initialSearchParams[key];
    if (typeof fromInitial === "string") return fromInitial;
    return fallback;
  };

  // Derive filters directly from URL searchParams
  const societyFilter = getParam("society", "all");
  const tierFilter = getParam("tier", "all");
  const departmentFilter = getParam("department", "all");
  const batchFilter = getParam("batch", "all");

  // Local state for search input typing responsiveness
  const [searchInput, setSearchInput] = useState(() => {
    const fromUrl = searchParams.get("search");
    if (fromUrl !== null) return fromUrl;
    const fromInitial = initialSearchParams.search;
    if (typeof fromInitial === "string") return fromInitial;
    return "";
  });

  // Effective search query is whatever is in searchInput
  const searchQuery = searchInput;

  // Update URL search parameters when filters change
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

  // Map member_id to their verified roles
  const rolesByMember = useMemo(() => {
    const map = new Map<string, MemberRole[]>();
    initialRoles.forEach((role) => {
      const existing = map.get(role.member_id) ?? [];
      existing.push(role);
      map.set(role.member_id, existing);
    });
    return map;
  }, [initialRoles]);

  // Map society id and slug
  const societyMap = useMemo(() => {
    return new Map<string, Society>(initialSocieties.map((s) => [s.id, s]));
  }, [initialSocieties]);

  // Extract unique departments and batches for filter dropdowns
  const departments = useMemo(() => {
    const set = new Set<string>();
    initialMembers.forEach((m) => {
      if (m.department && m.department.trim()) set.add(m.department.trim());
    });
    return Array.from(set).sort();
  }, [initialMembers]);

  const batches = useMemo(() => {
    const set = new Set<string>();
    initialMembers.forEach((m) => {
      if (m.batch_year && m.batch_year.trim()) set.add(m.batch_year.trim());
    });
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [initialMembers]);

  // Filter members using pure helper
  const filteredMembers = useMemo(() => {
    return filterDirectoryMembers(initialMembers, rolesByMember, societyMap, {
      searchQuery,
      department: departmentFilter,
      batch: batchFilter,
      society: societyFilter,
      tier: tierFilter,
    });
  }, [
    initialMembers,
    rolesByMember,
    societyMap,
    searchQuery,
    departmentFilter,
    batchFilter,
    societyFilter,
    tierFilter,
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    departmentFilter !== "all" ||
    batchFilter !== "all" ||
    societyFilter !== "all" ||
    tierFilter !== "all";

  const clearAllFilters = () => {
    setSearchInput("");
    router.replace(pathname, { scroll: false });
  };

  if (initialMembers.length === 0) {
    return (
      <div className="border border-border rounded-sm bg-paper p-10 text-center">
        <p className="font-mono text-sm text-muted">
          Member directory will appear here once data is seeded.
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
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-4 border-b border-border pb-6">
        {/* Search Input */}
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            type="search"
            placeholder="Search by name, role, department, or keyword..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              updateUrl({ search: e.target.value });
            }}
            className="pl-9 bg-paper border-border font-sans text-sm focus-visible:ring-accent"
          />
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Society Filter (via search params) */}
          {initialSocieties.length > 0 && (
            <select
              value={societyFilter}
              onChange={(e) => {
                updateUrl({ society: e.target.value });
              }}
              className="h-8 px-2.5 bg-paper border border-border rounded-sm font-mono text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
              aria-label="Filter by society"
            >
              <option value="all">All Societies</option>
              {initialSocieties.map((soc) => (
                <option key={soc.id} value={soc.slug}>
                  {soc.short_name || soc.name}
                </option>
              ))}
            </select>
          )}

          {/* Tier Filter (via search params) */}
          <select
            value={tierFilter}
            onChange={(e) => {
              updateUrl({ tier: e.target.value });
            }}
            className="h-8 px-2.5 bg-paper border border-border rounded-sm font-mono text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
            aria-label="Filter by tier"
          >
            <option value="all">All Tiers</option>
            <option value="branch">Branch</option>
            <option value="society">Society</option>
          </select>

          {/* Department Filter */}
          {departments.length > 0 && (
            <select
              value={departmentFilter}
              onChange={(e) => {
                updateUrl({ department: e.target.value });
              }}
              className="h-8 px-2.5 bg-paper border border-border rounded-sm font-mono text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
              aria-label="Filter by department"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          )}

          {/* Batch Filter */}
          {batches.length > 0 && (
            <select
              value={batchFilter}
              onChange={(e) => {
                updateUrl({ batch: e.target.value });
              }}
              className="h-8 px-2.5 bg-paper border border-border rounded-sm font-mono text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
              aria-label="Filter by batch year"
            >
              <option value="all">All Batches</option>
              {batches.map((batch) => (
                <option key={batch} value={batch}>
                  Batch {batch}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Results Count & Active Filter Indicator */}
      <div className="flex items-center justify-between text-xs font-mono text-muted">
        <span>
          Showing {filteredMembers.length} of {initialMembers.length} indexed records
        </span>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-accent hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Ruled Compact Indexed List */}
      {filteredMembers.length === 0 ? (
        <div className="border border-border rounded-sm p-10 text-center">
          <p className="font-mono text-sm text-muted">
            No members found matching the specified criteria.
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="font-mono text-xs text-accent hover:underline mt-2 cursor-pointer"
            >
              Clear active filters
            </button>
          )}
        </div>
      ) : (
        <ul className="divide-y divide-border border-y border-border" role="list">
          {filteredMembers.map((member, idx) => {
            const memberRoles = rolesByMember.get(member.id) ?? [];
            const societyCodes = extractSocietyCodes(memberRoles, societyMap);
            const indexNumber = String(idx + 1).padStart(3, "0");

            return (
              <li key={member.id}>
                <Link
                  href={`/directory/${member.id}`}
                  className="group flex items-center gap-3 sm:gap-4 py-3 px-3 transition-colors hover:bg-black/[0.02] focus-visible:outline-accent"
                >
                  {/* Index Number */}
                  <span className="font-mono text-xs text-muted tabular-nums w-7 shrink-0 text-right">
                    {indexNumber}
                  </span>

                  {/* Avatar */}
                  <MemberAvatar
                    name={member.full_name}
                    photoUrl={member.photo_url}
                    size="sm"
                    className="shrink-0"
                  />

                  {/* Name & Designation */}
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <div className="min-w-0 pr-2">
                      <span className="font-display text-base font-medium text-foreground group-hover:text-accent transition-colors truncate block">
                        {member.full_name}
                      </span>
                      {member.role && (
                        <span className="font-mono text-xs text-muted truncate block mt-0.5">
                          {member.role}
                        </span>
                      )}
                    </div>

                    {/* Society Codes */}
                    {societyCodes.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 shrink-0">
                        {societyCodes.map((code) => (
                          <span
                            key={code}
                            className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 border border-border rounded-sm text-muted bg-paper group-hover:border-accent/40 group-hover:text-foreground transition-colors"
                          >
                            {code}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
