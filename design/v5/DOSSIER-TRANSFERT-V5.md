# NEOXIX · Dossier de transfert V5 (conception)

Statut : proposition de conception, non validée comme interface finale. Non publiée. Aucune autorisation de développement ou de déploiement.
Fichier de référence : `/home/claude/neoxix-v5/index.html` (62 672 octets, SHA-256 `5ad1cd451257280f66c8bcd070a19daf8951a578d44cfdd936ac0c96f245b62a`).
Base : V4 (contenu corrigé validé, direction chromatique NEOXIX Ambre). V3 non modifiée.

## 1. Prototype et écrans

| Écran | Largeur testée | Résultat automatisé |
|---|---|---|
| Mobile | 390 px | Aucun débordement horizontal, menu ouvert/fermé, fermeture à Échap |
| Tablette | 834 px | Aucun débordement horizontal |
| iPad paysage | 1194 px | Aucun débordement horizontal |
| Ordinateur | 1440 px | Aucun débordement horizontal |

Parcours testés (navigateur headless Chromium) : validation de l'étape 1 du formulaire, passage à l'étape 2, erreur de courriel, confirmation simulée, aucune requête vers un domaine tiers, aucune erreur console aux quatre largeurs.
Mouvement réduit : aucune animation active, contenu visible sans défilement.

Non testé : rendu visuel à l'œil par le propriétaire, Safari sur iPad Pro 13 pouces réel (recette confiée au propriétaire, non marquée comme faite), navigateurs mobiles réels, lecteurs d'écran, Lighthouse.

## 2. Tokens

| Jeton | Valeur | Usage |
|---|---|---|
| `--nuit` | `#10171A` | Fonds sombres (héros, engagements, pied de page) |
| `--nuit-2` | `#18242A` | Cartes sur fond sombre |
| `--filet-nuit` | `#2C3D45` | Bordures sur fond sombre |
| `--ambre-vif` | `#FF8B47` | Accent sur fond sombre uniquement |
| `--ambre` | `#E87436` | Boutons principaux, puces |
| `--ambre-fonce` | `#B44D29` | Texte ambre sur fond clair (contraste) |
| `--ambre-presse` | `#973F21` | Erreurs de formulaire |
| `--signal` | `#4FD1C5` | Turquoise fonctionnel : étapes, progression, automatisation |
| `--fond` | `#FAF8F5` | Fond éditorial clair |
| `--lavis` | `#FFF0E5` | Fonds d'icônes et de bandeaux |
| `--texte` | `#1B2528` | Texte principal |
| `--encre-2` | `#56636A` | Texte secondaire |
| `--filet` | `#E4DED6` | Bordures claires |

Typographie : IBM Plex Sans (texte), IBM Plex Mono (surtitres, statuts, étiquettes), Bricolage Grotesque (titres). Les trois familles doivent être auto-hébergées (fichiers à fournir, licence OFL). La maquette utilise une pile de polices de repli tant que les fichiers ne sont pas intégrés.

Points de rupture : 1100, 960, 834, 620 et 360 px.

## 3. Composants

- En-tête collant : marque, navigation, bouton « Présenter mon projet », menu mobile à bouton unique (`aria-expanded`, fermeture à Échap, retour du focus).
- Héros avec schéma animé : six étapes, de « Besoin exprimé » à « Suivi ». L'étape 04 est distinguée comme décision humaine.
- Bandeau de confiance (pas de chiffre client).
- Cartes de solutions : statut obligatoire (« Prestation sur devis », « Concept en conception · non commercialisé »).
- Cartes de services : problème, résultat recherché, technologies, détail repliable (inclus, dépend du périmètre, non inclus, pour démarrer).
- Cartes de réalisations : statuts Ivoire Connect (« En développement »), laboratoires (« Démonstration interne »), LeadFlow (« En conception »).
- Légende des statuts : En développement, Démonstration, Pilote autorisé (accord écrit), Livré (réservé aux projets avec preuve, aucune carte ne l'utilise).
- Méthode en cinq étapes, avec distinction « maquette visuelle » / « schéma d'architecture ».
- Engagements en deux colonnes.
- Formules Ponctuel, Suivi, Accompagnement : toutes « Sur devis ».
- FAQ en accordéon natif (`details`).
- Formulaire LeadFlow en deux étapes (voir section 5).
- Pied de page sans lien juridique factice.

## 4. Interactions et mouvement

- Schéma du héros : un signal circule le long de la ligne, et chaque étape s'allume à tour de rôle (cycle de 8 secondes).
- Apparition au défilement des blocs (`.revele`) ; le contenu reste visible sans JavaScript.
- Cartes : légère élévation au survol, bordure ambre.
- FAQ et détails des services : ouverture animée.
- Menu mobile : transition d'ouverture et de fermeture.
- Mouvement réduit (`prefers-reduced-motion: reduce`) : toutes les animations et transitions sont désactivées, le schéma reste lisible, et le contenu s'affiche sans apparition progressive.
- Ces animations ne véhiculent aucune information seule : chaque étape porte son libellé.

## 5. Formulaire LeadFlow (simulation)

Étape 1, « Comprendre le besoin » : service recherché (obligatoire), objectif ou difficulté, localisation générale, description courte (obligatoire, 10 caractères minimum).
Étape 2, « Vous identifier » : nom et organisation (obligatoire), courriel (obligatoire, format vérifié), téléphone (facultatif), préférence de contact, case de consentement (obligatoire).
États conçus : saisie, champ requis manquant, courriel invalide, consentement manquant, chargement simulé, erreur temporaire simulée avec nouvelle tentative, confirmation de simulation.

Aucune donnée n'est envoyée. La maquette affiche « Simulation » à chaque étape. Le texte de consentement doit être validé juridiquement avant publication (Loi 25).

Pour Claude Code : le traitement serveur, la validation côté serveur, la protection anti-abus et l'intégration à n8n ou HubSpot restent à réaliser et à tester. Ne pas afficher « demande envoyée » tant que le mécanisme réel n'existe pas.

## 6. Textes

### Validés (repris de la V4)
- Titre d'accueil : « Votre site, vos outils et votre réseau, avec un seul interlocuteur. »
- Quatre pôles de services, sans prix ni délai.
- Formules Ponctuel, Suivi, Accompagnement, toutes sur devis.
- Engagements (proposition écrite avant tout travail facturé, validation humaine, accès et livrables au contrat).
- Ivoire Connect : « En développement », sans chiffre ni témoignage.
- Adresse de contact : `info@neoxix.ca`.

### Corrigés depuis la V3 (validés)
- Sauvegardes : « dont les modalités sont précisées dans chaque proposition » ; aucune restauration présentée comme testée.
- CRM : « serait enregistrée » ; aucune intégration présentée comme active.
- Résultats clients : « nous ne publions pas de résultats clients à ce jour ».

### À décider par le propriétaire
- Texte du consentement du formulaire (revue juridique, Loi 25).
- Texte de confidentialité et présence d'un lien vers celui-ci (aucun lien factice n'est affiché).
- Symbole officiel : la V5 utilise un symbole provisoire, sans mention « logo provisoire » visible. Le remplacement se fait à partir des actifs de marque validés.
- Délai de réponse : aucun n'est affiché.
- Version anglaise : aucune date.
- Projet « NEOXIX LeadFlow » : son nom public et son statut « en conception » restent à confirmer.

