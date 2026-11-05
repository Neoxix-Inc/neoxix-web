# Rapport Lot 1 · NEOXIX-LOT1-PREVIEW-001 (v2)

Date : 5 novembre 2026. Exécutant : Claude Code. Branche : `feat/services-platform`, sans push.

**Statut :** le site vitrine v3 est construit et vérifié **en local seulement**. Il n'y a eu ni déploiement Vercel, ni URL publique, ni intégration externe, ni modification DNS. Aucun point d'arrêt n'a été atteint.

Deux décisions prises pendant la mission doivent être confirmées par la direction (section 7).

## 1. Commits

| SHA | Message |
|---|---|
| `9aa4a22` | docs(lot1): mission NEOXIX-LOT1-PREVIEW-001 v2 |
| `2546121` | refactor(portfolio): déplacer le portfolio dans un groupe de routes |
| `d0c4a94` | feat(vitrine): site vitrine v3 Ambre Motion en français |
| `e941391` | test(vitrine): Vitest (contenu) et Playwright (pages, clavier, mouvement) |
| `d3cf4ec` | build(deps): next 16.4.2, eslint-config-next 16.4.2, vitest 4.1.12 |
| *(ce commit)* | docs(lot1): rapport et captures |

Base : Lot 0 `44365bc`, lui-même posé sur `787eeae` (`fix/reveal-safari`). Le Lot 0 n'a pas été réécrit et la maquette `design/v3/index.html` n'a pas été modifiée : son empreinte est vérifiée par un test.

## 2. Ce qui a été construit

| URL | Page | Source du contenu |
|---|---|---|
| `/` | Accueil : héros, flux animé, repères, trois questions, services, méthode, engagements, FAQ, contact | Maquette v3, texte repris tel quel |
| `/services` | Catalogue des quatre pôles, tarification « Sur devis », intervention ponctuelle | Maquette v3 et catalogue 03 |
| `/services/sites-web`, `/automatisation`, `/infrastructure`, `/applications` | Pages de pôle : problème, prestations, résultat, devis, non inclus | Catalogue 03 (décision A3), prestations « commercialisables » seulement |
| `/methode` | Cinq étapes avec tracé, semaine illustrative, engagements | Maquette v3 |
| `/contact` | `mailto:info@neoxix.ca`, éléments à préparer par pôle, FAQ | Maquette v3 et catalogue 03 |
| `/confidentialite` | Texte provisoire, marqué « en révision juridique (Loi 25) » | Faits vérifiables seulement (voir section 7) |
| `/portfolio`, `/projects/*`, `/technologies/*` | Redirection 301 vers `/` (commit `55f8921`), non déployée en production | — |
| toute autre URL | 404 commune | — |

Organisation technique :
- **Contenu :** typé dans `src/content/` (`types.ts`, `fr/index.ts`). Une version anglaise s'ajoutera dans `src/content/en/` avec le même type.
- **Polices :** IBM Plex Sans, IBM Plex Mono et Bricolage Grotesque, auto-hébergées via `next/font/local` (`src/app/fonts/`, licence OFL).
- **Styles :** `src/app/(vitrine)/vitrine.css`, repris de la maquette.
- **Composants :** `src/components/vitrine/`. Trois seulement sont des composants client : l'en-tête, le révélateur et le flux.
- **Dépendances d'exécution :** `next`, `react` et `react-dom`, sans framework CSS. Tailwind et react-icons ont été retirés au commit `e5fd5a8`.

Ce qui n'a pas été fait, conformément aux exclusions : aucun formulaire ni route `POST`, aucun témoin (cookie), aucun appel à n8n, HubSpot, Odoo, Proxmox ou Ivoire Connect. Les éléments conditionnels ou futurs ne sont pas affichés (hébergement géré, formules Suivi et Accompagnement, Kubernetes, agents IA, Terraform, Business Suite).

## 3. Écarts volontaires par rapport à la maquette

