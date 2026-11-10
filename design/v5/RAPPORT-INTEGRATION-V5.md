# NEOXIX · Rapport d'intégration V5 (Claude Code)

Date : 10 novembre 2026 · Branche `feat/services-platform` · Statut : **prévisualisation seulement, aucun déploiement public**.

## 1. Concordance maquette / dossier (vérifiée avant toute modification)

- SHA-256 de `design/v5/index.html` : `5ad1cd45…f245b62a`, identique au dossier.
- Tokens (13), points de rupture (1100, 960, 834, 620, 360), polices, 13 composants du § 3, champs, règles et 7 états LeadFlow : concordants.
- Écarts relevés, tranchés en faveur du dossier :
  1. Pied de page « Ambre · proposition de conception » visible : contraire au § 6 et au critère 7. Non repris.
  2. « Service recherché » obligatoire sans astérisque dans le HTML : astérisque ajouté.
  3. Élévation au survol (§ 4 « Cartes ») limitée aux Solutions dans le HTML : étendue aux Réalisations.
  4. Règle `.actif-statique` (mouvement réduit) jamais appliquée : sans effet, non reprise.
  5. Symbole provisoire V5 : remplacé par le mot-symbole NEOXIX existant (mission, point 6), sans mention « provisoire ».

## 2. Écarts volontaires avec la maquette

| Élément | Maquette | Intégration | Raison |
|---|---|---|---|
| Anneau de focus | turquoise `#4FD1C5` partout | ambre foncé sur fond clair, ambre vif sur fond nuit | turquoise ≈ 1,7:1 sur `#FAF8F5` (WCAG 1.4.11 exige 3:1) ; décision V4 |
| Bordure des champs | `#CFC7BC` (≈ 1,6:1) | `#8F8478` (≈ 3,6:1) | WCAG 1.4.11 |
| Schéma du héros | boucle infinie | 7 cycles (≈ 56 s) + bouton pause | WCAG 2.2.2 ; décision V4 |
| FAQ « Que se passe-t-il après une demande ? » | « Cette maquette ne transmet aucune demande. » | « …le formulaire de ce site fonctionne en mode test et ne transmet aucune demande. » | la maquette parlait d'elle-même |
| Textes du formulaire | « Simulation », « Confirmation de simulation » | « Mode test », « Demande valide (mode test) » | le serveur valide réellement, puis abandonne la demande |
| Lien « Page complète du pôle » | absent | dans le détail repliable de chaque pôle | rendre les pages de pôle accessibles autrement que par le pied de page |

## 3. Réalisé

- Accueil V5 en composants (`src/components/vitrine/`) : en-tête et menu mobile à bouton unique, héros + schéma, confiance, Solutions, Services (détail repliable), Réalisations + légende, Méthode, Engagements, Formules, FAQ, Contact LeadFlow, pied de page sans lien juridique.
- Pages conservées et alignées sur la V5 : `/services`, `/services/[pôle]` (allégations « sauvegardes / restauration testées » retirées), `/methode`, `/contact`, `/confidentialite` (non liée, sans crochets), 404.
- Retirés : bandeau « Maquette / prévisualisation », mention « Logo provisoire », barre d'action mobile, section « Trois questions » (décision V5 n° 10, à confirmer), tous les crochets.
- LeadFlow réel : `POST /api/demandes` (`src/app/api/demandes/route.ts`, `src/lib/demande/`).
  - Validation Zod partagée client/serveur ; erreurs sous forme de codes, textes dans `src/content/fr`.
  - Origine vérifiée, JSON seulement, 32 Ko maximum, 5 envois par IP et par 10 min (+ plafond global), champ piège, durée minimale de 3 s (réponse 202 factice aux robots), détection de mots de passe et de clés, clé d'idempotence (référence stable), `Cache-Control: no-store`.
  - `INTAKE_MODE=mock` (défaut) : demande validée puis abandonnée. **Rien n'est stocké, journalisé ni transmis.**
  - `INTAKE_MODE=live` : POST signé HMAC-SHA256 (sur `horodatage.corps`) vers `N8N_WEBHOOK_URL`, délai de 5 s. Sans `N8N_WEBHOOK_URL` et `N8N_HMAC_SECRET`, la route répond 503 et le formulaire laisse place au courriel. **Non activé, non testé contre le n8n réel.**
  - `INTAKE_MODE=off` : formulaire remplacé par le courriel.
- En-têtes : CSP sans aucune origine tierce ; `X-Robots-Tag: noindex` et `robots: noindex` maintenus.

## 4. Tests

- Unitaires (Vitest) : 43 réussis. Contenu comparé mot pour mot à la V5, critères 7 et 8, schéma, protections, route (202, 400, 403, 413, 415, 429, 503), signature HMAC.
- Bout en bout (Playwright, build de production local) : 184 réussis, 20 ignorés par conception (tests propres à une largeur), 0 échec, sur 4 projets : `mobile-390`, `tablette-834`, `ipad-paysage-1194`, `ordinateur-1440`.
- **Émulation seulement** : moteur Chromium avec viewport, densité, tactile et agent iOS/iPadOS. Ce n'est ni Safari/WebKit (bibliothèques système manquantes sur le poste de développement), ni un appareil réel. **Aucun test sur appareil réel n'a été fait.**
- Non testé : appareils réels (iPhone, iPad Pro 13 po, Android), lecteurs d'écran, Lighthouse, n8n et HubSpot réels, balayage HawkScan (clé API absente).

## 5. Décisions du propriétaire avant toute ouverture publique

1. Texte de consentement et politique de confidentialité (Loi 25), puis lien depuis le formulaire.
2. Activation de `INTAKE_MODE=live` : webhook n8n de staging, secret HMAC, vérification de la signature côté n8n (format `horodatage.corps`).
3. Limitation de débit partagée (la mémoire est propre à chaque instance serverless), et éventuellement Turnstile.
4. Retrait du `noindex` et mise en production sur `neoxix.ca`.
5. Section « Trois questions » retirée ; nom public « NEOXIX LeadFlow » ; nouvelle identité graphique.
6. Recette sur appareils réels.
