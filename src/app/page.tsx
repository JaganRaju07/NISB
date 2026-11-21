import Link from "next/link";
import { Archive, Users, Milestone, Landmark } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-8 md:px-12">
        <div className="mx-auto max-w-4xl">
          <p className="font-mono text-xs tracking-widest text-muted uppercase mb-2">
            NIE IEEE Student Branch
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
            People &amp; Milestones
          </h1>
          <p className="mt-3 max-w-xl text-base text-muted leading-relaxed">
            An institutional archive of the members who have shaped NISB and the
            milestones that mark its journey.
          </p>
        </div>
      </header>

      {/* Navigation */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10 md:px-12">
        <nav aria-label="Main sections">
          <ul className="divide-y divide-border">
            <li>
              <Link
                href="/directory"
                className="group flex items-center gap-4 py-5 transition-colors hover:text-accent"
              >
                <Users
                  className="h-5 w-5 text-muted group-hover:text-accent transition-colors"
                  strokeWidth={1.5}
                />
                <div className="flex-1">
                  <span className="text-lg font-semibold">Directory</span>
                  <p className="mt-0.5 text-sm text-muted">
                    Browse the indexed list of NISB members, past and present.
                  </p>
                </div>
                <span className="font-mono text-xs text-muted group-hover:text-accent">
                  →
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/milestones"
                className="group flex items-center gap-4 py-5 transition-colors hover:text-accent"
              >
                <Milestone
                  className="h-5 w-5 text-muted group-hover:text-accent transition-colors"
                  strokeWidth={1.5}
                />
                <div className="flex-1">
                  <span className="text-lg font-semibold">Milestones</span>
                  <p className="mt-0.5 text-sm text-muted">
                    Key events and achievements in the branch&apos;s history.
                  </p>
                </div>
                <span className="font-mono text-xs text-muted group-hover:text-accent">
                  →
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/societies"
                className="group flex items-center gap-4 py-5 transition-colors hover:text-accent"
              >
                <Landmark
                  className="h-5 w-5 text-muted group-hover:text-accent transition-colors"
                  strokeWidth={1.5}
                />
                <div className="flex-1">
                  <span className="text-lg font-semibold">Societies &amp; Chapters</span>
                  <p className="mt-0.5 text-sm text-muted">
                    Explore IEEE societies and student affinity groups under NISB.
                  </p>
                </div>
                <span className="font-mono text-xs text-muted group-hover:text-accent">
                  →
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="group flex items-center gap-4 py-5 transition-colors hover:text-accent"
              >
                <Archive
                  className="h-5 w-5 text-muted group-hover:text-accent transition-colors"
                  strokeWidth={1.5}
                />
                <div className="flex-1">
                  <span className="text-lg font-semibold">About</span>
                  <p className="mt-0.5 text-sm text-muted">
                    About this archive and NIE IEEE Student Branch.
                  </p>
                </div>
                <span className="font-mono text-xs text-muted group-hover:text-accent">
                  →
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-6 md:px-12">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <p className="font-mono text-xs text-muted">
            NISB People &amp; Milestones
          </p>
          <p className="font-mono text-xs text-muted">
            NIE, Mysuru
          </p>
        </div>
      </footer>
    </div>
  );
}
