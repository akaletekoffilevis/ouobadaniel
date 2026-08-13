import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/admin`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.1,
    },
  ];
}
