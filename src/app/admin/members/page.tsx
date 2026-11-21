import { redirect } from "next/navigation";
import { Users, Database } from "lucide-react";
import {
  getAdminAuthStatus,
  getAdminMembers,
  getAdminSocieties,
  getAdminAccessDecision,
} from "@/lib/admin";
import { MemberManagementClient } from "./member-management-client";

export default async function AdminMembersPage() {
  const auth = await getAdminAuthStatus();
  const decision = getAdminAccessDecision({
    isConfigured: auth.isConfigured,
    isAdmin: auth.isAdmin,
    nodeEnv: process.env.NODE_ENV,
  });

  if (decision === "redirect") {
    redirect("/admin/login");
  }

  const [membersRes, societiesRes] = await Promise.all([
    getAdminMembers(),
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
                Member records are operating in local inspection standby. Configure{" "}
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
            Institutional Roster
          </span>
        </div>
        <h1 className="font-mono text-3xl font-extrabold tracking-tight text-ink flex items-center gap-2">
          <Users className="h-7 w-7 text-primary" />
          <span>Member Roster Management</span>
        </h1>
        <p className="mt-1 font-sans text-xs text-muted leading-relaxed">
          Manage member records, review audit provenance notes, stage official roster entries,
          and assign branch or society tier positions.
        </p>
      </div>

      <MemberManagementClient
        initialMembers={membersRes.data}
        societies={societiesRes.data}
      />
    </div>
  );
}
