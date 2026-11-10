import type { Contenu } from "../types";

/**
 * Contenu français du site vitrine.
 * Sources :
 * - `design/v5/index.html` (maquette V5, SHA-256 5ad1cd45…f245b62a) et `design/v5/DOSSIER-TRANSFERT-V5.md`
 *   pour l'accueil, la méthode, les engagements, les formules, la FAQ et le formulaire LeadFlow ;
 * - `docs/neoxix-services/03-SERVICES-CATALOG.md` (décision A3 du propriétaire) pour le détail des
 *   pages de pôle, limité aux prestations classées « commercialisables » et aligné sur les textes
 *   corrigés de la V5 (aucune sauvegarde ni restauration présentée comme testée, aucun délai, aucun prix).
 * Adaptations au site (la maquette parlait d'elle-même) : voir `design/v5/RAPPORT-INTEGRATION-V5.md`.
 */
export const fr: Contenu = {
  langue: "fr",
  site: {
    nom: "NEOXIX",
    titre: "NEOXIX · Services numériques pour PME",
    description:
      "NEOXIX conçoit, sécurise et automatise les systèmes numériques des PME au Canada et en Côte d'Ivoire. Proposition écrite avant tout travail facturé.",
    courriel: "info@neoxix.ca",
    sujetCourriel: "Demande de consultation",
    descriptionPied: "Services numériques pour PME, au Canada et en Côte d'Ivoire.",
    lieuPied: "© 2026 NEOXIX · Gatineau, Québec",
  },
  navigation: [
    { libelle: "Services", href: "/#services" },
    { libelle: "Solutions", href: "/#solutions" },
    { libelle: "Réalisations", href: "/#realisations" },
    { libelle: "Méthode", href: "/#methode" },
    { libelle: "Questions", href: "/#faq" },
  ],
  actionPrincipale: { libelle: "Présenter mon projet", href: "/#contact" },
  accueil: {
    surtitre: "Services numériques · Gatineau, Ottawa et Côte d'Ivoire",
    titre: { avant: "Votre site, vos outils et votre réseau, ", marque: "avec un seul interlocuteur." },
    chapo:
      "NEOXIX conçoit, sécurise et automatise les systèmes numériques des PME. Une méthode écrite, des livrables qui vous appartiennent, et une personne qui répond.",
    actionSecondaire: { libelle: "Explorer les solutions", href: "#solutions" },
    publics: ["PME de 1 à 50 personnes", "Travailleurs autonomes", "Organisations"],
    schema: {
      titre: "Comment une demande avance",
      mention: "Schéma illustratif",
      etapes: [
        { numero: "01", libelle: "Besoin exprimé", detail: "Votre situation, vos outils, vos contraintes", etiquette: "Client" },
        { numero: "02", libelle: "Analyse", detail: "Périmètre et points à clarifier", etiquette: "Analyse" },
        { numero: "03", libelle: "Proposition écrite", detail: "Périmètre, étapes, inclus, exclus", etiquette: "Écrit" },
        { numero: "04", libelle: "Validation humaine", detail: "Vous décidez avant toute réalisation", etiquette: "Décision", humain: true },
        { numero: "05", libelle: "Réalisation et tests", detail: "Construction par étapes, vérifications documentées", etiquette: "Projet" },
        { numero: "06", libelle: "Suivi", detail: "Documentation remise, accompagnement selon la formule", etiquette: "Suivi" },
      ],
      pied: ["Exemple de déroulement. Aucune donnée client.", "Aucune automatisation n'est présentée comme active ici."],
    },
    confiance: [
      "Basé à Gatineau, Québec",
      "Clientèle à Ottawa–Gatineau et au Québec",
      "Projets pour la Côte d'Ivoire",
      "Français, anglais sur demande",
      "Proposition écrite avant tout travail facturé",
    ],
  },
  solutions: {
    surtitre: "Solutions",
    titre: { avant: "Partez de votre ", marque: "besoin réel." },
    intro:
      "Des cas d'usage concrets. Chaque solution indique son statut : une prestation sur devis, ou un concept qui n'est pas encore commercialisé.",
    items: [
      {
        titre: "Présence en ligne",
        texte: "Un site clair qui présente vos services, inspire confiance et reçoit les demandes.",
        statut: "Prestation sur devis",
        icone: "ecran",
      },
      {
        titre: "Automatisation des demandes",
        texte: "Formulaire qualifié, notifications et suivi. Une personne valide chaque décision importante.",
        statut: "Prestation sur devis",
        icone: "flux",
      },
      {
        titre: "Gestion des clients",
        texte: "Contacts, rappels et suivi des devis, reliés à l'outil CRM que vous utilisez.",
        statut: "Intégration sur devis",
        icone: "clients",
      },
      {
        titre: "Sécurisation du réseau",
        texte: "Accès à distance chiffré, pare-feu, segmentation et supervision, selon votre périmètre.",
        statut: "Prestation sur devis",
        icone: "bouclier",
      },
      {
        titre: "Outils métiers",
        texte: "Portails, outils internes et tableaux de bord conçus autour de votre façon de travailler.",
        statut: "Sur devis, selon le périmètre",
        icone: "blocs",
      },
      {
        titre: "NEOXIX LeadFlow",
        texte: "Concept de gestion structurée des demandes : formulaire, qualification, validation humaine, notifications.",
        statut: "Concept en conception · non commercialisé",
        icone: "courbe",
        concept: true,
      },
    ],
    note: "Une solution présentée ici n'est pas un produit déjà déployé chez des clients. Les concepts restent signalés comme tels jusqu'à leur mise en service.",
  },
  services: {
    surtitre: "Services",
    titre: { avant: "Quatre pôles, ", marque: "une seule méthode." },
    intro:
      "Chaque service précise ce qui est inclus, ce qui dépend du périmètre et ce qu'il faut préparer pour recevoir une proposition.",
    tarification: "Sur devis",
    poles: [
      {
        slug: "sites-web",
        numero: "01",
        titre: "Sites web et WordPress",
        titreCourt: "Sites web et WordPress",
        accroche: "Un site qui présente votre entreprise clairement et facilite la prise de contact.",
        resultatRecherche: "Résultat recherché : un site à jour, lisible sur téléphone et relié à vos demandes.",
        etiquettes: ["WordPress", "WooCommerce", "DNS", "Courriel professionnel"],
        detail: {
          inclus: ["Site vitrine ou boutique WooCommerce", "Refonte ou migration", "Configuration DNS et courriel"],
          perimetre: ["Contenu rédactionnel et photos", "Fonctionnalités de commerce"],
          nonInclus: ["Hébergement géré", "Référencement continu"],
          demarrer: ["Vos objectifs et vos pages principales", "Accès à votre domaine"],
        },
        resume: "Sites vitrines, boutiques WooCommerce, refontes, migrations, domaines, courriels professionnels et entretien.",
        probleme: "« Mon site ne me ressemble plus, il est lent, et je ne sais pas qui le met à jour. »",
        prestations: [
          "Site vitrine WordPress responsive",
          "Refonte et migration",
          "Boutique WooCommerce",
          "Domaines et DNS",
          "Messagerie professionnelle (MX, SPF, DKIM, DMARC)",
          "Entretien : mises à jour, sauvegardes et sécurité, selon le périmètre convenu",
          "Optimisation de performance et SEO technique",
        ],
        pourDevis:
          "Type de site, nombre de pages ou de produits, fonctionnalités, domaine existant ou non, hébergement souhaité, langues, échéance, budget indicatif.",
        ensuite: "Suivi WordPress selon la formule choisie : mises à jour vérifiées et sauvegardes, dont les modalités sont précisées dans chaque proposition.",
      },
      {
        slug: "automatisation",
        numero: "02",
        titre: "Automatisation des processus",
        titreCourt: "Automatisation",
        accroche: "Des demandes qui n'attendent plus dans une boîte courriel, et des tâches répétitives qui se font seules.",
        resultatRecherche:
          "Résultat recherché : moins de saisie, un suivi clair, et une décision humaine à chaque étape importante.",
        etiquettes: ["n8n", "CRM", "API", "Python"],
        detail: {
          inclus: ["Formulaire qualifié", "Notifications et rappels", "Intégration entre deux outils"],
          perimetre: ["Outils déjà utilisés", "Accès aux systèmes concernés"],
          nonInclus: ["Décisions automatiques sans validation"],
          demarrer: ["Liste des tâches actuelles", "Outils utilisés"],
        },
        resume:
          "Formulaires qualifiés, CRM, rappels, suivi de devis et intégrations entre vos logiciels, avec validation humaine.",
        probleme: "« On recopie les mêmes informations dans trois outils, et des demandes se perdent. »",
        prestations: [
          "Flux formulaire, qualification et CRM",
          "Notifications, rappels et suivi de devis",
          "Intégrations API entre logiciels",
          "Automatisation documentaire",
          "Workflows avec validation humaine",
          "Odoo : conseil, installation, configuration",
        ],
        paliers: [
          {
            titre: "Diagnostic de processus",
            texte: "Cartographie d'un processus actuel, des outils et des tâches manuelles, puis recommandation écrite.",
          },
          { titre: "Pilote", texte: "Un flux automatisé en environnement de test, validé avec vous." },
          { titre: "Mise en production et suivi", texte: "Surveillance des exécutions, alertes d'échec, ajustements." },
        ],
        pourDevis:
          "Description du processus actuel, outils utilisés, volume approximatif, tâches manuelles, résultat souhaité, contraintes de données.",
        note: "Licences des logiciels tiers (CRM, n8n Cloud, etc.) à la charge du client.",
      },
      {
        slug: "infrastructure",
        numero: "03",
        titre: "Infrastructure et sécurité",
        titreCourt: "Infrastructure et sécurité",
        accroche: "Un réseau stable, des accès maîtrisés et une documentation que vous pouvez lire.",
        resultatRecherche:
          "Résultat recherché : un réseau compréhensible, des accès protégés, et des sauvegardes dont les modalités sont précisées dans chaque proposition.",
        etiquettes: ["Réseau", "Pare-feu", "VPN", "Windows Server", "Linux"],
        detail: {
          inclus: ["Configuration réseau et segmentation", "Accès à distance chiffré", "Documentation technique"],
          perimetre: ["Sauvegardes, selon le périmètre contractuel", "Supervision"],
          nonInclus: ["Sécurité absolue", "Disponibilité 24/7 sans contrat"],
          demarrer: ["Plan du réseau existant", "Liste des équipements"],
        },
        resume:
          "Réseau et VLAN, accès à distance chiffré, pare-feu, Windows Server et Linux, sauvegardes, dont les modalités sont précisées dans chaque proposition.",
        probleme:
          "« Mes employés travaillent à distance, mon serveur a dix ans et je ne suis pas sûr que mes sauvegardes fonctionnent. »",
        prestations: [
          "VPN et accès à distance",
          "Routage, commutation, VLAN, segmentation",
          "Pare-feu",
          "Windows Server, Active Directory, DNS, Linux",
          "Virtualisation Proxmox et VMware",
          "Sauvegarde, reprise et supervision, selon le périmètre contractuel",
          "Revue technique de configuration, durcissement, MFA",
          "Git, Docker, CI/CD, Ansible",
          "Migrations cloud",
        ],
        pourDevis:
          "Contexte, nombre de postes et de sites, équipements actuels (marque et modèle, sans configuration), urgence. Ne transmettez aucun mot de passe.",
        ensuite: "Supervision et maintenance préventive, selon la formule choisie.",
        note: "Les technologies citées (Proxmox, VMware, Windows Server) sont des outils utilisés. NEOXIX n'est partenaire officiel d'aucun de ces éditeurs.",
      },
      {
        slug: "applications",
        numero: "04",
        titre: "Applications sur mesure",
        titreCourt: "Applications sur mesure",
        accroche: "Des outils faits pour vos processus, de la maquette jusqu'à la maintenance.",
        resultatRecherche:
          "Résultat recherché : un outil qui remplace un tableur ou un processus manuel, validé avec vous à chaque étape.",
        etiquettes: ["Applications web", "Outils internes", "Tableaux de bord"],
        detail: {
          inclus: ["Portail client ou outil interne", "Tableau de bord", "Intégration avec un système existant"],
          perimetre: ["Applications mobiles ou desktop"],
          nonInclus: ["Maintenance au-delà de la formule choisie"],
          demarrer: ["Description du processus actuel", "Utilisateurs concernés"],
        },
        resume: "Portails clients, outils internes et tableaux de bord, de la maquette jusqu'à la maintenance.",
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
  realisations: {
    surtitre: "Réalisations",
    titre: { avant: "Ce qui existe, ", marque: "présenté avec son statut." },
    intro: "Aucun résultat chiffré ni témoignage client n'est publié à ce jour. Chaque projet indique où il en est réellement.",
    items: [
      {
        titre: "Ivoire Connect",
        statut: "En développement",
        texte: "Plateforme communautaire en cours de développement. Nous ne publions aucun chiffre d'utilisateurs ni résultat à ce jour.",
        apercu: "plateforme",
      },
      {
        titre: "Laboratoires techniques",
        statut: "Démonstration interne",
        texte:
          "Architectures réseau, configurations expurgées et rapports de tests. Ce sont des démonstrations internes, et non des déploiements clients.",
        apercu: "laboratoire",
      },
      {
        titre: "NEOXIX LeadFlow",
        statut: "En conception",
        texte: "Concept de gestion des demandes, en conception. Il n'est pas commercialisé, et son traitement serveur n'est pas encore réalisé.",
        apercu: "flux",
      },
    ],
    legende: [
      { terme: "En développement", sens: "projet en cours" },
      { terme: "Démonstration", sens: "démonstration interne" },
      { terme: "Pilote autorisé", sens: "avec accord écrit" },
      { terme: "Livré", sens: "réservé aux projets avec preuve" },
    ],
  },
  methode: {
    surtitre: "Méthode",
    titre: { avant: "Nous cadrons et validons ", marque: "avec vous avant la réalisation." },
    intro: "Chaque étape produit un document que vous pouvez lire, commenter et conserver.",
    etapes: [
      { numero: "01", titre: "Comprendre", texte: "Un échange pour décrire votre situation, vos outils et vos contraintes." },
      { numero: "02", titre: "Proposer", texte: "Une proposition écrite : périmètre, étapes, exclus, prix." },
      { numero: "03", titre: "Maquetter", texte: "Vous voyez le résultat visuel avant la construction." },
      { numero: "04", titre: "Réaliser et tester", texte: "Construction par étapes, avec des vérifications documentées." },
      { numero: "05", titre: "Livrer et accompagner", texte: "Mise en service, documentation remise, suivi selon la formule choisie." },
    ],
    encarts: [
      {
        titre: "Maquette visuelle",
        texte: "Ce que vous voyez à l'écran : pages, parcours, textes et états. Elle sert à valider l'expérience avant de construire.",
      },
      {
        titre: "Schéma d'architecture",
        texte: "Comment les systèmes se connectent entre eux : réseau, données, outils et accès. Il sert à valider la solution technique.",
      },
    ],
    exemple: {
      titre: "Exemple de déroulement simplifié",
      etapes: [
        "Besoin exprimé et contexte compris",
        "Proposition écrite et périmètre défini",
        "Maquette avec données fictives",
        "Validation humaine avant réalisation",
        "Tests et corrections documentés",
        "Livraison et documentation remise",
      ],
      note: "Exemple illustratif. Le déroulement réel dépend de chaque projet, et aucune durée n'est garantie.",
    },
  },
  engagements: {
    surtitre: "Engagements",
    titre: { avant: "Ce que vous pouvez attendre, ", marque: "et ce que nous ne promettons pas." },
    oui: {
      titre: "Nous nous engageons à",
      items: [
        "Une proposition écrite avant tout travail facturé.",
        "Une validation humaine aux décisions importantes.",
        "Des livrables et des accès définis au contrat.",
        "Des sauvegardes dont les modalités sont précisées dans chaque proposition.",
        "Une documentation prévue au périmètre, et un langage clair.",
      ],
    },
    non: {
      titre: "Nous ne promettons pas",
      items: [
        "Une sécurité absolue : personne ne peut la garantir honnêtement.",
        "Une disponibilité permanente ni une assistance 24/7 sans contrat qui la prévoit.",
        "Une certification ou un partenariat que nous n'avons pas.",
        "Des résultats financiers ou des performances chiffrées non vérifiées.",
      ],
    },
  },
  formules: {
    surtitre: "Accompagnement",
    titre: { avant: "Trois façons de ", marque: "continuer après la livraison." },
    intro: "Toutes les prestations sont établies sur devis. Aucun prix n'est affiché avant un échange.",
    items: [
      { titre: "Ponctuel", texte: "Interventions et besoins précis, avec un périmètre défini à l'avance.", statut: "Sur devis" },
      { titre: "Suivi", texte: "Maintenance et suivi régulier, selon le périmètre convenu avec vous.", statut: "Sur devis" },
      {
        titre: "Accompagnement",
        texte: "Suivi plus structuré des besoins techniques et des évolutions de votre système.",
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
        reponse: "Par une description de votre besoin. Nous revenons par écrit avec une proposition qui précise le périmètre.",
      },
      {
        question: "Travaillez-vous avec nos outils existants ?",
        reponse: "Souvent oui, selon le périmètre. Indiquez les outils que vous utilisez dans votre demande.",
      },
      {
        question: "Qui possède les accès et les livrables ?",
        reponse: "Les accès et les livrables sont définis au contrat, avant le début du travail.",
      },
      {
        question: "Peut-on commencer par un petit projet ?",
        reponse: "Oui, selon le périmètre. La proposition écrite précise ce qui est inclus et ce qui ne l'est pas.",
      },
      {
        question: "Comment vos données sont-elles protégées ?",
        reponse:
          "Ce site ne collecte aucune donnée personnelle pour l'instant. La politique de confidentialité sera publiée après validation juridique.",
      },
      {
        question: "Travaillez-vous en français et en anglais ?",
        reponse: "Le français est notre langue principale. La version anglaise est prévue, sans date fixée à ce jour.",
      },
      {
        question: "Y a-t-il un engagement après une première demande ?",
        reponse:
          "Non. Une demande n'entraîne aucun engagement. Toute prestation fait l'objet d'une proposition écrite que vous pouvez accepter ou refuser.",
      },
      {
        question: "Que se passe-t-il après une demande ?",
        reponse:
          "Votre demande est examinée par une personne. Le délai dépend du périmètre et des informations fournies.",
      },
    ],
  },
  contact: {
    surtitre: "Commencer",
    titre: { avant: "Décrivez votre situation en ", marque: "quelques lignes." },
    intro: "Aucun engagement de votre part. Une personne lit votre demande et vous répond par écrit.",
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
      consentement: "J'accepte que NEOXIX utilise mes informations pour répondre à ma demande.",
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
        confirmationTitre: "Demande reçue",
        confirmationTexte: "Une personne examinera votre demande et vous répondra par écrit.",
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
    statut: "Politique en vigueur depuis le 10 novembre 2026. Elle sera mise à jour avant l'ouverture du formulaire en ligne.",
    sections: [
      {
        titre: "Responsable de la protection des renseignements personnels",
        texte:
          "La personne responsable de la protection des renseignements personnels chez NEOXIX est la direction de l'entreprise. Pour toute question, demande d'accès, de rectification ou de retrait, écrivez à info@neoxix.ca.",
      },
      {
        titre: "Ce que ce site collecte",
        texte:
          "Ce site n'utilise aucun témoin (cookie) de mesure d'audience ni aucun outil d'analyse ou de publicité tiers. Le formulaire en ligne n'est pas encore ouvert : aucun renseignement saisi sur ce site n'est enregistré ni transmis.",
      },
      {
        titre: "Journaux techniques de l'hébergeur",
        texte:
          "Le site est hébergé par Vercel. Comme tout hébergeur, Vercel traite des données techniques de connexion (adresse IP, navigateur, page demandée, date) pour acheminer les pages et protéger le service. Ces données peuvent être traitées hors du Québec. NEOXIX ne les utilise pas pour vous identifier ni pour du marketing.",
      },
      {
        titre: "Messages envoyés par courriel",
        texte:
          "Si vous écrivez à info@neoxix.ca, nous utilisons votre nom, votre adresse et le contenu de votre message uniquement pour répondre à votre demande et préparer une éventuelle proposition. La messagerie est hébergée par un fournisseur de courriel qui peut traiter ces messages hors du Québec. Nous ne vendons ni ne partageons ces renseignements à des fins commerciales. Les messages sans suite sont supprimés au plus tard 24 mois après le dernier échange.",
      },
      {
        titre: "Vos droits",
        texte:
          "Vous pouvez demander l'accès à vos renseignements, leur rectification ou leur suppression, et retirer votre consentement, en écrivant à info@neoxix.ca. Vous pouvez aussi vous adresser à la Commission d'accès à l'information du Québec.",
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
