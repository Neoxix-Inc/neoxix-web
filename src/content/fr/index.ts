import type { Contenu } from "../types";

/**
 * Contenu français du site vitrine NEOXIX Services.
 * Structure et identité visuelle : maquette V5 (`design/v5/`). Textes commerciaux réécrits pour le
 * lancement (mission SHIP-FINAL) : problème, prestation, réalisation concrète, résultat, demande.
 * Règles : aucune référence client, certification d'entreprise, prix, délai ou garantie non vérifiés ;
 * les scénarios de pôle sont des exemples types, présentés comme tels.
 */
export const fr: Contenu = {
  langue: "fr",
  site: {
    nom: "NEOXIX",
    titre: "NEOXIX · Solutions informatiques pour PME",
    description:
      "Sites web, réseaux et sécurité, automatisation et applications sur mesure pour les PME. NEOXIX est basé à Gatineau et accompagne des entreprises à Ottawa, au Québec et en Côte d'Ivoire.",
    courriel: "info@neoxix.ca",
    sujetCourriel: "Discuter de mon projet",
    descriptionPied: "Solutions informatiques pour PME, au Canada et en Côte d'Ivoire.",
    lieuPied: "© 2026 NEOXIX · Gatineau, Québec",
  },
  navigation: [
    { libelle: "Services", href: "/#services" },
    { libelle: "Solutions", href: "/#solutions" },
    { libelle: "Méthode", href: "/#methode" },
    { libelle: "Réalisations", href: "/#realisations" },
    { libelle: "À propos", href: "/#a-propos" },
  ],
  actionPrincipale: { libelle: "Discuter de mon projet", href: "/#contact" },
  accueil: {
    surtitre: "Services informatiques · Gatineau, Ottawa et Côte d'Ivoire",
    titre: { avant: "Des solutions informatiques ", marque: "adaptées à votre entreprise." },
    chapo:
      "Sites web, réseaux, sécurité, logiciels et automatisation : NEOXIX conçoit et met en place les outils dont votre entreprise a besoin pour fonctionner, avec une proposition écrite avant tout travail.",
    actionSecondaire: { libelle: "Découvrir nos services", href: "#services" },
    publics: ["PME de 1 à 50 personnes", "Travailleurs autonomes", "Organisations"],
    schema: {
      titre: "Comment avance votre projet",
      mention: "Déroulement type",
      etapes: [
        { numero: "01", libelle: "Votre demande", detail: "Votre situation, vos outils, vos contraintes", etiquette: "Échange" },
        { numero: "02", libelle: "Analyse", detail: "Ce qu'il faut faire, et dans quel ordre", etiquette: "Analyse" },
        { numero: "03", libelle: "Proposition écrite", detail: "Périmètre, étapes, prix, exclusions", etiquette: "Écrit" },
        { numero: "04", libelle: "Votre accord", detail: "Rien ne commence sans votre validation", etiquette: "Décision", humain: true },
        { numero: "05", libelle: "Réalisation et tests", detail: "Travail par étapes, vérifié avant la livraison", etiquette: "Projet" },
        { numero: "06", libelle: "Livraison", detail: "Mise en service, documentation et accès remis", etiquette: "Suivi" },
      ],
      pied: ["Chaque étape produit un document que vous conservez.", "Vous décidez avant toute réalisation."],
    },
    confiance: [
      "Basé à Gatineau, Québec",
      "Ottawa–Gatineau, Québec et Côte d'Ivoire",
      "Proposition écrite avant tout travail facturé",
      "Configurations documentées et remises",
      "Français, anglais sur demande",
    ],
  },
  solutions: {
    surtitre: "Solutions",
    titre: { avant: "Partez de ", marque: "votre problème." },
    intro:
      "Vous ne cherchez pas un « pôle de services », mais une réponse à une situation précise. Voici les demandes que nous recevons le plus souvent.",
    items: [
      {
        titre: "Un site qui vous apporte des demandes",
        texte: "Votre site actuel est daté ou absent. Nous créons un site clair, rapide sur téléphone, que vous pouvez mettre à jour vous-même.",
        statut: "Sites web",
        icone: "ecran",
        pole: "sites-web",
      },
      {
        titre: "Des demandes clients qui ne se perdent plus",
        texte: "Chaque demande est enregistrée, attribuée et suivie, avec un rappel si personne n'a répondu.",
        statut: "Automatisation",
        icone: "flux",
        pole: "automatisation",
      },
      {
        titre: "Vos outils enfin reliés",
        texte: "Formulaire, CRM, tableur et agenda échangent leurs données au lieu d'être recopiés à la main.",
        statut: "Automatisation",
        icone: "clients",
        pole: "automatisation",
      },
      {
        titre: "Travail à distance en sécurité",
        texte: "VPN, pare-feu, réseau invité séparé et accès contrôlés, pour que vos employés travaillent de partout sans exposer vos données.",
        statut: "Infrastructure et sécurité",
        icone: "bouclier",
        pole: "infrastructure",
      },
      {
        titre: "Un outil fait pour votre processus",
        texte: "Quand les tableurs ne suffisent plus : une application web où chaque dossier a un statut, un responsable et un historique.",
        statut: "Applications sur mesure",
        icone: "blocs",
        pole: "applications",
      },
      {
        titre: "Vos chiffres au même endroit",
        texte: "Un tableau de bord qui regroupe les données de vos outils et montre l'essentiel en un coup d'œil.",
        statut: "Applications sur mesure",
        icone: "courbe",
        pole: "applications",
      },
    ],
    note: "Votre situation n'est pas dans la liste ? Décrivez-la en quelques lignes : nous vous dirons franchement si nous pouvons vous aider.",
  },
  services: {
    surtitre: "Services",
    titre: { avant: "Quatre domaines d'intervention, ", marque: "un seul interlocuteur." },
    intro:
      "Du site web au réseau de votre bureau, chaque mandat commence par une proposition écrite qui précise ce qui sera fait, ce qui est exclu et ce qu'il faut préparer.",
    tarification: "Sur devis, après un premier échange sans engagement",
    poles: [
      {
        slug: "sites-web",
        numero: "01",
        titre: "Sites web et WordPress",
        titreCourt: "Sites web et WordPress",
        accroche: "Un site professionnel qui présente vos services clairement, inspire confiance et vous apporte des demandes.",
        resultatRecherche: "Résultat recherché : un site rapide, lisible sur téléphone, que vous pouvez mettre à jour vous-même.",
        etiquettes: ["WordPress", "WooCommerce", "Responsive", "Domaines et courriels"],
        detail: {
          inclus: ["Site vitrine professionnel", "Affichage mobile, tablette et ordinateur", "Refonte d'un site existant"],
          perimetre: ["Boutique WooCommerce", "Domaine et courriel professionnel", "Rédaction et photos"],
          nonInclus: ["Hébergement géré", "Publicité en ligne"],
          demarrer: ["Vos services et vos pages principales", "L'adresse de votre site actuel, s'il existe"],
        },
        resume:
          "Création et refonte de sites vitrines WordPress, boutiques WooCommerce, configuration des domaines et des courriels professionnels, maintenance sur devis.",
        probleme: "« Mon site ne me ressemble plus, il s'affiche mal sur téléphone, et je ne sais pas qui peut le mettre à jour. »",
        prestations: [
          "Site vitrine conçu pour présenter vos services et recevoir des demandes",
          "Affichage adapté au téléphone, à la tablette et à l'ordinateur",
          "WordPress, pour modifier vos textes et vos photos sans développeur",
          "Boutique WooCommerce, lorsque la vente en ligne a du sens pour vous",
          "Refonte ou migration d'un site existant, sans perdre vos contenus",
          "Domaine et courriels professionnels (MX, SPF, DKIM, DMARC), selon le mandat",
          "Maintenance : mises à jour, sauvegardes et vérifications, selon la formule choisie",
        ],
        exemple: {
          titre: "Exemple : une entreprise de rénovation",
          texte:
            "Elle veut présenter ses services, montrer ses chantiers et recevoir des demandes de soumission. Nous structurons cinq pages avec elle, écrivons des appels à l'action clairs, relions le formulaire de contact à sa boîte courriel et lui montrons comment ajouter ses photos.",
        },
        pourDevis:
          "Type de site, nombre de pages ou de produits, fonctionnalités souhaitées, domaine existant ou non, langues, échéance et budget indicatif.",
        ensuite: "Maintenance selon la formule choisie : mises à jour vérifiées et sauvegardes, dont les modalités sont écrites dans la proposition.",
      },
      {
        slug: "automatisation",
        numero: "02",
        titre: "Automatisation des processus",
        titreCourt: "Automatisation",
        accroche: "Vos demandes, rappels et suivis se perdent entre la boîte courriel, les tableurs et vos logiciels. Nous les relions.",
        resultatRecherche:
          "Résultat recherché : moins de saisie en double, aucune demande oubliée, et une personne qui garde la main sur les décisions.",
        etiquettes: ["n8n", "API", "CRM", "Notifications"],
        detail: {
          inclus: ["Traitement automatique des demandes", "Synchronisation entre deux outils", "Notifications et rappels"],
          perimetre: ["Intégrations API, selon vos logiciels", "Licences des outils utilisés"],
          nonInclus: ["Décisions automatiques sans validation humaine"],
          demarrer: ["La liste de vos tâches répétitives", "Les outils que vous utilisez"],
        },
        resume:
          "Automatisation des demandes, synchronisation entre outils, notifications et rappels, intégrations API et workflows n8n, avec suivi des exécutions.",
        probleme: "« On recopie les mêmes informations dans trois outils, et des demandes se perdent. »",
        prestations: [
          "Traitement des demandes reçues : enregistrement, tri, accusé de réception",
          "Synchronisation entre vos outils : formulaire, CRM, tableur, agenda",
          "Notifications et rappels envoyés à la bonne personne",
          "Intégrations API entre logiciels",
          "Workflows n8n documentés et remis",
          "Suivi des exécutions et alerte en cas d'échec",
          "Odoo : conseil, installation et configuration",
        ],
        paliers: [
          {
            titre: "Diagnostic de processus",
            texte: "Nous décrivons votre processus actuel, vos outils et les tâches manuelles, puis vous remettons une recommandation écrite.",
          },
          { titre: "Pilote", texte: "Un premier flux automatisé, testé avec vous sur des données d'essai." },
          { titre: "Mise en service et suivi", texte: "Surveillance des exécutions, alertes d'échec et ajustements." },
        ],
        exemple: {
          titre: "Exemple : une demande client arrive",
          texte:
            "Un client remplit le formulaire de votre site. La demande est enregistrée dans votre outil de suivi, la personne responsable reçoit une notification, et un rappel part si personne n'a répondu après deux jours ouvrables. Rien n'est envoyé au client sans validation.",
        },
        pourDevis:
          "Description du processus actuel, outils utilisés, volume approximatif, tâches manuelles, résultat souhaité et contraintes sur les données.",
        note: "Les licences des logiciels tiers (CRM, n8n Cloud, etc.) restent à la charge du client.",
      },
      {
        slug: "infrastructure",
        numero: "03",
        titre: "Infrastructure et sécurité",
        titreCourt: "Infrastructure et sécurité",
        accroche: "Un réseau stable, des accès à distance protégés et une configuration documentée que vous comprenez.",
        resultatRecherche:
          "Résultat recherché : un réseau compréhensible, des accès maîtrisés, et des sauvegardes dont les modalités sont écrites.",
        etiquettes: ["Réseau", "Pare-feu", "VPN", "Windows Server", "Linux"],
        detail: {
          inclus: ["Installation et configuration réseau", "Pare-feu, VPN et segmentation", "Documentation des configurations"],
          perimetre: ["Serveurs Windows et Linux", "Sauvegardes, selon le périmètre contractuel", "Supervision"],
          nonInclus: ["Sécurité absolue", "Disponibilité 24/7 sans contrat"],
          demarrer: ["Le plan de votre réseau, s'il existe", "La liste de vos équipements"],
        },
        resume:
          "Installation et configuration réseau, pare-feu et VPN, segmentation, serveurs Windows et Linux, gestion des accès, documentation et amélioration de l'existant.",
        probleme:
          "« Mes employés travaillent à distance, mon serveur a dix ans, et je ne suis pas sûr que mes sauvegardes fonctionnent. »",
        prestations: [
          "Installation et configuration réseau : routage, commutation, Wi-Fi",
          "Pare-feu et VPN pour le travail à distance",
          "Segmentation (VLAN) pour séparer invités, postes et serveurs",
          "Windows Server, Active Directory et Linux",
          "Gestion des accès : comptes, droits, authentification multifacteur",
          "Documentation des configurations, remise à la fin du mandat",
          "Diagnostic de l'existant et plan d'amélioration par priorité",
          "Virtualisation Proxmox et VMware",
          "Sauvegarde et supervision, selon le périmètre contractuel",
        ],
        exemple: {
          titre: "Exemple : un bureau de huit postes",
          texte:
            "Une partie de l'équipe travaille à distance et le Wi-Fi invité partage le réseau des postes. Nous faisons l'inventaire, séparons le réseau invité, configurons un VPN avec authentification multifacteur et remettons un document qui décrit la nouvelle configuration.",
        },
        pourDevis:
          "Contexte, nombre de postes et de sites, équipements actuels (marque et modèle, sans configuration) et urgence. Ne transmettez aucun mot de passe.",
        ensuite: "Supervision et maintenance préventive, selon la formule choisie.",
        note: "Les technologies citées (Proxmox, VMware, Windows Server) sont des outils que nous utilisons. NEOXIX n'est partenaire officiel d'aucun de ces éditeurs.",
      },
      {
        slug: "applications",
        numero: "04",
        titre: "Applications sur mesure",
        titreCourt: "Applications sur mesure",
        accroche: "Quand les tableurs et les courriels ne suffisent plus : un outil conçu autour de votre façon de travailler.",
        resultatRecherche:
          "Résultat recherché : un outil qui remplace un suivi manuel, validé avec vous sur maquette avant le développement.",
        etiquettes: ["Applications web", "Portails clients", "Tableaux de bord", "API"],
        detail: {
          inclus: ["Application web métier ou outil de gestion", "Portail client", "Tableau de bord"],
          perimetre: ["Intégration avec vos systèmes existants", "Applications mobiles"],
          nonInclus: ["Maintenance au-delà de la formule choisie"],
          demarrer: ["La description de votre processus actuel", "Les fichiers ou outils utilisés aujourd'hui"],
        },
        resume:
          "Applications web métiers, outils de gestion, portails clients et tableaux de bord, reliés à vos systèmes, de la maquette jusqu'à la maintenance.",
        probleme: "« Toute l'équipe travaille dans quatre fichiers Excel, et personne ne sait lequel est à jour. »",
        prestations: [
          "Applications web métiers et outils de gestion internes",
          "Portails clients : suivi de dossiers, documents, demandes",
          "Tableaux de bord qui regroupent vos données",
          "Intégrations avec vos systèmes existants (API, bases de données)",
          "Maquette interactive validée avant tout développement",
          "Maintenance et évolutions, selon le mandat",
        ],
        exemple: {
          titre: "Exemple : remplacer des fichiers partagés",
          texte:
            "Une entreprise suit ses interventions dans plusieurs tableurs. Nous analysons le processus, présentons une maquette des écrans, puis développons une application web où chaque intervention a un statut, un responsable et un historique. Les données existantes sont reprises.",
        },
        deroulement: "Analyse, maquette, validation, développement, tests, livraison, maintenance.",
        pourDevis:
          "Besoin métier, types d'utilisateurs et nombre approximatif, fonctionnalités clés, intégrations, données sensibles éventuelles, échéance.",
      },
    ],
  },
  realisations: {
    surtitre: "Réalisations",
    titre: { avant: "Des projets ", marque: "que vous pouvez vérifier." },
    intro: "Nous ne publions ni témoignage ni chiffre que nous ne pouvons pas prouver. Chaque projet indique où il en est.",
    items: [
      {
        titre: "neoxix.ca",
        statut: "En ligne",
        texte:
          "Le site que vous consultez : conception, développement Next.js, sécurité des en-têtes et tests automatisés sur mobile, tablette et ordinateur. Projet interne.",
        apercu: "site",
      },
      {
        titre: "Ivoire Connect",
        statut: "En développement",
        texte: "Plateforme communautaire conçue et développée par NEOXIX. Projet en cours : aucune statistique d'utilisation n'est publiée.",
        apercu: "plateforme",
      },
      {
        titre: "Environnements de démonstration",
        statut: "Démonstration technique",
        texte:
          "Réseaux segmentés, pare-feu, VPN et serveurs montés en laboratoire pour éprouver nos configurations avant de les proposer. Ce ne sont pas des mandats clients.",
        apercu: "laboratoire",
      },
    ],
    legende: [
      { terme: "En ligne", sens: "projet interne publié" },
      { terme: "En développement", sens: "projet en cours" },
      { terme: "Démonstration", sens: "environnement de test interne" },
      { terme: "Livré", sens: "mandat client, avec preuve" },
    ],
  },
  appelAction: {
    titre: "Un projet, un problème technique ou une simple question ?",
    texte: "Écrivez-nous en quelques lignes. Nous vous répondons par écrit avec les prochaines étapes, sans engagement.",
  },
  apropos: {
    surtitre: "À propos",
    titre: { avant: "Une jeune entreprise, ", marque: "un interlocuteur technique direct." },
    intro:
      "NEOXIX est une entreprise de services informatiques fondée à Gatineau. Elle accompagne les PME de bout en bout, du réseau du bureau jusqu'au site web, avec une seule personne qui comprend l'ensemble de votre environnement.",
    points: [
      {
        titre: "Vous parlez à la personne qui fait le travail",
        texte: "Pas d'intermédiaire : la personne qui analyse votre besoin est celle qui conçoit et configure la solution.",
      },
      {
        titre: "Réseau, systèmes et développement",
        texte: "Réseaux, pare-feu, serveurs Windows et Linux, développement web et automatisation : l'infrastructure et les applications sont pensées ensemble.",
      },
      {
        titre: "Des choix expliqués",
        texte: "Chaque recommandation est justifiée par écrit, en langage clair, pour que vous décidiez en connaissance de cause.",
      },
    ],
  },
  methode: {
    surtitre: "Méthode",
    titre: { avant: "Vous savez ce qui sera fait ", marque: "avant que nous commencions." },
    intro: "Chaque étape produit un document que vous pouvez lire, commenter et conserver.",
    etapes: [
      { numero: "01", titre: "Comprendre", texte: "Un échange pour décrire votre situation, vos outils et vos contraintes." },
      { numero: "02", titre: "Proposer", texte: "Une proposition écrite : périmètre, étapes, exclusions et prix." },
      { numero: "03", titre: "Maquetter", texte: "Vous voyez le résultat avant la construction, et vous l'ajustez." },
      { numero: "04", titre: "Réaliser et tester", texte: "Travail par étapes, avec des vérifications documentées." },
      { numero: "05", titre: "Livrer et accompagner", texte: "Mise en service, documentation remise, suivi selon la formule choisie." },
    ],
    encarts: [
      {
        titre: "Maquette visuelle",
        texte: "Ce que vous verrez à l'écran : pages, parcours, textes et états. Elle sert à valider l'expérience avant de construire.",
      },
      {
        titre: "Schéma d'architecture",
        texte: "Comment les systèmes se connectent : réseau, données, outils et accès. Il sert à valider la solution technique.",
      },
    ],
    exemple: {
      titre: "Déroulement type d'un mandat",
      etapes: [
        "Besoin exprimé et contexte compris",
        "Proposition écrite et périmètre défini",
        "Maquette avec données fictives",
        "Votre validation avant la réalisation",
        "Tests et corrections documentés",
        "Livraison et documentation remise",
      ],
      note: "Le déroulement réel dépend de chaque projet. Les durées sont précisées dans la proposition.",
    },
  },
  engagements: {
    surtitre: "Engagements",
    titre: { avant: "Ce que vous pouvez attendre, ", marque: "et ce que nous ne promettons pas." },
    oui: {
      titre: "Nous nous engageons à",
      items: [
        "Une proposition écrite avant tout travail facturé.",
        "Votre validation avant chaque décision importante.",
        "Des livrables et des accès définis au contrat, qui vous appartiennent.",
        "Des sauvegardes et une maintenance dont les modalités sont écrites.",
        "Une documentation prévue au mandat, en langage clair.",
      ],
    },
    non: {
      titre: "Nous ne promettons pas",
      items: [
        "Une sécurité absolue : personne ne peut la garantir honnêtement.",
        "Une assistance 24/7 sans contrat qui la prévoit.",
        "Une certification ou un partenariat que nous n'avons pas.",
        "Des résultats chiffrés que nous ne pouvons pas vérifier.",
      ],
    },
  },
  formules: {
    surtitre: "Accompagnement",
    titre: { avant: "Trois façons de travailler ", marque: "ensemble." },
    intro: "Chaque prestation fait l'objet d'un devis écrit, établi après un premier échange sans engagement.",
    items: [
      {
        titre: "Ponctuel",
        texte: "Un besoin précis : un site, une configuration, un diagnostic. Le périmètre et le prix sont fixés à l'avance.",
        statut: "Sur devis",
      },
      {
        titre: "Suivi",
        texte: "Mises à jour, vérifications et petites évolutions réalisées régulièrement, selon un périmètre convenu.",
        statut: "Sur devis",
      },
      {
        titre: "Accompagnement",
        texte: "Un interlocuteur technique pour planifier et faire évoluer votre informatique au fil de vos projets.",
        statut: "Sur devis",
      },
    ],
    action: "Demander un devis",
  },
  faq: {
    surtitre: "Questions fréquentes",
    titre: { avant: "Avant de nous ", marque: "écrire." },
    entrees: [
      {
        question: "Comment commence un projet ?",
        reponse: "Par un courriel qui décrit votre besoin. Nous vous répondons par écrit, puis nous vous envoyons une proposition qui précise le périmètre et le prix.",
      },
      {
        question: "Combien cela coûte-t-il ?",
        reponse: "Cela dépend du périmètre. Chaque mandat fait l'objet d'un devis écrit, que vous pouvez accepter ou refuser.",
      },
      {
        question: "Travaillez-vous avec nos outils existants ?",
        reponse: "Oui, dans la plupart des cas. Indiquez dans votre message les logiciels et les équipements que vous utilisez.",
      },
      {
        question: "Qui possède les accès et les livrables ?",
        reponse: "Vous. Les accès, les comptes et les livrables qui vous reviennent sont définis au contrat, avant le début du travail.",
      },
      {
        question: "Peut-on commencer par un petit projet ?",
        reponse: "Oui. Un diagnostic ou un mandat ponctuel est souvent la meilleure façon de commencer.",
      },
      {
        question: "Intervenez-vous à distance ou sur place ?",
        reponse: "Les deux, selon le mandat. Les interventions sur place se font dans la région d'Ottawa–Gatineau ; le reste se fait à distance.",
      },
      {
        question: "Comment vos données sont-elles protégées ?",
        reponse:
          "Ce site n'utilise aucun témoin ni outil d'analyse. Les messages reçus servent uniquement à vous répondre. Les détails sont dans notre politique de confidentialité.",
      },
      {
        question: "Travaillez-vous en français et en anglais ?",
        reponse: "Le français est notre langue de travail principale. Nous pouvons échanger et documenter en anglais sur demande.",
      },
    ],
  },
  contact: {
    surtitre: "Contact",
    titre: { avant: "Parlons de ", marque: "votre projet." },
    intro:
      "Décrivez en quelques lignes ce que vous utilisez aujourd'hui, ce qui vous bloque et ce que vous aimeriez obtenir. Une personne lit chaque message et vous répond par écrit.",
    coordonnees: "Vous pouvez aussi nous écrire directement, sans passer par le formulaire.",
    preparer: {
      titre: "Ce qui nous aide à vous répondre",
      intro: "Selon votre besoin, ces éléments permettent de préparer une proposition plus précise.",
    },
  },
  leadflow: {
    etapes: ["Comprendre le besoin", "Vous identifier"],
    services: [
      { valeur: "presence-en-ligne", libelle: "Présence en ligne" },
      { valeur: "automatisation-demandes", libelle: "Automatisation des demandes" },
      { valeur: "gestion-clients", libelle: "Gestion des clients" },
      { valeur: "securisation-reseau", libelle: "Sécurisation du réseau" },
      { valeur: "outils-metiers", libelle: "Outils métiers" },
      { valeur: "indecis", libelle: "Je ne sais pas encore" },
    ],
    champs: {
      service: { libelle: "Service recherché", placeholder: "Choisissez un service" },
      objectif: {
        libelle: "Objectif ou difficulté rencontrée",
        aide: "Par exemple : je reçois mes demandes par courriel et je perds le suivi.",
      },
      lieu: { libelle: "Localisation générale", aide: "Ville ou région, par exemple Gatineau ou Abidjan." },
      description: { libelle: "Description courte du projet" },
      nom: { libelle: "Nom et organisation" },
      courriel: { libelle: "Courriel" },
      telephone: { libelle: "Téléphone", facultatif: "(facultatif)" },
      preference: { libelle: "Préférence de contact", courriel: "Courriel", telephone: "Téléphone" },
      consentement:
        "J'accepte que NEOXIX utilise ces informations pour répondre à ma demande. Elles sont enregistrées dans notre outil de suivi des clients (HubSpot), comme le décrit la politique de confidentialité.",
    },
    requis: "* Champ requis",
    continuer: "Continuer",
    retour: "Retour",
    erreurs: {
      service_requis: "Choisissez un service, ou « Je ne sais pas encore ».",
      description_courte: "Décrivez votre projet en quelques mots (au moins 10 caractères).",
      nom_requis: "Indiquez votre nom.",
      courriel_invalide: "Saisissez une adresse courriel valide, par exemple nom@entreprise.ca.",
      telephone_invalide: "Saisissez un numéro de téléphone valide, ou laissez ce champ vide.",
      telephone_requis: "Indiquez un numéro de téléphone, ou choisissez le courriel.",
      consentement_requis: "Cochez cette case pour envoyer votre demande.",
      trop_long: "Ce texte est trop long. Raccourcissez-le.",
      secret_detecte:
        "Retirez tout mot de passe ou clé de votre message. Nous les demanderons, si nécessaire, par un canal sécurisé.",
    },
    modes: {
      mock: {
        bandeauFort: "Mode test.",
        bandeau:
          "Le serveur vérifie votre demande, puis la supprime aussitôt : rien n'est conservé ni transmis à NEOXIX. Pour un vrai projet, écrivez à info@neoxix.ca.",
        envoyer: "Envoyer la demande (test)",
        chargement: "Vérification en cours…",
        confirmationTitre: "Demande valide (mode test)",
        confirmationTexte:
          "Le serveur a vérifié votre demande, puis l'a supprimée : rien n'a été conservé ni transmis. Dans la version publiée, une personne examinera votre demande et vous répondra par écrit.",
      },
      live: {
        envoyer: "Envoyer la demande",
        chargement: "Envoi en cours…",
        confirmationTitre: "Demande enregistrée",
        confirmationTexte:
          "Votre demande est bien enregistrée. Une personne l'examinera et vous répondra par écrit. Conservez votre référence si vous nous écrivez à son sujet.",
      },
    },
    erreurTemporaire: {
      titre: "Erreur temporaire",
      texte: "Votre demande n'a pas pu être traitée. Vous pouvez réessayer, ou écrire directement à info@neoxix.ca.",
      reessayer: "Réessayer",
    },
    tropDeTentatives: {
      titre: "Trop de tentatives",
      texte: "Patientez quelques minutes avant de réessayer, ou écrivez directement à info@neoxix.ca.",
    },
    recommencer: "Recommencer",
    reference: "Référence",
    desactive:
      "Le formulaire en ligne n'est pas encore ouvert. Écrivez-nous à info@neoxix.ca en décrivant votre besoin : une personne lit chaque message et vous répond par écrit.",
  },
  confidentialite: {
    titre: "Confidentialité",
    statut: "Dernière mise à jour : 11 novembre 2026.",
    sections: [
      {
        titre: "Responsable de la protection des renseignements personnels",
        texte:
          "Conformément à la Loi sur la protection des renseignements personnels dans le secteur privé (Québec), la personne ayant la plus haute autorité au sein de NEOXIX exerce la fonction de responsable de la protection des renseignements personnels. Pour la joindre : info@neoxix.ca.",
      },
      {
        titre: "Témoins et mesure d'audience",
        texte: "Ce site n'utilise aucun témoin (cookie) de mesure d'audience ni aucun outil d'analyse ou de publicité tiers.",
      },
      {
        titre: "Journaux techniques de l'hébergeur",
        texte:
          "Le site est hébergé par Vercel. Comme tout hébergeur, Vercel traite des données techniques de connexion (adresse IP, navigateur, page demandée, date) pour acheminer les pages et protéger le service. Ces données peuvent être traitées hors du Québec. NEOXIX ne les utilise pas pour vous identifier ni à des fins de marketing.",
      },
      {
        titre: "Messages envoyés par courriel",
        texte:
          "Si vous écrivez à info@neoxix.ca, nous utilisons votre nom, votre adresse et le contenu de votre message uniquement pour vous répondre et, si vous le souhaitez, préparer une proposition. La messagerie est hébergée par un fournisseur de courriel qui peut traiter ces messages hors du Québec. Nous ne vendons pas ces renseignements et ne les communiquons pas à des tiers à des fins commerciales.",
      },
      {
        titre: "Accès et conservation des demandes",
        texte:
          "Seules les personnes de NEOXIX qui traitent les demandes y ont accès. Les demandes reçues par le formulaire en ligne qui n'ont pas donné lieu à un mandat sont supprimées de notre outil de suivi des clients au plus tard 12 mois après le dernier échange. Vous pouvez demander la suppression de vos renseignements à tout moment en écrivant à info@neoxix.ca.",
      },
      {
        titre: "Vos droits",
        texte:
          "Vous pouvez demander l'accès à vos renseignements, leur rectification ou leur suppression, et retirer votre consentement, en écrivant à info@neoxix.ca. Vous pouvez aussi vous adresser à la Commission d'accès à l'information du Québec.",
      },
    ],
    sansFormulaire: {
      titre: "Formulaire en ligne",
      texte: "Ce site ne comporte pas de formulaire en ligne actif : aucun renseignement saisi sur ce site n'est enregistré ni transmis.",
    },
    avecFormulaire: [
      {
        titre: "Formulaire de demande",
        texte:
          "Le formulaire recueille le service recherché, la description de votre besoin, votre nom et votre organisation, votre courriel, et, si vous les indiquez, votre téléphone et votre région. Ces renseignements servent uniquement à examiner votre demande, à vous répondre et, si vous le souhaitez, à préparer une proposition. Ils ne sont jamais utilisés pour vous envoyer des communications marketing.",
      },
      {
        titre: "Où vont ces renseignements",
        texte:
          "Le site transmet votre demande, par une connexion chiffrée et signée, à notre serveur d'automatisation (n8n), qui l'enregistre dans notre outil de suivi des clients, HubSpot. HubSpot est un fournisseur établi hors du Québec : vos renseignements peuvent y être stockés hors du Québec. Le serveur d'automatisation ne conserve pas le contenu des demandes enregistrées avec succès ; en cas d'erreur de traitement, ce contenu peut être conservé temporairement, le temps de corriger le problème.",
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
