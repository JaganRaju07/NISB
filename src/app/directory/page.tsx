import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader, Footer } from "@/components/ui";
import {
  getPublicMembers,
  getPublicMemberRoles,
  getPublicSocieties,
} from "@/lib/archive";
import { DirectoryList } from "./directory-list";

export const metadata: Metadata = {
  title: "Member Directory — NISB Digital Archive",
  description:
    "An indexed institutional directory of NIE IEEE Student Branch officers, committee leaders, and members.",
};

interface DirectoryPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function DirectoryPage({
  searchParams,
}: DirectoryPageProps) {
  return (
    <div className="flex flex-1 flex-col bg-slate-950 text-slate-100">
      <PageHeader
        backLabel="Home"
        backHref="/"
        eyebrow="Institutional Leadership Directory"
        title="Member Directory"
        description="Official directory and indexed archival records of NIE IEEE Student Branch officers, technical chapter leads, and committee members."
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-8">
        <Suspense
          fallback={
            <div className="border border-slate-800 rounded-lg bg-slate-900/40 p-12 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
              <p className="font-mono text-sm text-slate-400 mt-3">Loading directory...</p>
            </div>
          }
        >
          <DirectoryPageContent searchParams={searchParams} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

async function DirectoryPageContent({
  searchParams,
}: DirectoryPageProps) {
  const [membersRes, rolesRes, societiesRes, resolvedSearchParams] =
    await Promise.all([
      getPublicMembers(),
      getPublicMemberRoles(),
      getPublicSocieties(),
      searchParams,
    ]);

  return (
    <DirectoryList
      initialMembers={membersRes.data}
      initialRoles={rolesRes.data}
      initialSocieties={societiesRes.data}
      initialSearchParams={resolvedSearchParams}
      isConfigured={membersRes.isConfigured}
    />
  );
}
