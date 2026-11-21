"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
} from "lucide-react";
import { StatusBadge } from "@/components/admin/status-badge";
import { MilestoneFormDialog } from "@/components/admin/milestone-form-dialog";
import { deleteMilestoneAction } from "@/lib/actions/admin-actions";
import type { AdminMilestone, AdminSociety } from "@/lib/admin";

interface MilestoneManagementClientProps {
  initialMilestones: AdminMilestone[];
  societies: AdminSociety[];
}

export function MilestoneManagementClient({
  initialMilestones,
  societies,
}: MilestoneManagementClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");

  const [activeMilestoneForEdit, setActiveMilestoneForEdit] =
    useState<AdminMilestone | null>(null);
  const [isMilestoneFormOpen, setIsMilestoneFormOpen] = useState(false);

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

  function handleDelete(milestoneId: string, title: string) {
    if (!confirm(`Are you sure you want to permanently delete milestone "${title}"?`)) {
      return;
    }

    startTransition(async () => {
      const res = await deleteMilestoneAction(milestoneId);
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
            placeholder="Search by title, year, or category..."
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
              <option value="all">All ({initialMilestones.length})</option>
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

          {/* Add Milestone Button */}
          <button
            type="button"
            onClick={handleOpenCreate}
            className="btn-tactile-amber inline-flex items-center gap-1.5 px-4 py-1.5 text-xs uppercase ml-auto md:ml-2"
          >
            <Plus className="h-4 w-4" />
            <span>Record Milestone</span>
          </button>
        </div>
      </div>

      {/* Milestones Table */}
      <div className="overflow-x-auto border-2 border-ink bg-white shadow-[6px_6px_0px_#141414]">
        <table className="w-full text-left font-sans text-xs">
          <thead className="border-b-2 border-ink bg-paper font-mono text-[11px] uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3">Year / Date</th>
              <th className="px-4 py-3">Milestone Title &amp; Category</th>
              <th className="px-4 py-3">Associated Chapter</th>
              <th className="px-4 py-3">Lifecycle</th>
              <th className="px-4 py-3">Verification</th>
              <th className="px-4 py-3">Curator Note</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredMilestones.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center font-mono text-xs text-muted">
                  No milestone records match the selected filters.
                </td>
              </tr>
            ) : (
              filteredMilestones.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono">
                    <div className="text-sm font-bold text-ink flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-amber-600" />
                      <span>{m.milestone_year ?? "—"}</span>
                    </div>
                    {m.date && (
                      <div className="text-[10px] text-muted">
                        {m.date}
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-mono font-bold text-ink text-sm">
                      {m.title}
                    </div>
                    {m.category && (
                      <span className="inline-block border border-border bg-paper px-1.5 py-0.2 font-mono text-[10px] text-muted uppercase mt-0.5">
                        {m.category}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    {m.societies ? (
                      <span className="border border-ink bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-ink">
                        {m.societies.short_name || m.societies.name}
                      </span>
                    ) : (
                      <span className="text-muted italic">Branch-wide</span>
                    )}
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
                        title="Edit milestone"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(m.id, m.title)}
                        disabled={isPending}
                        className="flex h-7 w-7 items-center justify-center border border-border text-destructive hover:border-destructive hover:bg-red-50 disabled:opacity-50"
                        title="Delete milestone"
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

      {/* Dialog */}
      <MilestoneFormDialog
        key={activeMilestoneForEdit ? `edit-${activeMilestoneForEdit.id}` : "create-milestone"}
        isOpen={isMilestoneFormOpen}
        onClose={() => setIsMilestoneFormOpen(false)}
        milestone={activeMilestoneForEdit}
        societies={societies}
      />
    </div>
  );
}
