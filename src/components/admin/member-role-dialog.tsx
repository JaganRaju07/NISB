"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Trash2, X, Layers } from "lucide-react";
import {
  addMemberRoleAction,
  deleteMemberRoleAction,
} from "@/lib/actions/admin-actions";
import type { AdminMember, AdminSociety } from "@/lib/admin";

interface MemberRoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  member: AdminMember | null;
  societies: AdminSociety[];
}

export function MemberRoleDialog({
  isOpen,
  onClose,
  member,
  societies,
}: MemberRoleDialogProps) {
  const router = useRouter();
  const [tier, setTier] = useState<"branch" | "society">("branch");
  const [societyId, setSocietyId] = useState<string>("");
  const [roleTitle, setRoleTitle] = useState<string>("");
  const [startYear, setStartYear] = useState<string>("");
  const [endYear, setEndYear] = useState<string>("");
  const [isCurrent, setIsCurrent] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !member) return null;

  const roles = member.member_roles ?? [];

  async function handleAddRole(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!member) return;
    if (tier === "society" && !societyId) {
      setError("Society Tier requires selecting a valid society/chapter.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("member_id", member.id);
    formData.append("role_title", roleTitle);
    formData.append("tier", tier);
    formData.append("society_id", tier === "society" ? societyId : "");
    formData.append("start_year", startYear);
    formData.append("end_year", endYear);
    formData.append("is_current", isCurrent ? "true" : "false");

    try {
      const res = await addMemberRoleAction(formData);
      if (!res.success) {
        setError(res.error ?? "Failed to add role");
        setIsSubmitting(false);
        return;
      }

      // Reset input fields
      setRoleTitle("");
      setStartYear("");
      setEndYear("");
      setIsCurrent(false);
      setIsSubmitting(false);
      onClose();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error adding role");
      setIsSubmitting(false);
    }
  }

  async function handleDeleteRole(roleId: string) {
    if (!confirm("Remove this tenure role from the historical record?")) return;
    try {
      const res = await deleteMemberRoleAction(roleId);
      if (res.success) {
        onClose();
        router.refresh();
      } else {
        setError(res.error ?? "Failed to delete role");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete role");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="space-y-0.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-sky-400 font-bold">
              Tenure &amp; Leadership Lineage
            </span>
            <h2 className="font-mono text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-sky-400" />
              <span>Manage Roles: {member.full_name}</span>
            </h2>
            <p className="font-sans text-xs text-slate-400">
              Record branch executive or technical chapter officer tenures.
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

        {/* Existing roles list */}
        <div className="pt-4 space-y-3">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
            Recorded Tenures ({roles.length})
          </h3>
          {roles.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-800 bg-slate-950/60 p-4 text-center">
              <p className="font-mono text-xs text-slate-400 italic">
                No historical role records linked to this member yet.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {roles.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/70 p-3 hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-white">
                        {r.role_title}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.2 font-mono text-[9px] uppercase font-bold border ${
                          r.tier === "branch"
                            ? "border-sky-500/40 bg-sky-500/15 text-sky-300"
                            : "border-amber-500/40 bg-amber-500/15 text-amber-300"
                        }`}
                      >
                        {r.tier === "branch" ? "Branch Tier" : r.societies?.short_name ?? "Society"}
                      </span>
                      {r.is_current && (
                        <span className="rounded border border-emerald-500/40 bg-emerald-500/15 px-1.5 py-0.2 font-mono text-[9px] font-bold text-emerald-300 uppercase">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-[11px] text-slate-400">
                      {r.start_year ?? "Unknown"} – {r.end_year ?? (r.is_current ? "Present" : "—")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteRole(r.id)}
                    className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete role record"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add role form */}
        <form onSubmit={handleAddRole} className="mt-6 border-t border-slate-800 pt-4 space-y-4">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
            Add New Tenure Record
          </h3>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 font-mono text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Tier Selector */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTier("branch")}
              className={`rounded-lg border py-2 px-3 font-mono text-xs font-bold uppercase transition-colors ${
                tier === "branch"
                  ? "border-sky-500/50 bg-sky-500/20 text-sky-300 shadow-sm"
                  : "border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200"
              }`}
            >
              Branch Tier (Executive)
            </button>
            <button
              type="button"
              onClick={() => setTier("society")}
              className={`rounded-lg border py-2 px-3 font-mono text-xs font-bold uppercase transition-colors ${
                tier === "society"
                  ? "border-amber-500/50 bg-amber-500/20 text-amber-300 shadow-sm"
                  : "border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200"
              }`}
            >
              Society Tier (Officer)
            </button>
          </div>

          {/* Society Dropdown (if society tier) */}
          {tier === "society" && (
            <div>
              <label className="block font-mono text-[11px] font-bold uppercase text-slate-400 mb-1">
                Select Society / Chapter <span className="text-rose-400">*</span>
              </label>
              <select
                required
                value={societyId}
                onChange={(e) => setSocietyId(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-100 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              >
                <option value="">-- Choose Chapter --</option>
                {societies.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.slug})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Role Title */}
          <div>
            <label className="block font-mono text-[11px] font-bold uppercase text-slate-400 mb-1">
              Role Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="e.g. Chair, Secretary, Treasurer, Webmaster"
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* Years */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[11px] font-bold uppercase text-slate-400 mb-1">
                Start Year
              </label>
              <input
                type="text"
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                placeholder="e.g. 2024"
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] font-bold uppercase text-slate-400 mb-1">
                End Year
              </label>
              <input
                type="text"
                value={endYear}
                disabled={isCurrent}
                onChange={(e) => setEndYear(e.target.value)}
                placeholder={isCurrent ? "Present" : "e.g. 2025"}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Is Current Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_current"
              checked={isCurrent}
              onChange={(e) => setIsCurrent(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-sky-500 focus:ring-sky-500"
            />
            <label htmlFor="is_current" className="font-mono text-xs text-slate-300 select-none">
              Currently holding this position
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn-tactile-ghost px-4 py-2 text-xs uppercase"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !roleTitle.trim()}
              className="btn-tactile-amber px-5 py-2 text-xs uppercase disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Add Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
