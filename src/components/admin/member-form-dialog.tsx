"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ShieldAlert, X, User } from "lucide-react";
import { createMemberAction, updateMemberAction } from "@/lib/actions/admin-actions";
import { MemberAvatar } from "@/components/ui";
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
  const [photoUrl, setPhotoUrl] = useState<string>(member?.photo_url ?? "");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="space-y-0.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-sky-400 font-bold">
              Archival Admin Portal
            </span>
            <h2 className="font-mono text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <User className="h-5 w-5 text-sky-400" />
              <span>{isEditing ? `Edit Member: ${member?.full_name}` : "Create New Member"}</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 font-mono text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {isInvalidPublication && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 font-mono text-xs text-amber-200">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
              <div>
                <strong>Publication Integrity Alert:</strong> Postgres database constraint
                (<code>chk_members_publication_integrity</code>) forbids publishing records that
                are not explicitly confirmed. Please set verification status to &quot;confirmed&quot; or
                keep status as &quot;draft&quot;.
              </div>
            </div>
          )}

          {/* Official Photograph Section with Live Preview */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
            <div className="flex items-start gap-4">
              <div className="shrink-0 flex flex-col items-center gap-1.5">
                <MemberAvatar
                  name={member?.full_name || "Member Photo"}
                  photoUrl={photoUrl ? photoUrl.trim() : null}
                  size="lg"
                  className="border border-slate-700"
                />
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                  {photoUrl ? "Live Preview" : "Monogram"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <label className="block font-mono text-xs font-bold uppercase text-slate-300 mb-1">
                  Official Photograph URL (photo_url)
                </label>
                <input
                  type="text"
                  name="photo_url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="e.g. https://www.nisb.in/assets/cores25-26/SagarSingh.jpg or /assets/cores25-26/..."
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
                <p className="mt-1 font-mono text-[10px] text-slate-400 leading-tight">
                  Official NISB core photos are sourced from <code>nisb.in/content.html#team</code> or uploaded to Supabase Storage (<code>archive-media</code>). Accepts full HTTPS URLs or local root-relative paths.
                </p>
              </div>
            </div>
          </div>

          {/* Full Name & Role */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-slate-300 mb-1">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="full_name"
                required
                defaultValue={member?.full_name ?? ""}
                placeholder="e.g. Sagar Kumar Singh"
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-sans text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase text-slate-300 mb-1">
                Primary Title / Role
              </label>
              <input
                type="text"
                name="role"
                defaultValue={member?.role ?? ""}
                placeholder="e.g. Chair, Counselor, Vice Chair"
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-sans text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Department & Batch Year */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-slate-300 mb-1">
                Department
              </label>
              <input
                type="text"
                name="department"
                defaultValue={member?.department ?? ""}
                placeholder="e.g. Computer Science & Engineering"
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-sans text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase text-slate-300 mb-1">
                Batch Year
              </label>
              <input
                type="text"
                name="batch_year"
                defaultValue={member?.batch_year ?? ""}
                placeholder="e.g. 2024"
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-sans text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Tenure Start & End */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-slate-300 mb-1">
                Tenure Start
              </label>
              <input
                type="text"
                name="tenure_start"
                defaultValue={member?.tenure_start ?? ""}
                placeholder="e.g. 2023"
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-sans text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase text-slate-300 mb-1">
                Tenure End
              </label>
              <input
                type="text"
                name="tenure_end"
                defaultValue={member?.tenure_end ?? ""}
                placeholder="e.g. 2024"
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-sans text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Lifecycle Status & Verification Status */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-t border-slate-800 pt-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-slate-300 mb-1">
                Publication Status <span className="text-rose-400">*</span>
              </label>
              <select
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-100 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 uppercase"
              >
                <option value="draft">Draft (Staged)</option>
                <option value="published">Published (Public View)</option>
                <option value="archived">Archived (Retired)</option>
              </select>
              <p className="mt-1 font-mono text-[10px] text-slate-400">
                Only published records appear on the public directory.
              </p>
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase text-slate-300 mb-1">
                Verification Status <span className="text-rose-400">*</span>
              </label>
              <select
                name="verification_status"
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-100 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 uppercase"
              >
                <option value="pending">Pending (Unverified)</option>
                <option value="source_listed">Source Listed (Official Record)</option>
                <option value="confirmed">Confirmed (Audit Verified)</option>
              </select>
              <p className="mt-1 font-mono text-[10px] text-slate-400">
                Official seed defaults to source_listed.
              </p>
            </div>
          </div>

          {/* Internal Private Administrative Audit Note */}
          <div className="border-t border-slate-800 pt-4">
            <label className="block font-mono text-xs font-bold uppercase text-slate-300 mb-1">
              Private Administrative Audit Note{" "}
              <span className="font-normal text-slate-400">(Internal Only · Excluded from public view)</span>
            </label>
            <textarea
              name="source_note"
              rows={2}
              defaultValue={member?.source_note ?? ""}
              placeholder="e.g. Sourced from nisb.in/content.html#team. Verified against IEEE Bangalore Section charter."
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* Contributions to NISB */}
          <div className="border-t border-slate-800 pt-4">
            <label className="block font-mono text-xs font-bold uppercase text-slate-300 mb-1">
              Contributions to NISB
            </label>
            <textarea
              name="contributions"
              rows={3}
              defaultValue={member?.contributions ?? ""}
              placeholder="e.g. Key branch initiatives, organized symposiums, student activities, or awards won."
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-sans text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
            <p className="mt-1 font-mono text-[10px] text-slate-400">
              Institutional contributions and achievements (optional, up to 2000 characters).
            </p>
          </div>

          {/* Bio & Interests */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-slate-300 mb-1">
                Bio / Citation
              </label>
              <textarea
                name="bio"
                rows={2}
                defaultValue={member?.bio ?? ""}
                placeholder="Institutional note or verified citation"
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-sans text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase text-slate-300 mb-1">
                Interests (Comma-separated)
              </label>
              <input
                type="text"
                name="interests"
                defaultValue={member?.interests?.join(", ") ?? ""}
                placeholder="e.g. VLSI, Robotics, Signal Processing"
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-sans text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn-tactile-ghost px-4 py-2 text-xs font-bold uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isInvalidPublication}
              className="btn-tactile-amber px-5 py-2 text-xs font-bold uppercase disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
