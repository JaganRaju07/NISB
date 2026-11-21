import { redirect } from "next/navigation";
import { Milestone, Database } from "lucide-react";
import {
  getAdminAuthStatus,
  getAdminMilestones,
  getAdminSocieties,
  getAdminMembers,
  getAdminMilestoneMembers,
  getAdminAccessDecision,
} from "@/lib/admin";
import { MilestoneManagementClient } from "./milestone-management-client";

export default async function AdminMilestonesPage() {
  const auth = await getAdminAuthStatus();
  const decision = getAdminAccessDecision({
    isConfigured: auth.isConfigured,
    isAdmin: auth.isAdmin,
    nodeEnv: process.env.NODE_ENV,
  });

  if (decision === "redirect") {
    redirect("/admin/login");
  }

  const [milestonesRes, societiesRes, membersRes, participantsRes] =
    await Promise.all([
      getAdminMilestones(),
      getAdminSocieties(),
      getAdminMembers(),
      getAdminMilestoneMembers(),
    ]);

  return (
    <div className="mx-auto w-full max-w-6xl p-6 md:p-8 space-y-6">
      {/* Standby Banner */}
      {!auth.isConfigured && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <Database className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-mono text-sm font-bold uppercase text-amber-300">
                Admin Standby Mode Active
              </h3>
              <p className="font-sans text-xs text-amber-200/80 leading-relaxed">
                Supabase database credentials are not actively configured in <code className="text-amber-100">.env.local</code>.
                Milestone records are operating in local inspection standby. Configure{" "}
                <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and{" "}
                <code>SUPABASE_SERVICE_ROLE_KEY</code> to enable live database persistence.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="rounded border border-amber-500/40 bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300 uppercase tracking-wider">
            Admin Portal
          </span>
          <span className="font-mono text-xs text-slate-400">
            Chronological Timeline
          </span>
        </div>
        <h1 className="font-mono text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <Milestone className="h-7 w-7 text-amber-400" />
          <span>Milestones Timeline Management</span>
        </h1>
        <p className="mt-1 font-sans text-xs text-slate-400 leading-relaxed">
          Record verified branch milestones, symposiums, and inaugurations.
          Enforce chronological year boundaries (1900–2100), participant linkages, and publication integrity.
        </p>
      </div>

      <MilestoneManagementClient
        initialMilestones={milestonesRes.data}
        societies={societiesRes.data}
        members={membersRes.data}
        initialParticipants={participantsRes.data}
      />
    </div>
  );
}
