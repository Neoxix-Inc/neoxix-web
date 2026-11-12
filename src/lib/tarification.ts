import type { ElementCatalogue } from "@/content/types";

/**
 * Affichage des montants. Les montants proposés ne sont pas publiés sur neoxix.ca en production
 * tant qu'ils ne sont pas approuvés : hors production (local, aperçus), ils sont visibles et
 * étiquetés « proposé ». `VERCEL_ENV` est évalué au build.
 */
export function montantsAffiches(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.VERCEL_ENV !== "production";
}

/** Séparateur de milliers : espace insécable (format québécois). */
function groupes(nombre: number): string {
  return String(nombre).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const SUFFIXES: Record<ElementCatalogue["unite"], string> = {
  forfait: "",
  "par-boite": " par boîte",
  "par-heure": " / heure",
  "par-mois": " / mois",
  "par-banque": "",
  "sur-devis": "",
};

/**
 * Texte d'un montant : « à partir de 900 $ CA », « 149 $ CA / mois », « 150 $ CA par boîte »,
 * ou « Sur devis ». Retourne « Sur devis » pour tout élément à montant nul ou non affichable.
 */
export function formatMontant(element: ElementCatalogue, env: NodeJS.ProcessEnv = process.env): string {
  if (element.montant === null || !montantsAffiches(env)) return "Sur devis";
  const prefixe = element.aPartirDe ? "à partir de " : "";
  return `${prefixe}${groupes(element.montant)} $ CA${SUFFIXES[element.unite]}`;
}

/** Libellé court pour une référence d'offre : « Intitulé : montant ». */
export function reperePrix(element: ElementCatalogue, env: NodeJS.ProcessEnv = process.env): string {
  return `${element.intitule} : ${formatMontant(element, env)}`;
}
