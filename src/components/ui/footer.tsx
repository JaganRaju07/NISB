interface FooterProps {
  className?: string;
}

export function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`border-t border-border px-6 py-6 md:px-12 ${className}`}>
      <div className="mx-auto max-w-4xl flex items-center justify-between">
        <p className="font-mono text-xs text-muted">
          NISB People &amp; Milestones
        </p>
        <p className="font-mono text-xs text-muted">
          NIE, Mysuru
        </p>
      </div>
    </footer>
  );
}
