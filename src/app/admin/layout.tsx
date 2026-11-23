import type { Metadata } from "next";
import { Suspense } from "react";
import { getAdminAuthStatus } from "@/lib/admin";
import { AdminHeader } from "@/components/admin/admin-header";

export const metadata: Metadata = {
  title: "Admin — NISB",
  description: "Administration for NISB member and milestone records.",
};

async function AdminHeaderAsync() {
  const auth = await getAdminAuthStatus();
  return (
    <AdminHeader
      userEmail={auth.userEmail}
      role={auth.role}
      isConfigured={auth.isConfigured}
    />
  );
}

function AdminHeaderFallback() {
  return (
    <AdminHeader
      userEmail={null}
      role={null}
      isConfigured={true}
    />
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell min-h-screen flex flex-col">
      <Suspense fallback={<AdminHeaderFallback />}>
        <AdminHeaderAsync />
      </Suspense>
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}

