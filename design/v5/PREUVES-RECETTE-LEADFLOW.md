# LeadFlow · Preuves de recette (anonymisées)

Recette réelle contrôlée du 11 nov. 2026, avec données fictives (« TEST NEOXIX »), destinataire unique : la boîte de test de l'entreprise. Aucun prospect réel contacté. Aucun secret consigné ici.

## Identifiants de test

- Référence : `NX-2026-FBGFS8`
- EventId : `845af651-804b-4c10-8975-9f8ece4403fb`
- Portail HubSpot : `343401633`
- Transaction : `235523587025` (pipeline `default`, étape `appointmentscheduled`)
- Contact : `289216521205`
- Tâche : `285953924065` (propriétaire `94724831`)

## Résultats

| Scénario | Résultat |
|---|---|
| A. Première demande signée | HTTP 202, `enregistree`, référence `NX-2026-FBGFS8` |
| A. Contact, transaction, tâche | Vérifiés par le propriétaire dans HubSpot, associations comprises |
| A. Notifications | Deux courriels reçus par le propriétaire (notification interne et accusé) |
| B. Doublon (même eventId) | HTTP 202, `deja_enregistree`, même référence ; absence de courriel supplémentaire non confirmée (non signalée par le propriétaire) |
| C1. Signature invalide | HTTP 401, aucune écriture |
| C2. Horodatage expiré, signature valide | HTTP 401 |
| SMTP (« NEOXIX — Test SMTP ») | Exécution 203, succès ; message reçu |
| WAF « LeadFlow - limite formulaire » | Active et valide, `POST /api/demandes`, 5 requêtes / IP / 600 s |
| Disponibilité | Site, `/confidentialite`, `robots.txt` en 200 ; webhook refuse les requêtes non signées |

## Archivage

Non effectué dans cette session : aucun accès API HubSpot disponible (HTTP 401 sans jeton). À archiver par le propriétaire : les quatre objets ci-dessus, dont le contact `289216521205`.

## Points de contrôle

- Vérifier la fiche de la boîte de test : le contact `289216521205` peut avoir reçu des champs de test si ses champs étaient vides.
- Les exécutions Lead Intake n'apparaissent pas dans l'API n8n : la livraison a été confirmée par le propriétaire, pas par les journaux.
