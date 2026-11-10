/**
 * Types du contenu du site vitrine NEOXIX (maquette V5).
 * Chaque langue fournit un objet `Contenu` complet (voir `src/content/fr/`).
 * Une version anglaise s'ajoutera dans `src/content/en/` avec le même type.
 */

export type Langue = "fr";

export type Lien = { libelle: string; href: string };

/** Titre avec un segment mis en valeur (classe `.accent`). */
export type TitreMarque = { avant: string; marque: string; apres?: string };

export type EnTeteSection = { surtitre: string; titre: TitreMarque; intro?: string };

export type EtapeSchema = {
  numero: string;
  libelle: string;
  detail: string;
  etiquette: string;
  /** Étape de décision humaine : nœud en pointillés ambre. */
  humain?: boolean;
};

export type NomIcone = "ecran" | "flux" | "clients" | "bouclier" | "blocs" | "courbe";

export type Solution = {
  titre: string;
  texte: string;
  statut: string;
  icone: NomIcone;
  /** Concept non commercialisé : carte en pointillés, statut turquoise. */
  concept?: boolean;
  /** Pôle de service qui répond à ce besoin (lien « Voir le service »). */
  pole?: string;
};

export type DetailPole = {
  inclus: string[];
  perimetre: string[];
  nonInclus: string[];
  demarrer: string[];
};

export type Pole = {
  slug: string;
  numero: string;
  titre: string;
  titreCourt: string;
  /** Phrase sous le titre de la carte (V5). */
  accroche: string;
  /** « Résultat recherché » (V5). */
  resultatRecherche: string;
  etiquettes: string[];
  detail: DetailPole;
  /** Page de pôle : résumé sous le titre. */
  resume: string;
  /** Page de pôle : phrase « dans les mots du client » (catalogue 03). */
  probleme?: string;
  prestations: string[];
  paliers?: { titre: string; texte: string }[];
  deroulement?: string;
  /** Scénario type présenté sur la carte et la page du pôle (illustratif, sans client réel). */
  exemple: { titre: string; texte: string };
  pourDevis: string;
  ensuite?: string;
  note?: string;
};

export type Realisation = { titre: string; statut: string; texte: string; apercu: "plateforme" | "laboratoire" | "flux" | "site" };

export type EtapeMethode = { numero: string; titre: string; texte: string };

export type EntreeFaq = { question: string; reponse: string };

export type Formule = { titre: string; texte: string; statut: string };

export type OptionService = { valeur: string; libelle: string };

export type Contenu = {
  langue: Langue;
  site: {
    nom: string;
    titre: string;
    description: string;
    courriel: string;
    sujetCourriel: string;
    descriptionPied: string;
    lieuPied: string;
  };
  navigation: Lien[];
  actionPrincipale: Lien;
  accueil: {
    surtitre: string;
    titre: TitreMarque;
    chapo: string;
    actionSecondaire: Lien;
    publics: string[];
    schema: { titre: string; mention: string; etapes: EtapeSchema[]; pied: [string, string] };
    confiance: string[];
  };
  solutions: EnTeteSection & { items: Solution[]; note: string };
  services: EnTeteSection & { tarification: string; poles: Pole[] };
  realisations: EnTeteSection & { items: Realisation[]; legende: { terme: string; sens: string }[] };
  appelAction: { titre: string; texte: string };
  apropos: EnTeteSection & { points: { titre: string; texte: string }[] };
  methode: EnTeteSection & {
    etapes: EtapeMethode[];
    encarts: { titre: string; texte: string }[];
    exemple: { titre: string; etapes: string[]; note: string };
  };
  engagements: EnTeteSection & {
    oui: { titre: string; items: string[] };
    non: { titre: string; items: string[] };
  };
  formules: EnTeteSection & { items: Formule[]; action: string };
  faq: EnTeteSection & { entrees: EntreeFaq[] };
  contact: EnTeteSection & {
    coordonnees: string;
    preparer: { titre: string; intro: string };
  };
  leadflow: {
    etapes: [string, string];
    services: OptionService[];
    champs: {
      service: { libelle: string; placeholder: string };
      objectif: { libelle: string; aide: string };
      lieu: { libelle: string; aide: string };
      description: { libelle: string };
      nom: { libelle: string };
      courriel: { libelle: string };
      telephone: { libelle: string; facultatif: string };
      preference: { libelle: string; courriel: string; telephone: string };
      consentement: string;
    };
    requis: string;
    continuer: string;
    retour: string;
    /** Messages d'erreur, indexés par code renvoyé par le schéma. */
    erreurs: Record<string, string>;
    modes: {
      mock: { bandeau: string; bandeauFort: string; envoyer: string; chargement: string; confirmationTitre: string; confirmationTexte: string };
      live: { envoyer: string; chargement: string; confirmationTitre: string; confirmationTexte: string };
    };
    erreurTemporaire: { titre: string; texte: string; reessayer: string };
    tropDeTentatives: { titre: string; texte: string };
    recommencer: string;
    reference: string;
    desactive: string;
  };
  confidentialite: {
    titre: string;
    statut: string;
    sections: { titre: string; texte: string }[];
  };
  introuvable: { code: string; titre: string; texte: string; retour: string };
};
