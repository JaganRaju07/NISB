import type { PublicMember, MemberRole, PublicMilestone, Society } from "./validation";

/**
 * Formats a member's role tier into an institutional display label.
 * For branch-level roles returns "Branch".
 * For society-level roles returns "Society (Society Name)" or "Society".
 */
export function formatRoleTierLabel(
  tier: "branch" | "society",
  societyName?: string | null
): string {
  if (tier === "branch") {
    return "Branch";
  }
  return societyName ? `Society (${societyName})` : "Society";
}

/**
 * Formats tenure years into an en-dash joined archival string.
 * e.g. "2023–2024", "2024", or null if neither year is present.
 */
export function formatTenure(
  start?: string | null,
  end?: string | null
): string | null {
  const s = start?.trim();
  const e = end?.trim();
  if (s && e) {
    return s === e ? s : `${s}–${e}`;
  }
  if (s) return s;
  if (e) return e;
  return null;
}

/**
 * Determines whether a member's record sheet has zero optional content
 * (bio, technical interests, contributions, and tenure start/end are all empty).
 * When true, the quiet committee line should be rendered.
 */
export function isMemberRecordEmpty(member: {
  bio?: string | null;
  interests?: string[] | null;
  contributions?: string | null;
  tenure_start?: string | null;
  tenure_end?: string | null;
}): boolean {
  const hasBio = Boolean(member.bio?.trim());
  const hasInterests = Boolean(
    member.interests &&
      member.interests.length > 0 &&
      member.interests.some((i) => i.trim().length > 0)
  );
  const hasContributions = Boolean(member.contributions?.trim());
  const hasTenure = Boolean(
    member.tenure_start?.trim() || member.tenure_end?.trim()
  );

  return !hasBio && !hasInterests && !hasContributions && !hasTenure;
}

export interface MemberFilterOptions {
  searchQuery?: string;
  department?: string;
  batch?: string;
  society?: string; // slug or UUID
  tier?: string; // "branch" | "society" | "all"
}

/**
 * Pure helper filtering members according to search query, department, batch,
 * society affiliation (by slug or id), and role tier.
 */
export function filterDirectoryMembers(
  members: PublicMember[],
  rolesByMember: Map<string, MemberRole[]>,
  societyMap: Map<string, Society>,
  options: MemberFilterOptions
): PublicMember[] {
  const { searchQuery, department, batch, society, tier } = options;
  const q = searchQuery?.toLowerCase().trim();

  return members.filter((member) => {
    const memberRoles = rolesByMember.get(member.id) ?? [];

    // Search query filter
    if (q) {
      const matchesName = member.full_name.toLowerCase().includes(q);
      const matchesRole = member.role?.toLowerCase().includes(q) ?? false;
      const matchesDept = member.department?.toLowerCase().includes(q) ?? false;
      const matchesBio = member.bio?.toLowerCase().includes(q) ?? false;
      const matchesInterests =
        member.interests?.some((i) => i.toLowerCase().includes(q)) ?? false;
      const matchesRolesList = memberRoles.some((r) =>
        r.role_title.toLowerCase().includes(q)
      );

      if (
        !matchesName &&
        !matchesRole &&
        !matchesDept &&
        !matchesBio &&
        !matchesInterests &&
        !matchesRolesList
      ) {
        return false;
      }
    }

    // Department filter
    if (department && department !== "all" && member.department !== department) {
      return false;
    }

    // Batch filter
    if (batch && batch !== "all" && member.batch_year !== batch) {
      return false;
    }

    // Tier filter
    if (tier && tier !== "all") {
      const hasMatchingTier = memberRoles.some((r) => r.tier === tier);
      if (!hasMatchingTier) return false;
    }

    // Society filter (by slug or id)
    if (society && society !== "all") {
      const hasMatchingSociety = memberRoles.some((r) => {
        if (!r.society_id) return false;
        if (r.society_id === society) return true;
        const s = societyMap.get(r.society_id);
        return s?.slug === society;
      });
      if (!hasMatchingSociety) return false;
    }

    return true;
  });
}

export interface MilestoneFilterOptions {
  society?: string; // slug or UUID
  year?: string | number; // YYYY or "all"
  societyMap?: Map<string, Society>;
}

/**
 * Pure helper filtering milestones by society slug/id and year.
 */
export function filterPublicMilestones(
  milestones: PublicMilestone[],
  options: MilestoneFilterOptions
): PublicMilestone[] {
  const { society, year, societyMap } = options;
  const yearNum = year && year !== "all" ? Number(year) : null;

  return milestones.filter((milestone) => {
    // Society filter
    if (society && society !== "all") {
      if (!milestone.society_id) return false;
      let matchesSoc = milestone.society_id === society;
      if (!matchesSoc && societyMap) {
        const s = societyMap.get(milestone.society_id);
        matchesSoc = s?.slug === society;
      }
      if (!matchesSoc) return false;
    }

    // Year filter
    if (yearNum !== null && !isNaN(yearNum)) {
      const matchesYear =
        milestone.milestone_year === yearNum ||
        (Boolean(milestone.date) && milestone.date!.startsWith(String(yearNum)));
      if (!matchesYear) return false;
    }

    return true;
  });
}

/**
 * Extracts unique display codes for a member's society memberships
 * (e.g. ["NISB", "CS", "CASS"]).
 */
export function extractSocietyCodes(
  roles: MemberRole[],
  societyMap: Map<string, Society>
): string[] {
  const codes = new Set<string>();

  roles.forEach((r) => {
    if (r.tier === "branch") {
      codes.add("NISB");
    } else if (r.society_id) {
      const soc = societyMap.get(r.society_id);
      if (soc) {
        codes.add(soc.short_name || soc.name);
      }
    }
  });

  return Array.from(codes);
}
