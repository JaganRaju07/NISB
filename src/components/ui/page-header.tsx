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
    <header className="section-rule py-16 sm:py-20">
      <div className="site-container hairline-grid flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          {backHref && backLabel && (
            <Link
              href={backHref}
              className="group mb-5 inline-flex items-center gap-2 mono-label text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              <span>{backLabel}</span>
            </Link>
          )}

          {eyebrow && (
            <div className="flex items-center gap-2 mb-4 mono-label text-[var(--accent)]">
              <span className="inline-block h-1 w-1 rounded-full bg-[var(--accent)]" />
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
