# NEOXIX-SERVICES-PRICING-001 · Phase 1C · Corrections de supervision avant validation propriétaire

**Statut :** maquette technique acceptée comme base ; **non approuvée pour publication**.
**Branche :** `feat/services-pricing-001` · **PR :** #2 (passée en Draft, non fusionnée) · **Base de départ :** `7caa109`.
Rien n'est fusionné, déployé ni publié sur neoxix.ca. Aucune variable Vercel n'a été modifiée. Aucune collecte de renseignements personnels n'est active.

## 1. Corrections factuelles

| Point | Rapports précédents | Vérifié en 1C |
|---|---|---|
| Nombre de prestations | « 22 » | **23** : 21 montants numériques + 2 prestations sur devis |
| Bouton principal | « texte blanc, 3,0:1, non conforme » | **Faux.** Texte `#1b1208` sur fond `#e87436` : **6,14:1** (normal), **7,95:1** (survol, fond `#ff8b47`) |
| Contour de focus | non vérifié | `3px solid #b44d29` : **4,91:1** contre le fond de page, voisinage réel du contour. Contre le bouton lui-même : 1,73:1, sans incidence sur la visibilité |
| Montants en production | « non publiés » | **Fuite corrigée** (voir § 3) |
| Phase 1 | rapport valide | **Remplacé** par ce rapport et par celui de 1B |

Le rapport 1B contenait une affirmation de contraste fausse. Il est corrigé par la présente section.

## 2. Mécanisme de publication (trois niveaux)

1. **Tarif proposé** : montant du cadrage, statut `propose`. Jamais publié.
2. **Tarif approuvé individuellement** : statut `approuve` **et** référence écrite `approbation`. Aucun élément n'est approuvé aujourd'hui ; un test impose la référence.
3. **Autorisation de publication commerciale** : constante `autorisationPublication.autorisee` (dans `src/content/fr/catalogue.ts`, valeur **`false`**) **et** variable `PUBLICATION_TARIFS=autorisee`. Double verrou, désactivé par défaut. La constante ne doit passer à `true` que par un commit approuvé par le propriétaire.

Règles d'affichage (`src/lib/tarification.ts`) :
- **Production** (`VERCEL_ENV=production`) : tous les montants s'affichent « Sur devis ».
- **Local** (build sans `VERCEL_ENV`) : montants visibles, étiquetés « Proposé, non approuvé ».
- **Aperçus Vercel** : masqués, sauf si `TARIFS_APERCU=protege` est déclaré explicitement. Cette variable n'est définie nulle part par le dépôt.

## 3. Fuite constatée et corrigée

Le contrôle de production a révélé deux fuites :
- **Dans le JavaScript public** : le catalogue complet, avec ses montants, était importé par le module de contenu lu par l'en-tête client. **Corrigé** : le catalogue est sorti du contenu partagé et réservé à des composants serveur (`src/lib/catalogue.ts`).
- **Dans le HTML de production** : le point d'arbitrage de la banque de cinq heures affichait « 525 $ CA ». **Corrigé** : les points d'arbitrage ne sont rendus que dans l'aperçu local ou protégé.

Vérification automatisée : `scripts/verifier-publication.sh`, à lancer après `VERCEL_ENV=production pnpm build`.
- Résultat sur le build de production : **0** motif dans `.next/static` et **0** dans `.next/server/app`.
- Contrôle positif sur le build local : **échec** attendu et obtenu (montants visibles). Le script détecte donc bien une fuite.
- Les identifiants internes (`site-essentiel`, etc.) ne sont pas des montants et ne sont pas testés. Ils figurent dans le HTML et le JavaScript.

## 4. Points commerciaux signalés (maquette, aperçu local)

- **Forfait Google Workspace jusqu'à cinq utilisateurs (1 200 $ CA)** : point commercial à arbitrer. Le forfait remplace-t-il la configuration initiale (500 $ CA) ou s'y ajoute-t-il ? Non tranché dans le cadrage.
- **Banque de cinq heures (525 $ CA)** : pour un usage à distance seul, cinq heures à 95 $ CA font 475 $ CA. La banque coûte **50 $ CA de plus**, sauf prestation supplémentaire. Elle n'est donc pas économiquement avantageuse pour ce seul usage. Les déplacements et interventions sur place ne sont pas couverts ; modalités à valider.

Les montants ne sont **pas modifiés** : ils restent ceux du cadrage, en attente de validation humaine.

## 5. Exposition publique du dépôt

