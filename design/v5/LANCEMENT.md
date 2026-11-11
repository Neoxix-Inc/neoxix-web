# NEOXIX Services V5 · Fiche de lancement

## Configuration publiée

- **LeadFlow non collecteur en production.** Avec `VERCEL_ENV=production`, le formulaire est remplacé par le courriel `info@neoxix.ca` : l'adresse reçoit bien le courrier, car ses enregistrements MX pointent vers iCloud Mail. `POST /api/demandes` répond 503. Le mode démonstration (`mock`) reste en prévisualisation seulement.
- **Indexation.** Seule la production est indexée (`robots.txt`, plan du site et balise meta `index, follow`, sans `X-Robots-Tag`). Les prévisualisations et le poste local restent en `noindex`.
- **Confidentialité.** La page `/confidentialite` est liée depuis le pied de page. Elle décrit le traitement réel : aucun témoin, journaux de l'hébergeur, courriels. **Aucune validation juridique n'a été faite.**
  - Responsable : la fonction est exercée par défaut par la personne ayant la plus haute autorité (art. 3.1 de la loi), sans nom publié. Décision du propriétaire : publier un nom ou un titre.
  - Durée de conservation des courriels : **non publiée**. Décision du propriétaire à prendre, puis à ajouter à la politique.
- **Variables Vercel.** Les variables `INTAKE_MODE`, `N8N_*` et `INTAKE_*` sont volontaires. Elles restent en place et ne doivent pas être supprimées. `INTAKE_MODE` doit rester à `off` en production : c'est lui qui empêche toute collecte réelle, même si les autres variables sont présentes.

## État réel de la production (vérifié le 11 nov. 2026)

- `origin/main` contient déjà 24 commits au-delà du portfolio (`cbcf7a1`), jusqu'à `d640000`. Le déploiement de production `d640000` est en ligne (READY, créé le 10 nov. à 04:44 UTC). **La bascule a donc déjà eu lieu** : cette fiche ne décrit plus une étape future.
- `main` local est resté à `cbcf7a1` : il doit être mis à jour avant toute opération.
- 8 commits de la branche ne sont pas encore sur `main`, dont la correction de la durée de conservation à 12 mois. Leur publication est une décision séparée (voir le dossier de confidentialité).

## Bascule (historique, déjà effectuée le 10 nov. 2026)

1. `git tag portfolio-prod cbcf7a1` (dernière version publique, le portfolio) est déjà poussé.
2. `git push origin feat/services-platform:main` a déjà été effectué (fast-forward) : `origin/main` contient 24 commits au-delà du portfolio.
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

> J'accepte que NEOXIX utilise les renseignements de ce formulaire pour répondre à ma demande et préparer une proposition. Ils sont conservés au plus 12 mois après le dernier échange lorsqu'aucune suite n'est donnée, ne sont ni vendus ni partagés à des fins commerciales, et peuvent être traités hors du Québec par nos fournisseurs (hébergement, automatisation). Voir la politique de confidentialité.

## Recette manuelle (5 minutes, iPhone et iPad)

1. Ouvrez `neoxix.ca` : page complète, aucun défilement horizontal.
2. Le menu s'ouvre et se ferme, et chaque lien mène à sa section.
3. Services : ouvrez le détail d'un pôle, puis sa page complète.
4. Contact : le bouton « Écrire à info@neoxix.ca » ouvre Mail avec le sujet prérempli.
5. Pied de page › Confidentialité : la page s'affiche.

## Lancement SHIP-FINAL (10 novembre 2026)

- Textes commerciaux réécrits : problème, prestation, scénario type, résultat, prise de contact.
- Accueil réorganisé : services, solutions par besoin (avec lien vers le service), appel à l'action, méthode, réalisations vérifiables, à propos, engagements, formules, FAQ, contact.
- LeadFlow retiré des pages publiques : c'est un concept non commercialisé.
- Finitions visuelles en CSS : halos et entrée en cascade du héros, survol des cartes, tracé de la méthode, micro-interactions. Tout est désactivé en mouvement réduit, et le contenu reste visible sans JavaScript.

## Backlog après lancement

- **P2**
  - Le test « /services/infrastructure » est instable sur 1440 px : un échec sur une exécution, puis 3 réussites sur 3.
  - Le texte de Réalisations sur LeadFlow (« traitement serveur pas encore réalisé ») sera à mettre à jour lors de l'activation.
- **P2** Chaque carte de service affiche deux liens (« Découvrir ce service » et « Voir le périmètre ») : à simplifier si les retours le justifient.
- **P3**
  - Logo institutionnel (candidat A non approuvé).
  - Inventaire des visuels Google Drive : le connecteur est à reconnecter.
  - Version anglaise.
  - Nonce CSP pour retirer `unsafe-inline`.
  - Recette Safari/WebKit automatisée (dépendances système).
- **Poste de développement**
  - Hook `python` du plugin `backend-design` : `sudo apt install python-is-python3`, ou désactiver le plugin.
  - Jeton du CLI Vercel expiré : lancer `vercel login`.
