import type { Offres, Tarifs } from "../types";

/**
 * Offres de démarrage et page Tarifs (proposition, lot PRICING-001).
 *
 * Source unique des tarifs : chaque offre porte son montant dans `prix`. Tant que le propriétaire
 * n'a pas validé un montant, `prix` vaut `null` et le site affiche « Sur devis ». Aucun montant n'est
 * inventé ici. Les textes de cette section sont à valider par le propriétaire avant publication.
 */
export const offres: Offres = {
  surtitre: "Démarrer",
  titre: { avant: "Offres pour démarrer ", marque: "rapidement." },
  intro:
    "Trois prestations courtes, au périmètre fixe, pour régler un besoin précis avant d'engager un projet plus large. Chacune se termine par une remise écrite.",
  tarification: "Sur devis, après un premier échange sans engagement. Le montant, quand il est publié, figure à la page de l'offre.",
  items: [
    {
      slug: "google-workspace",
      titre: "Google Workspace : mise en place",
      accroche: "Courriel professionnel, documents partagés et agenda, configurés proprement dès le départ pour toute votre équipe.",
      pour: "PME qui utilisent encore des comptes personnels ou une messagerie mal configurée.",
      resultat: "Votre équipe travaille dans un environnement unique, avec des accès contrôlés et un courriel qui appartient à votre entreprise.",
      inclus: [
        "Création des comptes et des adresses courriel de votre domaine",
        "Enregistrements DNS du courriel : MX, SPF, DKIM et DMARC",
        "Authentification à deux facteurs et règles de partage des fichiers",
        "Migration du courriel et des contacts existants, selon le volume",
        "Courte formation de l'équipe et document d'utilisation remis",
      ],
      nonInclus: [
        "Licences Google Workspace, souscrites et facturées par le client",
        "Suivi quotidien des comptes après la remise, sauf mandat de support",
        "Intégrations avec des logiciels tiers, sur devis",
      ],
      deroulement: [
        "Inventaire du domaine, des comptes et des outils actuels",
        "Configuration des comptes, du courriel et de la sécurité",
        "Migration, tests de réception et corrections",
        "Remise de la documentation et formation courte",
      ],
      etiquettes: ["Gmail", "Drive", "Agenda", "Meet", "Domaine et DNS"],
      icone: "clients",
      prix: null,
      pole: "infrastructure",
      pourDevis: "Nombre d'utilisateurs, domaine existant ou non, outils actuels, volume de courriels à migrer.",
      note: "Google et Google Workspace sont des marques de Google LLC. NEOXIX n'est pas affiliée à Google.",
    },
    {
      slug: "support-informatique-pme",
      titre: "Support informatique PME",
      accroche: "Un point de contact unique pour les problèmes informatiques du quotidien, avec un suivi écrit de chaque demande.",
      pour: "PME de 1 à 50 personnes qui n'ont pas de service informatique interne.",
      resultat: "Vos employés savent où écrire, et vous savez ce qui a été fait, quand et par qui.",
      inclus: [
        "Réception des demandes par courriel ou formulaire, avec un numéro de suivi",
        "Dépannage à distance des postes, des comptes et des imprimantes",
        "Vérification des mises à jour et des sauvegardes, selon le contrat",
        "Rapport écrit des interventions, remis chaque mois",
        "Inventaire tenu à jour des équipements et des accès",
      ],
      nonInclus: [
        "Assistance hors des plages d'intervention prévues au contrat",
        "Interventions sur place hors de la région Ottawa–Gatineau",
        "Achat de matériel et de licences",
      ],
      deroulement: [
        "Inventaire des équipements, des comptes et des accès",
        "Mise en place du canal de demande et des règles de priorité",
        "Suivi mensuel et rapport écrit",
        "Révision du périmètre à chaque renouvellement",
      ],
      etiquettes: ["Dépannage", "Suivi des demandes", "Rapport mensuel", "Inventaire"],
      icone: "bouclier",
      prix: null,
      pole: "infrastructure",
      pourDevis: "Nombre de postes et d'utilisateurs, équipements et logiciels principaux, sites concernés, plages souhaitées.",
      note: "Les plages d'intervention, les modalités de réponse et de facturation sont écrites dans le contrat de service.",
    },
    {
      slug: "reservation-en-ligne",
      titre: "Réservation en ligne",
      accroche: "Vos clients réservent un rendez-vous en ligne ; l'agenda, les rappels et le suivi se mettent à jour seuls.",
      pour: "Professionnels et PME qui fixent encore leurs rendez-vous par téléphone ou par courriel.",
      resultat: "Moins d'appels pour fixer un rendez-vous, et moins de rendez-vous oubliés.",
      inclus: [
        "Page de réservation intégrée à votre site, ou lien dédié",
        "Types de rendez-vous, durées et disponibilités configurés",
        "Confirmation et rappels envoyés automatiquement",
        "Synchronisation avec votre agenda",
        "Procédure écrite pour modifier ou annuler un rendez-vous",
      ],
      nonInclus: [
        "Abonnement à l'outil de réservation ou d'agenda, à la charge du client",
        "Paiement en ligne, sauf mandat précis",
        "Envoi de messages commerciaux",
      ],
      deroulement: [
        "Description de vos types de rendez-vous et de vos disponibilités",
        "Configuration de la réservation et des rappels",
        "Essai avec vous, sur des rendez-vous de test",
        "Mise en service et procédure de modification",
      ],
      etiquettes: ["Agenda", "Rappels", "Synchronisation", "Confirmation"],
      icone: "flux",
      prix: null,
      pole: "automatisation",
      pourDevis: "Types de rendez-vous, durées, disponibilités, agenda actuel, site web existant ou non.",
      note: "Les outils de réservation et d'agenda sont choisis avec vous selon vos besoins ; leurs abonnements restent à la charge du client.",
    },
  ],
};

export const tarifs: Tarifs = {
  surtitre: "Tarifs",
  titre: { avant: "Tarifs établis ", marque: "par écrit." },
  intro:
    "Chaque prestation a un périmètre écrit, avec ses exclusions. Le montant est indiqué quand il est confirmé ; sinon, il est établi sur devis après un premier échange sans engagement.",
  statutMontants: "Montants en attente de validation : ils ne sont pas publiés tant que le propriétaire ne les a pas confirmés.",
  engagements: [
    "Une proposition écrite précise le périmètre, les étapes, les exclusions et le montant avant tout travail facturé.",
    "Les licences et abonnements de logiciels tiers restent à la charge du client, et sont indiqués dans la proposition.",
    "Aucun montant n'est ajouté sans votre accord écrit.",
  ],
};
