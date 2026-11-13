import type { MetadataRoute } from "next";
import { contenu } from "@/content";
import { SITE_URL } from "@/lib/publication";

export default function sitemap(): MetadataRoute.Sitemap {
  const chemins = [
    "/",
    "/services",
    ...contenu.services.poles.map((p) => `/services/${p.slug}`),
    "/tarifs",
    ...contenu.offres.items.map((o) => `/offres/${o.slug}`),
    "/methode",
    "/contact",
    "/confidentialite",
  ];
  return chemins.map((chemin) => ({ url: `${SITE_URL}${chemin === "/" ? "" : chemin}` }));
}
