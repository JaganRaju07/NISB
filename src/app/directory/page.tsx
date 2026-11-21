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
  title: "Directory — NISB People & Milestones",
  description:
    "An indexed institutional roster of NIE IEEE Student Branch members, past and present.",
};

interface DirectoryPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function DirectoryPage({
  searchParams,
}: DirectoryPageProps) {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        backLabel="Home"
        backHref="/"
        eyebrow="NIE IEEE Student Branch"
        title="Directory"
        description="An indexed archival roster of NISB members, past and present. Ruled archival record."
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10 md:px-12">
        <Suspense
          fallback={
            <div className="border border-border rounded-sm bg-paper p-10 text-center">
              <p className="font-mono text-sm text-muted">Loading directory...</p>
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