### Retirés
- Tous les crochets de validation (`[délai à valider]`, `[fourchette à valider]`, etc.).
- Les mentions internes « Proposition V4 », « Maquette v3 » et « Logo provisoire » (la V5 ne les affiche pas au public).
- Les liens « Confidentialité (à venir) » et « Conditions (à venir) ».

## 7. Différences V4 → V5

1. Bouton « Nous écrire » remplacé par « Présenter mon projet » ; sur mobile, le bouton est dans le menu, ce qui supprime le débordement signalé.
2. Héros : deux actions (« Présenter mon projet », « Explorer les solutions »), et schéma animé en six étapes.
3. Nouvelle section Solutions, avec statuts, placée avant les services.
4. Services : détails repliables et résultats recherchés.
5. Réalisations : nouvelle section avec trois cartes et statuts.
6. Méthode : distinction maquette visuelle / schéma d'architecture.
7. Contact : formulaire LeadFlow en deux étapes, avec états (remplace le bloc de contact simple).
8. FAQ : questions reformulées, sans délai ni promesse non vérifiés.
9. Mouvement réduit : toutes les animations désactivables.
10. Section « Trois questions » retirée de l'accueil : décision de conception à soumettre à votre validation (la V3 et la V4 la conservent).

## 8. Fichiers à transmettre au dépôt

- `design/v5/index.html` : prototype de référence (pour Claude Code, non déployé).
- `design/v5/DOSSIER-TRANSFERT-V5.md` : ce document.
- Captures à 390, 834, 1194 et 1440 px : à produire à la demande, non commitées.

## 9. Procédure d'intégration recommandée (Claude Code)

1. Vérifier le SHA-256 du prototype avant toute reprise.
2. Ne pas copier le HTML tel quel : le traduire en composants Next.js/React et en CSS basé sur les tokens ci-dessus.
3. Remplacer le schéma animé et le formulaire par leurs équivalents réels, puis ajouter la validation serveur (Zod) et le mode `INTAKE_MODE=mock` tant que les intégrations ne sont pas validées.
4. Auto-héberger les polices et retirer toute dépendance externe.
5. Tester sur les quatre largeurs, en clavier et en mouvement réduit, puis documenter les résultats.
6. Remettre un rapport de fin de mission avant toute publication.

## 10. Critères d'acceptation (pour Claude Code)

1. Aucun débordement horizontal à 390, 834, 1194 et 1440 px.
2. Le menu mobile s'ouvre, se ferme avec Échap, et rend le focus au bouton.
3. Le formulaire valide les champs requis et le courriel, et n'envoie aucune donnée tant que le mode réel n'est pas autorisé.
4. Aucune animation active avec `prefers-reduced-motion`, et contenu identique.
5. Aucune requête vers un domaine tiers au chargement.
6. Aucune erreur console.
7. Aucun texte entre crochets, aucune mention « provisoire » visible au public, aucun lien juridique factice.
8. Aucune promesse non validée (délai, sauvegarde testée, certification, résultat client, prix).

## 11. Limites connues

- Conception validée par tests automatisés seulement : pas de test de rendu par le propriétaire, ni de recette sur appareil réel.
- Aucune conformité WCAG ni performance terrain ne peut être déclarée à partir de cette maquette.
- Le formulaire est une simulation : aucune transmission, aucun stockage, aucun traitement de données.
- Les icônes et illustrations sont en SVG créés pour cette maquette ; aucune image de stock ni photo n'est utilisée.
