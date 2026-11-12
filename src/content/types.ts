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

/** Catégorie de facturation, telle que présentée sur la page Tarifs. */
export type CategorieTarif = "honoraires" | "services-ponctuels" | "forfaits-mensuels" | "tarifs-horaires";

/** Unité de facturation d'un élément du catalogue. */
export type UniteTarif = "forfait" | "par-boite" | "par-heure" | "par-mois" | "par-banque" | "sur-devis";

/**
 * Statut commercial. `propose` : montant soumis à validation du propriétaire (jamais publié sur
 * neoxix.ca en production). `approuve` : réservé à un montant validé par écrit.
 */
export type StatutValidation = "propose" | "approuve";

/** Élément du catalogue : une seule source de montant pour tout le site. */
export type ElementCatalogue = {
  /** Identifiant stable, utilisé par les offres et les pôles. */
  id: string;
  intitule: string;
  /** Slug du pôle de service associé (`sites-web`, `automatisation`, `infrastructure`, `applications`). */
  pole: string;
  categorie: CategorieTarif;
  description: string;
  /** Montant en dollars canadiens ; `null` = sur devis. */
  montant: number | null;
  devise: "CAD";
  unite: UniteTarif;
  /** « à partir de » : prix de départ, selon la portée. */
  aPartirDe: boolean;
  exclusions: string[];
  /** Conditions de facturation (ex. minimum de deux heures sur place). */
  conditions?: string[];
  statut: StatutValidation;
};

export type Catalogue = {
  /** Mention commune à reprendre sur les pages de tarifs et d'offres. */
  mention: string;
  categories: { id: CategorieTarif; titre: string; texte: string }[];
  /** Coûts hors honoraires, jamais inclus dans les montants ci-dessus sans mention. */
  horsHonoraires: { titre: string; texte: string }[];
  elements: ElementCatalogue[];
};

/**
 * Offre de démarrage : prestation courte à périmètre fixe, présentée sur l'accueil, la page Tarifs
 * et sa propre page. Les montants viennent exclusivement de `contenu.catalogue` (via `references`).
 */
export type OffreDemarrage = {
  /** Segment d'URL : `/offres/[slug]`. */
  slug: string;
  titre: string;
  accroche: string;
  /** Public visé, en une phrase. */
  pour: string;
  resultat: string;
  inclus: string[];
  nonInclus: string[];
  deroulement: string[];
  etiquettes: string[];
  icone: NomIcone;
  /** Identifiants d'éléments du catalogue. Le premier sert de repère sur l'accueil. */
  references: string[];
  /** Pôle de service qui précise la prestation (lien « Voir le service »). */
  pole?: string;
  pourDevis: string;
  note?: string;
};

export type Offres = EnTeteSection & {
  items: OffreDemarrage[];
  /** Règle de tarification commune, affichée sur la page Tarifs. */
  tarification: string;
};

export type Tarifs = EnTeteSection & {
  /** Mention affichée tant que les montants ne sont pas publiés. */
  statutMontants: string;
  engagements: string[];
};

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
  catalogue: Catalogue;
  offres: Offres;
  tarifs: Tarifs;
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
    /** Section affichée tant que la collecte réelle n'est pas activée (`INTAKE_MODE` ≠ `live`). */
    sansFormulaire: { titre: string; texte: string };
    /** Sections affichées lorsque le formulaire transmet réellement les demandes (n8n → HubSpot). */
    avecFormulaire: { titre: string; texte: string }[];
  };
  introuvable: { code: string; titre: string; texte: string; retour: string };
};
