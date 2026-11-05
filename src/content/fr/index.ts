import type { Contenu } from "../types";

/**
 * Contenu français du site vitrine.
 * Sources :
 * - `design/v3/index.html` (maquette v3, SHA-256 29f16280…ec729d1) pour tout le texte de l'accueil,
 *   des services, de la méthode, des engagements, de la FAQ et du contact ;
 * - `docs/neoxix-services/03-SERVICES-CATALOG.md` (décision A3 du propriétaire) pour le détail des
 *   pages de pôle, limité aux prestations classées « commercialisables ».
 * Les éléments entre crochets sont des valeurs non validées : ils restent tels quels.
 */
export const fr: Contenu = {
  langue: "fr",
  site: {
    nom: "NEOXIX",
    courriel: "info@neoxix.ca",
    sujetCourriel: "Demande de consultation",
    bandeau: {
      principal: "Maquette / prévisualisation, non publiée",
      secondaire: "v3 · non définitive · éléments entre crochets à valider · aucun formulaire actif",
    },
    logoProvisoire: "Logo provisoire",
    descriptionPied: "Services numériques pour PME, Canada et Côte d'Ivoire.",
    lieuPied: "© 2026 NEOXIX · Gatineau, Québec",
    mentionPied: "Maquette v3 · non publiée",
  },
  navigation: [
    { libelle: "Services", href: "/services" },
    { libelle: "Méthode", href: "/methode" },
    { libelle: "Engagements", href: "/methode#engagements" },
    { libelle: "Questions", href: "/#faq" },
    { libelle: "Contact", href: "/contact" },
  ],
  accueil: {
    surtitre: "Services numériques · Gatineau, Ottawa et Côte d'Ivoire",
    titre: {
      avant: "Votre site, vos outils et votre réseau, ",
      marque: "avec un seul interlocuteur",
      apres: ".",
    },
    chapo:
      "NEOXIX conçoit, sécurise et automatise les systèmes numériques des PME et des organisations. Une méthode écrite, des livrables qui vous appartiennent, et une personne qui répond.",
    actionPrincipale: "Nous écrire pour mon projet",
    actionSecondaire: "Voir les services",
    publics: ["PME de 1 à 50 personnes", "Travailleurs autonomes", "Organisations"],
    flux: {
      titre: "Exemple · une demande reçue",
      sousTitre: "sans ressaisie",
      etapes: [
        { numero: "01", libelle: "Votre site reçoit une demande", detail: "Courriel ou formulaire, selon la configuration", etiquette: "Site" },
        { numero: "02", libelle: "Elle est classée", detail: "Type de besoin, urgence, marché", etiquette: "Automatisation" },
        { numero: "03", libelle: "Elle serait enregistrée dans votre CRM", detail: "Contact et suivi créés", etiquette: "Intégration" },
        { numero: "04", libelle: "Vous décidez de la suite", detail: "Aucune réponse commerciale automatique", etiquette: "Humain", humain: true },
      ],
      legende: ["étape automatisée", "décision humaine", "Schéma illustratif"],
    },
    reperes: [
      "Basé à Gatineau, Québec",
      "Clientèle à Ottawa–Gatineau et au Québec",
      "Projets pour la Côte d'Ivoire",
      "Français, anglais sur demande [à valider]",
      "Réponse écrite sous [délai à valider]",
    ],
    questions: {
      surtitre: "Trois questions",
      titre: { avant: "Ce que vous vous demandez ", marque: "avant d'écrire", apres: "." },
      intro: "Des réponses courtes. Les détails sont dans chaque service.",
      items: [
        {
          numero: "01",
          titre: "Que faites-vous exactement ?",
          texte:
            "Sites WordPress et boutiques, automatisation de vos processus, réseau et sécurité, applications sur mesure. Quatre pôles, un seul interlocuteur.",
        },
        {
          numero: "02",
          titre: "Pour qui ?",
          texte: "Entrepreneurs, PME de 1 à 50 personnes, organisations et communautés au Canada et en Côte d'Ivoire.",
        },
        {
          numero: "03",
          titre: "Combien ça coûte ?",
          texte:
            "Chaque prestation est établie sur devis, après un échange. Aucun prix n'est affiché sans cadrage. [Fourchette indicative à valider.]",
        },
      ],
    },
  },
  services: {
    surtitre: "Services",
    titre: { avant: "Quatre domaines, ", marque: "une seule méthode", apres: "." },
    intro:
      "Chaque service précise ce qui est inclus, ce qui ne l'est pas, et ce qu'il faut préparer pour recevoir une proposition.",
    tarification: "Sur devis",
    maintenance: {
      titre: "Intervention ponctuelle",
      texte: "Intervention à la demande, facturée au temps passé. Sur devis.",
    },
    poles: [
      {
        slug: "sites-web",
        numero: "01",
        titre: "Sites web et WordPress",
        titreCourt: "Sites web et WordPress",
        resume: "Sites vitrines, boutiques WooCommerce, refontes, migrations, domaines, courriels professionnels et entretien.",
        etiquettes: ["WordPress", "WooCommerce", "DNS", "Courriel"],
        probleme: "« Mon site ne me ressemble plus, il est lent, et je ne sais pas qui le met à jour. »",
        prestations: [
          "Site vitrine WordPress responsive",
          "Refonte et migration",
          "Boutique WooCommerce",
          "Domaines et DNS",
          "Messagerie professionnelle (MX, SPF, DKIM, DMARC)",
          "Entretien : mises à jour, sauvegardes, restauration, sécurité",
          "Optimisation de performance et SEO technique",
        ],
        resultat:
          "Un site rapide, que vous pouvez modifier vous-même, avec des sauvegardes testées et un responsable clairement nommé pour les mises à jour.",
        pourDevis:
          "Type de site, nombre de pages ou de produits, fonctionnalités, domaine existant ou non, hébergement souhaité, langues, échéance, budget indicatif.",
        ensuite: "Contrat de maintenance WordPress : mises à jour vérifiées, sauvegardes, surveillance de disponibilité.",
        nonInclus: "Rédaction des contenus et photographies, sauf mention contraire au devis.",
      },
      {
        slug: "automatisation",
        numero: "02",
        titre: "Automatisation des processus",
        titreCourt: "Automatisation",
        resume:
          "Formulaires qualifiés, CRM, rappels, suivi de devis et intégrations entre vos logiciels, avec validation humaine.",
        etiquettes: ["n8n", "CRM", "API", "Python"],
        probleme: "« On recopie les mêmes informations dans trois outils, et des demandes se perdent. »",
        prestations: [
          "Flux formulaire → qualification → CRM (HubSpot)",
          "Notifications, rappels et suivi de devis",
          "Intégrations API entre logiciels",
          "Automatisation documentaire",
          "Workflows avec validation humaine",
          "Odoo : conseil, installation, configuration",
        ],
        paliers: [
          {
            titre: "Diagnostic de processus",
            texte:
              "Cartographie d'un processus actuel, des outils et des tâches manuelles, puis recommandation écrite.",
          },
          { titre: "Pilote", texte: "Un flux automatisé en environnement de test, validé avec vous." },
          {
            titre: "Mise en production et suivi",
            texte: "Surveillance des exécutions, alertes d'échec, ajustements.",
          },
        ],
        resultat:
          "Chaque demande arrive au bon endroit, avec une trace consultable, et les décisions commerciales restent humaines.",
        pourDevis:
          "Description du processus actuel, outils utilisés, volume approximatif, tâches manuelles, résultat souhaité, contraintes de données.",
        nonInclus: "Licences des logiciels tiers (HubSpot, n8n Cloud, etc.), à la charge du client.",
      },
      {
        slug: "infrastructure",
        numero: "03",
        titre: "Infrastructure et sécurité",
        titreCourt: "Infrastructure et sécurité",
        resume:
          "Réseau et VLAN, accès à distance chiffré, pare-feu, Windows Server et Linux, sauvegardes, dont les modalités sont précisées dans chaque proposition.",
        etiquettes: ["Réseau", "Pare-feu", "Windows Server", "Linux"],
        probleme:
          "« Mes employés travaillent à distance, mon serveur a dix ans et je ne suis pas sûr que mes sauvegardes fonctionnent. »",
        prestations: [
          "VPN et accès à distance",
          "Routage, commutation, VLAN, segmentation",
          "Pare-feu",
          "Windows Server, Active Directory, DNS, Linux",
          "Virtualisation Proxmox et VMware",
          "Sauvegarde, reprise et supervision",
          "Revue technique de configuration, durcissement, MFA",
          "Git, Docker, CI/CD, Ansible",
          "Migrations cloud",
        ],
        resultat:
          "Un accès à distance chiffré, des réseaux séparés par usage, des sauvegardes dont la restauration a été testée, et une documentation qui vous appartient.",
        pourDevis:
          "Contexte, nombre de postes et de sites, équipements actuels (marque et modèle, sans configuration), urgence. Ne transmettez aucun mot de passe.",
        ensuite: "Supervision et maintenance préventive.",
        nonInclus: "Achat de matériel (une recommandation peut être fournie), garantie de sécurité absolue.",
        note: "Les marques citées (Fortinet, Cisco, Proxmox) sont des technologies utilisées. NEOXIX n'est partenaire officiel d'aucun de ces éditeurs.",
      },
      {
        slug: "applications",
        numero: "04",
        titre: "Applications sur mesure",
        titreCourt: "Applications sur mesure",
        resume: "Portails clients, outils internes et tableaux de bord, de la maquette jusqu'à la maintenance.",
        etiquettes: ["Applications web", "Outils internes", "Tableaux de bord"],
        prestations: [
          "Portails et plateformes communautaires",
          "Outils internes, tableaux de bord, interfaces d'administration",
          "Intégrations API",
          "SaaS sur mesure",
        ],
        deroulement: "Analyse, maquette, validation, développement, tests, livraison, maintenance.",
        pourDevis:
          "Besoin métier, types d'utilisateurs et nombre approximatif, fonctionnalités clés, intégrations, données sensibles éventuelles, échéance.",
      },
    ],
  },
  methode: {
    surtitre: "Méthode",
    titre: { avant: "Rien n'est construit avant d'être ", marque: "validé avec vous", apres: "." },
    intro: "Chaque étape produit un document que vous pouvez lire, commenter et conserver.",
    etapes: [
      { numero: "01", titre: "Comprendre", texte: "Un échange pour décrire votre situation, vos outils et vos contraintes." },
      { numero: "02", titre: "Proposer", texte: "Une proposition écrite : périmètre, étapes, inclus, exclus, prix." },
      { numero: "03", titre: "Maquetter", texte: "Vous voyez le résultat avant la construction." },
      { numero: "04", titre: "Réaliser et tester", texte: "Construction par étapes, vérifications documentées." },
      { numero: "05", titre: "Livrer et suivre", texte: "Mise en service, documentation remise, maintenance si vous le souhaitez." },
    ],
    chrono: {
      titre: "Exemple illustratif · une semaine type",
      mention: "Aucune donnée client",
      jours: [
        { jour: "Lun", texte: "Demande reçue et classée" },
        { jour: "Mar", texte: "Proposition envoyée par écrit" },
        { jour: "Mer", texte: "Alerte : certificat à renouveler", alerte: true },
        { jour: "Jeu", texte: "Maquette validée par vous" },
        { jour: "Ven", texte: "Sauvegarde et restauration testées" },
        { jour: "Sam", texte: "Aucune intervention requise" },
        { jour: "Dim", texte: "Rapport de semaine disponible" },
      ],
      note: "Scénario fictif, présenté pour illustrer la méthode. Il ne représente pas un client réel ni un résultat mesuré.",
    },
  },
  engagements: {
    surtitre: "Engagements",
    titre: { avant: "Ce que vous pouvez attendre, ", marque: "et ce que nous ne promettons pas", apres: "." },
    oui: {
      titre: "Nous nous engageons à",
      items: [
        "Une proposition écrite avant tout travail facturé.",
        "Des accès, codes et documents qui vous appartiennent.",
        "Des sauvegardes, dont les modalités sont précisées dans chaque proposition.",
        "Un langage clair, sans jargon inutile.",
      ],
    },
    non: {
      titre: "Nous ne promettons pas",
      items: [
        "Une sécurité absolue : personne ne peut la garantir honnêtement.",
        "Une certification ou un partenariat que nous n'avons pas.",
        "Une disponibilité 24/7 sans contrat qui la prévoit.",
        "Des résultats chiffrés pour un client : nous ne publions pas de résultats clients à ce jour.",
      ],
    },
  },
  faq: {
    surtitre: "Questions fréquentes",
    titre: "Avant de nous écrire.",
    entrees: [
      {
        question: "Travaillez-vous avec des entreprises hors du Québec ?",
        reponse:
          "Oui, pour certains projets. Nos points d'ancrage sont Ottawa–Gatineau et le Québec, et nous suivons aussi des projets pour la Côte d'Ivoire. Précisez votre lieu dans votre message.",
        ouverte: true,
      },
      {
        question: "Mes données sont-elles protégées ?",
        reponse:
          "Ce site ne collecte aucune donnée personnelle pour l'instant. Le traitement des demandes sera encadré par une politique de confidentialité conforme à la Loi 25, actuellement en révision juridique.",
      },
      {
        question: "Combien de temps avant une réponse ?",
        reponse: "Nous répondons par écrit sous [délai à valider]. Ce délai n'est pas garanti avant validation finale.",
      },
      {
        question: "Y a-t-il un engagement après une première demande ?",
        reponse:
          "Non. Une demande n'entraîne aucun engagement. Toute prestation fait l'objet d'une proposition écrite que vous pouvez accepter ou refuser.",
      },
    ],
  },
  contact: {
    surtitre: "Commencer",
    titre: "Décrivez votre situation en quelques lignes. ",
    titreMarque: "Nous vous répondons par écrit.",
    lead: "Aucun engagement de votre part. Une personne lit votre message et vous répond.",
    bouton: "Écrire à info@neoxix.ca",
    delai: "Nous répondons sous [délai à valider].",
    attente:
      "Formulaire de demande en préparation. En attendant, écrivez-nous directement : ce site ne collecte aucune donnée personnelle.",
    preparer: {
      titre: "Ce qui nous aide à vous répondre",
      intro: "Selon votre besoin, indiquez dans votre courriel les éléments suivants.",
    },
  },
  confidentialite: {
    titre: "Confidentialité",
    statut:
      "Texte provisoire. La politique de confidentialité est en révision juridique (Loi 25) et remplacera ce texte avant toute mise en ligne.",
    sections: [
      {
        titre: "Données collectées par ce site",
        texte:
          "Ce site ne collecte aucune donnée personnelle : il ne contient aucun formulaire actif, aucun témoin de mesure d'audience et aucun outil d'analyse tiers.",
      },
      {
        titre: "Courriels",
        texte:
          "Le seul moyen de contact est le courriel info@neoxix.ca. Les règles de conservation et de traitement des messages reçus seront précisées dans la politique définitive.",
      },
      {
        titre: "Responsable de la protection des renseignements personnels",
        texte: "[responsable à désigner]",
      },
    ],
  },
  introuvable: {
    code: "404",
    titre: "Page introuvable",
    texte: "Cette page n'existe pas ou a été déplacée.",
    retour: "Retour à l'accueil",
  },
};
