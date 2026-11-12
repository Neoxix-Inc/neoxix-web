import type { Offres, Tarifs } from "../types";

/**
 * Offres de démarrage (accueil, page Tarifs, pages d'offre). Aucun montant ici : chaque offre
 * référence des éléments de `catalogue.ts`. Textes à valider par le propriétaire avant publication.
 */
export const offres: Offres = {
  surtitre: "Démarrer",
  titre: { avant: "Offres pour démarrer ", marque: "rapidement." },
  intro:
    "Trois points de départ, à périmètre écrit, pour régler un besoin précis avant d'engager un projet plus large. Chaque offre se termine par une proposition écrite.",
  tarification:
    "Montants indicatifs, à confirmer par une proposition écrite avant le début des travaux. Les licences tierces, le matériel et les déplacements sont facturés à part.",
  items: [
    {
      slug: "reservation-en-ligne",
      titre: "Site web et réservation",
      accroche: "Un site professionnel avec la réservation en ligne configurée pour vos rendez-vous.",
      pour: "Professionnels et PME qui veulent un site clair et des rendez-vous pris en ligne.",
      resultat: "Vos clients trouvent vos services, réservent leur rendez-vous, et reçoivent une confirmation.",
      inclus: [
        "Création du site professionnel, affiché sur téléphone, tablette et ordinateur",
        "Configuration de la réservation : types de rendez-vous, durées et disponibilités",
        "Confirmation et rappels de rendez-vous, selon la configuration retenue",
        "Mise en service et procédure écrite pour modifier un rendez-vous",
      ],
      nonInclus: [
        "Abonnement du fournisseur de réservation ou d'agenda, à la charge du client",
        "Plateforme de réservation propre à NEOXIX : non incluse",
        "Paiement en ligne, sauf mandat précis",
      ],
      deroulement: [
        "Description de vos services, de vos types de rendez-vous et de vos disponibilités",
        "Maquette du site et de la page de réservation",
        "Configuration de la réservation, puis essai avec vous",
        "Mise en service",
      ],
      etiquettes: ["Site web", "Réservation", "Agenda", "Rappels"],
      icone: "flux",
      references: ["site-professionnel-reservation", "site-essentiel", "site-avance-automatisation", "maintenance-web"],
      pole: "sites-web",
      pourDevis: "Vos services, vos types de rendez-vous, l'agenda actuel, le site existant ou non.",
      note: "La réservation repose sur un fournisseur tiers choisi avec vous ; son abonnement n'est pas inclus.",
    },
    {
      slug: "google-workspace",
      titre: "Google Workspace professionnel",
      accroche: "Courriel professionnel, documents partagés et agenda, configurés pour votre équipe.",
      pour: "PME qui utilisent encore des comptes personnels ou une messagerie mal configurée.",
      resultat: "Votre équipe travaille dans un environnement unique, avec des comptes et un courriel qui appartiennent à votre entreprise.",
      inclus: [
        "Configuration initiale du domaine et des comptes",
        "Forfait jusqu'à cinq utilisateurs, pour la mise en place",
        "Assistance Workspace mensuelle, si vous la choisissez",
      ],
      nonInclus: [
        "Licences Google Workspace : souscrites et facturées par Google ou le client, en dehors des honoraires NEOXIX",
        "Migration des boîtes courriel : facturée par boîte, non comprise dans la configuration de base",
        "Intégrations avec des logiciels tiers : sur devis",
      ],
      deroulement: [
        "Inventaire du domaine, des comptes et des outils actuels",
        "Configuration initiale des comptes et du courriel",
        "Migration des boîtes, si elle est retenue, puis vérification avec vous",
        "Remise des accès et des réglages utilisés",
      ],
      etiquettes: ["Gmail", "Drive", "Agenda", "Meet", "Domaine"],
      icone: "clients",
      references: ["workspace-forfait-cinq-utilisateurs", "workspace-configuration-initiale", "workspace-migration", "workspace-assistance"],
      pole: "infrastructure",
      pourDevis: "Nombre d'utilisateurs, domaine existant ou non, nombre de boîtes à migrer, outils actuels.",
      note: "Google et Google Workspace sont des marques de Google LLC. NEOXIX n'est pas affiliée à Google.",
    },
    {
      slug: "support-informatique-pme",
      titre: "Assistance informatique PME",
      accroche: "Un point de contact pour les problèmes informatiques du quotidien, avec une demande écrite pour chaque intervention.",
      pour: "PME qui n'ont pas de service informatique interne.",
      resultat: "Vos employés savent où demander de l'aide, et vous savez ce qui a été fait.",
      inclus: [
        "Dépannage à distance des postes, des comptes et des imprimantes, à l'heure ou selon un forfait",
        "Intervention sur place, à l'heure, avec un minimum de deux heures",
        "Banque de cinq heures, pour les besoins ponctuels",
        "Forfait mensuel PME Essentiel ou PME Suivi, selon le périmètre écrit",
      ],
      nonInclus: [
        "Assistance 24/7 : non incluse ; les plages d'intervention sont précisées dans le contrat",
        "Achat de matériel et de licences",
        "Déplacements sur place : à confirmer selon chaque proposition, y compris avec la banque de cinq heures",
      ],
      deroulement: [
        "Inventaire des équipements, des comptes et des accès",
        "Mise en place du canal de demande et des règles de priorité",
        "Traitement des demandes, avec suivi écrit de chaque intervention",
        "Révision du périmètre à chaque renouvellement",
      ],
      etiquettes: ["Dépannage", "Suivi des demandes", "Inventaire", "Forfait mensuel"],
      icone: "bouclier",
      references: ["assistance-pme-essentiel", "assistance-pme-suivi", "assistance-distance", "assistance-sur-place", "assistance-banque-cinq-heures"],
      pole: "infrastructure",
      pourDevis: "Nombre de postes et d'utilisateurs, équipements et logiciels principaux, sites concernés.",
      note: "Aucun délai de réponse ni niveau de service (SLA) n'est garanti ici : ils sont écrits dans le contrat de service, s'il est signé.",
    },
  ],
};

export const tarifs: Tarifs = {
  surtitre: "Tarifs",
  titre: { avant: "Tarifs établis ", marque: "par écrit." },
  intro:
    "Chaque prestation a un périmètre écrit, avec ses exclusions. Le montant indiqué est un point de départ : une proposition écrite le confirme avant le début des travaux.",
  statutMontants:
    "Montants proposés, en attente d'approbation par le propriétaire. Ils ne sont pas publiés sur neoxix.ca tant qu'ils ne sont pas approuvés.",
  engagements: [
    "Une proposition écrite précise le périmètre, les étapes, les exclusions et le montant avant tout travail facturé.",
    "Les licences et abonnements de logiciels tiers restent à la charge du client, et sont indiqués dans la proposition.",
    "Aucun montant n'est ajouté sans votre accord écrit.",
  ],
};
