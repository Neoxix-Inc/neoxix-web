# NEOXIX-SERVICES-PRICING-002 · RAPPORT FINAL

**Statut :** maquette commerciale complète. **Non approuvée pour publication.** Rien n'est fusionné, déployé ni publié sur neoxix.ca.
**Branche :** `feat/services-pricing-001` · **PR :** #2 (Draft) · **Base :** `main` `40c7b3f` (inchangée) · **HEAD de départ vérifié :** `ec4c381`.

## 1. Résumé exécutif

Le catalogue passe à **26 prestations** : **23 montants numériques** (« à partir de » ou unitaires) et **3 prestations sur devis** (maintenance et supervision des automatisations, Wazuh/SIEM, applications sur mesure). Trois offres **Express** sont ajoutées (Google Workspace, Wi-Fi petite entreprise, Automatisation). Zapier est présenté, avec mesure, comme option étudiée sur le pôle Automatisation ; **n8n reste le socle**. Les montants restent protégés : aucun n'est approuvé, aucune autorisation de publication n'est activée, et le contrôle de production passe.

## 2. Ancienne et nouvelle grille

| Prestation | Phase 1C | Phase 002 |
|---|---|---|
| Site Essentiel | 900 $ | **à partir de 990 $ CA** |
| Site Professionnel avec réservation | 1 400 $ | **à partir de 1 990 $ CA** |
| Site Avancé avec automatisation | 2 500 $ | **à partir de 3 490 $ CA** |
| Maintenance Web | 149 $/mois | **à partir de 149 $ CA/mois** |
| Google Workspace Express | — | **à partir de 295 $ CA** (nouveau) |
| Configuration initiale standard | 500 $ | **à partir de 495 $ CA** |
| Migration de boîte | 150 $/boîte | **à partir de 95 $ CA/boîte** |
| Configuration jusqu'à cinq utilisateurs | 1 200 $ | **à partir de 895 $ CA** (comprend la configuration standard) |
| Assistance Workspace | 199 $/mois | **à partir de 199 $ CA/mois** |
| Assistance à distance | 95 $/h | 95 $ CA/heure (inchangé) |
| Intervention sur place | 125 $/h | 125 $ CA/heure, minimum deux heures (inchangé) |
| Banque de cinq heures | 525 $ | **425 $ CA**, à distance uniquement |
| PME Essentiel | 299 $/mois | **à partir de 299 $ CA/mois** |
| PME Suivi | 699 $/mois | **à partir de 599 $ CA/mois** |
| Audit Wi-Fi et réseau | 700 $ | **à partir de 695 $ CA** |
| Installation Wi-Fi petite entreprise | — | **à partir de 990 $ CA** (nouveau) |
| Installation réseau structurée | 3 000 $ | **à partir de 3 000 $ CA** |
| NAS et sauvegardes | 1 500 $ | **à partir de 1 490 $ CA** |
| Migration ou déploiement Proxmox | 5 000 $ | **à partir de 5 000 $ CA** |
| Automatisation Express | — | **à partir de 990 $ CA** (nouveau) |
| Projet d'automatisation n8n complet | 3 000 $ | **à partir de 3 000 $ CA** |
| HubSpot et formulaires | 2 000 $ | **à partir de 1 990 $ CA** |
| Maintenance et supervision (automatisation) | sur devis | sur devis |
| Audit défensif PME | 1 500 $ | **à partir de 1 500 $ CA** |
| Wazuh ou supervision SIEM | 1 000 $/mois | **sur devis** (retiré des montants) |
| Applications sur mesure | sur devis | sur devis |

**Décompte :** 21 montants numériques en 1C ; 23 en 002 (−1 Wazuh, +3 Express). Prestations : 26 en 002.

**Changement de fond sur la banque de cinq heures :** à 525 $, elle était plus chère que cinq heures à distance (475 $) ; à 425 $ elle est **50 $ CA moins chère** pour un usage à distance seul. Le point commercial est documenté, avec validité et report à définir.

