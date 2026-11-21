import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader, Footer } from "@/components/ui";
import {
  getPublicMilestones,
  getPublicSocieties,
  getPublicMilestoneMembers,
  getPublicMembers,
} from "@/lib/archive";
import { MilestoneList } from "./milestone-list";

export const metadata: Metadata = {
  title: "Milestones — NISB People & Milestones",
  description: "Key events and achievements in NISB's institutional history.",
};

interface MilestonesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function MilestonesPage({
  searchParams,
}: MilestonesPageProps) {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        backLabel="Home"
        backHref="/"
        eyebrow="NIE IEEE Student Branch"
        title="Milestones"
        description="Key events and achievements in the branch's history. Chronological institutional record."
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10 md:px-12">
        <Suspense
          fallback={
            <div className="border border-border rounded-sm bg-paper p-10 text-center">
              <p className="font-mono text-sm text-muted">Loading milestones...</p>
            </div>
          }
        >
          <MilestonesPageContent searchParams={searchParams} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

async function MilestonesPageContent({
  searchParams,
}: MilestonesPageProps) {
  const [
    milestonesRes,
    societiesRes,
    milestoneMembersRes,
    membersRes,
    resolvedSearchParams,
  ] = await Promise.all([
    getPublicMilestones(),
    getPublicSocieties(),
    getPublicMilestoneMembers(),
    getPublicMembers(),
    searchParams,
  ]);

  return (
    <MilestoneList
      initialMilestones={milestonesRes.data}
      initialSocieties={societiesRes.data}
      initialMilestoneMembers={milestoneMembersRes.data}
      initialMembers={membersRes.data}
      initialSearchParams={resolvedSearchParams}
      isConfigured={milestonesRes.isConfigured}
    />
  );
}
