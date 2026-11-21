"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Trash2, X, Plus } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto border-2 border-ink bg-paper p-6 shadow-[6px_6px_0px_#141414]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-ink pb-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted font-bold">
              Tenure &amp; Leadership Lineage
            </span>
            <h2 className="font-mono text-xl font-bold tracking-tight text-ink">
              Manage Roles: {member.full_name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center border-2 border-ink bg-white hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Existing roles list */}
        <div className="pt-4 space-y-3">
          <h3 className="font-mono text-xs font-bold uppercase text-ink">
            Recorded Tenures ({roles.length})
          </h3>
          {roles.length === 0 ? (
            <p className="font-mono text-xs text-muted italic border border-dashed border-border p-3">
              No historical role records linked to this member yet.
            </p>
          ) : (
            <div className="space-y-2">
              {roles.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between border-2 border-ink bg-white p-3 shadow-[2px_2px_0px_#141414]"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-ink">
                        {r.role_title}
                      </span>
                      <span
                        className={`border px-1.5 py-0.2 font-mono text-[9px] uppercase font-bold ${
                          r.tier === "branch"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-amber-600 bg-amber-50 text-amber-900"
                        }`}
                      >
                        {r.tier === "branch" ? "Branch Tier" : r.societies?.short_name ?? "Society"}
                      </span>
                      {r.is_current && (
                        <span className="border border-emerald-600 bg-emerald-50 px-1 py-0.2 font-mono text-[9px] font-bold text-emerald-800 uppercase">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-xs text-muted">
                      {r.start_year ?? "Unknown"} – {r.end_year ?? (r.is_current ? "Present" : "—")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteRole(r.id)}
                    className="flex h-7 w-7 items-center justify-center border border-border text-destructive hover:border-destructive hover:bg-red-50"
                    title="Delete role record"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add role form */}
        <form onSubmit={handleAddRole} className="mt-6 border-t-2 border-ink pt-4 space-y-3">
          <h3 className="font-mono text-xs font-bold uppercase text-ink">
            Add New Tenure Record
          </h3>

          {error && (
            <div className="flex items-start gap-2 border-2 border-destructive bg-red-50 p-2 font-mono text-xs text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Tier Selector */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTier("branch")}
              className={`border-2 py-1.5 font-mono text-xs font-bold uppercase transition-colors ${
                tier === "branch"
                  ? "border-ink bg-primary text-white shadow-[2px_2px_0px_#141414]"
                  : "border-border bg-white text-muted"
              }`}
            >
              Branch Tier (NISB Executive)
            </button>
            <button
              type="button"
              onClick={() => setTier("society")}
              className={`border-2 py-1.5 font-mono text-xs font-bold uppercase transition-colors ${
                tier === "society"
                  ? "border-ink bg-amber-400 text-ink shadow-[2px_2px_0px_#141414]"
                  : "border-border bg-white text-muted"
              }`}
            >
              Society Tier (Chapter Officer)
            </button>
          </div>

          {/* Society Dropdown (if society tier) */}
          {tier === "society" && (
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
                Select Society / Chapter <span className="text-destructive">*</span>
              </label>
              <select
                required
                value={societyId}
                onChange={(e) => setSocietyId(e.target.value)}
                className="w-full border-2 border-ink bg-white px-3 py-1.5 font-mono text-xs font-bold"
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
            <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
              Role Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="e.g. Chair, Secretary, Treasurer, Webmaster"
              className="w-full border-2 border-ink bg-white px-3 py-1.5 font-sans text-sm focus:outline-hidden"
            />
          </div>

          {/* Years */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
                Start Year
              </label>
              <input
                type="text"
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                placeholder="2023"
                className="w-full border-2 border-ink bg-white px-3 py-1.5 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
                End Year
              </label>
              <input
                type="text"
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
                placeholder="2024"
                className="w-full border-2 border-ink bg-white px-3 py-1.5 font-mono text-xs"
              />
            </div>
          </div>

          {/* Is Current Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_current"
              checked={isCurrent}
              onChange={(e) => setIsCurrent(e.target.checked)}
              className="h-4 w-4 border-2 border-ink rounded-none text-primary"
            />
            <label htmlFor="is_current" className="font-mono text-xs text-ink">
              Currently holding this position
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-tactile-amber inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold uppercase"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{isSubmitting ? "Adding..." : "Add Role"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
