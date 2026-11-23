import Link from "next/link";
import { Search, Home } from "lucide-react";
import { Footer } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col bg-slate-950 text-slate-100">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 sm:px-8 text-center bg-blueprint-grid">
        <div className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 font-mono text-xs text-sky-400 mb-4">
          ERROR 404 · RECORD NOT INDEXED
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
          Page Not Found
        </h1>
        <p className="max-w-md text-sm text-slate-400 mb-8 leading-relaxed">
          The requested page has not been published.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md bg-sky-600 hover:bg-sky-500 px-4 py-2.5 text-xs font-semibold text-white transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/directory"
            className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
          >
            <Search className="h-3.5 w-3.5 text-sky-400" />
            <span>Search Member Directory</span>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
