import type { Metadata } from "next";
import { contenu } from "@/content";
import { SITE_URL } from "./publication";

/**
 * Métadonnées d'une page de la vitrine : titre, description, canonical, Open Graph et Twitter.
 * Le titre reçoit le suffixe « · NEOXIX » du gabarit du layout. `robots` est hérité du layout
 * (indexable seulement en production).
 */
export function metadonneesPage({ titre, description, chemin }: { titre: string; description: string; chemin: string }): Metadata {
  const url = `${SITE_URL}${chemin === "/" ? "" : chemin}`;
  return {
    title: titre,
    description,
    alternates: { canonical: chemin },
    openGraph: {
      title: `${titre} · NEOXIX`,
      description,
      url,
      siteName: contenu.site.nom,
      locale: "fr_CA",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${titre} · NEOXIX`,
      description,
    },
  };
}
