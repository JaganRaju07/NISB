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
} from "@/lib/admin";
import { StatusBadge } from "@/components/admin/status-badge";

export default async function AdminDashboardPage() {
  const auth = await getAdminAuthStatus();

  // Redirect to login if configured but not authenticated as admin
  if (auth.isConfigured && !auth.isAdmin) {
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
        <div className="border-2 border-amber-600 bg-amber-50 p-4 shadow-[4px_4px_0px_#D97706]">
          <div className="flex items-start gap-3">
            <Database className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-mono text-sm font-bold uppercase text-amber-900">
                Curator Standby Mode Active
              </h3>
              <p className="font-sans text-xs text-amber-800 leading-relaxed">
                Supabase database credentials are not actively configured in <code>.env.local</code>.
                The admin dashboard is running in standby inspection mode. Configure{" "}
                <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and{" "}
                <code>SUPABASE_SERVICE_ROLE_KEY</code> to enable live database persistence.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b-2 border-ink pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="border border-ink bg-amber-300 px-2 py-0.5 font-mono text-[10px] font-bold text-ink uppercase tracking-wider">
            Archive Stewardship
          </span>
          <h1 className="mt-2 font-mono text-3xl font-extrabold tracking-tight text-ink">
            Archive Management Console
          </h1>
          <p className="mt-1 font-sans text-sm text-muted leading-relaxed">
            Curatorial verification, member roster staging, and milestone chronological audit.
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
            <Milestone className="h-4 w-4" />
            <span>Manage Milestones</span>
          </Link>
        </div>
      </div>

      {/* ── Metric Cards Grid ── */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Members */}
        <div className="card-tactile p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase text-muted">
              Roster Records
            </span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="font-mono text-3xl font-extrabold text-ink">
            {stats.totalMembers}
          </div>
          <div className="pt-2 border-t border-border flex items-center justify-between font-mono text-[11px] text-muted">
            <span>{stats.publishedMembers} Published</span>
            <span>{stats.draftMembers} Drafts</span>
          </div>
        </div>

        {/* Card 2: Verification Queue */}
        <div className="card-tactile p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase text-muted">
              Audit Breakdown
            </span>
            <FileCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="font-mono text-3xl font-extrabold text-ink">
            {stats.confirmedMembers}
            <span className="text-sm font-bold text-emerald-700 ml-1.5">Confirmed</span>
          </div>
          <div className="pt-2 border-t border-border flex items-center justify-between font-mono text-[11px] text-muted">
            <span>{stats.sourceListedMembers} Source Listed</span>
            <span>{stats.pendingMembers} Pending</span>
          </div>
        </div>

        {/* Card 3: Milestones */}
        <div className="card-tactile p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase text-muted">
              Milestones
            </span>
            <Milestone className="h-4 w-4 text-amber-600" />
          </div>
          <div className="font-mono text-3xl font-extrabold text-ink">
            {stats.totalMilestones}
          </div>
          <div className="pt-2 border-t border-border flex items-center justify-between font-mono text-[11px] text-muted">
            <span>{stats.publishedMilestones} Published</span>
            <span>{stats.draftMilestones} Staged</span>
          </div>
        </div>

        {/* Card 4: Chapters */}
        <div className="card-tactile p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase text-muted">
              Societies
            </span>
            <Landmark className="h-4 w-4 text-ink" />
          </div>
          <div className="font-mono text-3xl font-extrabold text-ink">
            {stats.totalSocieties}
          </div>
          <div className="pt-2 border-t border-border font-mono text-[11px] text-muted">
            Parent Branch &amp; Technical Chapters
          </div>
        </div>
      </div>

      {/* ── Action Navigation Jump Cards ── */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Link
          href="/admin/members"
          className="card-tactile group flex items-center justify-between p-6"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-primary uppercase">
                Section 1
              </span>
              <span className="border border-ink bg-amber-200 px-1.5 py-0.2 font-mono text-[9px] font-bold uppercase">
                21 Staged Entries
              </span>
            </div>
            <h2 className="font-mono text-xl font-bold tracking-tight text-ink group-hover:text-primary transition-colors">
              Member Roster Management →
            </h2>
            <p className="font-sans text-xs text-muted leading-relaxed">
              Create, edit, audit, and assign branch or society tier roles. Review internal source notes.
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center border-2 border-ink bg-amber-400 text-ink shadow-[2px_2px_0px_#141414] group-hover:translate-x-1 transition-transform shrink-0">
            <ArrowRight className="h-5 w-5" />
          </div>
        </Link>

        <Link
          href="/admin/milestones"
          className="card-tactile group flex items-center justify-between p-6"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-primary uppercase">
                Section 2
              </span>
              <span className="border border-ink bg-paper px-1.5 py-0.2 font-mono text-[9px] font-bold uppercase">
                Chronology
              </span>
            </div>
            <h2 className="font-mono text-xl font-bold tracking-tight text-ink group-hover:text-primary transition-colors">
              Milestone Timeline Management →
            </h2>
            <p className="font-sans text-xs text-muted leading-relaxed">
              Record historical milestones, link them to technical chapters, and enforce publication rules.
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center border-2 border-ink bg-primary text-white shadow-[2px_2px_0px_#141414] group-hover:translate-x-1 transition-transform shrink-0">
            <ArrowRight className="h-5 w-5" />
          </div>
        </Link>
      </div>

      {/* ── Curatorial Integrity Checklist ── */}
      <div className="border-2 border-ink bg-white p-6 shadow-[4px_4px_0px_#141414] space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h3 className="font-mono text-sm font-bold uppercase text-ink">
              Archival Integrity Invariants Status
            </h3>
          </div>
          <span className="border border-emerald-600 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-800 uppercase">
            Active Enforcement
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 font-mono text-xs">
          <div className="border border-border p-3 space-y-1 bg-paper">
            <div className="flex items-center gap-1.5 font-bold text-ink">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Publication Integrity</span>
            </div>
            <p className="font-sans text-[11px] text-muted">
              <code>chk_members_publication_integrity</code> ensures records cannot be published unless verification is confirmed.
            </p>
          </div>

          <div className="border border-border p-3 space-y-1 bg-paper">
            <div className="flex items-center gap-1.5 font-bold text-ink">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Security Barrier Views</span>
            </div>
            <p className="font-sans text-[11px] text-muted">
              <code>public_members</code> exposes confirmed data while completely concealing internal curator notes.
            </p>
          </div>

          <div className="border border-border p-3 space-y-1 bg-paper">
            <div className="flex items-center gap-1.5 font-bold text-ink">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Role Tier Consistency</span>
            </div>
            <p className="font-sans text-[11px] text-muted">
              <code>chk_member_roles_tier_consistency</code> strictly segregates branch executive vs chapter officer roles.
            </p>
          </div>
        </div>
      </div>

      {/* ── Recent Staged Entries Preview ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-ink">
            Recent Roster Entries (Staged from official seed)
          </h3>
          <Link
            href="/admin/members"
            className="font-mono text-xs font-bold text-primary hover:underline"
          >
            View All ({stats.totalMembers}) →
          </Link>
        </div>

        <div className="overflow-x-auto border-2 border-ink bg-white shadow-[4px_4px_0px_#141414]">
          <table className="w-full text-left font-sans text-xs">
            <thead className="border-b-2 border-ink bg-paper font-mono text-[11px] uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">Member Name</th>
                <th className="px-4 py-3">Recorded Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Verification</th>
                <th className="px-4 py-3">Private Curatorial Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentMembers.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-ink">
                    {m.full_name}
                  </td>
                  <td className="px-4 py-3 font-mono text-muted">
                    {m.role || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge type="status" value={m.status} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge type="verification" value={m.verification_status} />
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-muted max-w-[240px] truncate" title={m.source_note ?? undefined}>
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
