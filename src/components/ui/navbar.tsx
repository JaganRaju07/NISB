"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Shield,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Directory", href: "/directory" },
  { label: "Milestones", href: "/milestones" },
  { label: "Societies & Chapters", href: "/societies" },
  { label: "About", href: "/about" },
];

function NavbarContent() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close mobile menu on route change without an effect
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Hide public navbar on admin pages (which have their own AdminHeader)
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md text-white transition-all">
      {/* Institutional Top Utility Bar */}
      <div className="border-b border-slate-900 bg-slate-950/60 px-4 py-1.5 sm:px-8 text-xs text-slate-400">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[11px] tracking-wide">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-200">NIE IEEE STUDENT BRANCH</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400">STB64141</span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400">IEEE Bangalore Section</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <a
              href="https://www.nisb.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              <span>Official Site</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <Link
              href="/admin/login"
              className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors"
            >
              <Shield className="h-3 w-3" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        {/* Brand Lockup */}
        <Link
          href="/"
          className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-sm"
          aria-label="NIE IEEE Student Branch Home"
        >
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 border border-slate-700/80 p-1 group-hover:border-sky-500 transition-colors shadow-sm">
            <Image
              src="/assets/images/Condensed---White-Circle.png"
              alt="NISB Official Emblem"
              width={36}
              height={36}
              className="h-8 w-8 object-contain"
              priority
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-white text-base md:text-lg">
                NISB
              </span>
              <span className="rounded bg-sky-500/20 px-1.5 py-0.2 text-[10px] font-mono font-medium text-sky-400 border border-sky-500/30">
                ARCHIVE
              </span>
            </div>
            <span className="font-mono text-[10px] text-slate-400 tracking-wider uppercase hidden sm:block">
              NIE IEEE Student Branch · Mysuru
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-1 text-sm font-medium"
          aria-label="Primary navigation"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3.5 py-1.5 rounded-md text-sm transition-all ${
                  active
                    ? "text-white font-semibold bg-slate-800/80 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-sky-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Affiliation */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/directory"
            className="flex items-center gap-1.5 rounded-md bg-sky-600 hover:bg-sky-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Search Directory</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 top-[97px] z-40 bg-slate-950/98 backdrop-blur-xl md:hidden overflow-y-auto px-6 py-8 border-t border-slate-800 animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="flex flex-col space-y-6 max-w-sm mx-auto">
            <div className="space-y-1">
              <p className="font-mono text-xs uppercase tracking-widest text-slate-500 px-3 pb-2">
                Archive Navigation
              </p>
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                      active
                        ? "bg-sky-600/20 text-sky-400 border border-sky-500/30"
                        : "text-slate-200 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <p className="font-mono text-xs uppercase tracking-widest text-slate-500 px-3">
                Administration
              </p>
              <Link
                href="/admin/login"
                className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300 hover:text-white"
              >
                <Shield className="h-4 w-4 text-amber-400" />
                <div className="flex flex-col">
                  <span className="font-medium">Admin</span>
                  <span className="text-xs text-slate-500 font-mono">Authenticate &amp; Manage Records</span>
                </div>
              </Link>
              <a
                href="https://www.nisb.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-2.5 text-xs text-slate-400 hover:text-white"
              >
                <span>Visit Main NISB Website</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="pt-4 border-t border-slate-800/60 font-mono text-center text-xs text-slate-500">
              NIE IEEE Student Branch · STB64141
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={<div className="h-24 w-full bg-slate-950 border-b border-slate-800" />}>
      <NavbarContent />
    </Suspense>
  );
}
