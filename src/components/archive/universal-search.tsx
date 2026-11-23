"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Users,
  Landmark,
  Milestone as MilestoneIcon,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Command,
  AlertCircle,
} from "lucide-react";
import { MemberAvatar } from "@/components/ui/member-avatar";

export type SearchCategory =
  | "all"
  | "members"
  | "societies"
  | "milestones"
  | "publications";

export interface UniversalSearchItem {
  id: string;
  category: "members" | "societies" | "milestones" | "publications";
  categoryLabel: string;
  title: string;
  subtitle: string;
  meta?: string | null;
  href: string;
  isExternal?: boolean;
  photoUrl?: string | null;
  badge?: string;
  provenance?: "confirmed" | "staged_roster" | "official";
}

interface UniversalSearchProps {
  items: UniversalSearchItem[];
  className?: string;
}

const CATEGORY_TABS: Array<{
  id: SearchCategory;
  label: string;
  icon: typeof Search;
}> = [
  { id: "all", label: "All", icon: Search },
  { id: "members", label: "People & Officers", icon: Users },
  { id: "societies", label: "Societies & Chapters", icon: Landmark },
  { id: "milestones", label: "Milestones", icon: MilestoneIcon },
  { id: "publications", label: "Publications", icon: BookOpen },
];

export function UniversalSearch({ items, className = "" }: UniversalSearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SearchCategory>("all");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // Global keyboard shortcut to focus search: '/' or 'Cmd+K' / 'Ctrl+K'
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        (e.key === "/" &&
          document.activeElement?.tagName !== "INPUT" &&
          document.activeElement?.tagName !== "TEXTAREA") ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter items based on query and activeTab
  const filteredItems = useMemo(() => {
    const trimmed = query.trim().toLowerCase();

    return items.filter((item) => {
      // Category tab match
      if (activeTab !== "all" && item.category !== activeTab) {
        return false;
      }

      // If query is empty, show nothing in dropdown (or top highlights if opened)
      if (!trimmed) {
        return false;
      }

      // Query match against title, subtitle, meta, and badge
      const matchesTitle = item.title.toLowerCase().includes(trimmed);
      const matchesSubtitle = item.subtitle.toLowerCase().includes(trimmed);
      const matchesMeta = item.meta?.toLowerCase().includes(trimmed);
      const matchesBadge = item.badge?.toLowerCase().includes(trimmed);

      return matchesTitle || matchesSubtitle || !!matchesMeta || !!matchesBadge;
    });
  }, [items, query, activeTab]);

  // Group filtered results by category
  const groupedResults = useMemo(() => {
    const groups: Record<string, UniversalSearchItem[]> = {
      members: [],
      societies: [],
      milestones: [],
      publications: [],
    };

    filteredItems.forEach((item) => {
      if (groups[item.category]) {
        groups[item.category].push(item);
      }
    });

    return groups;
  }, [filteredItems]);

  // Total counts per category across the full index
  const categoryCounts = useMemo(() => {
    const counts: Record<SearchCategory, number> = {
      all: items.length,
      members: 0,
      societies: 0,
      milestones: 0,
      publications: 0,
    };

    items.forEach((item) => {
      if (counts[item.category] !== undefined) {
        counts[item.category]++;
      }
    });

    return counts;
  }, [items]);

  // Handle keyboard navigation through search results
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || filteredItems.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredItems.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredItems.length - 1
        );
      } else if (e.key === "Enter") {
        if (selectedIndex >= 0 && selectedIndex < filteredItems.length) {
          e.preventDefault();
          const target = filteredItems[selectedIndex];
          if (target.isExternal) {
            window.open(target.href, "_blank", "noopener,noreferrer");
          } else {
            router.push(target.href);
          }
          setIsOpen(false);
        }
      }
    },
    [isOpen, filteredItems, selectedIndex, router]
  );

  const clearSearch = () => {
    setQuery("");
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-3xl mx-auto ${className}`}
      role="search"
      aria-label="Search NISB"
    >
      {/* ── Search Input Frame ── */}
      <div className="relative rounded-xl border border-slate-700/80 bg-slate-900/90 shadow-2xl backdrop-blur-md transition-all duration-200 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20">
        <div className="flex items-center px-4 py-3 sm:py-3.5">
          <Search className="h-5 w-5 text-sky-400 shrink-0 mr-3" />

          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-controls="universal-search-results"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search people, leadership, chapters, milestones, or publications..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-100 placeholder:text-slate-400 focus:outline-none font-sans"
          />

          <div className="flex items-center gap-2 shrink-0 ml-2">
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                aria-label="Clear search query"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <div className="hidden sm:inline-flex items-center gap-1 rounded border border-slate-700/80 bg-slate-950/70 px-2 py-0.5 font-mono text-[11px] text-slate-400">
              <Command className="h-3 w-3" />
              <span>K</span>
            </div>
          </div>
        </div>

        {/* ── Category Filter Tabs Row ── */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-t border-slate-800/80 px-3 py-2 text-xs font-mono scrollbar-none">
          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider px-1 shrink-0">
            Scope:
          </span>
          {CATEGORY_TABS.map((tab) => {
            const count = categoryCounts[tab.id];
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedIndex(-1);
                }}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-colors whitespace-nowrap text-[11px] font-medium ${
                  isActive
                    ? "bg-sky-500/15 border border-sky-500/40 text-sky-300"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <span>{tab.label}</span>
                {count > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[9px] ${
                      isActive
                        ? "bg-sky-400 text-slate-950 font-bold"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Dropdown Results Panel ── */}
      {isOpen && query.trim() !== "" && (
        <div
          id="universal-search-results"
          className="absolute top-full left-0 right-0 z-50 mt-2 max-h-[28rem] overflow-y-auto rounded-xl border border-slate-700/80 bg-slate-950/95 p-3 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center space-y-3 font-mono text-xs text-slate-400">
              <AlertCircle className="h-6 w-6 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-300 font-sans">
                No results found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Try searching by a member name (e.g. &ldquo;Sagar&rdquo;, &ldquo;Abhay&rdquo;), a chapter (&ldquo;CS&rdquo;, &ldquo;WIE&rdquo;, &ldquo;CASS&rdquo;), or publication title (&ldquo;MANAS&rdquo;, &ldquo;JIJNASA&rdquo;).
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Top Result Count Indicator */}
              <div className="flex items-center justify-between px-2 pt-1 font-mono text-[11px] text-slate-400 border-b border-slate-800/80 pb-2">
                <span>
                  Found <strong className="text-sky-400">{filteredItems.length}</strong> matching result{filteredItems.length === 1 ? "" : "s"}
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  Navigate with ↑ ↓ and press ↵ Enter
                </span>
              </div>

              {/* 1. People & Officers */}
              {groupedResults.members.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 px-2 font-mono text-[10px] font-bold uppercase tracking-wider text-sky-400">
                    <Users className="h-3 w-3" />
                    <span>People &amp; Officers ({groupedResults.members.length})</span>
                  </div>

                  <ul className="space-y-1">
                    {groupedResults.members.map((item) => {
                      const itemGlobalIndex = filteredItems.indexOf(item);
                      const isSelected = selectedIndex === itemGlobalIndex;

                      return (
                        <li key={item.id}>
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center justify-between gap-3 rounded-lg p-2.5 transition-colors ${
                              isSelected
                                ? "bg-sky-500/20 border border-sky-500/40 text-white"
                                : "hover:bg-slate-900 border border-transparent text-slate-200"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <MemberAvatar
                                name={item.title}
                                photoUrl={item.photoUrl}
                                size="sm"
                                className="border border-slate-700 shrink-0"
                              />

                              <div className="min-w-0">
                                <div className="flex items-baseline gap-2">
                                  <span className="font-semibold text-sm text-white truncate">
                                    {item.title}
                                  </span>
                                  {item.badge && (
                                    <span className="hidden sm:inline-block rounded bg-slate-800 px-1.5 py-0.2 font-mono text-[10px] text-slate-300 border border-slate-700">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="font-mono text-xs text-sky-400 truncate">
                                  {item.subtitle}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 font-mono text-xs text-slate-400">
                              <span className="hidden md:inline text-[11px]">
                                {item.meta}
                              </span>
                              <ArrowRight className="h-3.5 w-3.5 text-sky-400" />
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* 2. Societies & Chapters */}
              {groupedResults.societies.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 px-2 font-mono text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    <Landmark className="h-3 w-3" />
                    <span>Technical Societies ({groupedResults.societies.length})</span>
                  </div>

                  <ul className="space-y-1">
                    {groupedResults.societies.map((item) => {
                      const itemGlobalIndex = filteredItems.indexOf(item);
                      const isSelected = selectedIndex === itemGlobalIndex;

                      return (
                        <li key={item.id}>
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center justify-between gap-3 rounded-lg p-2.5 transition-colors ${
                              isSelected
                                ? "bg-amber-500/20 border border-amber-500/40 text-white"
                                : "hover:bg-slate-900 border border-transparent text-slate-200"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="relative h-8 w-8 rounded bg-slate-950 border border-slate-800 p-1 flex items-center justify-center shrink-0">
                                {item.photoUrl ? (
                                  <Image
                                    src={item.photoUrl}
                                    alt={item.title}
                                    width={24}
                                    height={24}
                                    sizes="24px"
                                    className="h-6 w-6 object-contain"
                                  />
                                ) : (
                                  <Landmark className="h-4 w-4 text-amber-400" />
                                )}
                              </div>

                              <div className="min-w-0">
                                <span className="font-semibold text-sm text-white truncate block">
                                  {item.title}
                                </span>
                                <p className="font-mono text-xs text-slate-400 truncate">
                                  {item.subtitle}
                                </p>
                              </div>
                            </div>

                            <ArrowRight className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* 3. Milestones */}
              {groupedResults.milestones.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 px-2 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    <MilestoneIcon className="h-3 w-3" />
                    <span>Historical Milestones ({groupedResults.milestones.length})</span>
                  </div>

                  <ul className="space-y-1">
                    {groupedResults.milestones.map((item) => {
                      const itemGlobalIndex = filteredItems.indexOf(item);
                      const isSelected = selectedIndex === itemGlobalIndex;

                      return (
                        <li key={item.id}>
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center justify-between gap-3 rounded-lg p-2.5 transition-colors ${
                              isSelected
                                ? "bg-emerald-500/20 border border-emerald-500/40 text-white"
                                : "hover:bg-slate-900 border border-transparent text-slate-200"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-500/10 text-emerald-400 shrink-0 font-mono text-xs font-bold border border-emerald-500/20">
                                {item.meta ?? "YR"}
                              </div>

                              <div className="min-w-0">
                                <span className="font-semibold text-sm text-white truncate block">
                                  {item.title}
                                </span>
                                <p className="font-mono text-xs text-slate-400 truncate">
                                  {item.subtitle}
                                </p>
                              </div>
                            </div>

                            <ArrowRight className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* 4. Publications & Print Collections */}
              {groupedResults.publications.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 px-2 font-mono text-[10px] font-bold uppercase tracking-wider text-sky-400">
                    <BookOpen className="h-3 w-3" />
                    <span>Publications ({groupedResults.publications.length})</span>
                  </div>

                  <ul className="space-y-1">
                    {groupedResults.publications.map((item) => {
                      const itemGlobalIndex = filteredItems.indexOf(item);
                      const isSelected = selectedIndex === itemGlobalIndex;

                      return (
                        <li key={item.id}>
                          <a
                            href={item.href}
                            target={item.isExternal ? "_blank" : undefined}
                            rel={item.isExternal ? "noopener noreferrer" : undefined}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center justify-between gap-3 rounded-lg p-2.5 transition-colors ${
                              isSelected
                                ? "bg-purple-500/20 border border-purple-500/40 text-white"
                                : "hover:bg-slate-900 border border-transparent text-slate-200"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="relative h-8 w-7 rounded overflow-hidden border border-slate-700 bg-slate-950 shrink-0">
                                {item.photoUrl ? (
                                  <Image
                                    src={item.photoUrl}
                                    alt={item.title}
                                    fill
                                    sizes="32px"
                                    className="object-cover"
                                  />
                                ) : (
                                  <BookOpen className="h-4 w-4 text-purple-400 m-auto" />
                                )}
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-baseline gap-2">
                                  <span className="font-semibold text-sm text-white truncate">
                                    {item.title}
                                  </span>
                                  <span className="rounded bg-purple-500/10 px-1.5 py-0.2 font-mono text-[10px] text-purple-300 border border-purple-500/20">
                                    {item.badge}
                                  </span>
                                </div>
                                <p className="font-mono text-xs text-slate-400 truncate">
                                  {item.subtitle}
                                </p>
                              </div>
                            </div>

                            <ExternalLink className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
