"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ShieldAlert, X } from "lucide-react";
import { createMemberAction, updateMemberAction } from "@/lib/actions/admin-actions";
import type { AdminMember } from "@/lib/admin";

interface MemberFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  member?: AdminMember | null;
}

export function MemberFormDialog({
  isOpen,
  onClose,
  member,
}: MemberFormDialogProps) {
  const router = useRouter();
  const isEditing = Boolean(member);

  const [status, setStatus] = useState<string>(member?.status ?? "draft");
  const [verificationStatus, setVerificationStatus] = useState<string>(
    member?.verification_status ?? "pending"
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Real-time publication integrity validation feedback
  const isInvalidPublication =
    status === "published" && verificationStatus !== "confirmed";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isInvalidPublication) {
      setError(
        "Publication Constraint Violation: A record can only be set to 'published' when verification status is 'confirmed'."
      );
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      let res;
      if (isEditing && member) {
        res = await updateMemberAction(member.id, formData);
      } else {
        res = await createMemberAction(formData);
      }

      if (!res.success) {
        setError(res.error ?? "An error occurred");
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      onClose();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save record");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-ink bg-paper p-6 shadow-[6px_6px_0px_#141414]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-ink pb-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted font-bold">
              Archival Curator Portal
            </span>
            <h2 className="font-mono text-xl font-bold tracking-tight text-ink">
              {isEditing ? `Edit Member: ${member?.full_name}` : "Create New Member"}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {error && (
            <div className="flex items-start gap-2 border-2 border-destructive bg-red-50 p-3 font-mono text-xs text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {isInvalidPublication && (
            <div className="flex items-start gap-2 border-2 border-amber-600 bg-amber-50 p-3 font-mono text-xs text-amber-900">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
              <div>
                <strong>Publication Integrity Alert:</strong> Postgres database constraint
                (<code>chk_members_publication_integrity</code>) forbids publishing records that
                are not explicitly confirmed. Please set verification status to &quot;confirmed&quot; or
                keep status as &quot;draft&quot;.
              </div>
            </div>
          )}

          {/* Full Name & Role */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                name="full_name"
                required
                defaultValue={member?.full_name ?? ""}
                placeholder="e.g. Sagar Kumar Singh"
                className="w-full border-2 border-ink bg-white px-3 py-1.5 font-sans text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
                Primary Title / Role
              </label>
              <input
                type="text"
                name="role"
                defaultValue={member?.role ?? ""}
                placeholder="e.g. Chair, Counselor, Vice Chair"
                className="w-full border-2 border-ink bg-white px-3 py-1.5 font-sans text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Department & Batch Year */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
                Department
              </label>
              <input
                type="text"
                name="department"
                defaultValue={member?.department ?? ""}
                placeholder="e.g. Computer Science & Engineering"
                className="w-full border-2 border-ink bg-white px-3 py-1.5 font-sans text-sm focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
                Batch Year
              </label>
              <input
                type="text"
                name="batch_year"
                defaultValue={member?.batch_year ?? ""}
                placeholder="e.g. 2024"
                className="w-full border-2 border-ink bg-white px-3 py-1.5 font-sans text-sm focus:outline-hidden"
              />
            </div>
          </div>

          {/* Tenure Start & End */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
                Tenure Start
              </label>
              <input
                type="text"
                name="tenure_start"
                defaultValue={member?.tenure_start ?? ""}
                placeholder="e.g. 2023"
                className="w-full border-2 border-ink bg-white px-3 py-1.5 font-sans text-sm focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
                Tenure End
              </label>
              <input
                type="text"
                name="tenure_end"
                defaultValue={member?.tenure_end ?? ""}
                placeholder="e.g. 2024"
                className="w-full border-2 border-ink bg-white px-3 py-1.5 font-sans text-sm focus:outline-hidden"
              />
            </div>
          </div>

          {/* Lifecycle Status & Verification Status */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-t border-border pt-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
                Publication Status <span className="text-destructive">*</span>
              </label>
              <select
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border-2 border-ink bg-white px-3 py-1.5 font-mono text-xs font-bold uppercase"
              >
                <option value="draft">Draft (Staged)</option>
                <option value="published">Published (Public View)</option>
                <option value="archived">Archived (Retired)</option>
              </select>
              <p className="mt-1 font-mono text-[10px] text-muted">
                Only published records appear on the public directory.
              </p>
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
                Verification Status <span className="text-destructive">*</span>
              </label>
              <select
                name="verification_status"
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value)}
                className="w-full border-2 border-ink bg-white px-3 py-1.5 font-mono text-xs font-bold uppercase"
              >
                <option value="pending">Pending (Unverified)</option>
                <option value="source_listed">Source Listed (Official Roster)</option>
                <option value="confirmed">Confirmed (Audit Verified)</option>
              </select>
              <p className="mt-1 font-mono text-[10px] text-muted">
                Official seed defaults to source_listed.
              </p>
            </div>
          </div>

          {/* Internal Private Curatorial Audit Note */}
          <div className="border-t border-border pt-4">
            <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
              Private Curatorial Audit Note{" "}
              <span className="font-normal text-muted">(Internal Only · Excluded from public view)</span>
            </label>
            <textarea
              name="source_note"
              rows={2}
              defaultValue={member?.source_note ?? ""}
              placeholder="e.g. Sourced from nisb.in/content.html#team. Verified against IEEE Bangalore Section charter."
              className="w-full border-2 border-ink bg-white px-3 py-2 font-mono text-xs"
            />
          </div>

          {/* Bio & Interests */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
                Bio / Citation
              </label>
              <textarea
                name="bio"
                rows={2}
                defaultValue={member?.bio ?? ""}
                placeholder="Institutional note or verified citation"
                className="w-full border-2 border-ink bg-white px-3 py-2 font-sans text-sm"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
                Interests (Comma-separated)
              </label>
              <input
                type="text"
                name="interests"
                defaultValue={member?.interests?.join(", ") ?? ""}
                placeholder="e.g. VLSI, Robotics, Signal Processing"
                className="w-full border-2 border-ink bg-white px-3 py-1.5 font-sans text-sm"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 border-t-2 border-ink pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn-tactile-ghost px-4 py-1.5 text-xs font-bold uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isInvalidPublication}
              className="btn-tactile-amber px-5 py-1.5 text-xs font-bold uppercase disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
