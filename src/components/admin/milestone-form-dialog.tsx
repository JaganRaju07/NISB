"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ShieldAlert, X, Milestone } from "lucide-react";
import {
  createMilestoneAction,
  updateMilestoneAction,
} from "@/lib/actions/admin-actions";
import type { AdminMilestone, AdminSociety } from "@/lib/admin";

interface MilestoneFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  milestone?: AdminMilestone | null;
  societies: AdminSociety[];
}

export function MilestoneFormDialog({
  isOpen,
  onClose,
  milestone,
  societies,
}: MilestoneFormDialogProps) {
  const router = useRouter();
  const isEditing = Boolean(milestone);

  const [status, setStatus] = useState<string>(milestone?.status ?? "draft");
  const [verificationStatus, setVerificationStatus] = useState<string>(
    milestone?.verification_status ?? "pending"
  );
  const [milestoneYear, setMilestoneYear] = useState<string>(
    milestone?.milestone_year?.toString() ?? "2024"
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const yearNum = parseInt(milestoneYear, 10);
  const isInvalidYear =
    milestoneYear.trim() !== "" &&
    (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100);

  const isInvalidPublication =
    status === "published" && verificationStatus !== "confirmed";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isInvalidYear) {
      setError("Milestone year must be a valid integer between 1900 and 2100.");
      return;
    }

    if (isInvalidPublication) {
      setError(
        "Publication Constraint Violation: A milestone can only be set to 'published' when verification status is 'confirmed'."
      );
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      let res;
      if (isEditing && milestone) {
        res = await updateMilestoneAction(milestone.id, formData);
      } else {
        res = await createMilestoneAction(formData);
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
      setError(err instanceof Error ? err.message : "Failed to save milestone");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="space-y-0.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-sky-400 font-bold">
              Archival Admin Portal
            </span>
            <h2 className="font-mono text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Milestone className="h-5 w-5 text-amber-400" />
              <span>
                {isEditing
                  ? `Edit Milestone: ${milestone?.title}`
                  : "Record New Milestone"}
              </span>
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
                <strong>Publication Constraint Alert:</strong> Database check constraint{" "}
                (<code>chk_milestones_publication_integrity</code>) forbids publishing unconfirmed
                milestones. Set verification status to &quot;confirmed&quot; or keep status as &quot;draft&quot;.
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase text-slate-300 mb-1">
              Milestone Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              defaultValue={milestone?.title ?? ""}
              placeholder="e.g. Inauguration of NISB Chapter"
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-sans text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* Year & Date */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-slate-300 mb-1">
                Milestone Year (1900–2100) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                name="milestone_year"
                required
                min={1900}
                max={2100}
                value={milestoneYear}
                onChange={(e) => setMilestoneYear(e.target.value)}
                placeholder="2024"
                className={`w-full rounded-md border bg-slate-950 px-3 py-2 font-mono text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 ${
                  isInvalidYear
                    ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500"
                    : "border-slate-700 focus:border-sky-500 focus:ring-sky-500"
                }`}
              />
              {isInvalidYear && (
                <p className="mt-1 font-mono text-[10px] text-rose-400">
                  Must be between 1900 and 2100.
                </p>
              )}
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase text-slate-300 mb-1">
                Exact Date / Period
              </label>
              <input
                type="text"
                name="date"
                defaultValue={milestone?.date ?? ""}
                placeholder="e.g. October 2023 or 2023-10-15"
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Category & Associated Society */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-slate-300 mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                defaultValue={milestone?.category ?? ""}
                placeholder="e.g. Charter, Inauguration, Award, Symposium"
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-sans text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase text-slate-300 mb-1">
                Associated Society / Chapter
              </label>
              <select
                name="society_id"
                defaultValue={milestone?.society_id ?? ""}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-100 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              >
                <option value="">None (Branch-Wide Milestone)</option>
                {societies.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.slug})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase text-slate-300 mb-1">
              Description / Historical Significance
            </label>
            <textarea
              name="description"
              rows={3}
              defaultValue={milestone?.description ?? ""}
              placeholder="Factual archival summary of the event or achievement."
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-sans text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* Publication Status & Verification Status */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-t border-slate-800 pt-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-slate-300 mb-1">
                Status <span className="text-rose-400">*</span>
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
                Only published milestones appear on the public timeline.
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
                <option value="source_listed">Source Listed (Reported)</option>
                <option value="confirmed">Confirmed (Archival Provenance)</option>
              </select>
              <p className="mt-1 font-mono text-[10px] text-slate-400">
                Requires confirmed status to be published.
              </p>
            </div>
          </div>

          {/* Private Admin Note */}
          <div className="border-t border-slate-800 pt-4">
            <label className="block font-mono text-xs font-bold uppercase text-slate-300 mb-1">
              Private Administrative Audit Note{" "}
              <span className="font-normal text-slate-400">(Internal Provenance)</span>
            </label>
            <textarea
              name="source_note"
              rows={2}
              defaultValue={milestone?.source_note ?? ""}
              placeholder="e.g. Sourced from branch annual report 2023. Verified with branch counselor."
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
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
              disabled={isSubmitting || isInvalidPublication || isInvalidYear}
              className="btn-tactile-amber px-5 py-2 text-xs font-bold uppercase disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Save Changes"
                : "Record Milestone"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
