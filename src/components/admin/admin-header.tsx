"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, ExternalLink, ShieldCheck, Database } from "lucide-react";
import { logoutAdminAction } from "@/lib/actions/admin-actions";

interface AdminHeaderProps {
  userEmail?: string | null;
  role?: string | null;
  isConfigured?: boolean;
}

export function AdminHeader({
  userEmail,
  role = "admin",
  isConfigured = true,
}: AdminHeaderProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/members", label: "Members Roster" },
    { href: "/admin/milestones", label: "Milestones Timeline" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-ink bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Left: Brand & Curator Tag */}
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center border-2 border-ink bg-primary font-mono text-xs font-bold text-white shadow-[2px_2px_0px_#141414]">
              N
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm font-bold tracking-tight text-ink">
                  NISB ARCHIVE
                </span>
                <span className="border border-ink bg-amber-400 px-1 py-0.2 font-mono text-[9px] font-bold text-ink uppercase">
                  Curator
                </span>
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 ml-6 border-l border-border pl-6" aria-label="Admin Navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
                  pathname === item.href
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: User Status & Actions */}
        <div className="flex items-center gap-3">
          {isConfigured ? (
            <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 border border-ink bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-900">
                <ShieldCheck className="h-3 w-3 text-emerald-700" />
                {role ?? "Admin"}
              </span>
              <span className="max-w-[160px] truncate text-ink font-medium" title={userEmail ?? undefined}>
                {userEmail}
              </span>
            </div>
          ) : (
            <span className="inline-flex items-center gap-1 border border-ink bg-amber-100 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-900">
              <Database className="h-3 w-3 text-amber-700" />
              Standby Mode
            </span>
          )}

          {/* Public Archive Link */}
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1 border border-border px-2.5 py-1 font-mono text-xs text-muted hover:text-ink hover:border-ink transition-colors"
          >
            <span>Public Site</span>
            <ExternalLink className="h-3 w-3" />
          </Link>

          {/* Sign Out Button */}
          {userEmail && (
            <form action={logoutAdminAction}>
              <button
                type="submit"
                className="btn-tactile-ghost inline-flex items-center gap-1 px-2.5 py-1 text-xs"
                title="Sign out of curator portal"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="flex md:hidden border-t border-border px-4 py-2 gap-2 overflow-x-auto bg-paper font-mono text-xs">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap px-2.5 py-1 border ${
              pathname === item.href
                ? "border-ink bg-amber-300 font-bold text-ink"
                : "border-border text-muted"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
