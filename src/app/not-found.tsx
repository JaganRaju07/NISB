import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <p className="font-mono text-xs tracking-widest text-muted uppercase mb-4">
        404
      </p>
      <h1 className="font-display text-3xl font-semibold tracking-tight mb-3">
        Page not found
      </h1>
      <p className="text-muted text-sm mb-8">
        The page you&apos;re looking for doesn&apos;t exist in this archive.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:underline"
      >
        <ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
        Back to home
      </Link>
    </div>
  );
}
