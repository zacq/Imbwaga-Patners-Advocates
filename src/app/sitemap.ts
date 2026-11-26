import type { MetadataRoute } from "next";
import { readStore } from "@/lib/store";
import { FIRM_CONTACT } from "@/lib/compliance";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = `https://${FIRM_CONTACT.domain}`;
  const store = readStore();

  const staticRoutes = [
    "",
    "/about",
    "/advocates",
    "/areas-of-practice",
    "/how-we-work",
    "/request-consultation",
    "/insights",
    "/faqs",
    "/careers",
    "/contact",
    "/legal",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  const practiceRoutes = store.practiceAreas
    .filter((a) => a.status === "published")
    .map((area) => ({
      url: `${baseUrl}/areas-of-practice/${area.slug}`,
      lastModified: new Date(area.updatedAt),
    }));

  const advocateRoutes = store.advocates
    .filter((a) => a.status === "published")
    .map((adv) => ({
      url: `${baseUrl}/advocates/${adv.slug}`,
      lastModified: new Date(adv.updatedAt),
    }));

  const insightRoutes = store.insights
    .filter((i) => i.status === "published")
    .map((ins) => ({
      url: `${baseUrl}/insights/${ins.slug}`,
      lastModified: new Date(ins.publishedAt),
    }));

  return [...staticRoutes, ...practiceRoutes, ...advocateRoutes, ...insightRoutes];
}
