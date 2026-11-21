"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  Users,
  CheckCheck,
  Archive,
} from "lucide-react";
import { StatusBadge } from "@/components/admin/status-badge";
import { MilestoneFormDialog } from "@/components/admin/milestone-form-dialog";
import { MilestoneParticipantDialog } from "@/components/admin/milestone-participant-dialog";
import {
  deleteMilestoneAction,
  quickUpdateMilestoneStatusAction,
} from "@/lib/actions/admin-actions";
import type {
  AdminMilestone,
  AdminSociety,
  AdminMember,
  AdminMilestoneMember,
} from "@/lib/admin";

interface MilestoneManagementClientProps {
  initialMilestones: AdminMilestone[];
  societies: AdminSociety[];
  members?: AdminMember[];
  initialParticipants?: AdminMilestoneMember[];
}

export function MilestoneManagementClient({
  initialMilestones,
  societies,
  members = [],
  initialParticipants = [],
}: MilestoneManagementClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");

  const [activeMilestoneForEdit, setActiveMilestoneForEdit] =
    useState<AdminMilestone | null>(null);
  const [isMilestoneFormOpen, setIsMilestoneFormOpen] = useState(false);

  const [activeMilestoneForParticipants, setActiveMilestoneForParticipants] =
    useState<AdminMilestone | null>(null);
  const [isParticipantsDialogOpen, setIsParticipantsDialogOpen] =
    useState(false);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filteredMilestones = initialMilestones.filter((m) => {
    const matchesSearch =
      searchTerm.trim() === "" ||
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.category && m.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.milestone_year && m.milestone_year.toString().includes(searchTerm.trim()));

    const matchesStatus =
      statusFilter === "all" || m.status === statusFilter;

    const matchesVerification =
      verificationFilter === "all" || m.verification_status === verificationFilter;

    return matchesSearch && matchesStatus && matchesVerification;
  });

  function handleOpenCreate() {
    setActiveMilestoneForEdit(null);
    setIsMilestoneFormOpen(true);
  }

  function handleOpenEdit(milestone: AdminMilestone) {
    setActiveMilestoneForEdit(milestone);
    setIsMilestoneFormOpen(true);
  }

  function handleOpenParticipants(milestone: AdminMilestone) {
    setActiveMilestoneForParticipants(milestone);
    setIsParticipantsDialogOpen(true);
  }

  function handleDelete(milestoneId: string, title: string) {
    if (!confirm(`Are you sure you want to permanently delete milestone "${title}"?`)) {
      return;
    }

    startTransition(async () => {
      const res = await deleteMilestoneAction(milestoneId);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error ?? "Failed to delete milestone");
      }
    });
  }

  function handleQuickPublish(milestone: AdminMilestone) {
    startTransition(async () => {
      const res = await quickUpdateMilestoneStatusAction(
        milestone.id,
        "published",
        "confirmed"
      );
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error ?? "Failed to publish milestone");
      }
    });
  }

  function handleQuickUnpublish(milestone: AdminMilestone) {
    startTransition(async () => {
      const res = await quickUpdateMilestoneStatusAction(
        milestone.id,
        "draft",
        milestone.verification_status
      );
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error ?? "Failed to unpublish milestone");
      }
    });
  }

  // Count participants per milestone
  const participantCountMap = new Map<string, number>();
  initialParticipants.forEach((p) => {
    const count = participantCountMap.get(p.milestone_id) ?? 0;
    participantCountMap.set(p.milestone_id, count + 1);
  });

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, year, or category..."
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
              <option value="all">All ({initialMilestones.length})</option>
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

          {/* Add Milestone Button */}
          <button
            type="button"
            onClick={handleOpenCreate}
            className="btn-tactile-amber inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase ml-auto md:ml-2"
          >
            <Plus className="h-4 w-4" />
            <span>Record Milestone</span>
          </button>
        </div>
      </div>

      {/* Milestones Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/90 shadow-md">
        <table className="w-full text-left font-sans text-xs">
          <thead className="border-b border-slate-800 bg-slate-950/90 font-mono text-[11px] uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3">Year / Date</th>
              <th className="px-4 py-3">Milestone Title &amp; Category</th>
              <th className="px-4 py-3">Associated Chapter</th>
              <th className="px-4 py-3">Participants</th>
              <th className="px-4 py-3">Lifecycle</th>
              <th className="px-4 py-3">Verification</th>
              <th className="px-4 py-3">Admin Note</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredMilestones.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center font-mono text-xs text-slate-400">
                  No milestone records match the selected filters.
                </td>
              </tr>
            ) : (
              filteredMilestones.map((m) => {
                const pCount = participantCountMap.get(m.id) ?? 0;

                return (
                  <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono">
                      <div className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-amber-400" />
                        <span>{m.milestone_year ?? "—"}</span>
                      </div>
                      {m.date && (
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {m.date}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-mono font-bold text-white text-sm">
                        {m.title}
                      </div>
                      {m.category && (
                        <span className="inline-block rounded border border-slate-700 bg-slate-950 px-1.5 py-0.2 font-mono text-[10px] text-slate-400 uppercase mt-1">
                          {m.category}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 font-mono text-xs text-slate-300">
                      {m.societies ? (
                        <span className="rounded border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300">
                          {m.societies.short_name || m.societies.name}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Branch-wide</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleOpenParticipants(m)}
                        className="inline-flex items-center gap-1.5 rounded border border-slate-700 bg-slate-800/80 px-2.5 py-1 font-mono text-[10px] text-slate-200 hover:text-white hover:border-slate-600 transition-colors"
                        title="Manage participants linked to this milestone"
                      >
                        <Users className="h-3 w-3 text-sky-400" />
                        <span>{pCount > 0 ? `${pCount} Linked` : "Link"}</span>
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge type="status" value={m.status} />
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge type="verification" value={m.verification_status} />
                    </td>

                    <td
                      className="px-4 py-3 font-mono text-[11px] text-slate-400 max-w-[180px] truncate"
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
                            title="Verify & Publish this milestone to public timeline"
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
                            title="Move milestone back to draft"
                          >
                            <Archive className="h-3 w-3" />
                            <span>Draft</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(m)}
                          className="p-1.5 rounded border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
                          title="Edit milestone"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(m.id, m.title)}
                          disabled={isPending}
                          className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                          title="Delete milestone"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Dialogs */}
      <MilestoneFormDialog
        key={activeMilestoneForEdit ? `edit-${activeMilestoneForEdit.id}` : "create-milestone"}
        isOpen={isMilestoneFormOpen}
        onClose={() => setIsMilestoneFormOpen(false)}
        milestone={activeMilestoneForEdit}
        societies={societies}
      />

      <MilestoneParticipantDialog
        key={activeMilestoneForParticipants ? `participants-${activeMilestoneForParticipants.id}` : "manage-participants"}
        isOpen={isParticipantsDialogOpen}
        onClose={() => setIsParticipantsDialogOpen(false)}
        milestone={activeMilestoneForParticipants}
        members={members}
        initialParticipants={initialParticipants}
      />
    </div>
  );
}
