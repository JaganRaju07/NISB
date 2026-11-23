interface StatusBadgeProps {
  type: "status" | "verification";
  value: string | null | undefined;
}

export function StatusBadge({ type, value }: StatusBadgeProps) {
  if (!value) return <span className="font-mono text-xs text-slate-500">—</span>;

  if (type === "status") {
    switch (value) {
      case "published":
        return (
          <span className="inline-flex items-center gap-1 rounded border border-sky-500/40 bg-sky-500/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-sky-300 ">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
            Published
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 rounded border border-slate-700 bg-slate-800/80 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
            Draft
          </span>
        );
      case "archived":
        return (
          <span className="inline-flex items-center gap-1 rounded border border-zinc-700 bg-zinc-900 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
            Retired
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded border border-slate-800 bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
            {value}
          </span>
        );
    }
  }

  // Verification status
  switch (value) {
    case "confirmed":
      return (
        <span className="inline-flex items-center gap-1 rounded border border-[var(--line)] bg-[var(--surface-2)] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Confirmed
        </span>
      );
    case "source_listed":
      return (
        <span className="inline-flex items-center gap-1 rounded border border-[var(--line)] bg-[var(--surface-2)] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          Source Listed
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1 rounded border border-dashed border-rose-500/40 bg-rose-500/15 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-rose-300">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
          Pending
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded border border-slate-800 bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
          {value}
        </span>
      );
  }
}
