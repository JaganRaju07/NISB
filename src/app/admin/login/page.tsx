"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Mail, KeyRound } from "lucide-react";
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
      <div className="w-full max-w-md rounded-xl border border-[var(--line)] bg-[var(--surface)] p-8">
        {/* Top Eyebrow */}
        <div className="flex items-center gap-2 mb-2">
          <span className="rounded border border-amber-500/40 bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300 uppercase tracking-wider">
            Restricted Access
          </span>
          <span className="font-mono text-xs text-slate-400">
            Administration
          </span>
        </div>

        <h1 className="font-mono text-2xl font-bold tracking-tight text-white">
          Admin Portal Login
        </h1>
        <p className="mt-2 font-sans text-xs text-slate-400 leading-relaxed">
          Authorized access for branch administrators to manage member records,
          verification audits, and milestone chronologies.
        </p>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 font-mono text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block font-mono text-xs font-bold uppercase text-slate-300 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                name="email"
                required
                placeholder="admin@nisb.in"
                className="w-full rounded-md border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 font-mono text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs font-bold uppercase text-slate-300 mb-1.5">
              Access Token / Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••••••"
                className="w-full rounded-md border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 font-mono text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
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
      </div>
    </div>
  );
}
