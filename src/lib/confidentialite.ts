import type { Contenu } from "@/content/types";

type Section = { titre: string; texte: string };

/**
 * Sections de la politique à afficher selon le mode du formulaire.
 * Les sections communes (dont « Accès et conservation des demandes ») sont toujours visibles :
 * seules la description du formulaire et du circuit réel dépendent du mode.
 */
export function sectionsConfidentialite(c: Contenu["confidentialite"], mode: "mock" | "live" | "off"): Section[] {
  const [premiere, ...autres] = c.sections;
  return mode === "live" ? [premiere, ...c.avecFormulaire, ...autres] : [premiere, c.sansFormulaire, ...autres];
}
