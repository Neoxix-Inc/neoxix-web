# NEOXIX-SERVICES-PRICING-001 · Phase 1B · Rapport de correction commerciale

Branche : `feat/services-pricing-001` (base `642bf9c`). Maquette locale, non publiée.
Aucune fusion, aucun déploiement, aucun accès créé. Pull request à ouvrir après validation de la maquette par le propriétaire.

## 1. Différences fonctionnelles

| Avant (642bf9c) | Après (phase 1B) |
|---|---|
| Aucun montant, « Sur devis » partout | Catalogue de 22 éléments avec les montants du cadrage, en CAD |
| Montants (si ajoutés) recopiés dans chaque composant | Une seule source : `src/content/fr/catalogue.ts`, lue par l'accueil, la page Tarifs, les pages d'offre et les pages de pôle |
| Trois cartes : « Site web avec réservation », « Google Workspace », « Support PME » | Cartes : « Site web et réservation » (1 400 $ CA), « Google Workspace professionnel » (forfait 1 200 $ CA), « Assistance informatique PME » (PME Essentiel 299 $ CA / mois) |
| Page Tarifs : quatre cartes de pôle complètes, formules | Page compacte : quatre tableaux par catégorie, hors honoraires, liens vers les pôles avec repère de prix |
| Pages de pôle : « Sur devis » | Encart « Tarifs de référence » calculé depuis le catalogue |
| Offres : champ `prix` par offre | Offres : liste de références vers le catalogue ; aucun montant propre |
| Métadonnées : titre et description | Canonical, Open Graph et Twitter sur toutes les pages (`src/lib/metadonnees.ts`) |
| JSON-LD : zones « Gatineau, Ottawa, Outaouais, Québec » | Zone « Québec » retirée (non justifiée) ; aucun prix dans le JSON-LD |

Routes inchangées : `/tarifs`, `/offres/google-workspace`, `/offres/support-informatique-pme`, `/offres/reservation-en-ligne`. Quatre pôles conservés. Aucun nouveau pôle.

## 2. Règle d'affichage des montants

`src/lib/tarification.ts` : `montantsAffiches()` est vrai hors `VERCEL_ENV=production`.
- Local et aperçus : montants visibles, étiquetés « proposés, en attente d'approbation ».
- Production : tous les montants s'affichent « Sur devis ». Aucun montant ne sort sur neoxix.ca.
Le JSON-LD ne contient aucun prix, quel que soit l'environnement.

## 3. Décisions d'interprétation (à valider)

1. « À partir de » : appliqué aux prestations-projet (sites, configuration, installation, audits, automatisations). Non appliqué aux tarifs horaires, aux montants par unité (boîte, banque) ni aux forfaits mensuels.
2. Forfait Google Workspace 5 utilisateurs (1 200 $) : relation avec la configuration initiale (500 $) à préciser. Dans la maquette, la migration est facturée à part dans tous les cas.
3. Banque de cinq heures (525 $) : ne couvre pas les déplacements ni les interventions sur place ; modalités marquées « à valider ».
4. Intervention sur place : minimum de deux heures ; déplacements à confirmer.
5. Wazuh / SIEM (1 000 $ CA/mois) : périmètre et licences de supervision à la charge du client.
6. Maintenance Web (149 $/mois) : périmètre écrit ; aucune fréquence ni délai ajouté.
7. Carte « Site web et réservation » : le forfait 1 400 $ couvre la création du site et la configuration de la réservation ; l'abonnement du fournisseur de réservation est exclu. NEOXIX Booking n'est pas développé.
8. Slug `reservation-en-ligne` conservé pour stabilité d'URL, bien que le titre soit « Site web et réservation ».

## 4. Engagements retirés

Les engagements sans source dans le cadrage ont été retirés : formation de l'équipe, document d'utilisation, rapport mensuel, délai de réponse, DKIM/DMARC détaillés. Le SLA est explicitement non garanti. Aucun faux avis, partenaire, chiffre client ou SLA n'a été ajouté.

## 5. Vérifications

| Contrôle | Résultat |
|---|---|
| `pnpm lint` | 0 erreur ; 8 avertissements, identiques à la base (tous dans les fichiers de test existants) |
| `pnpm typecheck` | Réussi après build |
| `pnpm build` | Réussi |
| Vitest | 72 / 72 (58 à la base, tests catalogue, montants, production, JSON-LD) |
| Playwright, 4 largeurs | 232 réussis, 0 échec, 20 ignorés (volontaires selon la largeur) |
| Captures | 20 captures : 1440, 1194, 834, 390 px ; 5 pages ; densité 2 ; mouvement réduit |
| Débordement horizontal | 0 px sur les 20 captures |
| Erreurs console | 0 sur les 20 captures |
| Titres | Un seul `h1` par page |
| Navigation | 960 px : menu mobile ; 961 à 1194 px : une ligne, sans retour à la ligne |

Correction en cours de phase : à 961 px, « À propos » se coupait sur deux lignes. Corrigé par `white-space: nowrap` et espacement resserré entre 961 et 1100 px.

Tests ajoutés à la boucle clavier : `/tarifs` et `/offres/reservation-en-ligne`.

## 6. Accessibilité : limites

- Contrastes calculés (WCAG) : texte principal 15,6:1 ; texte secondaire 5,9:1 sur fond clair ; ambre foncé 4,9:1 sur fond clair. Conformes au niveau AA pour le texte courant.
- **Bouton principal non conforme** : texte blanc sur ambre `#E87436` = 3,0:1, en dessous de 4,5:1. Élément d'identité V5, non modifié. Décision à prendre : passer le fond à l'ambre foncé `#B44D29` (5,2:1).
- Focus, ordre de tabulation et titres vérifiés par les tests existants, étendus aux nouvelles pages dans la boucle clavier.
- Aucune conformité WCAG ne peut être déclarée à partir de ces tests.

## 7. Sécurité et confidentialité

- LeadFlow, n8n, HubSpot, secrets, `INTAKE_MODE`, authentification et production Vercel : non modifiés.
- Collecte publique : toujours désactivée. Repli : `info@neoxix.ca`.
- HawkScan : non exécuté (pas de clé StackHawk ni de `stackhawk.yml`). Seuls les en-têtes ont été vérifiés.
- Politique de confidentialité : non modifiée dans ce lot. Corrections à prévoir avant mise en ligne d'une réservation ou d'une migration :
  - la réservation en ligne collectera des données personnelles (nom, courriel, rendez-vous) : la politique devra le décrire ;
  - la migration de boîtes courriel traite des données de tiers pour le compte du client : à encadrer dans le contrat et la politique ;
  - la politique actuelle indique qu'aucun formulaire actif n'est exposé sur le site : à réviser si la réservation est activée.

## 8. Décisions commerciales à approuver

1. Montants du catalogue (22 éléments), un par un.
2. Règle « à partir de ».
3. Relation forfait 5 utilisateurs / configuration initiale.
4. Périmètre de la banque de cinq heures et des déplacements.
5. Périmètre Wazuh / SIEM et maintenance Web.
6. Couleur du bouton principal (contraste).
7. Mention commune et taxes.
8. Publication : aucun montant sur neoxix.ca avant approbation écrite.

## 9. Retour arrière

`git checkout 642bf9c` sur la branche, ou supprimer la branche si elle n'est pas fusionnée. Rien n'a été déployé.
