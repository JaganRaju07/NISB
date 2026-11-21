import type { Metadata } from "next";
import { PageHeader, Footer } from "@/components/ui";
import { getPublicMembers, getPublicMemberRoles } from "@/lib/archive";
import { DirectoryList } from "./directory-list";

export const metadata: Metadata = {
  title: "Directory — NISB People & Milestones",
  description: "An indexed institutional roster of NIE IEEE Student Branch members, past and present.",
};

export default async function DirectoryPage() {
  const [membersRes, rolesRes] = await Promise.all([
    getPublicMembers(),
    getPublicMemberRoles(),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        backLabel="Home"
        backHref="/"
        eyebrow="NIE IEEE Student Branch"
        title="Directory"
        description="An indexed list of NISB members, past and present. Ruled archival record."
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10 md:px-12">
        <DirectoryList
          initialMembers={membersRes.data}
          initialRoles={rolesRes.data}
          isConfigured={membersRes.isConfigured}
        />
      </main>

      <Footer />
    </div>
  );
}
