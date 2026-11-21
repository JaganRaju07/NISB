"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import type { PublicMember, MemberRole } from "@/lib/validation";
import { Monogram } from "@/components/ui/monogram";
import { Input } from "@/components/ui/input";

interface DirectoryListProps {
  initialMembers: PublicMember[];
  initialRoles?: MemberRole[];
  isConfigured: boolean;
}

function MemberAvatar({
  name,
  photoUrl,
}: {
  name: string;
  photoUrl?: string | null;
}) {
  const [error, setError] = useState(false);

  if (!photoUrl || error) {
    return <Monogram name={name} size="md" />;
  }

  return (
    <Image
      src={photoUrl}
      alt={name}
      width={48}
      height={48}
      className="h-12 w-12 rounded-sm object-cover border border-border"
      unoptimized
      onError={() => setError(true)}
    />
  );
}

export function DirectoryList({
  initialMembers,
  initialRoles = [],
  isConfigured,
}: DirectoryListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");

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

  // Filter members based on user inputs
  const filteredMembers = useMemo(() => {
    return initialMembers.filter((member) => {
      // Search query filter (matches name, role, department, bio, interests, and member_roles)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = member.full_name.toLowerCase().includes(q);
        const matchesRole = member.role?.toLowerCase().includes(q) ?? false;
        const matchesDept = member.department?.toLowerCase().includes(q) ?? false;
        const matchesBio = member.bio?.toLowerCase().includes(q) ?? false;
        const matchesInterests =
          member.interests?.some((i) => i.toLowerCase().includes(q)) ?? false;

        const memberRoles = rolesByMember.get(member.id) ?? [];
        const matchesRolesList = memberRoles.some((r) =>
          r.role_title.toLowerCase().includes(q)
        );

        if (
          !matchesName &&
          !matchesRole &&
          !matchesDept &&
          !matchesBio &&
          !matchesInterests &&
          !matchesRolesList
        ) {
          return false;
        }
      }

      // Department filter
      if (departmentFilter !== "all" && member.department !== departmentFilter) {
        return false;
      }

      // Batch filter
      if (batchFilter !== "all" && member.batch_year !== batchFilter) {
        return false;
      }

      return true;
    });
  }, [initialMembers, searchQuery, departmentFilter, batchFilter, rolesByMember]);

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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            type="search"
            placeholder="Search by name, role, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-paper border-border font-sans text-sm focus-visible:ring-accent"
          />
        </div>

        <div className="flex items-center gap-3">
          {departments.length > 0 && (
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="h-9 px-3 py-1 bg-paper border border-border rounded-sm font-mono text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
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

          {batches.length > 0 && (
            <select
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="h-9 px-3 py-1 bg-paper border border-border rounded-sm font-mono text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
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
        {(searchQuery || departmentFilter !== "all" || batchFilter !== "all") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setDepartmentFilter("all");
              setBatchFilter("all");
            }}
            className="text-accent hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Ruled Indexed List */}
      {filteredMembers.length === 0 ? (
        <div className="border border-border rounded-sm p-10 text-center">
          <p className="font-mono text-sm text-muted">
            No members found matching the specified criteria.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border border-y border-border" role="list">
          {filteredMembers.map((member) => {
            const tenure = [member.tenure_start, member.tenure_end]
              .filter(Boolean)
              .join("–");
            const memberRoles = rolesByMember.get(member.id) ?? [];

            return (
              <li
                key={member.id}
                className="py-5 px-2 transition-colors hover:bg-black/[0.02] flex items-start gap-4"
              >
                {/* Photo or Monogram */}
                <div className="shrink-0 pt-0.5">
                  <MemberAvatar
                    name={member.full_name}
                    photoUrl={member.photo_url}
                  />
                </div>

                {/* Primary Metadata */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <h2 className="font-display text-lg font-semibold text-foreground tracking-tight">
                      {member.full_name}
                    </h2>
                    {tenure && (
                      <span className="font-mono text-xs text-muted tabular-nums shrink-0">
                        {tenure}
                      </span>
                    )}
                  </div>

                  {member.role && (
                    <p className="font-sans text-sm font-medium text-foreground/90 mt-0.5">
                      {member.role}
                    </p>
                  )}

                  {/* Verified Role Tiers */}
                  {memberRoles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {memberRoles.map((r) => {
                        const roleTenure = [r.start_year, r.end_year]
                          .filter(Boolean)
                          .join("–");
                        return (
                          <span
                            key={r.id}
                            className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 border border-border rounded-sm text-foreground/80 bg-black/[0.02]"
                          >
                            <span className="text-accent/90 uppercase font-semibold text-[9px] tracking-wider">
                              {r.tier}
                            </span>
                            <span>{r.role_title}</span>
                            {roleTenure && (
                              <span className="text-muted">({roleTenure})</span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {(member.department || member.batch_year) && (
                    <p className="font-mono text-xs text-muted mt-1.5">
                      {[
                        member.department,
                        member.batch_year ? `Batch of ${member.batch_year}` : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}

                  {member.bio && (
                    <p className="font-sans text-sm text-muted leading-relaxed mt-2 line-clamp-3">
                      {member.bio}
                    </p>
                  )}

                  {member.interests && member.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {member.interests.map((interest) => (
                        <span
                          key={interest}
                          className="font-mono text-[11px] px-2 py-0.5 border border-border rounded-sm text-muted bg-paper"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
