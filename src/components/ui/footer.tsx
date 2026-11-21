interface FooterProps {
  className?: string;
}

export function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`border-t border-border px-6 py-6 md:px-12 ${className}`}>
      <div className="mx-auto max-w-4xl flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-muted">
          NISB People &amp; Milestones · NIE, Mysuru
        </p>
        <p className="font-mono text-xs text-muted">
          Data as published on nisb.in
        </p>
      </div>
    </footer>
  );
}
