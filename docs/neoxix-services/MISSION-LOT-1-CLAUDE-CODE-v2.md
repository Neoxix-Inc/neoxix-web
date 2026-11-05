# MISSION NEOXIX-LOT1-PREVIEW-001 (v2) · Site vitrine v3, développement en local

Destinataire : Claude Code (seul agent de développement autorisé).
Autorité : propriétaire NEOXIX. Décisions 1 à 4 déléguées à la direction le 4 novembre 2026. Démarrage du Lot 1 confirmé par le propriétaire le 4 novembre 2026 (soir).

## CONTEXTE

- Lot 0 committé sur `feat/services-platform` : SHA `44365bce91729a10189a41bcd36e05ddd337fd20`, parent `787eeae`. Ne pas le réécrire.
- Maquette source : `design/v3/index.html` (empreinte `29f16280025be245596bc46a3f766f175132011c2a0b251d0230821ecef729d1`, 37 828 octets). Elle sert de référence visuelle et de contenu. Ne pas la modifier sans demande écrite.
- Direction : NEOXIX Ambre Motion, direction C. Tokens : nuit `#10171A`, ambre vif `#FF8B47`, ambre foncé `#B44D29`, signal `#4FD1C5`.
- Dépôt : `/home/kodjo/worktrees/neoxix-web-services`, branche `feat/services-platform`.
- Le thème lime est archivé sur `archive/theme-lime-2026-11-04`. Ne pas le réintégrer.

## OBJECTIF

Construire en local le site vitrine v3 : accueil, services (4 pôles), méthode, engagements, FAQ, contact par courriel. Français par défaut. Structure prête pour une version anglaise plus tard.

Pages du Lot 1 : accueil, services, quatre pages de pôles, méthode, contact, confidentialité (texte provisoire), 404.

## PÉRIMÈTRE

- Next.js (version déjà présente dans le dépôt, sans mise à niveau majeure), TypeScript strict, CSS basé sur les tokens ci-dessus.
- Contenu typé en français dans `src/content/`, copié depuis la maquette validée.
- Polices auto-hébergées (`next/font/local`). IBM Plex Sans, IBM Plex Mono, Bricolage Grotesque.
- Tests : Vitest (contenu), Playwright (navigation, clavier, responsive 390, 768 et 1440 px, réduction de mouvement).
- Build de production, captures d'écran des pages à 390 et 1440 px.
- Documentation dans `docs/neoxix-services/LOT1-RAPPORT.md`.

## EXCLUSIONS

- **Aucun déploiement Vercel, aucune URL publique, aucune intégration externe** tant que le propriétaire n'a pas confirmé par écrit. Le build local et les captures suffisent pour ce lot.
- Aucun formulaire actif, aucune route `POST` de demande, aucun stockage de données personnelles.
- Aucun appel vers n8n, HubSpot, Odoo, Proxmox, Ivoire Connect ou toute autre intégration.
- Aucune modification DNS. Aucune publication sur `neoxix.ca`.
- Aucun logo officiel présenté comme définitif. Le monogramme est marqué « logo provisoire ».
- Aucun témoignage, chiffre client, certification, partenariat, prix ou délai non validé. Les éléments entre crochets (`[délai à valider]`, `[fourchette à valider]`) restent tels quels.
- Aucun `git reset --hard`, aucun `push --force`, aucun rebase, aucun push sans demande écrite.
- Aucun autre agent de développement sollicité.

## CRITÈRES D'ACCEPTATION

1. Le build de production réussit ; `tsc --noEmit` et ESLint sans erreur.
2. Toutes les pages du périmètre existent et sont accessibles en local.
3. Aucun débordement horizontal à 390, 768 et 1440 px.
4. Navigation complète au clavier ; focus visible ; menu mobile accessible au clavier, fermeture à Échap.
5. Avec `prefers-reduced-motion`, aucune animation active.
6. Aucune requête réseau vers un domaine tiers au chargement (hors polices auto-hébergées).
7. Aucune erreur console au chargement de chaque page.
8. Les textes entre crochets sont présents tels quels, ou retirés avec validation écrite. Aucun n'est remplacé par une valeur inventée.
9. Le lien `mailto:info@neoxix.ca` est le seul moyen de contact publié.
10. Un bandeau « Maquette / prévisualisation, non publiée » est visible sur toutes les pages.
11. Animations : entrées au défilement, flux en boucle, tracé de la méthode, survol des services, FAQ animée. Chacune est désactivée sous `prefers-reduced-motion`, et le contenu reste visible sans JavaScript.
12. Contraste : les textes ambre sur fond clair utilisent l'ambre foncé. Vérifié par test automatisé.
13. Menu mobile accessible, barre d'action fixe sur mobile.

## VALIDATION

- Tests Vitest et Playwright ; résultats fournis en réussis / échoués / non réalisés / limitations.
- Vérification manuelle des parcours : accueil vers services, vers un pôle, vers contact.
- Captures des pages à 390 et 1440 px, dans `docs/neoxix-services/captures-lot1/`.
- Lighthouse en local, indicatif seulement. Ne jamais déclarer une conformité WCAG ou des Core Web Vitals terrain.
- Sécurité : aucune clé dans le code, `pnpm audit` sans vulnérabilité critique.

## LIVRABLES

- Branche `feat/services-platform`, commits séparés par étape, sans push.
- `docs/neoxix-services/LOT1-RAPPORT.md` : état vérifié, tests, limites, procédure de retour arrière.
- Captures dans `docs/neoxix-services/captures-lot1/`.

## RISQUES

- Le domaine `neoxix.ca` sert encore le portfolio : aucune bascule DNS dans ce lot.
- Les mentions juridiques (confidentialité, Loi 25) sont provisoires. Aucune donnée personnelle collectée tant que la revue juridique n'est pas faite.
- L'hébergement géré reste conditionnel : ne pas l'afficher comme service disponible.
- Le fast-forward du 4 novembre a intégré les pages dynamiques et le correctif reveal dans la branche : tenir compte de ces pages dans les tests.

## POINT D'ARRÊT

Arrêter et revenir à la direction si :
- une étape demande un déploiement Vercel, une URL publique, une modification DNS ou une publication sur `neoxix.ca` ;
- un texte bloqué (délai, prix, certification, logo officiel) doit être inventé pour continuer ;
- un formulaire ou une intégration externe devient nécessaire ;
- un test critique échoue et la correction changerait le périmètre.

## RAPPORT DE FIN DE MISSION

À remettre à la direction avant toute mission suivante. La mise en ligne sur Vercel, puis sur `neoxix.ca`, fera chacune l'objet d'une demande d'autorisation écrite au propriétaire.
