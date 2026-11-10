# NEOXIX · Circuit commercial (LeadFlow → n8n → HubSpot)

```
neoxix.ca (Vercel)                       n8n (auto-hébergé)                          HubSpot (portail existant)
POST /api/demandes ── HTTPS + HMAC ──▶ « Lead Intake » ── jeton HubSpot ──▶ contact · transaction · tâche
  Zod, origine, débit, robots,         signature, fenêtre de 300 s,           pipeline « NEOXIX — Services
  idempotence (clé → eventId)          dédoublonnage par eventId               informatiques », étape
  202 seulement si n8n répond 2xx      202 seulement après la transaction      « Nouvelle demande »
                                        └─▶ notification interne (SMTP)
                                        « Rappels quotidiens » (8 h, lun.-ven.) ─▶ tâches internes + résumé
```

Si HubSpot ou n8n est en panne, le formulaire affiche « Erreur temporaire » et garde la saisie. Il propose de réessayer avec la même clé, sans doublon, ou d'écrire à `info@neoxix.ca`. Le reste du site n'est pas affecté.

## Contenu du dossier

| Fichier | Rôle |
|---|---|
| `n8n/logique/intake.mjs`, `n8n/logique/suivi.mjs` | Logique des workflows, testée par `tests/unit/automation.test.ts` |
| `n8n/construire.mjs` | Génère `n8n/workflows/*.json` (`node automation/n8n/construire.mjs`) |
| `n8n/workflows/*.json` | Définitions importables, **sans secret**, inactives à l'import |
| `hubspot/configurer.mjs` | Diagnostic du portail, propriétés NEOXIX, identifiants du pipeline |
| `emails/modeles-commerciaux.md` | Accusé de réception, notification interne, 5 brouillons commerciaux |

## Mise en service (dans l'ordre)

1. **HubSpot.** Créez une *Service Key* (Paramètres › Intégrations), ou à défaut une application privée, avec les seules portées nécessaires :
   - contacts : lecture et écriture ;
   - transactions : lecture et écriture ;
   - schémas des transactions : lecture et écriture, utile seulement pour l'étape 2 ;
   - tâches : lecture et écriture.

   Pas de portée marketing ni de portée sur les entreprises : l'organisation est saisie avec le nom. Vérifiez aussi le réglage qui marque les contacts créés par les intégrations comme « non marketing ».
2. `HUBSPOT_TOKEN=… node automation/hubspot/configurer.mjs --appliquer --verifier-ecriture`. Le script :
   - crée les 6 propriétés `neoxix_*`, dont `neoxix_request_id` à valeur unique ;
   - vérifie les permissions ;
   - affiche les identifiants du pipeline et des étapes.
3. **n8n : point d'entrée public** (constaté le 10 novembre 2026) :
   - `hooks.neoxix.ca` est déjà publié par un tunnel Cloudflare géré depuis le tableau de bord. Le connecteur `cloudflared` tourne sur le poste 10.90.0.101.
   - Ce nom répond aujourd'hui 404 partout, depuis un nginx 1.24 dont la cible reste à identifier.
   - Ce poste **n'atteint pas** n8n (10.50.0.100, ports 443 et 5678 fermés). Le connecteur doit tourner sur un hôte qui joint n8n, sinon il faut une règle de pare-feu qui autorise le port 5678 depuis 10.90.0.101 et rien d'autre.

   Configuration à appliquer, **après autorisation**, dans Cloudflare › Zero Trust › Tunnels › *public hostnames* :

   | Ordre | Nom d'hôte | Chemin (regex) | Service |
   |---|---|---|---|
   | 1 | `hooks.neoxix.ca` | `^/webhook/neoxix-lead-intake$` | `http://10.50.0.100:5678` |
   | dernier | (règle finale) | — | `http_status:404` |

   Compléter par une règle WAF Cloudflare (gratuite) sur `hooks.neoxix.ca` : bloquer si `not (http.request.method eq "POST" and http.request.uri.path eq "/webhook/neoxix-lead-intake")`. Ainsi `/`, `/rest`, `/signin`, `/webhook-test/…`, les autres webhooks et les autres méthodes sont refusés avant le tunnel. L'éditeur n8n reste accessible seulement par `n8n.neoxix.ca`, sur le réseau interne.
