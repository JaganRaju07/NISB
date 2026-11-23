import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Users,
  Milestone,
  Landmark,
  ShieldCheck,
  ArrowRight,
  Database,
  CheckCircle2,
  FileCheck,
} from "lucide-react";
import {
  getAdminAuthStatus,
  getAdminDashboardStats,
  getAdminMembers,
  getAdminAccessDecision,
} from "@/lib/admin";
import { StatusBadge } from "@/components/admin/status-badge";

export const instant = false;

export default async function AdminDashboardPage() {
  const auth = await getAdminAuthStatus();
  const decision = getAdminAccessDecision({
    isConfigured: auth.isConfigured,
    isAdmin: auth.isAdmin,
    nodeEnv: process.env.NODE_ENV,
  });

  if (decision === "redirect") {
    redirect("/admin/login");
  }

  const [stats, recentMembersRes] = await Promise.all([
    getAdminDashboardStats(),
    getAdminMembers(),
  ]);

  const recentMembers = recentMembersRes.data.slice(0, 6);

  return (
    <div className="mx-auto w-full max-w-6xl p-6 md:p-8 space-y-8">
      {/* Top Banner / Standby Warning */}
      {!auth.isConfigured && (
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
          <div className="flex items-start gap-3">
            <Database className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-mono text-sm font-bold uppercase text-amber-300">
                Admin Standby Mode Active
              </h3>
              <p className="font-sans text-xs text-amber-200/80 leading-relaxed">
                Supabase database credentials are not actively configured in <code className="text-amber-100">.env.local</code>.
                The admin dashboard is running in local standby mode. Configure{" "}
                <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and{" "}
                <code>SUPABASE_SERVICE_ROLE_KEY</code> to enable live database persistence.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="rounded border border-amber-500/40 bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300 uppercase tracking-wider">
            Administration
          </span>
          <h1 className="mt-2 font-mono text-3xl font-extrabold tracking-tight text-white">
            Management Console
          </h1>
          <p className="mt-1 font-sans text-sm text-slate-400 leading-relaxed">
            Administrative verification, member staging, and milestone chronological audit.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/members"
            className="btn-tactile-amber inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase"
          >
            <Users className="h-4 w-4" />
            <span>Manage Members</span>
          </Link>
          <Link
            href="/admin/milestones"
            className="btn-tactile-ghost inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase"
          >
            <Milestone className="h-4 w-4 text-sky-400" />
            <span>Manage Milestones</span>
          </Link>
        </div>
      </div>

      {/* ── Metric Cards Grid ── */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Members */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase text-slate-400">
              Member Records
            </span>
            <Users className="h-4 w-4 text-sky-400" />
          </div>
          <div className="font-mono text-3xl font-extrabold text-white">
            {stats.totalMembers}
          </div>
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-mono text-[11px] text-slate-400">
            <span>{stats.publishedMembers} Published</span>
            <span>{stats.draftMembers} Drafts</span>
          </div>
        </div>

        {/* Card 2: Verification Queue */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase text-slate-400">
              Audit Breakdown
            </span>
            <FileCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="font-mono text-3xl font-extrabold text-white">
            {stats.confirmedMembers}
            <span className="text-sm font-bold text-emerald-400 ml-1.5">Confirmed</span>
          </div>
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-mono text-[11px] text-slate-400">
            <span>{stats.sourceListedMembers} Source Listed</span>
            <span>{stats.pendingMembers} Pending</span>
          </div>
        </div>

        {/* Card 3: Milestones */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase text-slate-400">
              Milestones
            </span>
            <Milestone className="h-4 w-4 text-amber-400" />
          </div>
          <div className="font-mono text-3xl font-extrabold text-white">
            {stats.totalMilestones}
          </div>
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-mono text-[11px] text-slate-400">
            <span>{stats.publishedMilestones} Published</span>
            <span>{stats.draftMilestones} Staged</span>
          </div>
        </div>

        {/* Card 4: Chapters */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase text-slate-400">
              Societies
            </span>
            <Landmark className="h-4 w-4 text-sky-400" />
          </div>
          <div className="font-mono text-3xl font-extrabold text-white">
            {stats.totalSocieties}
          </div>
          <div className="pt-2 border-t border-slate-800 font-mono text-[11px] text-slate-400">
            Parent Branch &amp; Technical Chapters
          </div>
        </div>
      </div>

      {/* ── Action Navigation Jump Cards ── */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Link
          href="/admin/members"
          className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 hover:border-slate-700 transition-all group flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-sky-400 uppercase">
                Section 1
              </span>
              <span className="rounded border border-amber-500/40 bg-amber-500/20 px-1.5 py-0.2 font-mono text-[9px] font-bold text-amber-300 uppercase">
                21 Staged Entries
              </span>
            </div>
            <h2 className="font-mono text-xl font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors">
              Member Management →
            </h2>
            <p className="font-sans text-xs text-slate-400 leading-relaxed">
              Create, edit, audit, and assign branch or society tier roles. Review internal source notes.
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500 text-slate-950 font-bold group-hover:translate-x-1 transition-transform shrink-0">
            <ArrowRight className="h-5 w-5" />
          </div>
        </Link>

        <Link
          href="/admin/milestones"
          className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 hover:border-slate-700 transition-all group flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-sky-400 uppercase">
                Section 2
              </span>
              <span className="rounded border border-sky-500/40 bg-sky-500/20 px-1.5 py-0.2 font-mono text-[9px] font-bold text-sky-300 uppercase">
                Chronology
              </span>
            </div>
            <h2 className="font-mono text-xl font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors">
              Milestone Timeline Management →
            </h2>
            <p className="font-sans text-xs text-slate-400 leading-relaxed">
              Record historical milestones, link them to technical chapters, and enforce publication rules.
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-sky-500/40 bg-sky-600 text-white font-bold group-hover:translate-x-1 transition-transform shrink-0">
            <ArrowRight className="h-5 w-5" />
          </div>
        </Link>
      </div>

      {/* ── Archival Integrity Checklist ── */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <h3 className="font-mono text-sm font-bold uppercase text-white">
              Archival Integrity Invariants Status
            </h3>
          </div>
          <span className="rounded border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-300 uppercase">
            Active Enforcement
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 font-mono text-xs">
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Publication Integrity</span>
            </div>
            <p className="font-sans text-[11px] text-slate-400 leading-relaxed">
              <code className="text-sky-400">chk_members_publication_integrity</code> ensures records cannot be published unless verification is confirmed.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Security Barrier Views</span>
            </div>
            <p className="font-sans text-[11px] text-slate-400 leading-relaxed">
              <code className="text-sky-400">public_members</code> exposes confirmed data while completely concealing internal administrative notes.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Role Tier Consistency</span>
            </div>
            <p className="font-sans text-[11px] text-slate-400 leading-relaxed">
              <code className="text-sky-400">chk_member_roles_tier_consistency</code> strictly segregates branch executive vs chapter officer roles.
            </p>
          </div>
        </div>
      </div>

      {/* ── Recent Staged Entries Preview ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
            Recent Member Entries (Staged from official seed)
          </h3>
          <Link
            href="/admin/members"
            className="font-mono text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors"
          >
            {stats.totalMembers > 0 ? `View All (${stats.totalMembers}) →` : "View All →"}
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-[var(--surface)]">
          <table className="w-full text-left font-sans text-xs">
            <thead className="sticky top-0 z-10 border-b border-[var(--line)] bg-[var(--surface-2)] font-mono text-[11px] uppercase tracking-wider text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3">Member Name</th>
                <th className="px-4 py-3">Recorded Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Verification</th>
                <th className="px-4 py-3">Private Administrative Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {recentMembers.map((m) => (
                <tr key={m.id} className="hover:bg-[var(--surface-2)] transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-white">
                    {m.full_name}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-300">
                    {m.role || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge type="status" value={m.status} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge type="verification" value={m.verification_status} />
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-400 max-w-[240px] truncate" title={m.source_note ?? undefined}>
                    {m.source_note || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
