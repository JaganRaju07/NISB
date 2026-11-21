"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ShieldAlert, X } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto border-2 border-ink bg-paper p-6 shadow-[6px_6px_0px_#141414]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-ink pb-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted font-bold">
              Archival Curator Portal
            </span>
            <h2 className="font-mono text-xl font-bold tracking-tight text-ink">
              {isEditing
                ? `Edit Milestone: ${milestone?.title}`
                : "Record New Milestone"}
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
                <strong>Publication Constraint Alert:</strong> Database check constraint{" "}
                (<code>chk_milestones_publication_integrity</code>) forbids publishing unconfirmed
                milestones. Set verification status to &quot;confirmed&quot; or keep status as &quot;draft&quot;.
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
              Milestone Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              defaultValue={milestone?.title ?? ""}
              placeholder="e.g. Inauguration of NISB Chapter"
              className="w-full border-2 border-ink bg-white px-3 py-1.5 font-sans text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Year & Date */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
                Milestone Year (1900–2100) <span className="text-destructive">*</span>
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
                className={`w-full border-2 bg-white px-3 py-1.5 font-mono text-sm focus:outline-hidden ${
                  isInvalidYear ? "border-destructive" : "border-ink"
                }`}
              />
              {isInvalidYear && (
                <p className="mt-1 font-mono text-[10px] text-destructive">
                  Must be between 1900 and 2100.
                </p>
              )}
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
                Exact Date / Period
              </label>
              <input
                type="text"
                name="date"
                defaultValue={milestone?.date ?? ""}
                placeholder="e.g. October 2023 or 2023-10-15"
                className="w-full border-2 border-ink bg-white px-3 py-1.5 font-mono text-sm focus:outline-hidden"
              />
            </div>
          </div>

          {/* Category & Associated Society */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                defaultValue={milestone?.category ?? ""}
                placeholder="e.g. Charter, Inauguration, Award, Symposium"
                className="w-full border-2 border-ink bg-white px-3 py-1.5 font-sans text-sm focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
                Associated Society / Chapter
              </label>
              <select
                name="society_id"
                defaultValue={milestone?.society_id ?? ""}
                className="w-full border-2 border-ink bg-white px-3 py-1.5 font-mono text-xs"
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
            <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
              Description / Historical Significance
            </label>
            <textarea
              name="description"
              rows={3}
              defaultValue={milestone?.description ?? ""}
              placeholder="Factual archival summary of the event or achievement."
              className="w-full border-2 border-ink bg-white px-3 py-2 font-sans text-sm"
            />
          </div>

          {/* Publication Status & Verification Status */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-t border-border pt-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
                Status <span className="text-destructive">*</span>
              </label>
              <select
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border-2 border-ink bg-white px-3 py-1.5 font-mono text-xs font-bold uppercase"
              >
                <option value="draft">Draft (Staged)</option>
                <option value="published">Published (Public View)</option>
                <option value="archived">Archived (Historical)</option>
              </select>
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
                <option value="source_listed">Source Listed (Official Record)</option>
                <option value="confirmed">Confirmed (Verified)</option>
              </select>
            </div>
          </div>

          {/* Private Curator Note */}
          <div className="border-t border-border pt-4">
            <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
              Private Curatorial Audit Note{" "}
              <span className="font-normal text-muted">(Excluded from public view)</span>
            </label>
            <textarea
              name="source_note"
              rows={2}
              defaultValue={milestone?.source_note ?? ""}
              placeholder="e.g. Verified against IEEE Bangalore Section annual general meeting minutes."
              className="w-full border-2 border-ink bg-white px-3 py-2 font-mono text-xs"
            />
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
              disabled={isSubmitting || isInvalidPublication || isInvalidYear}
              className="btn-tactile-amber px-5 py-1.5 text-xs font-bold uppercase disabled:opacity-50"
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