4. Variables du serveur n8n :
   - `NEOXIX_INTAKE_HMAC_SECRET` : 32 caractères ou plus, par exemple `openssl rand -hex 32`, identique à `N8N_HMAC_SECRET` sur Vercel ;
   - `NODE_FUNCTION_ALLOW_BUILTIN=crypto` ;
   - `N8N_BLOCK_ENV_ACCESS_IN_NODE=false` ;
   - `EXECUTIONS_DATA_PRUNE=true` et `EXECUTIONS_DATA_MAX_AGE=168`, pour purger les exécutions en échec après 7 jours.
5. Importez les deux JSON. Ensuite :
   - liez la credential **HubSpot App Token** (« HubSpot NEOXIX ») et, si l'envoi est validé, la credential **SMTP** (« SMTP NEOXIX ») ;
   - complétez les nœuds « Configuration » avec la sortie de l'étape 2 ;
   - activez « Lead Intake », puis « Rappels quotidiens ».
6. **Vercel (Production).**
   - Définissez : `INTAKE_MODE=live`, `N8N_WEBHOOK_URL=https://…/webhook/neoxix-lead-intake`, `N8N_HMAC_SECRET`, `INTAKE_VERSION_CONSENTEMENT=2026-11-10` et `INTAKE_LIMITE_PARTAGEE=waf`.
   - Créez la règle du pare-feu Vercel : Firewall › Custom rule › *Rate limit*, condition `Request path = /api/demandes` et `Method = POST`, 5 requêtes par IP sur 600 s, action *Deny*. Vérifiez d'abord le coût de la limitation de débit pour votre forfait, puis publiez la règle. Preuve attendue : la 6e requête en 10 minutes reçoit 429 de Vercel, avant la fonction (le corps de réponse n'est pas celui du site).
   - Redéployez : la page Contact et la politique de confidentialité passent alors en mode « formulaire actif ».

## Courriels (envoi depuis n8n)

- Le domaine `neoxix.ca` est servi par iCloud Mail : MX iCloud, SPF `include:icloud.com`, DKIM `sig1` en place. **Aucun DMARC n'est publié** : ajoutez `_dmarc` en TXT avec `v=DMARC1; p=none; rua=mailto:info@neoxix.ca` (changement DNS soumis à votre autorisation).
- SMTP iCloud : `smtp.mail.me.com`, port 587 (STARTTLS). L'identifiant est l'adresse du compte Apple et le mot de passe est un **mot de passe d'application**. L'expéditeur doit être `info@neoxix.ca`.
- L'accusé de réception et la notification interne restent **désactivés** jusqu'à un envoi d'essai vérifié (réception, en-têtes SPF/DKIM « pass », retour d'erreur). En attendant, la tâche HubSpot assignée au propriétaire sert de notification, si les notifications HubSpot sont actives.

## HubSpot : organisation commerciale

Vues à enregistrer (Transactions › filtrer sur le pipeline NEOXIX) :

| Vue | Filtre |
|---|---|
| Demandes entrantes | Étape = Nouvelle demande |
| À traiter | Étape = Besoin analysé |
| Devis en cours | Étape = Devis en préparation ou Devis envoyé |
| Relances | Tâches ouvertes dont le sujet commence par « Rappel » ou « Relancer » |
| Gagnées / perdues | Étape = Gagné, ou Étape = Perdu (motif de perte obligatoire) |

Les rappels quotidiens créent une tâche dans trois cas :
- demande à l'étape « Nouvelle demande » depuis plus d'un jour ouvrable ;
- transaction en « Devis en préparation » ;
- transaction en « Devis envoyé » sans changement depuis 5 jours (réglable dans « Configuration »).

Une même transaction n'est rappelée qu'une fois tous les 3 jours. Le résumé quotidien ne contient que des nombres et des références, sans nom, courriel ni téléphone.

## Exploitation

