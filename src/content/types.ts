/**
 * Types du contenu du site vitrine NEOXIX.
 * Chaque langue fournit un objet `Contenu` complet (voir `src/content/fr/`).
 * Une version anglaise s'ajoutera dans `src/content/en/` avec le même type.
 */

export type Langue = "fr";

export type Lien = { libelle: string; href: string };

/** Texte avec un segment mis en valeur (classe `.mot`). */
export type TitreMarque = { avant: string; marque: string; apres?: string };

export type EtapeFlux = {
  numero: string;
  libelle: string;
  detail: string;
  etiquette: string;
  humain?: boolean;
};

export type Question = { numero: string; titre: string; texte: string };

export type EtapeMethode = { numero: string; titre: string; texte: string };

export type JourChrono = { jour: string; texte: string; alerte?: boolean };

export type EntreeFaq = { question: string; reponse: string; ouverte?: boolean };

export type Pole = {
  slug: string;
  numero: string;
  titre: string;
  titreCourt: string;
  resume: string;
  etiquettes: string[];
  /** Phrase « dans les mots du client » (catalogue 03). Absente si non rédigée. */
  probleme?: string;
  prestations: string[];
  paliers?: { titre: string; texte: string }[];
  resultat?: string;
  deroulement?: string;
  pourDevis: string;
  ensuite?: string;
  nonInclus?: string;
  note?: string;
};

export type Contenu = {
  langue: Langue;
  site: {
    nom: string;
    courriel: string;
    sujetCourriel: string;
    bandeau: { principal: string; secondaire: string };
    logoProvisoire: string;
    descriptionPied: string;
    lieuPied: string;
    mentionPied: string;
  };
  navigation: Lien[];
  accueil: {
    surtitre: string;
    titre: TitreMarque;
    chapo: string;
    actionPrincipale: string;
    actionSecondaire: string;
    publics: string[];
    flux: { titre: string; sousTitre: string; etapes: EtapeFlux[]; legende: string[] };
    reperes: string[];
    questions: { surtitre: string; titre: TitreMarque; intro: string; items: Question[] };
  };
  services: {
    surtitre: string;
    titre: TitreMarque;
    intro: string;
    tarification: string;
    maintenance: { titre: string; texte: string };
    poles: Pole[];
  };
  methode: {
    surtitre: string;
    titre: TitreMarque;
    intro: string;
    etapes: EtapeMethode[];
    chrono: { titre: string; mention: string; jours: JourChrono[]; note: string };
  };
  engagements: {
    surtitre: string;
    titre: TitreMarque;
    oui: { titre: string; items: string[] };
    non: { titre: string; items: string[] };
  };
  faq: { surtitre: string; titre: string; entrees: EntreeFaq[] };
  contact: {
    surtitre: string;
    titre: string;
    titreMarque: string;
    lead: string;
    bouton: string;
    delai: string;
    attente: string;
    preparer: { titre: string; intro: string };
  };
  confidentialite: {
    titre: string;
    statut: string;
    sections: { titre: string; texte: string }[];
  };
  introuvable: { code: string; titre: string; texte: string; retour: string };
};
