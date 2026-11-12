import { fr } from "./fr";
import type { Contenu, ElementCatalogue, OffreDemarrage, Pole } from "./types";

export type { Contenu, Pole } from "./types";

/** Langue par défaut du site. Une entrée `en` s'ajoutera ici. */
export const contenus = { fr } as const satisfies Record<string, Contenu>;

export const contenu: Contenu = contenus.fr;

export function trouverPole(slug: string): Pole | undefined {
  return contenu.services.poles.find((pole) => pole.slug === slug);
}

/** Élément du catalogue par identifiant stable. */
export function trouverElement(id: string): ElementCatalogue | undefined {
  return contenu.catalogue.elements.find((element) => element.id === id);
}

/** Éléments du catalogue rattachés à un pôle, dans l'ordre du catalogue. */
export function elementsDuPole(slug: string): ElementCatalogue[] {
  return contenu.catalogue.elements.filter((element) => element.pole === slug);
}

/** Éléments du catalogue référencés par une offre, dans l'ordre de l'offre. */
export function elementsDeLOffre(offre: OffreDemarrage): ElementCatalogue[] {
  return offre.references.map(trouverElement).filter((e): e is ElementCatalogue => e !== undefined);
}

export function trouverOffre(slug: string): OffreDemarrage | undefined {
  return contenu.offres.items.find((offre) => offre.slug === slug);
}

export function lienCourriel(sujet: string = contenu.site.sujetCourriel): string {
  return `mailto:${contenu.site.courriel}?subject=${encodeURIComponent(sujet)}`;
}