## 3. Catalogue final

- Fichier : `src/content/fr/catalogue.ts`. Identifiants stables conservés ; trois identifiants ajoutés (`workspace-express`, `installation-wifi-petite-entreprise`, `automatisation-express`).
- Chaque prestation porte : identifiant, intitulé, pôle, catégorie, description, montant, devise (CAD), unité, « à partir de », conditions, exclusions, statut (`propose`), et pour les Express un périmètre de référence.
- Aucun montant n'est recopié : tous les composants lisent le catalogue serveur (`src/lib/catalogue.ts`).
- Aucun élément n'est approuvé. `autorisationPublication.autorisee` reste `false`. `PUBLICATION_TARIFS` n'est pas défini.

## 4. Offres Express

- **Workspace Express — à partir de 295 $ CA.** Un domaine existant, une boîte, configuration de la messagerie, vérification envoi/réception. Exclus : licence Google, achat du domaine, migration, plusieurs domaines, formation approfondie, assistance récurrente.
- **Installation Wi-Fi petite entreprise — à partir de 990 $ CA.** Un établissement, jusqu'à deux points d'accès, Wi-Fi et sécurité de base, vérification, remise des réglages. Exclus : matériel, câblage, travaux électriques, segmentation complexe, multisite, déplacements.
- **Automatisation Express — à partir de 990 $ CA.** Un workflow simple, deux systèmes standards maximum, un déclencheur, actions définies, tests, documentation. Exclus : API complexe, hébergement, licences et tâches payantes (y compris Zapier si retenu), automatisations critiques, workflows multiples, supervision continue.

Ces périmètres sont des propositions, à confirmer contractuellement avant publication. Les Express ne sont pas des pages séparées : elles apparaissent dans les tableaux de `/tarifs` et dans l'encart « Tarifs de référence » de leur pôle.

## 5. Positionnement n8n / Zapier

- **n8n** : orchestrateur principal, pour workflows complexes, API personnalisées, orchestration interne.
- **Zapier** : option étudiée pour des connexions SaaS simples, selon les applications, le budget et la faisabilité.
- Présentation sur `/services/automatisation`, bloc « Quelle technologie pour votre besoin ? », avec la phrase de la mission adaptée. Aucune certification, aucun partenariat, aucun logo Zapier.
- Coûts Zapier séparés des honoraires NEOXIX ; aucun tarif Zapier chiffré dans le catalogue ; limites de formule à vérifier sur la documentation officielle avant chaque proposition.
- Grille de décision interne : `docs/neoxix-services/ZAPIER-GRILLE-DECISION.md` (non publiée).
- Loi 25 : une évaluation des facteurs relatifs à la vie privée est à prévoir avant tout usage avec des renseignements personnels de clients québécois (transferts hors Québec, sous-traitants, conservation).
- **Non fait, par mandat :** aucun compte Zapier, aucun webhook, aucune automatisation réelle, aucune connexion à des interfaces d'administration, aucune modification de n8n de production.

## 6. Changements UX et contenu

- Hero, méthode, réalisations, FAQ, engagements, quatre pôles et identité NEOXIX Ambre V5 : **inchangés**.
- `/tarifs` : quatre tableaux par catégorie, colonne « Exclusions et conditions », périmètre des Express en liste, point d'arbitrage en aperçu uniquement.
- Pages de pôle : encart « Tarifs de référence » (lit le catalogue), bloc Zapier sur Automatisation.
- Pages d'offre : trois offres inchangées dans leurs routes ; la carte Google Workspace mentionne l'option Express.
- Aucune page Zapier créée. Aucune nouvelle catégorie. Aucun cinquième pôle.
- Pas de CTA vers un formulaire : le formulaire public reste désactivé ; les CTA ouvrent `info@neoxix.ca` avec le sujet de l'offre pré-rempli.

## 7. Métadonnées, sitemap, données structurées

