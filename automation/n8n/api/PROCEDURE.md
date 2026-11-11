# Procédure API n8n — NEOXIX

Procédure réutilisable pour que Claude Code vérifie, lise, sauvegarde, modifie, publie et dépanne
les workflows n8n de NEOXIX via l'API publique. Version de référence : **n8n 2.35.7**.

> La clé API **n'est jamais** dans le dépôt, ni dans ce document, ni dans les journaux.
> Elle se trouve uniquement dans `~/.config/neoxix/n8n-api-key` (mode 600, propriétaire `kodjo`).

## Accès

L'API écoute sur `127.0.0.1:5678` de **srv-n8n** (10.50.0.100). Elle n'est pas exposée sur le réseau.
Depuis neoxix-dev01, on passe par un tunnel SSH local, lié à 127.0.0.1 :

```bash
ssh -f -N -o ExitOnForwardFailure=yes -L 127.0.0.1:15678:127.0.0.1:5678 srv-n8n
```

Le client `n8n_api.py` utilise `http://127.0.0.1:15678/api/v1` par défaut
(modifiable avec `NEOXIX_N8N_URL`). Fermer le tunnel après usage :
`ss -ltn | grep 15678` puis `pkill -f "L 127.0.0.1:15678"`.

## Commandes du client

Toutes les commandes lisent la clé dans son fichier. Lancer depuis la racine du dépôt :

| Action | Commande |
|---|---|
| 1. Vérifier l'authentification | `python3 -I automation/n8n/api/n8n_api.py check` |
| 2. Lister les workflows | `python3 -I automation/n8n/api/n8n_api.py list` |
| 3. Lire un workflow par ID | `python3 -I automation/n8n/api/n8n_api.py get <id>` |
| 4. Sauvegarder avant modification | `python3 -I automation/n8n/api/n8n_api.py backup <id>` |
| 5. Enregistrer un brouillon | `python3 -I automation/n8n/api/n8n_api.py draft <id> <body.json>` |
| 6. Publier une version précise | `python3 -I automation/n8n/api/n8n_api.py publish <id> <versionId>` |
| 7. Consulter les exécutions | `python3 -I automation/n8n/api/n8n_api.py executions <id> [error]` |
| 8. Lire une version de l'historique | `python3 -I automation/n8n/api/n8n_api.py version <id> <versionId>` |
| 9. Revenir en arrière | `python3 -I automation/n8n/api/n8n_api.py rollback <id> <versionIdPrécédente>` |

Les sauvegardes sont écrites dans `~/.config/neoxix/backups/` (dossier 700, fichiers 600),
**hors dépôt**. Elles peuvent contenir des données de prospects : ne jamais les copier dans le dépôt.

## Procédure de modification et de publication

1. **Identifier l'ID** : `list`, puis noter `id` et l'état (`active`).
2. **Sauvegarder** : `backup <id>`. Noter le `versionId` publié (`activeVersionId`) : c'est la version de retour.
3. **Préparer le corps** : partir de la sauvegarde, modifier uniquement le périmètre autorisé.
   Ne garder que les champs acceptés par `PUT` : `name`, `description`, `nodes`, `connections`,
   `settings`, `staticData`, `nodeGroups`. Les champs en lecture seule (`activeVersion`, `versionId`,
   `active`, `createdAt`…) sont refusés par l'API.
4. **Vérifier le diff** avant envoi : seuls les nœuds voulus changent, les connexions sont identiques,
   les credentials (`credentials.<type>.id`) n'ont pas bougé.
5. **Enregistrer le brouillon sans republier** : `draft <id> <body.json>`
   (`PUT /workflows/{id}?publishIfActive=false`). Noter le nouveau `versionId`. La version publiée ne change pas.
6. **Publier cette version précise** : `publish <id> <nouveauVersionId>`
   (`POST /workflows/{id}/publish` avec `versionId`).
7. **Relire la version publiée** : `get <id>` ; vérifier `activeVersionId == nouveauVersionId`,
   `active == true`, et l'absence de `disabled` sur les nœuds attendus.
8. **Surveiller** : `executions <id> error` après un test réel.

Ne **jamais** publier avec `publish` sans `versionId` (la dernière version pourrait ne pas être celle relue),
ne **jamais** modifier PostgreSQL directement, et ne **jamais** redémarrer n8n pour « forcer » une prise en compte.
La commande CLI `publish:workflow` indique qu'un redémarrage est nécessaire : elle n'est pas utilisée ici.

## Retour arrière

Republier la version sauvegardée avant la modification :
`rollback <id> <versionIdSauvegardée>`, puis vérifier avec `get <id>`.

## Tests

- Un test d'envoi doit être **isolé** : destinataire `info@neoxix.ca`, aucune donnée de prospect réel.
- Ne pas déclencher le webhook de production pour tester ; utiliser une demande fictive signée
  ou un workflow de test dédié.

## Périmètre et restrictions

- Ne pas toucher aux workflows MÉCANIQUE RAYMOND.
- Ne pas modifier les secrets ni les credentials existants.
- Conserver `INTAKE_MODE=off` lorsqu'il est présent.
- Aucun redémarrage, aucun changement Cloudflare, Nginx ou FortiGate, aucun déploiement Vercel
  sans autorisation explicite.
- Modifier uniquement les workflows explicitement autorisés par le propriétaire.
