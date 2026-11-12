import { catalogue as donnees } from "@/content/fr/catalogue";
import type { ElementCatalogue, OffreDemarrage } from "@/content/types";

/**
 * Accès serveur au catalogue des montants. Ce module n'est importé que par des composants serveur :
 * il ne doit jamais être importé par un composant client (`"use client"`), sinon les montants
 * seraient présents dans le JavaScript public. Vérifié par `scripts/verifier-publication.sh`.
 */
export const catalogue = donnees;

export function trouverElement(id: string): ElementCatalogue | undefined {
  return catalogue.elements.find((element) => element.id === id);
}

/** Éléments rattachés à un pôle, dans l'ordre du catalogue. */
export function elementsDuPole(slug: string): ElementCatalogue[] {
  return catalogue.elements.filter((element) => element.pole === slug);
}

/** Éléments référencés par une offre, dans l'ordre de l'offre. */
export function elementsDeLOffre(offre: OffreDemarrage): ElementCatalogue[] {
  return offre.references.map(trouverElement).filter((e): e is ElementCatalogue => e !== undefined);
}
