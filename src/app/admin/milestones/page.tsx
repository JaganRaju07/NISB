import { redirect } from "next/navigation";
import { Milestone, Database } from "lucide-react";
import {
  getAdminAuthStatus,
  getAdminMilestones,
  getAdminSocieties,
} from "@/lib/admin";
import { MilestoneManagementClient } from "./milestone-management-client";

export default async function AdminMilestonesPage() {
  const auth = await getAdminAuthStatus();

  if (auth.isConfigured && !auth.isAdmin) {
    redirect("/admin/login");
  }

  const [milestonesRes, societiesRes] = await Promise.all([
    getAdminMilestones(),
    getAdminSocieties(),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl p-6 md:p-8 space-y-6">
      {/* Standby Banner */}
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
                Milestone records are operating in local inspection standby. Configure{" "}
                <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and{" "}
                <code>SUPABASE_SERVICE_ROLE_KEY</code> to enable live database persistence.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b-2 border-ink pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="border border-ink bg-amber-400 px-2 py-0.2 font-mono text-[10px] font-bold text-ink uppercase tracking-wider">
            Curator Portal
          </span>
          <span className="font-mono text-xs text-muted">
            Chronological Timeline
          </span>
        </div>
        <h1 className="font-mono text-3xl font-extrabold tracking-tight text-ink flex items-center gap-2">
          <Milestone className="h-7 w-7 text-amber-600" />
          <span>Milestones Timeline Management</span>
        </h1>
        <p className="mt-1 font-sans text-xs text-muted leading-relaxed">
          Record verified branch milestones, symposiums, and inaugurations.
          Enforce chronological year boundaries (1900–2100) and publication integrity.
        </p>
      </div>

      <MilestoneManagementClient
        initialMilestones={milestonesRes.data}
        societies={societiesRes.data}
      />
    </div>
  );
}
