# LeadFlow · Confidentialité : dossier de travail (brouillon)

> **Statut : brouillon. Aucune validation juridique n'a été faite.** À faire valider par une personne qualifiée avant toute collecte réelle.

## 1. Responsable de la protection des renseignements personnels

- Fonction exercée par défaut par la personne ayant la plus haute autorité dans l'entreprise (art. 3.1 de la Loi 25), sans nom publié.
- **Décision du propriétaire à prendre :** publier un nom ou un titre, avec un moyen de contact (`info@neoxix.ca` proposé).

## 2. Conservation

| Données | Durée | Statut |
|---|---|---|
| Demande sans mandat (contact, transaction, tâches) dans HubSpot | **12 mois après le dernier échange, revue trimestrielle** | **Approuvé par le propriétaire (10 nov. 2026)** |
| Client avec mandat | Durée de la relation, puis 2 ans | À valider |
| Pièces comptables | Durée légale (6 ans), hors CRM | À valider |
| Courriels échangés (iCloud Mail) | Même règle que HubSpot, purge trimestrielle manuelle | **Décision à prendre** |
| Exécutions n8n en échec | 7 jours (`EXECUTIONS_DATA_MAX_AGE=168`) | À appliquer lors de la maintenance de purge |
| Exécutions n8n réussies | Aucune conservation | En place (`saveDataSuccessExecution: none`) |
| Sauvegardes du serveur n8n | Rotation de 30 jours proposée | À confirmer |

Le texte public doit refléter les durées approuvées uniquement. Les autres lignes restent des propositions.

## 3. Transfert hors Québec (EFVP à compléter)

Fournisseurs qui reçoivent des renseignements de demandes, avec le lieu de traitement à confirmer dans leurs contrats ou documentations :

| Fournisseur | Rôle | Renseignements transmis | Lieu à confirmer |
|---|---|---|---|
| Vercel | Hébergement du site et route de réception | Contenu du formulaire, transitoire | États-Unis probable |
| Cloudflare | Tunnel vers le serveur n8n | Contenu transitoire, en-têtes | Mondial |
| HubSpot | CRM | Contact, transaction, tâches | Centre de données nord-américain (portail `app-na3`) |
| Apple (iCloud Mail) | Courriels sortants et entrants | Courriel, contenu des échanges | États-Unis probable |
| NEOXIX (n8n auto-hébergé) | Traitement | Toutes les données du circuit | Infrastructure de NEOXIX |

Points à établir pour l'EFVP :
- sensibilité des renseignements (coordonnées et description de besoin, pas de renseignement sensible déclaré) ;
- finalité et proportionnalité ;
- mesures de protection : signature HMAC, fenêtre de 300 s, dédoublonnage, limitation de débit, absence de journalisation du contenu, secrets hors dépôt ;
- mesures contractuelles avec chaque fournisseur (DPA ou équivalent) : **à obtenir** ;
- conclusion : décision à prendre après validation juridique.

## 4. Consentement (texte proposé, à valider)

> J'accepte que NEOXIX utilise les renseignements de ce formulaire pour répondre à ma demande et préparer une proposition. Ils sont conservés au plus 12 mois après le dernier échange lorsqu'aucune suite n'est donnée, ne sont ni vendus ni partagés à des fins commerciales, et peuvent être traités hors du Québec par nos fournisseurs (hébergement, automatisation). Voir la politique de confidentialité.

## 5. Décisions encore ouvertes

1. Nom ou titre du responsable.
2. Durée de conservation des courriels iCloud.
3. Contrats de traitement avec les fournisseurs et lieux de traitement confirmés.
4. Conclusion de l'EFVP et validation juridique de la politique et du consentement.
5. Durée de conservation des clients avec mandat (et des pièces) : proposition à valider.
