# NEOXIX · Modèles de courriels

Règles de cette première phase :

- **A** (accusé de réception) peut partir automatiquement, mais seulement quand l'envoi SMTP est configuré et testé. Le nœud est désactivé par défaut.
- **B** (notification interne) part vers `info@neoxix.ca`. Elle ne contient ni le courriel ni le téléphone du prospect.
- **C** (réponses commerciales) sont des **brouillons**. Une personne les personnalise, les relit, puis les envoie elle-même. Aucun prix, devis, délai ou engagement technique n'est envoyé automatiquement.
- Aucun outil d'IA ne reçoit de renseignements clients tant que ses conditions de traitement (lieu, conservation, réutilisation pour l'entraînement) n'ont pas été vérifiées et approuvées.

Les champs entre accolades (`{reference}`) sont remplis à partir de la transaction HubSpot.

---

## A. Accusé de réception (automatique, une fois l'envoi validé)

**Objet :** NEOXIX · Demande reçue ({reference})

> Bonjour,
>
> Nous avons bien reçu votre demande concernant {service}.
>
> Votre référence est {reference}.
>
> Nous allons examiner les informations transmises et vous recontacter pour préciser votre besoin.
>
> L'équipe NEOXIX
> info@neoxix.ca · https://neoxix.ca

Le texte est généré par `accuseReception()` (`automation/n8n/logique/intake.mjs`).

## B. Notification interne (automatique)

**Objet :** Nouvelle demande {reference} · {service}

> Référence : {reference}
> Service : {service}
> Nom et organisation : {nom}
> Reçue le : {date}
> Résumé : {280 premiers caractères}
>
> Transaction HubSpot : {lien}

Le texte est généré par `notificationInterne()`. Les coordonnées complètes restent dans HubSpot.

---

## C. Réponses commerciales (brouillons à valider)

### C1. Demande d'informations complémentaires

**Objet :** Votre demande {reference} · quelques précisions

> Bonjour {prénom},
>
> Merci pour votre demande concernant {service}. Pour vous proposer une approche adaptée, pourriez-vous préciser les points suivants :
>
> - {question 1, par exemple : les outils que vous utilisez aujourd'hui}
> - {question 2, par exemple : le nombre de personnes concernées}
> - {question 3, par exemple : l'échéance que vous visez}
>
> Inutile de nous transmettre des mots de passe ou des accès : nous les demanderons, si nécessaire, par un canal sécurisé.
>
> Bonne journée,
> {signature}

### C2. Proposition de rendez-vous

**Objet :** Votre demande {reference} · échange de 30 minutes

> Bonjour {prénom},
>
> Votre demande concernant {service} est claire. Le plus simple est d'en discuter de vive voix pendant une trentaine de minutes, sans engagement de votre part.
>
> Je vous propose les créneaux suivants :
>
> - {créneau 1}
> - {créneau 2}
>
> L'échange peut se faire par téléphone ou en visioconférence. Si aucun créneau ne vous convient, indiquez-moi vos disponibilités.
>
> Bonne journée,
> {signature}

### C3. Réponse à une demande de devis

**Objet :** Proposition NEOXIX · {reference}

> Bonjour {prénom},
>
> Vous trouverez ci-joint notre proposition écrite pour {objet du mandat}. Elle précise le périmètre, les étapes, ce qui est inclus et exclu, ainsi que le prix.
>
> Elle reste valable jusqu'au {date}. Je reste disponible pour la passer en revue avec vous et l'ajuster si votre besoin évolue.
>
> Bonne journée,
> {signature}

*Le devis lui-même est rédigé et vérifié à la main. Ce message ne part jamais sans pièce jointe validée.*

### C4. Relance d'une demande sans réponse

**Objet :** Votre demande {reference} · suite

> Bonjour {prénom},
>
> Je reviens vers vous au sujet de votre demande concernant {service}. Avez-vous eu l'occasion de prendre connaissance de mon dernier message ?
>
> Si le moment n'est pas le bon, aucun souci : dites-le-moi simplement et je classerai la demande. Vous pourrez nous écrire de nouveau à tout moment.
>
> Bonne journée,
> {signature}

### C5. Suivi après une discussion commerciale

**Objet :** Suite à notre échange · {reference}

> Bonjour {prénom},
>
> Merci pour notre échange du {date}. Voici ce que je retiens :
>
> - Besoin : {résumé}
> - Points à confirmer : {liste}
> - Prochaine étape : {par exemple, l'envoi d'une proposition écrite d'ici le {date convenue}}
>
> N'hésitez pas à corriger ou compléter ces éléments.
>
> Bonne journée,
> {signature}