**Le dépôt `Neoxix-Inc/neoxix-web` est public** (vérifié). Conséquences :
- Les 21 montants proposés sont lisibles dans `src/content/fr/catalogue.ts`, dans l'historique git de la branche, et sur la PR #2.
- Le verrou de publication protège le **site**, pas le **code**.

Décision à prendre : rendre le dépôt privé, ou sortir les montants (catalogue) vers un stockage privé avant tout partage large.

## 6. Prévisualisations

- **Vérifié dans le code et la réponse HTTP locale** : `X-Robots-Tag: noindex, nofollow` et `robots.txt` avec `Disallow: /` hors production.
- **Non vérifié** : la protection d'accès des aperçus Vercel (mot de passe ou SSO). Il faut la confirmer dans les réglages Vercel, sans modifier de variable.
- **Hors production** : un aperçu sans `TARIFS_APERCU=protege` n'affiche aucun montant proposé.

## 7. Accessibilité : contrôles et limites

**Testé (navigateur Chromium, émulation, mouvement réduit) :**
- Couleurs calculées du bouton principal dans les trois états (§ 1).
- Clavier : chaque page de la boucle « Tab » a un focus visible d'au moins 2 px. La boucle est étendue à `/tarifs` et à une offre.
- Titres : un seul `h1` par page, sur les 20 captures.
- Aucun formulaire sur les pages d'offre et sur `/tarifs`.
- Navigation : 961 à 1194 px sur une ligne ; menu mobile sous 960 px.

**Non testé :**
- Lecteurs d'écran (NVDA, VoiceOver, JAWS) ; navigateurs WebKit / Safari ; appareils réels ; audit automatisé type axe-core ; zoom 200 %.
- Aucune conformité WCAG ne peut être déclarée à partir de ces contrôles.

## 8. Publication : état

- Aucun montant approuvé ; aucun montant publié sur neoxix.ca.
- Formulaire public : **désactivé** (`INTAKE_MODE` non modifié). Les CTA des pages renvoient vers `info@neoxix.ca` avec le sujet de l'offre pré-rempli.
- LeadFlow, n8n, HubSpot, secrets : non modifiés.

## 9. Décisions restantes pour le propriétaire

1. Approbation individuelle des 21 montants (aucun approuvé à ce jour).
2. Forfait Google Workspace 1 200 $ : remplace-t-il ou s'ajoute-t-il à la configuration initiale (500 $) ?
3. Banque de cinq heures : la maintenir à 525 $ CA, la baisser, ou la retirer, sachant qu'elle coûte 50 $ de plus que cinq heures à distance ?
4. Visibilité du dépôt : privé, ou catalogue hors dépôt public.
5. Protection des aperçus Vercel : confirmer le mode d'accès.
6. Couleur du bouton principal : **aucune modification nécessaire** selon les contrôles (6,14:1).
7. Mention commune et taxes.
8. Politique de confidentialité : à réviser avant toute réservation ou migration de boîtes (§ 10 du rapport 1B).

## 10. Résultats des tests

Exécutés sur le code final de la phase (commit de correction, voir la PR #2).

| Contrôle | Résultat |
|---|---|
| `pnpm lint` | 0 erreur ; 8 avertissements, identiques à la base |
| `pnpm typecheck` | Réussi (avant et après build) |
| `pnpm build` (local) | Réussi |
| `pnpm build` (`VERCEL_ENV=production`) + `scripts/verifier-publication.sh` | Réussi : 0 montant dans le JavaScript public et le HTML/RSC |
| Contrôle positif (build local + même script) | Échec attendu et obtenu : le script détecte une fuite |
| Vitest | 76 / 76 |
| Playwright, quatre largeurs (1440, 1194, 834, 390) | 252 réussis, 0 échec, 20 ignorés (volontaires selon la largeur) |
| Contrôle production (serveur `VERCEL_ENV=production`) | 0 formulaire sur les 7 pages testées ; 0 montant visible ; CTA `mailto:info@neoxix.ca` avec sujet d'offre |
| Captures (20 : 1440, 1194, 834, 390 px ; 5 pages) | 0 débordement horizontal, 0 erreur console, un seul `h1` par page |
| Navigation | 960 px : menu mobile ; 961 à 1194 px : une ligne |

## 11. Ce qui n'est pas livré en 1C

- **Aperçu protégé** : aucun aperçu Vercel n'a été créé ; aucune variable Vercel n'a été modifiée. La revue visuelle repose sur les captures locales.
- **HawkScan** : toujours non exécuté (pas de clé StackHawk ni de `stackhawk.yml`).
- **Lecteurs d'écran, WebKit, appareils réels** : non testés (voir § 7).
