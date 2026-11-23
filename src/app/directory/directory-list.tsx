"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List, RotateCcw, Search } from "lucide-react";
import type { MemberRole, PublicMember, Society } from "@/lib/validation";
import { MemberAvatar } from "@/components/ui/member-avatar";
import { OFFICIAL_ROSTER_MEMBERS } from "@/lib/official-roster";

interface DirectoryListProps {
  initialMembers: PublicMember[];
  initialRoles?: MemberRole[];
  initialSocieties?: Society[];
  initialSearchParams?: Record<string, string | string[] | undefined>;
  isConfigured: boolean;
}

interface DirectoryItem {
  id: string;
  fullName: string;
  designation: string;
  category: string;
  portfolio: string;
  societySlug?: string;
  photoUrl: string;
  bio?: string | null;
}

export function DirectoryList({
  initialMembers,
  initialRoles = [],
  initialSocieties = [],
  initialSearchParams = {},
}: DirectoryListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "role" | "category">("name");

  const getParam = (key: string, fallback = "all") => {
    const urlValue = searchParams.get(key);
    if (urlValue !== null) return urlValue;
    const initialValue = initialSearchParams[key];
    return typeof initialValue === "string" ? initialValue : fallback;
  };

  const societyFilter = getParam("society");
  const categoryFilter = getParam("category");
  const roleFilter = getParam("role");
  const [searchInput, setSearchInput] = useState(() => {
    const urlValue = searchParams.get("search");
    if (urlValue !== null) return urlValue;
    const initialValue = initialSearchParams.search;
    return typeof initialValue === "string" ? initialValue : "";
  });

  const updateUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all") params.delete(key);
      else params.set(key, value);
    });
    const query = params.toString();
    startTransition(() => router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false }));
  };

  const rolesByMember = useMemo(() => {
    const map = new Map<string, MemberRole[]>();
    initialRoles.forEach((role) => {
      map.set(role.member_id, [...(map.get(role.member_id) ?? []), role]);
    });
    return map;
  }, [initialRoles]);

  const publishedMap = useMemo(
    () => new Map(initialMembers.map((member) => [member.id, member])),
    [initialMembers]
  );

  const allItems = useMemo<DirectoryItem[]>(() => {
    const seen = new Set<string>();
    const items: DirectoryItem[] = [];
    OFFICIAL_ROSTER_MEMBERS.forEach((member) => {
      seen.add(member.id);
      const published = publishedMap.get(member.id);
      items.push({
        id: member.id,
        fullName: member.fullName,
        designation: member.designation,
        category: member.category,
        portfolio: member.portfolio,
        societySlug: member.societySlug,
        photoUrl: member.localPhotoUrl,
        bio: published?.bio,
      });
    });
    initialMembers.forEach((member) => {
      if (!seen.has(member.id)) {
        items.push({
          id: member.id,
          fullName: member.full_name,
          designation: member.role ?? "Member",
          category: "Verified",
          portfolio: member.department ?? "Member",
          photoUrl: member.photo_url ?? "",
          bio: member.bio,
        });
      }
    });
    return items;
  }, [initialMembers, publishedMap]);

  const searchQuery = searchInput.trim().toLowerCase();
  const filteredItems = useMemo(() => {
    const items = allItems.filter((item) => {
      if (searchQuery && !`${item.fullName} ${item.designation} ${item.portfolio}`.toLowerCase().includes(searchQuery)) return false;
      if (societyFilter !== "all") {
        if (societyFilter === "branch") {
          if (item.category === "Society Officers") return false;
        } else if (item.societySlug !== societyFilter) return false;
      }
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
      if (roleFilter !== "all") {
        const designation = item.designation.toLowerCase();
        if (roleFilter === "chair" && !designation.includes("chair")) return false;
        if (roleFilter === "secretary" && !designation.includes("secretary")) return false;
        if (roleFilter === "treasurer" && !designation.includes("treasurer")) return false;
        if (roleFilter === "coordinator" && !designation.includes("coordinator")) return false;
      }
      return true;
    });
    return [...items].sort((a, b) => {
      if (sortBy === "role") return a.designation.localeCompare(b.designation);
      if (sortBy === "category") return a.category.localeCompare(b.category);
      return a.fullName.localeCompare(b.fullName);
    });
  }, [allItems, searchQuery, societyFilter, categoryFilter, roleFilter, sortBy]);

  const hasActiveFilters = searchQuery !== "" || societyFilter !== "all" || categoryFilter !== "all" || roleFilter !== "all";
  const clearAllFilters = () => {
    setSearchInput("");
    router.replace(pathname, { scroll: false });
  };

  return (
    <div className="space-y-8">
      <div className="sticky top-[72px] z-20 border border-[var(--line)] bg-[var(--panel)] p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-lg flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="search"
              value={searchInput}
              onChange={(event) => {
                setSearchInput(event.target.value);
                updateUrl({ search: event.target.value });
              }}
              placeholder="Search name, role or portfolio"
              className="admin-input pl-10"
              aria-label="Search people"
            />
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setViewMode("grid")} className="chip" aria-label="Grid view" aria-pressed={viewMode === "grid"}><LayoutGrid className="h-4 w-4" /></button>
            <button type="button" onClick={() => setViewMode("list")} className="chip" aria-label="List view" aria-pressed={viewMode === "list"}><List className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--line)] pt-4">
          <select value={societyFilter} onChange={(event) => updateUrl({ society: event.target.value })} className="admin-input w-auto" aria-label="Filter by society">
            <option value="all">Society: All</option>
            <option value="branch">Branch</option>
            <option value="ieee-cs">Computer Society</option>
            <option value="ieee-wie">Women in Engineering</option>
            <option value="ieee-cass">Circuits & Systems</option>
            <option value="ieee-ras">Robotics & Automation</option>
            <option value="ieee-grss">Geoscience & Remote Sensing</option>
            <option value="ieee-ceda">CEDA</option>
          </select>
          <select value={categoryFilter} onChange={(event) => updateUrl({ category: event.target.value })} className="admin-input w-auto" aria-label="Filter by category">
            <option value="all">Category: All</option>
            <option value="Executive Leadership">Executive Leadership</option>
            <option value="Coordination & Editorial">Coordination & Editorial</option>
            <option value="Society Officers">Society Officers</option>
          </select>
          <select value={roleFilter} onChange={(event) => updateUrl({ role: event.target.value })} className="admin-input w-auto" aria-label="Filter by role">
            <option value="all">Role: All</option>
            <option value="chair">Chair</option>
            <option value="secretary">Secretary</option>
            <option value="treasurer">Treasurer</option>
            <option value="coordinator">Coordinator</option>
          </select>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value as "name" | "role" | "category")} className="admin-input w-auto" aria-label="Sort people">
            <option value="name">Sort: Name</option>
            <option value="role">Sort: Role</option>
            <option value="category">Sort: Category</option>
          </select>
          {hasActiveFilters && (
            <button type="button" onClick={clearAllFilters} className="link-slide inline-flex items-center gap-2 text-sm text-[var(--accent)]">
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          )}
        </div>
      </div>

      <div className="mono-label flex items-center justify-between text-[10px] text-[var(--muted)]">
        <span>{filteredItems.length > 0 ? `Showing ${filteredItems.length} of ${allItems.length}` : "No matches"}</span>
        <span>2025–2026</span>
      </div>

      {filteredItems.length === 0 ? (
        <div className="border border-[var(--line)] bg-[var(--panel)] px-6 py-16 text-center">
          <p className="font-display text-3xl">No people found</p>
          {hasActiveFilters && <button type="button" onClick={clearAllFilters} className="button-secondary mt-6">Clear filters</button>}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map((item) => (
            <Link key={item.id} href={`/directory/${item.id}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden border border-[var(--line)] bg-[var(--panel)]">
                <MemberAvatar name={item.fullName} photoUrl={item.photoUrl} size="2xl" className="h-full w-full !rounded-none border-0 object-cover object-top" />
              </div>
              <h3 className="mt-4 font-display text-2xl">{item.fullName}</h3>
              <p className="mono-label mt-1 text-[10px] text-[var(--muted)]">{item.designation}</p>
              {item.societySlug && <p className="mt-2 text-xs text-[var(--accent)]">{item.portfolio}</p>}
            </Link>
          ))}
        </div>
      ) : (
        <div className="border-t border-[var(--line)]">
          {filteredItems.map((item) => (
            <Link key={item.id} href={`/directory/${item.id}`} className="group grid items-center gap-4 border-b border-[var(--line)] py-4 md:grid-cols-[56px_1fr_220px_80px]">
              <MemberAvatar name={item.fullName} photoUrl={item.photoUrl} size="sm" className="border border-[var(--line)]" />
              <div>
                <p className="font-display text-xl">{item.fullName}</p>
                <p className="mono-label mt-1 text-[10px] text-[var(--muted)]">{item.portfolio}</p>
              </div>
              <p className="text-sm text-[var(--body)]">{item.designation}</p>
              <span className="text-right text-[var(--accent)]">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