- Titres, descriptions, canonical, Open Graph et Twitter sur chaque page (`src/lib/metadonnees.ts`).
- Sitemap : 13 adresses, sans montant.
- JSON-LD `ProfessionalService` : zones Gatineau, Ottawa, Outaouais ; trois offres en `Offer` sans prix ; aucun champ `price`.
- Vérifié sur le build de production : aucun montant dans les métadonnées, le sitemap et le JSON-LD.

## 8. Protections de publication

| Contrôle | État |
|---|---|
| Trois niveaux (proposé / approuvé individuellement / autorisé à publier) | En place, désactivés par défaut |
| `autorisationPublication.autorisee` | `false` (non modifié) |
| `PUBLICATION_TARIFS` | Non défini (non modifié) |
| Production (`VERCEL_ENV=production`) | Tout « Sur devis » |
| Contrôle `scripts/verifier-publication.sh` sur build de production | **0 motif** dans `.next/static` et `.next/server/app` |
| Contrôle positif sur build local | **Échec** attendu et obtenu |
| Pages de production servies (serveur `VERCEL_ENV=production`) | 0 formulaire, 0 montant visible, `mailto:` vers `info@neoxix.ca` |
| Aperçus Vercel | Aucun créé. `noindex` et `Disallow: /` hors production, vérifiés dans le code. **Protection d'accès non vérifiable depuis le dépôt.** |
| Variables Vercel | Aucune modifiée. Aucun « Protection Bypass for Automation » créé. |

**Exposition publique :** le dépôt `Neoxix-Inc/neoxix-web` est **public**. Les montants proposés restent lisibles dans `src/content/fr/catalogue.ts`, dans l'historique git et sur la PR. Le verrou protège le site ; il ne protège pas le code. Ne pas décrire ces tarifs comme confidentiels.

## 9. Accessibilité et couleurs

- Bouton principal : **inchangé** (`.btn-principal { background: var(--ambre); color: #1b1208; }`). Couleurs calculées dans le navigateur : normal `rgb(27,18,8)` sur `rgb(232,116,54)` = **6,14:1** ; survol sur `rgb(255,139,71)` = **7,95:1**.
- Contour de focus `3px solid #b44d29` : **4,91:1** contre le fond de page.
- Nouveaux éléments : texte secondaire `#56636A` sur blanc = 6,20:1.
- Clavier : boucle « Tab » étendue à `/tarifs` et à une offre ; focus visible vérifié.
- **Non testé :** lecteurs d'écran, WebKit/Safari, appareils réels, zoom 200 %, audit axe-core. Aucune conformité WCAG n'est déclarée.

## 10. Tests exécutés (code final)

| Contrôle | Résultat |
|---|---|
| `pnpm lint` | 0 erreur ; 8 avertissements, identiques à la base |
| `pnpm typecheck` | Réussi (avant et après build) |
| `pnpm build` (local et `VERCEL_ENV=production`) | Réussi |
| `scripts/verifier-publication.sh` (production) | Réussi : 0 motif |
| Vitest | **79 / 79** |
| Playwright, quatre largeurs | **264 réussis, 0 échec, 20 ignorés** (volontaires selon la largeur) |
| Contrôles du catalogue (26 / 23 / 3, Express, Workspace 895 avec configuration standard, banque 425, Wazuh sans montant) | Inclus dans Vitest et Playwright |
| Contrôles Zapier (option, n8n socle, aucun tarif, aucune certification) | Inclus dans Vitest et Playwright |
| Captures | **36 / 36** : 0 débordement, 0 erreur console, un `h1` par page |

Navigation mesurée sur le build local : 960 px menu mobile ; 961, 1024, 1100 et 1194 px sur une ligne, sans débordement.

**Non exécutés, donc non déclarés réussis :** Safari/WebKit, lecteurs d'écran, appareils réels, DAST HawkScan (pas de clé StackHawk ni de `stackhawk.yml`).

