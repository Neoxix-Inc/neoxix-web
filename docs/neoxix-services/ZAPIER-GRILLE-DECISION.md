# Grille de décision interne : n8n ou Zapier

**Documentation interne. Non publiée. Ne constitue pas une promesse de résultat.**

## Principe

- **n8n** reste l'orchestrateur principal de NEOXIX pour ses services et automatisations internes.
- **Zapier** est une option étudiée pour des intégrations SaaS de clients PME, selon le besoin.
- Le choix dépend du besoin réel. Aucune technologie n'est imposée.
- Aucun compte Zapier client, connexion OAuth, webhook ou credential n'est autorisé à ce stade.
- Ne jamais brancher Zapier directement aux interfaces administratives privées (Proxmox, FortiGate, Synology, Active Directory).

## Tableau de décision

| Critère | Questions à poser | Penche vers n8n si… | Penche vers Zapier si… |
|---|---|---|---|
| Applications à connecter | Quels outils, quelles versions ? | Outils internes ou peu courants | Outils SaaS grand public |
| Connecteurs disponibles | Un connecteur natif existe-t-il pour chaque étape ? | Connecteurs absents ou insuffisants | Connecteurs natifs suffisants |
| Volume (tâches ou exécutions) | Nombre approximatif par mois | Volume élevé ou variable | Volume modeste et prévisible |
| Complexité | Branchements, boucles, transformations | Logique complexe ou API personnalisées | Workflow linéaire et simple |
| Maintenance | Qui maintient après la remise ? | Maintenance assurée par NEOXIX | Maintenance simple, documentée |
| Budget | Coût d'implémentation et de mise à jour | Coût total inférieur sur la durée | Mise en place rapide, coût récurrent acceptable |
| Coûts récurrents | Abonnement, tâches, licences | Coût fixe maîtrisé | Coût variable acceptable (vérifié sur la documentation Zapier) |
| Confidentialité | Renseignements personnels traités ? | Données devant rester maîtrisées | Données non sensibles, ou évaluation faite |
| Localisation et transfert | Où les données transitent-elles ? | Hébergement contrôlé requis | Transfert hors Québec accepté après évaluation |
| Accès et permissions | Quels droits donne-t-on à l'outil ? | Permissions fines requises | Permissions standard suffisantes |
| Gestion des erreurs | Reprise, alertes, journalisation | Surveillance et reprise exigées | Alertes natives suffisantes |
| Réversibilité | Peut-on changer de technologie ? | Export des workflows nécessaire | Exports et reprise documentés |
| Hébergement interne | Besoin d'exécuter localement ? | Oui | Non |

## Procédure

1. Recueillir les applications, les volumes et les données traitées.
2. Vérifier les connecteurs et les limites de formule sur la documentation officielle du fournisseur, à la date de la proposition.
3. Remplir la grille ; retenir la technologie qui répond au besoin à coût et risque égaux.
4. Documenter le choix dans la proposition écrite.
5. Si des renseignements personnels de clients québécois sont traités avec un service cloud tiers : évaluer les facteurs relatifs à la vie privée lorsque requis (Loi 25), notamment pour les communications hors Québec.

## Règles commerciales

- Honoraires NEOXIX, abonnement Zapier, consommation de tâches et autres SaaS sont facturés séparément.
- Aucun tarif Zapier chiffré n'est publié ni inscrit au catalogue NEOXIX.
- Aucune garantie de disponibilité de connecteur ou de fonctionnalité sur une formule gratuite.
- Aucun logo Zapier sans vérification des règles de marque du fournisseur.
- Ne pas présenter Zapier comme supérieur à n8n dans tous les cas, ni n8n comme nécessaire à toute automatisation.
