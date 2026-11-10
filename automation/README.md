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
3. **n8n.** Le webhook doit être joignable depuis Internet, par Vercel. Aujourd'hui, `n8n.neoxix.ca` n'existe que dans le DNS interne. La solution recommandée, sans coût, est un Cloudflare Tunnel avec un nom public dédié (par exemple `hooks.neoxix.ca`), qui n'expose que `/webhook/neoxix-lead-intake`. Toute autre adresse répond 404, et l'éditeur n8n reste interne.
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
   - Créez la règle du pare-feu : `POST /api/demandes`, 5 requêtes par IP sur 10 minutes, puis refus (429).
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
- **Conservation (proposition soumise au propriétaire) :**
  - demandes sans mandat supprimées dans HubSpot 24 mois après le dernier échange (revue trimestrielle de la vue « Perdu ») ;
  - exécutions n8n en échec purgées après 7 jours ;
  - exécutions réussies jamais conservées.
- **Demande d'accès ou de suppression :** recherchez le contact par courriel dans HubSpot, exportez-le ou supprimez-le (suppression RGPD/Loi 25), puis répondez par écrit dans les 30 jours.
- **Accès :** seuls le propriétaire du portail HubSpot et l'administrateur n8n ont accès aux données. La Service Key change si une personne quitte l'entreprise ou en cas de doute.

## État des tests (10 novembre 2026)

| Test | État |
|---|---|
| 1, 2, 3, 4 : parcours, doublon, contact connu, panne HubSpot | Réussis sur un HubSpot simulé (logique réelle des workflows). **À refaire contre le portail réel.** |
| 5 : webhook non autorisé | Réussi en local : signature invalide, expirée ou absente refusée. À refaire sur n8n. |
| 6 : limitation | Réussi sur la route Next.js (429). La règle WAF reste à créer. |
| 7, 8 : notification, accusé de réception | Non testés : SMTP non configuré |
| 9 : formulaire mobile | Réussi en émulation (Playwright, 390 px) |
| 10 : absence de secrets | Réussi : réponses de l'API sans détail interne, JSON exportés sans secret |
