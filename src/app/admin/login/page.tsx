"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, AlertCircle, Mail, KeyRound } from "lucide-react";
import { loginAdminAction } from "@/lib/actions/admin-actions";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await loginAdminAction(formData);
      if (!res.success) {
        setError(res.error ?? "Authentication failed");
        setIsLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-md border-2 border-ink bg-white p-8 shadow-[6px_6px_0px_#141414]">
        {/* Top Eyebrow */}
        <div className="flex items-center gap-2 mb-2">
          <span className="border border-ink bg-amber-400 px-2 py-0.5 font-mono text-[10px] font-bold text-ink uppercase tracking-wider">
            Restricted Access
          </span>
          <span className="font-mono text-xs text-muted">
            Institutional Archive
          </span>
        </div>

        <h1 className="font-mono text-2xl font-bold tracking-tight text-ink">
          Curator Portal Login
        </h1>
        <p className="mt-2 font-sans text-xs text-muted-foreground leading-relaxed">
          Authorized access for archive stewards and branch counselors to manage member records,
          verification audits, and milestone chronologies.
        </p>

        {error && (
          <div className="mt-4 flex items-start gap-2 border-2 border-destructive bg-red-50 p-3 font-mono text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
              Curator Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
              <input
                type="email"
                name="email"
                required
                placeholder="curator@nisb.in"
                className="w-full border-2 border-ink bg-paper pl-9 pr-3 py-2 font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
              Access Token / Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••••••"
                className="w-full border-2 border-ink bg-paper pl-9 pr-3 py-2 font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-tactile-amber w-full py-2.5 text-xs font-bold uppercase tracking-wider disabled:opacity-50"
            >
              {isLoading ? "Authenticating..." : "Authorize Session →"}
            </button>
          </div>
        </form>

        <div className="mt-8 border-t border-border pt-4">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Protected by PostgreSQL Row-Level Security</span>
          </div>
          <p className="mt-1 font-mono text-[10px] text-muted">
            All administrative actions are cryptographically signed and logged with audit provenance.
          </p>
        </div>
      </div>
    </div>
  );
}
