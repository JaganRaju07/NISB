import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  /** Breadcrumb label for back link */
  backLabel?: string;
  /** Back link href */
  backHref?: string;
  /** Small upper label */
  eyebrow?: string;
  /** Main heading */
  title: string;
  /** Optional description */
  description?: string;
  /** Optional extra right element */
  action?: React.ReactNode;
}

export function PageHeader({
  backLabel,
  backHref,
  eyebrow,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <header className="relative border-b border-slate-800/80 bg-slate-950/70 py-8 sm:py-10 px-4 sm:px-8 bg-blueprint-grid">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          {backHref && backLabel && (
            <Link
              href={backHref}
              className="group mb-4 inline-flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-sky-400 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              <span>{backLabel}</span>
            </Link>
          )}

          {eyebrow && (
            <div className="flex items-center gap-2 mb-2 font-mono text-xs uppercase tracking-widest text-sky-400">
              <span className="inline-block h-1 w-1 rounded-full bg-sky-400" />
              <span>{eyebrow}</span>
            </div>
          )}

          <h1 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            {title}
          </h1>

          {description && (
            <p className="mt-3 max-w-2xl text-sm md:text-base text-slate-300 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}
