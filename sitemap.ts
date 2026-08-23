import type { MetadataRoute } from "next";
import { courseCatalog } from "./course-catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://nikolaneet.com";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/learn`, changeFrequency: "daily", priority: 0.9 },
    ...courseCatalog.map((course) => ({ url: `${base}/learn/${course.slug}`, changeFrequency: "daily" as const, priority: 0.8 })),
  ];
}
