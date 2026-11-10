import type { MetadataRoute } from "next";
import { SITE_URL, indexable } from "@/lib/publication";

export default function robots(): MetadataRoute.Robots {
  if (!indexable()) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${SITE_URL}/sitemap.xml` };
}
