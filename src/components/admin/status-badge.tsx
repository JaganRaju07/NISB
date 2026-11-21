interface StatusBadgeProps {
  type: "status" | "verification";
  value: string | null | undefined;
}

export function StatusBadge({ type, value }: StatusBadgeProps) {
  if (!value) return <span className="font-mono text-xs text-muted">—</span>;

  if (type === "status") {
    switch (value) {
      case "published":
        return (
          <span className="inline-flex items-center border-2 border-ink bg-primary px-2 py-0.5 font-mono text-[10px] font-bold text-white uppercase tracking-wider shadow-[1px_1px_0px_#141414]">
            Published
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center border border-ink bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-800 uppercase tracking-wider">
            Draft
          </span>
        );
      case "archived":
        return (
          <span className="inline-flex items-center border border-border bg-stone-100 px-2 py-0.5 font-mono text-[10px] font-medium text-stone-600 uppercase tracking-wider">
            Archived
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center border border-border px-1.5 py-0.5 font-mono text-[10px]">
            {value}
          </span>
        );
    }
  }

  // Verification status
  switch (value) {
    case "confirmed":
      return (
        <span className="inline-flex items-center border-2 border-ink bg-emerald-500 px-2 py-0.5 font-mono text-[10px] font-bold text-white uppercase tracking-wider shadow-[1px_1px_0px_#141414]">
          Confirmed
        </span>
      );
    case "source_listed":
      return (
        <span className="inline-flex items-center border border-ink bg-amber-400 px-2 py-0.5 font-mono text-[10px] font-bold text-ink uppercase tracking-wider">
          Source Listed
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center border border-dashed border-amber-600 bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-medium text-amber-900 uppercase tracking-wider">
          Pending
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center border border-border px-1.5 py-0.5 font-mono text-[10px]">
          {value}
        </span>
      );
  }
}
