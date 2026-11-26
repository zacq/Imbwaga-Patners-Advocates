import type { MetadataRoute } from "next";
import { FIRM_CONTACT } from "@/lib/compliance";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `https://${FIRM_CONTACT.domain}/sitemap.xml`,
  };
}
