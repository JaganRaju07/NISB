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
  title: "Milestones & History — NISB Digital Archive",
  description:
    "A chronological institutional archive of major achievements, chapter foundations, and events of NIE IEEE Student Branch (STB64141).",
};

interface MilestonesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function MilestonesPage({
  searchParams,
}: MilestonesPageProps) {
  return (
    <div className="flex flex-1 flex-col bg-slate-950 text-slate-100">
      <PageHeader
        backLabel="Home"
        backHref="/"
        eyebrow="Institutional Historical Timeline"
        title="Branch Milestones"
        description="Chronological record of official milestones, chapter establishments, flagship fests, and Region 10 achievements of NIE IEEE Student Branch."
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-8">
        <Suspense
          fallback={
            <div className="border border-slate-800 rounded-lg bg-slate-900/40 p-12 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
              <p className="font-mono text-sm text-slate-400 mt-3">Loading milestones...</p>
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
