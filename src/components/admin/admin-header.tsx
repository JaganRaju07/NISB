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
    { href: "/admin/members", label: "Members" },
    { href: "/admin/milestones", label: "Milestones Timeline" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--line)] bg-[rgba(10,15,28,0.72)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Left: Brand & Admin Tag */}
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded border border-sky-500/40 bg-sky-600 font-mono text-xs font-bold text-white shadow-sm transition-transform group-hover:scale-105">
              N
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm font-bold tracking-tight text-white">
                  NISB ADMIN
                </span>
                <span className="rounded border border-amber-500/40 bg-amber-500/20 px-1.5 py-0.2 font-mono text-[9px] font-bold text-amber-300 uppercase tracking-wider">
                  Admin
                </span>
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 ml-6 border-l border-slate-800 pl-6" aria-label="Admin Navigation">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
                    isActive
                      ? "border-b-2 border-sky-400 text-sky-400"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: User Status & Actions */}
        <div className="flex items-center gap-3">
          {isConfigured ? (
            <div className="hidden sm:flex items-center gap-2 font-mono text-xs">
              <span className="inline-flex items-center gap-1 rounded border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                {role ?? "Admin"}
              </span>
              <span className="max-w-[160px] truncate text-slate-300 font-medium" title={userEmail ?? undefined}>
                {userEmail}
              </span>
            </div>
          ) : (
            <span className="inline-flex items-center gap-1 rounded border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300">
              <Database className="h-3 w-3 text-amber-400" />
              Standby Mode
            </span>
          )}

          {/* Public site link */}
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1 rounded border border-slate-700 bg-slate-900 px-2.5 py-1 font-mono text-xs text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
          >
            <span>Public Site</span>
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </Link>

          {/* Sign Out Button */}
          {userEmail && (
            <form action={logoutAdminAction}>
              <button
                type="submit"
                className="btn-tactile-ghost inline-flex items-center gap-1 px-2.5 py-1 text-xs"
                title="Sign out of admin portal"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="flex md:hidden border-t border-slate-800 px-4 py-2 gap-2 overflow-x-auto bg-slate-950 font-mono text-xs">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap rounded px-2.5 py-1 border transition-colors ${
              pathname === item.href
                ? "border-sky-500/50 bg-sky-500/20 font-bold text-sky-300"
                : "border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
