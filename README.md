# NEOXIX · site vitrine v3 (prévisualisation)

Site vitrine de NEOXIX (services numériques pour PME), direction visuelle « Ambre Motion » (C). Le contenu est en français.

## État au 5 novembre 2026

- **Non publié.** Le site existe sur la branche `feat/services-platform` et dans un aperçu Vercel protégé par connexion et en `noindex`. Toutes les pages affichent le bandeau « Maquette / prévisualisation, non publiée ».
- **Production inchangée.** `https://neoxix.ca/` sert toujours l'ancien portfolio, depuis `main` (`cbcf7a1`), déploiement `dpl_3Xcg…`. Vérifié le 5 novembre 2026 à 05 h 27 UTC. La mise en ligne demande une autorisation écrite distincte du propriétaire.
- **Revue du Lot 1 par le propriétaire en cours.** Aucune validation n'a encore été donnée.
- **Éléments provisoires :**
  - le logo (monogramme marqué « Logo provisoire ») ;
  - le texte de confidentialité (revue juridique Loi 25 en cours) ;
  - les éléments entre crochets, comme `[délai à valider]`, qui restent tels quels tant qu'ils ne sont pas validés.

## Ancien portfolio

Le portfolio a été retiré de cette branche (commit `72b41bd`). Il est archivé sur la branche `archive/portfolio-2026-11-04` (`2f5f4d6`), publiée sur `origin`. Un nouveau portfolio sera traité dans un dépôt séparé.

Les anciennes adresses de la branche (`/portfolio`, `/projects/*`, `/technologies/*`) redirigent vers `/` en 301 (commit `55f8921`). Ces redirections ne sont pas déployées en production.

## Pages

| URL | Contenu |
|---|---|
| `/` | Accueil |
| `/services` | Les quatre pôles, tarification « Sur devis » |
| `/services/sites-web`, `/services/automatisation`, `/services/infrastructure`, `/services/applications` | Pages de pôle |
| `/methode` | Méthode et engagements |
| `/contact` | Contact par `mailto:info@neoxix.ca` uniquement : aucun formulaire |
| `/confidentialite` | Texte provisoire |

## Développement local

Versions utilisées pour les vérifications : Node.js 24.19 et pnpm 11.22. Next.js 16.4.2 exige Node.js 20.9 ou plus récent.

```bash
pnpm install
pnpm dev
```

Avant de livrer une modification :

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

- `pnpm test` lance Vitest sur le contenu : empreinte de la maquette, textes repris tels quels, éléments interdits.
- `pnpm test:e2e` lance Playwright à 1440, 768 et 390 px sur le build de production, servi sur le port 3101 (variable `PORT_TESTS`). Lancez `pnpm build` d'abord.

## Organisation

- `src/content/` : contenu typé (`types.ts`, `fr/index.ts`). Une version anglaise s'ajoutera dans `src/content/en/`, avec le même type.
- `src/app/(vitrine)/` : layout, pages et feuille de style `vitrine.css`, qui reprend les tokens de la maquette.
- `src/components/vitrine/` : composants du site.
- `src/app/fonts/` : IBM Plex Sans, IBM Plex Mono et Bricolage Grotesque, auto-hébergées (SIL OFL, voir `LICENCES.md`).
- `src/app/global-not-found.tsx` : page 404.
- `src/app/icon.svg` : favicon, accent Ambre `#FF8B47` (commit `a0dfda5`).
- `src/components/reveal.tsx` : correctif Safari conservé par décision. Il n'est plus importé.
- `next.config.ts` : en-têtes de sécurité, `X-Robots-Tag: noindex, nofollow`, redirections des anciennes adresses.
- `design/v3/index.html` : maquette source (SHA-256 `66621c78…49dfb1c8`), vérifiée par un test.

Dépendances d'exécution : `next`, `react` et `react-dom`. Il n'y a pas de framework CSS : Tailwind et react-icons ont été retirés au commit `e5fd5a8`. Le site n'a ni base de données, ni CMS, ni authentification, ni outil d'analyse, ni témoins (cookies), ni appel à un service tiers.

## Règles de contenu

- Aucun prix, délai, témoignage, certification, partenariat ni chiffre client non validé.
- Aucun service conditionnel ou futur présenté comme disponible.
- Le seul moyen de contact publié est `info@neoxix.ca`.
- Aucune donnée personnelle n'est collectée tant que la revue juridique n'est pas terminée.

Documentation du projet : `docs/neoxix-services/LOT1-RAPPORT.md`.
