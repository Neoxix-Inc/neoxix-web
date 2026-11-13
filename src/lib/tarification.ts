import type { ElementCatalogue } from "@/content/types";
import { autorisationPublication } from "@/content/fr/catalogue";

/**
 * Trois niveaux distincts :
 *  1. Tarif proposé : montant du cadrage, statut `propose`. Jamais publié.
 *  2. Tarif approuvé individuellement : `statut: "approuve"` + `approbation` (référence écrite).
 *  3. Autorisation de publication commerciale : constante `autorisationPublication.autorisee` ET
 *     variable `PUBLICATION_TARIFS=autorisee`. Désactivée par défaut.
 *
 * Par défaut, aucun montant proposé n'apparaît en production. Hors production (build local),
 * les montants proposés sont visibles et étiquetés « proposé, non approuvé ».
 * Un aperçu protégé peut afficher les montants proposés seulement si `TARIFS_APERCU=protege`
 * est défini explicitement. Aucune variable Vercel n'est modifiée par ce mécanisme.
 */

/** Un montant est publiable seulement si les trois niveaux sont réunis. */
export function montantPublieAutorise(element: ElementCatalogue, env: NodeJS.ProcessEnv = process.env): boolean {
  return (
    autorisationPublication.autorisee &&
    env.PUBLICATION_TARIFS === "autorisee" &&
    element.statut === "approuve" &&
    typeof element.approbation === "string" &&
    element.approbation.length > 0
  );
}

/** Montants proposés visibles : hors production (build local), ou aperçu protégé explicitement déclaré. */
export function montantsProposesVisibles(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.VERCEL_ENV !== "production" && (env.VERCEL_ENV === undefined || env.TARIFS_APERCU === "protege");
}

/** Compatibilité : affichage global des montants (proposés ou approuvés). */
export function montantsAffiches(env: NodeJS.ProcessEnv = process.env): boolean {
  return montantsProposesVisibles(env);
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

/** Montant tel qu'il peut être affiché, ou « Sur devis » si rien n'est affichable. */
export function formatMontant(element: ElementCatalogue, env: NodeJS.ProcessEnv = process.env): string {
  if (element.montant === null) return "Sur devis";
  if (!montantPublieAutorise(element, env) && !montantsProposesVisibles(env)) return "Sur devis";
  const prefixe = element.aPartirDe ? "à partir de " : "";
  return `${prefixe}${groupes(element.montant)} $ CA${SUFFIXES[element.unite]}`;
}

/** Étiquette de statut à côté d'un montant affiché. */
export function etiquetteStatut(element: ElementCatalogue, env: NodeJS.ProcessEnv = process.env): string {
  if (element.montant === null || formatMontant(element, env) === "Sur devis") return "";
  return montantPublieAutorise(element, env) ? "Approuvé" : "Proposé, non approuvé";
}

/** Libellé court pour une référence d'offre : « Intitulé : montant ». */
export function reperePrix(element: ElementCatalogue, env: NodeJS.ProcessEnv = process.env): string {
  return `${element.intitule} : ${formatMontant(element, env)}`;
}
