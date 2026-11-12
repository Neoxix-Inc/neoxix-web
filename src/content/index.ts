import { fr } from "./fr";
import type { Contenu, OffreDemarrage, Pole } from "./types";

export type { Contenu, Pole } from "./types";

/** Langue par défaut du site. Une entrée `en` s'ajoutera ici. */
export const contenus = { fr } as const satisfies Record<string, Contenu>;

export const contenu: Contenu = contenus.fr;

export function trouverPole(slug: string): Pole | undefined {
  return contenu.services.poles.find((pole) => pole.slug === slug);
}

export function trouverOffre(slug: string): OffreDemarrage | undefined {
  return contenu.offres.items.find((offre) => offre.slug === slug);
}

export function lienCourriel(sujet: string = contenu.site.sujetCourriel): string {
  return `mailto:${contenu.site.courriel}?subject=${encodeURIComponent(sujet)}`;
}
