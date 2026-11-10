# NEOXIX Services V5 · Fiche de lancement

## Configuration publiée

- **LeadFlow non collecteur en production.** Avec `VERCEL_ENV=production`, le formulaire est remplacé par le courriel `info@neoxix.ca` : l'adresse reçoit bien le courrier, car ses enregistrements MX pointent vers iCloud Mail. `POST /api/demandes` répond 503. Le mode démonstration (`mock`) reste en prévisualisation seulement.
- **Indexation.** Seule la production est indexée (`robots.txt`, plan du site et balise meta `index, follow`, sans `X-Robots-Tag`). Les prévisualisations et le poste local restent en `noindex`.
- **Confidentialité.** La page `/confidentialite` est liée depuis le pied de page. Elle décrit le traitement réel : aucun témoin, journaux de l'hébergeur, courriels. **Aucune validation juridique n'a été faite.**
- **Variables Vercel.** Aucune n'est nécessaire en production. N'y ajoutez ni `INTAKE_MODE` ni `N8N_*`.

## Bascule (après autorisation)

1. `git tag portfolio-prod cbcf7a1` (dernière version publique, le portfolio) est déjà poussé.
2. `git push origin feat/services-platform:main` : avance rapide, sans commit de fusion.
3. Vercel construit la production depuis `main`. Contrôles à faire ensuite :
   - HTTPS ;
   - `/`, `/services`, `/services/infrastructure`, `/contact`, `/confidentialite` répondent 200 ;
   - `robots.txt` contient `Allow` ;
   - les anciennes adresses `/portfolio` et `/projects/*` répondent 301 ;
   - aucune erreur JavaScript ;
   - affichage correct à 390 px.

## Retour arrière

- **Le plus rapide (environ 1 minute)** : Vercel › neoxix-web › Deployments › déploiement de production précédent (portfolio) › **Instant Rollback**.
- **Par Git** : `git revert --no-edit cbcf7a1..main`, puis pousser `main`. Vercel reconstruit le portfolio. L'historique est conservé, sans `push --force`.
- Aucune donnée persistante n'est concernée, puisque rien n'est collecté.

## Avant d'activer LeadFlow en réel (lot séparé, sur validation)

1. Faire valider juridiquement la politique de confidentialité et le texte de consentement ci-dessous.
2. Créer une règle de limitation dans le pare-feu Vercel sur `POST /api/demandes`, par exemple 5 requêtes par IP sur 10 minutes, puis définir `INTAKE_LIMITE_PARTAGEE=waf`.
3. Dans n8n : vérifier la signature HMAC (`horodatage.corps`), refuser les messages de plus de 5 minutes et dédupliquer sur `eventId`.
4. Variables à définir : `INTAKE_MODE=live`, `N8N_WEBHOOK_URL` (https), `N8N_HMAC_SECRET` (32 caractères minimum) et `INTAKE_VERSION_CONSENTEMENT`. Sans elles, le code refuse le mode `live` en production.

**Projet de texte de consentement (à valider) :**

> J'accepte que NEOXIX utilise les renseignements de ce formulaire pour répondre à ma demande et préparer une proposition. Ils sont conservés au plus 24 mois sans suite, ne sont ni vendus ni partagés à des fins commerciales, et peuvent être traités hors du Québec par nos fournisseurs (hébergement, automatisation). Voir la politique de confidentialité.

## Recette manuelle (5 minutes, iPhone et iPad)

1. Ouvrez `neoxix.ca` : page complète, aucun défilement horizontal.
2. Le menu s'ouvre et se ferme, et chaque lien mène à sa section.
3. Services : ouvrez le détail d'un pôle, puis sa page complète.
4. Contact : le bouton « Écrire à info@neoxix.ca » ouvre Mail avec le sujet prérempli.
5. Pied de page › Confidentialité : la page s'affiche.

## Backlog après lancement

- **P2**
  - Le test « /services/infrastructure » est instable sur 1440 px : un échec sur une exécution, puis 3 réussites sur 3.
  - Le texte de Réalisations sur LeadFlow (« traitement serveur pas encore réalisé ») sera à mettre à jour lors de l'activation.
- **P3**
  - Logo institutionnel (candidat A non approuvé).
  - Inventaire des visuels Google Drive : le connecteur est à reconnecter.
  - Version anglaise.
  - Nonce CSP pour retirer `unsafe-inline`.
  - Recette Safari/WebKit automatisée (dépendances système).
- **Poste de développement**
  - Hook `python` du plugin `backend-design` : `sudo apt install python-is-python3`, ou désactiver le plugin.
  - Jeton du CLI Vercel expiré : lancer `vercel login`.
