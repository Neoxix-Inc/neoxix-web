import { contenu } from "@/content";
import { SITE_URL } from "./publication";

/**
 * Données structurées schema.org (référencement local). Seules les informations publiées sur le site
 * figurent ici : ni téléphone, ni adresse postale, ni horaire, car aucun n'est validé.
 */
export function donneesStructurees() {
  const { site, offres } = contenu;
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.nom,
    url: SITE_URL,
    email: site.courriel,
    description: site.description,
    inLanguage: "fr-CA",
    address: { "@type": "PostalAddress", addressLocality: "Gatineau", addressRegion: "QC", addressCountry: "CA" },
    areaServed: [
      { "@type": "City", name: "Gatineau" },
      { "@type": "City", name: "Ottawa" },
      { "@type": "AdministrativeArea", name: "Outaouais" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Offres de démarrage",
      itemListElement: offres.items.map((offre) => ({
        "@type": "Offer",
        name: offre.titre,
        description: offre.accroche,
        url: `${SITE_URL}/offres/${offre.slug}`,
      })),
    },
  };
}
