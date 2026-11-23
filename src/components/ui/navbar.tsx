"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { OFFICIAL_ROSTER_MEMBERS, OFFICIAL_SOCIETIES, OFFICIAL_PUBLICATIONS } from "@/lib/official-roster";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "People", href: "/directory" },
  { label: "Societies", href: "/societies" },
  { label: "Publications", href: "/about#collections" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/#contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  if (pathname.startsWith("/admin")) return null;
  const normalized = query.trim().toLowerCase();
  const results = normalized
    ? [
        ...OFFICIAL_ROSTER_MEMBERS.map((member) => ({
          title: member.fullName,
          subtitle: member.designation,
          href: `/directory/${member.id}`,
        })),
        ...OFFICIAL_SOCIETIES.map((society) => ({
          title: society.name,
          subtitle: society.shortName,
          href: `/societies/${society.slug}`,
        })),
        ...OFFICIAL_PUBLICATIONS.map((publication) => ({
          title: publication.title,
          subtitle: publication.periodicity,
          href: publication.externalLink ?? "/about#collections",
          external: Boolean(publication.externalLink),
        })),
      ].filter((item) =>
        `${item.title} ${item.subtitle}`.toLowerCase().includes(normalized)
      ).slice(0, 8)
    : [];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(248,248,245,0.96)]">
      <div className="site-container flex h-[72px] items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="NISB home">
          <Image src="/assets/images/Condensed---White-Circle.png" alt="" width={40} height={40} sizes="40px" priority className="h-10 w-10" />
          <span className="font-bold tracking-tight">NISB</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="link-slide text-sm text-[var(--body)] hover:text-[var(--accent)]">
              {item.label}
            </Link>
          ))}
          <button type="button" onClick={() => setSearchOpen(true)} className="chip" aria-haspopup="dialog" aria-label="Open search" title="Search (Command or Control K)">
            Search <span aria-hidden="true">⌘K</span>
          </button>
        </nav>
        <button
          type="button"
          className="chip md:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <nav id="mobile-navigation" className="border-t border-[var(--line)] bg-[var(--paper)] md:hidden" aria-label="Mobile navigation">
          <div className="site-container py-4">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className="block border-b border-[var(--line)] py-4 text-lg">
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-[rgba(11,18,32,0.18)] px-4 pt-[12vh]"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSearchOpen(false);
          }}
        >
          <div role="dialog" aria-modal="true" aria-label="Search NISB" className="card w-full max-w-xl bg-[var(--panel)] p-4">
            <div className="flex items-center gap-3 border-b border-[var(--line)] pb-3">
              <label htmlFor="global-search" className="mono-label shrink-0">Search</label>
              <input
                id="global-search"
                autoFocus
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="People, societies, publications"
                className="admin-input border-0 p-0 focus:outline-none"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="chip">Esc</button>
            </div>
            <div className="pt-3">
              {normalized && results.length === 0 && (
                <p className="px-2 py-8 text-center text-sm text-[var(--muted)]">No results found.</p>
              )}
              {results.map((item) => (
                "external" in item && item.external ? (
                  <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => setSearchOpen(false)} className="flex items-baseline justify-between border-b border-[var(--line)] px-2 py-3 last:border-0 hover:text-[var(--accent)]">
                    <span>{item.title}</span><span className="mono-label text-[10px] text-[var(--muted)]">{item.subtitle}</span>
                  </a>
                ) : (
                  <Link key={item.title} href={item.href} onClick={() => setSearchOpen(false)} className="flex items-baseline justify-between border-b border-[var(--line)] px-2 py-3 last:border-0 hover:text-[var(--accent)]">
                    <span>{item.title}</span><span className="mono-label text-[10px] text-[var(--muted)]">{item.subtitle}</span>
                  </Link>
                )
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
