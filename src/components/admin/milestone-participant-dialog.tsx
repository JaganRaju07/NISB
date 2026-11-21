"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Users, X, Plus, Trash2, AlertCircle } from "lucide-react";
import { MemberAvatar } from "@/components/ui";
import {
  addMilestoneMemberAction,
  deleteMilestoneMemberAction,
} from "@/lib/actions/admin-actions";
import type { AdminMilestone, AdminMember, AdminMilestoneMember } from "@/lib/admin";

interface MilestoneParticipantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: AdminMilestone | null;
  members: AdminMember[];
  initialParticipants: AdminMilestoneMember[];
}

export function MilestoneParticipantDialog({
  isOpen,
  onClose,
  milestone,
  members,
  initialParticipants,
}: MilestoneParticipantDialogProps) {
  const router = useRouter();
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [roleInMilestone, setRoleInMilestone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isOpen || !milestone) return null;

  const milestoneParticipants = initialParticipants.filter(
    (p) => p.milestone_id === milestone.id
  );

  const memberMap = new Map<string, AdminMember>(
    members.map((m) => [m.id, m])
  );

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!milestone) return;

    if (!selectedMemberId) {
      setError("Please select a member to associate with this milestone.");
      return;
    }

    // Check if member is already linked
    if (milestoneParticipants.some((p) => p.member_id === selectedMemberId)) {
      setError("This member is already linked to this milestone.");
      return;
    }

    setError(null);

    const formData = new FormData();
    formData.append("milestone_id", milestone.id);
    formData.append("member_id", selectedMemberId);
    formData.append("role_in_milestone", roleInMilestone);

    startTransition(async () => {
      const res = await addMilestoneMemberAction(formData);
      if (!res.success) {
        setError(res.error ?? "Failed to link member to milestone");
        return;
      }
      setSelectedMemberId("");
      setRoleInMilestone("");
      router.refresh();
    });
  }

  function handleDelete(junctionId: string, memberName: string) {
    if (!confirm(`Remove "${memberName}" from this milestone's participant list?`)) {
      return;
    }

    startTransition(async () => {
      const res = await deleteMilestoneMemberAction(junctionId);
      if (!res.success) {
        setError(res.error ?? "Failed to remove member");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="space-y-0.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-sky-400 font-bold">
              Milestone Junction Management
            </span>
            <h2 className="font-mono text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-sky-400" />
              <span>Participants: {milestone.title}</span>
            </h2>
            <p className="font-sans text-xs text-slate-400">
              Link branch members who contributed to or led this milestone achievement.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 font-mono text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Existing Participants List */}
        <div className="mt-6 space-y-3">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
            Linked Participants ({milestoneParticipants.length})
          </h3>

          {milestoneParticipants.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-800 bg-slate-950/60 p-6 text-center">
              <p className="font-mono text-xs text-slate-400">
                No members currently linked to this milestone record.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {milestoneParticipants.map((p) => {
                const member = memberMap.get(p.member_id);
                const memberName = member?.full_name || "Unknown Member";

                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/70 p-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <MemberAvatar
                        name={memberName}
                        photoUrl={member?.photo_url}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <div className="font-mono text-xs font-bold text-white truncate">
                          {memberName}
                        </div>
                        <div className="font-mono text-[11px] text-sky-400/90 truncate">
                          {p.role_in_milestone || "Participant / Contributor"}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleDelete(p.id, memberName)}
                      className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                      title="Remove participant link"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add Participant Form */}
        <form onSubmit={handleAdd} className="mt-6 border-t border-slate-800 pt-5 space-y-4">
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
            <Plus className="h-3.5 w-3.5 text-sky-400" />
            <span>Link Another Member</span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-[11px] font-bold uppercase text-slate-400 mb-1">
                Select Member <span className="text-rose-400">*</span>
              </label>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-100 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              >
                <option value="">— Choose Member —</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.full_name} {m.role ? `(${m.role})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-mono text-[11px] font-bold uppercase text-slate-400 mb-1">
                Role in Milestone
              </label>
              <input
                type="text"
                value={roleInMilestone}
                onChange={(e) => setRoleInMilestone(e.target.value)}
                placeholder="e.g. Lead Organizer, Speaker"
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-tactile-ghost px-4 py-2 text-xs uppercase"
            >
              Done
            </button>
            <button
              type="submit"
              disabled={isPending || !selectedMemberId}
              className="btn-tactile-blue px-4 py-2 text-xs uppercase disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{isPending ? "Linking..." : "Add Participant"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
