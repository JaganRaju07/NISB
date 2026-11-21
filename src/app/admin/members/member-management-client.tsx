"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Layers,
  Archive,
  CheckCheck,
} from "lucide-react";
import { StatusBadge } from "@/components/admin/status-badge";
import { MemberFormDialog } from "@/components/admin/member-form-dialog";
import { MemberRoleDialog } from "@/components/admin/member-role-dialog";
import { MemberAvatar } from "@/components/ui";
import {
  deleteMemberAction,
  quickUpdateMemberStatusAction,
} from "@/lib/actions/admin-actions";
import type { AdminMember, AdminSociety } from "@/lib/admin";

interface MemberManagementClientProps {
  initialMembers: AdminMember[];
  societies: AdminSociety[];
}

export function MemberManagementClient({
  initialMembers,
  societies,
}: MemberManagementClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");

  const [activeMemberForEdit, setActiveMemberForEdit] = useState<AdminMember | null>(null);
  const [isMemberFormOpen, setIsMemberFormOpen] = useState(false);

  const [activeMemberForRoles, setActiveMemberForRoles] = useState<AdminMember | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Filter members client-side
  const filteredMembers = initialMembers.filter((m) => {
    const matchesSearch =
      searchTerm.trim() === "" ||
      m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.role && m.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.department && m.department.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || m.status === statusFilter;

    const matchesVerification =
      verificationFilter === "all" || m.verification_status === verificationFilter;

    return matchesSearch && matchesStatus && matchesVerification;
  });

  function handleOpenCreate() {
    setActiveMemberForEdit(null);
    setIsMemberFormOpen(true);
  }

  function handleOpenEdit(member: AdminMember) {
    setActiveMemberForEdit(member);
    setIsMemberFormOpen(true);
  }

  function handleOpenRoles(member: AdminMember) {
    setActiveMemberForRoles(member);
    setIsRoleDialogOpen(true);
  }

  function handleDelete(memberId: string, memberName: string) {
    if (!confirm(`Are you sure you want to permanently delete "${memberName}" from the archive?`)) {
      return;
    }

    startTransition(async () => {
      const res = await deleteMemberAction(memberId);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error ?? "Failed to delete member");
      }
    });
  }

  function handleQuickPublish(member: AdminMember) {
    startTransition(async () => {
      const res = await quickUpdateMemberStatusAction(
        member.id,
        "published",
        "confirmed"
      );
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error ?? "Failed to publish member");
      }
    });
  }

  function handleQuickUnpublish(member: AdminMember) {
    startTransition(async () => {
      const res = await quickUpdateMemberStatusAction(
        member.id,
        "draft",
        member.verification_status
      );
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error ?? "Failed to unpublish member");
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, role, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 pl-9 pr-3 py-1.5 font-sans text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
        </div>

        {/* Filters & Action */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1.5 font-mono text-xs uppercase font-bold text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="all">All ({initialMembers.length})</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Verification Filter */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Verification:</span>
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1.5 font-mono text-xs uppercase font-bold text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="all">All</option>
              <option value="confirmed">Confirmed</option>
              <option value="source_listed">Source Listed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Add Member Button */}
          <button
            type="button"
            onClick={handleOpenCreate}
            className="btn-tactile-amber inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase ml-auto md:ml-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Roster Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/90 shadow-md">
        <table className="w-full text-left font-sans text-xs">
          <thead className="border-b border-slate-800 bg-slate-950/90 font-mono text-[11px] uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3">Member Name &amp; Dept</th>
              <th className="px-4 py-3">Primary Role</th>
              <th className="px-4 py-3">Tenure Roles</th>
              <th className="px-4 py-3">Lifecycle</th>
              <th className="px-4 py-3">Verification</th>
              <th className="px-4 py-3">Administrative Source Note</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center font-mono text-xs text-slate-400">
                  No member records match the selected filters.
                </td>
              </tr>
            ) : (
              filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">
                        <MemberAvatar
                          name={m.full_name}
                          photoUrl={m.photo_url}
                          size="sm"
                          className="border border-slate-700"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-mono font-bold text-white text-sm flex items-center gap-2">
                          <span className="truncate">{m.full_name}</span>
                          {m.photo_url ? (
                            <span
                              className="inline-block h-2 w-2 shrink-0 rounded-full bg-emerald-400 ring-2 ring-emerald-500/20"
                              title="Official Photograph Integrated"
                            />
                          ) : (
                            <span
                              className="inline-block h-2 w-2 shrink-0 rounded-full bg-slate-500 ring-2 ring-slate-600/20"
                              title="No Photograph (Archival Monogram Active)"
                            />
                          )}
                        </div>
                        {m.department ? (
                          <div className="font-mono text-[11px] text-slate-400 truncate">
                            {m.department} {m.batch_year ? `('Class of ${m.batch_year})` : ""}
                          </div>
                        ) : (
                          <div className="font-mono text-[10px] text-slate-500 italic">
                            Official Member (nisb.in)
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 font-mono text-xs text-slate-200">
                    {m.role || "—"}
                  </td>

                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleOpenRoles(m)}
                      className="inline-flex items-center gap-1.5 rounded border border-slate-700 bg-slate-800/80 px-2.5 py-1 font-mono text-[10px] text-slate-200 hover:text-white hover:border-slate-600 transition-colors"
                      title="Manage roles and society links"
                    >
                      <Layers className="h-3 w-3 text-sky-400" />
                      <span>{m.member_roles?.length ?? 0} Roles</span>
                    </button>
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge type="status" value={m.status} />
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge type="verification" value={m.verification_status} />
                  </td>

                  <td
                    className="px-4 py-3 font-mono text-[11px] text-slate-400 max-w-[200px] truncate"
                    title={m.source_note ?? undefined}
                  >
                    {m.source_note || "—"}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      {/* Quick Status Action Button */}
                      {m.status !== "published" ? (
                        <button
                          type="button"
                          onClick={() => handleQuickPublish(m)}
                          disabled={isPending}
                          className="inline-flex items-center gap-1 rounded border border-emerald-500/40 bg-emerald-500/15 px-2 py-1 font-mono text-[10px] font-bold text-emerald-300 hover:bg-emerald-500/25 transition-colors disabled:opacity-50"
                          title="Verify & Publish this record to the public directory"
                        >
                          <CheckCheck className="h-3 w-3" />
                          <span>Publish</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleQuickUnpublish(m)}
                          disabled={isPending}
                          className="inline-flex items-center gap-1 rounded border border-slate-700 bg-slate-800/80 px-2 py-1 font-mono text-[10px] text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50"
                          title="Move record back to draft"
                        >
                          <Archive className="h-3 w-3" />
                          <span>Draft</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(m)}
                        className="p-1.5 rounded border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
                        title="Edit member details"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(m.id, m.full_name)}
                        disabled={isPending}
                        className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                        title="Delete member"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Dialogs */}
      <MemberFormDialog
        key={activeMemberForEdit ? `edit-${activeMemberForEdit.id}` : "create-member"}
        isOpen={isMemberFormOpen}
        onClose={() => setIsMemberFormOpen(false)}
        member={activeMemberForEdit}
      />

      <MemberRoleDialog
        key={activeMemberForRoles ? `roles-${activeMemberForRoles.id}` : "manage-roles"}
        isOpen={isRoleDialogOpen}
        onClose={() => setIsRoleDialogOpen(false)}
        member={activeMemberForRoles}
        societies={societies}
      />
    </div>
  );
}
