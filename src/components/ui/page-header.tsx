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
}

export function PageHeader({
  backLabel,
  backHref,
  eyebrow,
  title,
  description,
}: PageHeaderProps) {
  return (
    <header className="border-b border-border px-6 py-8 md:px-12">
      <div className="mx-auto max-w-4xl">
        {backHref && backLabel && (
          <Link
            href={backHref}
            className="mb-4 inline-flex items-center gap-1.5 font-mono text-xs text-muted hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
            {backLabel}
          </Link>
        )}
        {eyebrow && (
          <p className="font-mono text-xs tracking-widest text-muted uppercase mb-2">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-xl text-base text-muted leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
