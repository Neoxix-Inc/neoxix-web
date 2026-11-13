# Mission NEOXIX-SERVICES-PRICING-001 · Phase 1 · Rapport de livraison

> **REMPLACÉ.** Ce rapport décrit la phase 1 (commit `642bf9c`), dont les tarifs étaient « Sur devis » partout.
> Voir `PRICING-001-1B-RAPPORT.md` (catalogue) puis `PRICING-001-1C-RAPPORT.md` (corrections de supervision, état actuel).

Statut : maquette locale, non publiée. Aucune fusion, aucun déploiement, aucune intégration définitive.
Branche : `feat/services-pricing-001`, créée depuis `main` au commit `40c7b3f`.

## 1. Ce qui a été ajouté

| Élément | Fichier(s) |
|---|---|
| Section « Offres pour démarrer rapidement » (accueil, après le bandeau de repères) | `src/components/vitrine/offres.tsx`, `src/app/(vitrine)/page.tsx` |
| Source unique des offres et des tarifs | `src/content/fr/offres.ts` (branché dans `src/content/fr/index.ts`) |
| Types des offres et de la page Tarifs | `src/content/types.ts` |
| Page Tarifs (offres, formules, pôles, engagements sur les montants) | `src/app/(vitrine)/tarifs/page.tsx` |
| Trois pages détaillées | `src/app/(vitrine)/offres/[slug]/page.tsx` : `/offres/google-workspace`, `/offres/support-informatique-pme`, `/offres/reservation-en-ligne` |
| Référencement local : données structurées schema.org (Gatineau, Ottawa, Outaouais) | `src/lib/donnees-structurees.ts`, `src/components/vitrine/gabarit.tsx` |
| Plan du site mis à jour | `src/app/sitemap.ts` |
| Lien « Tarifs » dans la navigation | `src/content/fr/index.ts` |
| Styles des nouveaux blocs (tableau qui devient une liste de cartes sur mobile) | `src/app/(vitrine)/vitrine.css` (bloc « Lot PRICING-001 » en fin de fichier) |
| Tests : nouvelles pages, ordre des titres de l'accueil, offres et données structurées | `tests/e2e/outils.ts`, `tests/e2e/pages.spec.ts`, `tests/unit/contenu.test.ts` |
| Captures desktop 1440 px et mobile 390 px (deux fois la densité) | `docs/neoxix-services/captures-pricing-001/` |

Non modifiés : identité V5, hero, les quatre pôles, composants existants (seul `EnTete` passe en `export`), LeadFlow, `src/app/api/demandes/`, `src/lib/demande/`, `next.config.ts`, `design/v5/`.

## 2. Tarifs : aucun montant publié

Le brief parle de « tarifs fournis », mais aucun montant ne figure dans la demande ni dans le dépôt. Aucun prix n'a été inventé. Chaque offre porte un champ `prix` mis à `null` : le site affiche « Sur devis ». Quand le propriétaire valide un montant, il suffit de renseigner `prix` dans `src/content/fr/offres.ts`. Les tests interdisent déjà tout montant au format « 123 $ ».

Les trois offres (Google Workspace, support PME, réservation en ligne) sont de nouvelles prestations : leur périmètre, leurs exclusions et leurs étapes sont des propositions à faire valider.

## 3. Vérifications

| Contrôle | Résultat |
|---|---|
| `pnpm lint` | 0 erreur ; 8 avertissements, identiques à `main` |
| `pnpm build` | Réussi ; 4 nouvelles routes (`/tarifs`, 3 offres) générées statiquement |
| `pnpm typecheck` | Réussi après `pnpm build` (comportement connu de Next 16 : les types `PageProps`/`LayoutProps` sont générés au build) |
| `pnpm test` (Vitest) | 63 / 63 |
| Playwright, 4 largeurs (1440, 1194, 834, 390) | 224 réussis, 0 échec, 20 ignorés (ignorés volontairement selon la largeur, voir `tests/e2e/`) |
| Débordement horizontal | 0 px sur les 5 pages testées à 1440 et 390 |
| Erreurs console | 0 sur les 10 captures |
| En-têtes de sécurité (CSP, X-Robots-Tag noindex, etc.) | Présents et identiques sur les nouvelles pages |

Playwright : le projet épingle Playwright 1.64, qui cherche un binaire absent du conteneur. Les tests ont été lancés avec un fichier de configuration **hors dépôt** qui ne change que l'exécutable vers `/opt/pw-browsers/chromium`. Le dépôt n'a pas été modifié pour cela.

## 4. Sécurité : HawkScan non exécuté

Le scan DAST HawkScan n'a **pas** été réalisé. Le CLI `hawk` n'est pas installé, `HAWK_API_KEY` n'est pas défini, et aucun `stackhawk.yml` n'existe. Un scan exige un compte StackHawk que je n'ai pas. Seules les en-têtes de sécurité ont été vérifiés, ce qui n'est pas un scan DAST. Pour lancer le scan, il faut fournir une clé StackHawk ; la procédure est dans le skill `hawkscan`.

## 5. Points à valider par le propriétaire

1. Montants de chaque offre (aucun n'est publié).
2. Licences Google Workspace « à la charge du client » : hypothèse commerciale à confirmer.
3. Mention de marque Google (« NEOXIX n'est pas affiliée à Google ») : à relire.
4. Plages d'intervention du support PME et modalités de réponse : renvoyées au contrat, sans délai chiffré.
5. Libellé « Montants en attente de validation » sur la page Tarifs : à retirer une fois les montants confirmés.
6. Lien « Tarifs » ajouté à la navigation : sept liens sur ordinateur. Rendu vérifié à 1440 px ; non vérifié entre 960 et 1100 px.

## 6. Procédure de retour arrière

La branche n'est pas fusionnée. Pour revenir en arrière : `git checkout main` puis supprimer la branche `feat/services-pricing-001`. Rien n'a été déployé, et aucun service externe (n8n, HubSpot, LeadFlow) n'est touché.
