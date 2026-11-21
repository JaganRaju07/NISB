import { redirect } from "next/navigation";
import { Users, Database } from "lucide-react";
import {
  getAdminAuthStatus,
  getAdminMembers,
  getAdminSocieties,
  getAdminAccessDecision,
} from "@/lib/admin";
import { MemberManagementClient } from "./member-management-client";

export const instant = false;

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
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <Database className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-mono text-sm font-bold uppercase text-amber-300">
                Admin Standby Mode Active
              </h3>
              <p className="font-sans text-xs text-amber-200/80 leading-relaxed">
                Supabase database credentials are not actively configured in <code className="text-amber-100">.env.local</code>.
                Member records are operating in local inspection standby. Configure{" "}
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
            Institutional Members
          </span>
        </div>
        <h1 className="font-mono text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <Users className="h-7 w-7 text-sky-400" />
          <span>Member Management</span>
        </h1>
        <p className="mt-1 font-sans text-xs text-slate-400 leading-relaxed">
          Manage member records, review audit provenance notes, stage official member entries,
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
