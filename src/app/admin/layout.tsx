import type { Metadata } from "next";
import { getAdminAuthStatus } from "@/lib/admin";
import { AdminHeader } from "@/components/admin/admin-header";

export const metadata: Metadata = {
  title: "Admin Portal — NISB Digital Archive",
  description: "Administrative archive management, member staging, and verification.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getAdminAuthStatus();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <AdminHeader
        userEmail={auth.userEmail}
        role={auth.role}
        isConfigured={auth.isConfigured}
      />
      <div className="flex-1 flex flex-col bg-blueprint-grid">
        {children}
      </div>
    </div>
  );
}
