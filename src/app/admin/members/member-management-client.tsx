"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Layers,
} from "lucide-react";
import { StatusBadge } from "@/components/admin/status-badge";
import { MemberFormDialog } from "@/components/admin/member-form-dialog";
import { MemberRoleDialog } from "@/components/admin/member-role-dialog";
import { deleteMemberAction } from "@/lib/actions/admin-actions";
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
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="border-2 border-ink bg-white p-4 shadow-[4px_4px_0px_#141414] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search by name, role, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-2 border-ink bg-paper pl-9 pr-3 py-1.5 font-sans text-xs focus:outline-hidden"
          />
        </div>

        {/* Filters & Action */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1 font-mono text-xs">
            <span className="text-muted text-[10px] uppercase font-bold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border-2 border-ink bg-paper px-2 py-1 font-mono text-xs uppercase font-bold"
            >
              <option value="all">All ({initialMembers.length})</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Verification Filter */}
          <div className="flex items-center gap-1 font-mono text-xs">
            <span className="text-muted text-[10px] uppercase font-bold">Verification:</span>
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="border-2 border-ink bg-paper px-2 py-1 font-mono text-xs uppercase font-bold"
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
            className="btn-tactile-amber inline-flex items-center gap-1.5 px-4 py-1.5 text-xs uppercase ml-auto md:ml-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Roster Table */}
      <div className="overflow-x-auto border-2 border-ink bg-white shadow-[6px_6px_0px_#141414]">
        <table className="w-full text-left font-sans text-xs">
          <thead className="border-b-2 border-ink bg-paper font-mono text-[11px] uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3">Member Name &amp; Dept</th>
              <th className="px-4 py-3">Primary Role</th>
              <th className="px-4 py-3">Tenure Roles</th>
              <th className="px-4 py-3">Lifecycle</th>
              <th className="px-4 py-3">Verification</th>
              <th className="px-4 py-3">Curatorial Source Note</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center font-mono text-xs text-muted">
                  No member records match the selected filters.
                </td>
              </tr>
            ) : (
              filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-mono font-bold text-ink text-sm">
                      {m.full_name}
                    </div>
                    {m.department && (
                      <div className="font-mono text-[11px] text-muted">
                        {m.department} {m.batch_year ? `('Class of ${m.batch_year})` : ""}
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3 font-mono text-xs text-ink">
                    {m.role || "—"}
                  </td>

                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleOpenRoles(m)}
                      className="inline-flex items-center gap-1 border border-border bg-paper px-2 py-0.5 font-mono text-[10px] text-ink hover:border-ink hover:bg-amber-100 transition-colors"
                      title="Manage roles and society links"
                    >
                      <Layers className="h-3 w-3 text-primary" />
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
                    className="px-4 py-3 font-mono text-[11px] text-muted max-w-[200px] truncate"
                    title={m.source_note ?? undefined}
                  >
                    {m.source_note || "—"}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(m)}
                        className="flex h-7 w-7 items-center justify-center border border-border text-ink hover:border-ink hover:bg-slate-100"
                        title="Edit member details"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(m.id, m.full_name)}
                        disabled={isPending}
                        className="flex h-7 w-7 items-center justify-center border border-border text-destructive hover:border-destructive hover:bg-red-50 disabled:opacity-50"
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