1. **Mot mis en valeur sur fond clair.** La maquette utilise un dégradé de l'ambre foncé vers l'ambre vif (#FF8B47), dont le contraste est d'environ 2,3:1 sur fond clair. Le site l'affiche en ambre foncé plein (#B44D29), comme le demande le critère 12. Le dégradé reste sur fond nuit.
2. **Anneau de focus.** Il est en ambre foncé sur fond clair et en ambre vif sur fond nuit, pour garder un contraste suffisant partout. La maquette l'affichait en ambre vif partout.
3. **Animations en boucle.** Le flux, le halo du héros et la pastille du bandeau s'arrêtent seuls après environ 60 s : décision V4, appliquée en CSS, donc aussi sans JavaScript. Le flux a en plus un bouton « Mettre l'animation en pause ».
4. **Plusieurs pages au lieu d'une.** La maquette tient sur une page avec des ancres ; la mission demande des pages séparées. Le menu mène à `/services`, `/methode`, `/methode#engagements`, `/#faq` et `/contact`, et les cartes de service mènent aux pages de pôle.
5. **Bandeau.** Il affiche « Maquette / prévisualisation, non publiée » (critère 10), puis le texte de la maquette.
6. **Mobile.** Le bouton « Nous écrire » de l'en-tête est masqué sous 768 px, car la barre d'action fixe le remplace. Sinon l'en-tête déborde à 390 px.
7. **Adresse visible.** Le texte `info@neoxix.ca` est affiché à côté du bouton `mailto:`, pour les visiteurs sans logiciel de courriel.

## 4. Critères d'acceptation

| # | Critère | Résultat | Preuve |
|---|---|---|---|
| 1 | Build, `tsc --noEmit`, ESLint | **Réussi** | `pnpm build`, `pnpm typecheck`, `pnpm lint` : 0 erreur |
| 2 | Pages du périmètre accessibles | **Réussi** | 9 pages en 200, 404 en 404, sur 3 tailles d'écran |
| 3 | Pas de débordement à 390, 768 et 1440 px | **Réussi** | `scrollWidth` ≤ largeur, toutes pages et 404 |
| 4 | Clavier, focus visible, menu mobile, Échap | **Réussi** | Lien d'évitement ; focus visible sur chaque élément atteint au Tab (3 pages) ; menu ouvert à Entrée, fermé à Échap avec retour du focus |
| 5 | `prefers-reduced-motion` : aucune animation | **Réussi** | 0 animation en cours, 0 transition, 0 élément masqué, sur les 9 pages |
| 6 | Aucune requête tierce | **Réussi** | Toutes les requêtes vont vers `127.0.0.1`, sur les 9 pages |
| 7 | Aucune erreur console | **Réussi** | 9 pages de la vitrine et 3 du portfolio |
| 8 | Crochets conservés | **Réussi** | Les 3 crochets de la maquette sont repris tels quels (test Vitest) et visibles à l'écran (Playwright) |
| 9 | Seul `mailto:info@neoxix.ca` | **Réussi** | Tous les liens externes testés ; aucun `form`, `input` ni témoin |
| 10 | Bandeau sur toutes les pages | **Réussi** | Testé sur les 9 pages et la 404 |
| 11 | Animations, désactivées en mouvement réduit, contenu visible sans JS | **Réussi** | Flux et pause, entrées au défilement, tracé de la méthode, survol des cartes, FAQ ; sans JS : 0 élément masqué |
| 12 | Ambre foncé sur fond clair, test automatisé | **Réussi** | Aucun texte #FF8B47 ou #E87436 sur fond clair (9 pages) ; `.mot` = `rgb(180, 77, 41)` |
| 13 | Menu mobile, barre d'action fixe | **Réussi** | `position: fixed`, visible après défilement à 390 px |

## 5. Résultats des tests

| Suite | Réussis | Échoués | Non réalisés | Remarque |
|---|---|---|---|---|
| Vitest (`pnpm test`) | 20 | 0 | 0 | Contenu, empreinte de la maquette, interdits |
| Playwright (`pnpm test:e2e`), 3 projets : 1440, 768, 390 | 171 | 0 | 12 | Les 12 tests non réalisés le sont par conception : tests mobiles sautés à 1440 px, animations vérifiées une seule fois à 1440 px |

Deux défauts ont été trouvés par les tests et corrigés dans `e941391` :
- la pause du flux ne gelait pas le nœud « Humain » ;
- le survol des cartes était annulé par la règle d'entrée au défilement.

Pour relancer les tests :

```bash
pnpm install
pnpm build
pnpm test
pnpm test:e2e
```

Le serveur de test démarre sur le port 3101 (variable `PORT_TESTS`).

## 6. Sécurité, performance et captures

**`pnpm audit` : réussi, aucune vulnérabilité critique.**
- Next 16.3.1 en comptait 5. Je suis passé à 16.4.2 : c'est une mise à niveau mineure, pas majeure, et cette version a été publiée le 15 octobre 2026 (voir section 7).
- Il reste 7 vulnérabilités élevées et 3 modérées, **toutes dans l'outillage** :
  - `brace-expansion`, `js-yaml`, `zod`, `minimatch`, via ESLint ;
  - `source-map-js`, via PostCSS et Tailwind, utilisé seulement au build.

  Aucune ne se trouve dans le code envoyé au navigateur.

**Secrets :** la recherche (`api_key`, `secret`, `token`, `password`, `bearer`, clés AWS ou privées) ne trouve rien dans `src/`, `tests/` ni la configuration. Il n'y a pas de fichier `.env`.

**En-têtes HTTP** (vérifiés) :
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`
- `Permissions-Policy` (caméra, micro, géolocalisation désactivés)
- `X-Robots-Tag: noindex, nofollow`
- `X-Powered-By` retiré

Les pages portent aussi `robots: noindex`.

**Lighthouse 13.5.0 en local : indicatif seulement.** Ces chiffres ne sont ni une conformité WCAG ni des Core Web Vitals mesurés sur le terrain.

| Page | Profil | Performance | Accessibilité | Bonnes pratiques | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| `/` | mobile | 83 | 100 | 100 | 60 | 3,7 s | 0 | 310 ms |
| `/` | ordinateur | 100 | 100 | 100 | 60 | 0,8 s | 0 | 60 ms |
| `/services/infrastructure` | mobile | 81 | 100 | 100 | 60 | 3,7 s | 0 | 330 ms |
| `/services/infrastructure` | ordinateur | 100 | 100 | 100 | 60 | 0,8 s | 0 | 40 ms |
| `/contact` | mobile | 83 | 100 | 100 | 60 | 3,7 s | 0 | 290 ms |
| `/contact` | ordinateur | 99 | 100 | 100 | 60 | 0,8 s | 0 | 40 ms |

- **SEO à 60 :** c'est voulu. Le seul audit en échec est `is-crawlable`, car la prévisualisation est en `noindex`.
- **LCP mobile de 3,7 s** (simulation 4G et processeur ralenti) : à investiguer au Lot 2. Pistes : l'entrée animée du titre du héros (opacité 0 au départ) et le chargement de Bricolage Grotesque.

**Captures :** `docs/neoxix-services/captures-lot1/`. Il y a 20 fichiers PNG en page entière : 10 pages (les 9 du périmètre et la 404) à 1440 px et à 390 px. Sur les captures à 390 px, la barre d'action fixe apparaît au milieu de la page : c'est un effet de la capture en page entière, pas un défaut.

**Vérification manuelle :** les parcours « accueil → services → pôle → contact » sont automatisés (test « parcours », 3 tailles d'écran). La vérification manuelle s'est limitée à la relecture visuelle des captures. Je n'ai fait aucun essai avec un lecteur d'écran ni sur un appareil réel.

## 7. Décisions à confirmer par la direction

1. **Portfolio : retiré de la branche (dépassé par la mission PORTFOLIO-ARCHIVE-001).**
   - Pendant le Lot 1, le portfolio avait été placé à `/portfolio` (commit `2546121`). La confirmation consignée au commit `f718360` reposait sur une réponse donnée en session, pas sur une décision écrite vérifiable.
   - Le portfolio a ensuite été retiré de `feat/services-platform` (commit `72b41bd`) et archivé sur `archive/portfolio-2026-11-04` (`2f5f4d6`).
   - Ses anciennes adresses redirigent vers `/` en 301 (commit `55f8921`), sans déploiement en production.
   - La 404 commune reste assurée par `global-not-found.tsx` (option `experimental.globalNotFound`).
   - La mise en ligne sur `neoxix.ca`, qui sert toujours le portfolio depuis `main`, fera l'objet d'une autorisation distincte.
2. **Mise à niveau de Next de 16.3.1 à 16.4.2.** Le critère de sécurité l'exigeait, et la mission n'exclut que les mises à niveau majeures.
3. **Responsable de la protection des renseignements personnels.** Le texte provisoire de confidentialité affiche `[responsable à désigner]`, plutôt qu'un nom inventé. À compléter après la revue juridique.
4. **Logo.** Le monogramme reste marqué « Logo provisoire » en attendant le fichier officiel (décision V6).

## 8. Limites

- Je n'ai testé qu'avec Chromium : ni Safari, ni Firefox, ni appareil iOS ou Android réel. Le correctif Safari de `reveal.tsx` ne concerne que le portfolio.
- Le contraste n'est vérifié automatiquement que pour l'ambre (critère 12). Lighthouse ne relève aucun défaut de contraste sur les 3 pages mesurées, mais ce n'est pas un audit complet.
- La licence OFL propre à Bricolage Grotesque reste à joindre avant la production, comme indiqué dans `src/app/fonts/LICENCES.md`.
- Les fichiers non suivis de Lot 0 dans `design/` et `docs/` ne sont pas commités : prototypes v1 et v2, captures et rapports antérieurs.
- J'ai arrêté les serveurs que j'ai lancés (ports 3100 à 3104). Un serveur Next déjà actif avant cette mission écoute sur le port 3109 : je n'y ai pas touché.

## 9. Retour arrière

Aucune opération ne réécrit l'historique. Pour revenir à l'état d'avant le Lot 1 sans rien perdre :

```bash
git branch sauvegarde/lot1-2026-11-05 HEAD
git switch -c retour/lot0 44365bc
```

Autres points de retour :
- avant le Lot 0 : branche `backup/services-pre-rebase-2026-11-04` (`cbcf7a1`) ;
- état complet du dépôt : `~/neoxix-backups/2026-11-04-services-lot0/services.bundle`.

Pour annuler un seul commit du Lot 1, utiliser `git revert <sha>` : jamais `reset --hard`.

## 10. Prochaines étapes, chacune sur autorisation écrite

1. Validation par la direction des décisions de la section 7.
2. Déploiement de prévisualisation Vercel : autorisation écrite du propriétaire.
3. Mise en ligne sur `neoxix.ca` : autorisation distincte.
4. Lot 2 : formulaire de demande et flux vers le CRM, après la revue juridique Loi 25.

## 11. Prévisualisation Vercel (5 novembre 2026)

Autorisation : le propriétaire a choisi l'étape 1, prévisualisation seulement, puis a demandé « vercel deploy ».

| Élément | Valeur |
|---|---|
| URL | https://neoxix-ouhi74yzp-admin-15752192s-projects.vercel.app |
| Inspecteur | https://vercel.com/admin-15752192s-projects/neoxix-web/7Y82vvNwxhM3pWv3n44shhNHj7Uh |
| Cible | `preview` (pas `production`), état `Ready` |
| Commit déployé | `a7513c1`, depuis le worktree local, avec `vercel deploy` sans `--prod`. Rien n'a été poussé sur GitHub. |
| Protection | Vercel Authentication : un visiteur anonyme est redirigé (302) vers la connexion Vercel |
| CLI | `vercel@64.7.0`, compte `admin-15752192`, projet `neoxix-web` |

Vérifications sur l'URL (accès authentifié par `vercel curl`) :
- les 9 pages de la vitrine, `/portfolio` et `/projects/neoxix-homelab` renvoient 200 ; une URL inconnue renvoie 404 ;
- le bandeau « Maquette / prévisualisation, non publiée » et `<meta name="robots" content="noindex, nofollow, nocache">` sont présents ;
- les en-têtes de sécurité sont tous présents, et Vercel ajoute `Strict-Transport-Security`.

Production inchangée : `https://neoxix.ca/` sert toujours le portfolio (titre « Kodjo Mathias Akah | Network & Systems Portfolio »). Aucune modification DNS ni de domaine.

Non réalisé sur l'URL de prévisualisation : la suite Playwright complète, parce que la protection bloque le navigateur de test. Elle a été exécutée sur le même code en local (section 5).

## 12. Note du 5 novembre 2026 : retrait du portfolio et nettoyage

Cette note complète le rapport. Les sections 1, 4 à 6, 8 et 11 décrivent l'état au moment du Lot 1, et leurs résultats de tests ne sont pas modifiés. Leurs mentions du portfolio (pages `/portfolio` et `/projects/*` testées, aperçu de `a7513c1`) et de Tailwind (avis `source-map-js`) sont donc historiques.

| Commit | Changement |
|---|---|
| `72b41bd` | Retrait du portfolio de `feat/services-platform`, archivé sur `archive/portfolio-2026-11-04` (`2f5f4d6`) |
| `55f8921` | Redirections 301 de `/portfolio`, `/projects/*` et `/technologies/*` vers `/` ; tests Playwright du portfolio remplacés par des tests de redirection |
| `a0dfda5` | Favicon : accent lime `#b9f552` remplacé par l'ambre vif `#FF8B47` |
| `e5fd5a8` | Retrait de `tailwindcss`, `@tailwindcss/postcss`, `react-icons` et `postcss.config.mjs` |

Vérifications faites après ces commits (missions PORTFOLIO-ARCHIVE-001 et CLEANUP-001) :
- build, `tsc`, ESLint et Vitest (20/20) réussis ;
- Playwright : 180 réussis, 0 échec, 12 non réalisés (tests propres à une taille d'écran) ;
- `pnpm audit` : 0 critique.

Les branches `feat/services-platform` et `archive/portfolio-2026-11-04` sont publiées sur `origin`. L'aperçu Vercel de `e5fd5a8` est protégé par connexion et en `noindex`. Le jeton de contournement de la protection a été révoqué le 5 novembre 2026 (mission CLEANUP-002).

La production n'a pas changé : `https://neoxix.ca/` sert toujours le portfolio depuis `main` (`cbcf7a1`). La revue du Lot 1 par le propriétaire est en cours ; aucune validation n'a été donnée.