## 11. Captures

- Dossier : `docs/neoxix-services/captures-pricing-002/`
- `mouvement-reduit/` : 4 largeurs (1440, 1194, 834, 390) × 6 pages (accueil, tarifs, trois offres, pôle Automatisation).
- `normal/` : 1440 et 390 × les mêmes pages, avec défilement lent pour déclencher les apparitions.
- Inventaire complet : `captures-pricing-002/bilan.json`.
- Ces captures sont locales (build local, montants proposés visibles et étiquetés). Aucun aperçu protégé n'a été créé.

## 12. Fichiers modifiés

- Contenu : `src/content/types.ts`, `src/content/fr/catalogue.ts`, `src/content/fr/offres.ts`, `src/content/fr/index.ts`
- Lib : `src/lib/catalogue.ts`, `src/lib/tarification.ts` (inchangés dans cette phase, relus)
- Composants et pages : `src/components/vitrine/offres.tsx`, `src/app/(vitrine)/tarifs/page.tsx`, `src/app/(vitrine)/offres/[slug]/page.tsx`, `src/app/(vitrine)/services/[pole]/page.tsx`, `src/app/(vitrine)/vitrine.css`
- Tests : `tests/unit/contenu.test.ts`, `tests/e2e/pages.spec.ts`, `tests/e2e/commercial.spec.ts`
- Documentation : `docs/neoxix-services/PRICING-002-RAPPORT.md`, `docs/neoxix-services/ZAPIER-GRILLE-DECISION.md`, `docs/neoxix-services/captures-pricing-002/`

**Non modifiés :** LeadFlow, `INTAKE_MODE`, workflows n8n, infrastructure, secrets, `src/app/api/`, `src/lib/demande/`, politique de confidentialité, Ivoire Connect, `design/v5/`.

## 13. Risques résiduels

1. **Dépôt public** : les montants sont lisibles dans le code et l'historique.
2. **Protection des aperçus Vercel** : non vérifiée depuis le dépôt.
3. **Conditions contractuelles non rédigées** : validité de la banque, périmètre des forfaits mensuels, fréquence de maintenance Web, couverture sur place, frais de déplacement, périmètre Wi-Fi, responsabilités de la supervision de sécurité, maintenance des automatisations.
4. **Périmètres Express** : propositions à confirmer.
5. **Zapier** : coûts et limites fournisseur non vérifiés à ce jour sur sa documentation officielle ; évaluation Loi 25 à faire avant usage.
6. **Politique de confidentialité** : à réviser avant toute réservation ou migration de boîtes.
7. **Accessibilité** : tests Chromium seulement.

## 14. Décisions contractuelles à approuver

1. Validité et report de la banque de cinq heures (425 $ CA, à distance).
2. Périmètre des forfaits mensuels (PME Essentiel, PME Suivi, Assistance Workspace, Maintenance Web), sans heures, postes ni tickets promis.
3. Couverture géographique et frais de déplacement pour les interventions sur place.
4. Périmètres exacts des trois Express.
5. Responsabilités et couverture de la supervision de sécurité (Wazuh/SIEM sur devis).
6. Modalités de maintenance des automatisations.
7. Mention commune et taxes applicables.
8. Visibilité du dépôt GitHub (privé, ou catalogue hors dépôt public).
9. Mode de protection des aperçus Vercel.
10. Approbation individuelle de chaque montant avant toute publication.

## 15. Confirmations

- Aucune modification des systèmes de production (Vercel, n8n, HubSpot, LeadFlow, secrets).
- Aucun déploiement en production déclenché.
- Aucune fusion.
- **PR #2 : Draft.**
- Aucune collecte de renseignements personnels activée.

## 16. Recommandation

**GO pour la revue humaine de la maquette. NO-GO pour la publication.** La maquette est techniquement complète et protégée. La publication est bloquée par les décisions des sections 14 et 13 (points 1, 2, 8 et 9 en priorité).
