import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://archive.nisb.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/directory", "/milestones", "/societies", "/about"],
        disallow: ["/admin", "/admin/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
