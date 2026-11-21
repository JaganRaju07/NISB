import type { MetadataRoute } from "next";
import {
  OFFICIAL_ROSTER_MEMBERS,
  OFFICIAL_SOCIETIES,
} from "@/lib/official-roster";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://archive.nisb.in";
  const currentDate = new Date();

  // Core public routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/directory`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/milestones`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/societies`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Technical societies routes
  const societyRoutes: MetadataRoute.Sitemap = OFFICIAL_SOCIETIES.map((soc) => ({
    url: `${baseUrl}/societies/${soc.slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Official roster member profiles
  const memberRoutes: MetadataRoute.Sitemap = OFFICIAL_ROSTER_MEMBERS.map(
    (member) => ({
      url: `${baseUrl}/directory/${member.id}`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.75,
    })
  );

  return [...staticRoutes, ...societyRoutes, ...memberRoutes];
}