- **Coupure immédiate du formulaire :** sur Vercel, `INTAKE_MODE=off`, puis Redeploy. Le formulaire est remplacé par le courriel. Pour couper sans redéployer, désactivez « Lead Intake » dans n8n : le site affiche alors « Erreur temporaire » et le courriel.
- **Retour arrière du code :** Vercel › Instant Rollback vers le déploiement précédent, ou `git revert` du commit, puis pousser `main`.
- **Conservation** (la durée de 12 mois pour les demandes sans mandat a été approuvée par le propriétaire le 10 novembre 2026 ; les autres lignes restent des propositions) :

  | Données | Lieu | Durée proposée | Justification |
  |---|---|---|---|
  | Demande sans mandat (contact, transaction, tâches) | HubSpot | **12 mois après le dernier échange (approuvé)**, revue trimestrielle | Couvre un cycle budgétaire annuel de PME ; la Loi 25 exige la destruction une fois la finalité atteinte |
  | Client avec mandat | HubSpot | Durée de la relation, puis 2 ans | Suivi et garantie des travaux ; les pièces comptables suivent leur propre durée légale (6 ans) hors CRM |
  | Courriels échangés | iCloud Mail | Même règle que HubSpot, purge trimestrielle manuelle | Éviter une copie conservée plus longtemps que le CRM |
  | Exécutions n8n réussies | n8n | Aucune conservation | Le contenu est déjà dans HubSpot |
  | Exécutions n8n en échec | n8n | 7 jours | Temps de diagnostic ; `EXECUTIONS_DATA_MAX_AGE=168` |
  | Journaux techniques | Vercel, Cloudflare | Durée imposée par chaque fournisseur (quelques jours selon le forfait) | Sans contenu de formulaire : la route ne journalise rien |
  | Sauvegardes du serveur n8n | Infrastructure NEOXIX | À préciser : rotation de 30 jours proposée | Elles peuvent contenir des exécutions en échec de moins de 7 jours |
- **Demande d'accès ou de suppression :** recherchez le contact par courriel dans HubSpot, exportez-le ou supprimez-le (suppression RGPD/Loi 25), puis répondez par écrit dans les 30 jours.
- **Accès :** seuls le propriétaire du portail HubSpot et l'administrateur n8n ont accès aux données. La Service Key change si une personne quitte l'entreprise ou en cas de doute.

## Essai du circuit réel

```
N8N_WEBHOOK_URL=https://hooks.neoxix.ca/webhook/neoxix-lead-intake NEOXIX_INTAKE_HMAC_SECRET=… HUBSPOT_TOKEN=… \
  node automation/tests/circuit-reel.mjs            # avant l'activation du formulaire
  node automation/tests/circuit-reel.mjs --via-site # après l'activation (passe par neoxix.ca)
```

Le script vérifie, avec des données fictives `TEST NEOXIX (à supprimer)` :
- le refus d'une signature invalide et d'un message expiré ;
- la création du contact, de la transaction (une seule) et de la tâche, ainsi que leurs associations ;
- l'absence de doublon pour un envoi identique ;
- la reprise après la perte de la tâche ;
- la conservation d'un contact déjà connu.

Il archive ensuite les enregistrements d'essai.

## Désactivation d'urgence

1. **Formulaire :** Vercel › Settings › Environment Variables › `INTAKE_MODE=off`, puis Deployments › Redeploy (environ 1 minute). Le formulaire est remplacé par le bouton courriel.
2. **Sans redéploiement :** désactivez « Lead Intake » dans n8n. Le site affiche alors « Erreur temporaire » et le courriel ; aucune donnée n'est reçue.
3. **Point d'entrée :** dans Cloudflare, supprimez le *public hostname* `hooks.neoxix.ca`, ou passez la règle WAF à « bloquer tout ».

## État des tests (10 novembre 2026)

| Test | État |
|---|---|
| 1, 2, 3, 4 : parcours, doublon, contact connu, panne HubSpot, reprise après échec partiel | Réussis sur un HubSpot simulé (logique réelle des workflows). **Non exécutés sur le portail réel : accès manquants.** `automation/tests/circuit-reel.mjs` est prêt. |
| 5 : webhook non autorisé | Réussi en local : signature invalide, expirée ou absente refusée. À refaire sur n8n. |
| 6 : limitation | Réussi sur la route Next.js (429). La règle WAF reste à créer. |
| 7, 8 : notification, accusé de réception | Non testés : SMTP non configuré |
| 9 : formulaire mobile | Réussi en émulation (Playwright, 390 px) |
| 10 : absence de secrets | Réussi : réponses de l'API sans détail interne, JSON exportés sans secret |
