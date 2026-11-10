# NEOXIX · Recette V5-RECETTE-01

Date : 10 novembre 2026 · Branche `feat/services-platform` · Base vérifiée : `ae25f2f` · Statut : **prévisualisation seulement**.

## 1. Déploiement Vercel

| Contrôle | Résultat | Source |
|---|---|---|
| Commit déployé | `ae25f2f24ef4d8232acbee2c3df51c2b0681e1c8`, environnement Preview | API GitHub, déploiement 7669950291 |
| Statut du build | `success` (« Deployment has completed ») | statut de commit « Vercel » |
| Protection | l'alias de branche répond 302 vers la connexion Vercel | requête anonyme |
| Journaux de build, réglages de protection, jetons de contournement | **non vérifiés** : le jeton du CLI Vercel local est expiré (`invalidToken`) | API Vercel |
| Routes, polices, formulaire sur le déploiement distant | **non vérifiés** (accès authentifié requis ; aucun jeton de contournement créé) | — |

Aucun contournement n'a été créé pendant cette mission. La page d'inspection est à l'adresse :
`https://vercel.com/admin-15752192s-projects/neoxix-web/8CtLwQYGz2puhFRUQDzghayjVyrH`.

### Vérification à faire par le propriétaire (environ 10 minutes, connecté à Vercel)

1. Projet `neoxix-web` › Deployments : le déploiement Preview le plus récent de `feat/services-platform` est « Ready », et son commit correspond au dernier commit de la branche.
2. Ouvrez-le, onglet **Build Logs** : aucune erreur, et aucun avertissement autre que ceux de Next.js.
3. Settings › **Deployment Protection** :
   - « Vercel Authentication » est actif pour les Preview ;
   - « Protection Bypass for Automation » ne contient **aucun** secret ; supprimez celui créé par `vercel curl` s'il existe encore (CLEANUP-002) ;
   - « Shareable Links » ne contient aucun lien actif non voulu.
4. Settings › Environment Variables : en Preview et en Production, `INTAKE_MODE` est absent ou vaut `mock`. `N8N_*` est absent, et `INTAKE_DEBIT_PAR_IP` aussi. Depuis ce lot, cette dernière variable est de toute façon ignorée sur Vercel.
5. Dans le navigateur connecté, parcourez `/`, `/services`, `/services/infrastructure`, `/methode`, `/contact` et une adresse inconnue (404 attendue). Dans les outils de développement, onglet Réseau, vérifiez qu'il n'y a aucune erreur 4xx ou 5xx sur les ressources, que les polices (`/_next/static/media/*.woff2`) répondent 200 et qu'aucune requête ne part vers un domaine tiers.
6. Soumettez LeadFlow avec des données fictives (`Camille Test`, `camille.test@example.com`). Résultats attendus :
   - la réponse de `POST /api/demandes` est 202 ;
   - la référence commence par `TEST-` ;
   - la mention « Mode test » est visible.

   Dans Logs (Runtime), seule la ligne de requête doit apparaître : aucun contenu du formulaire.

## 2. Revue de sécurité LeadFlow

| Point | État |
|---|---|
| Validation Zod | Les mêmes schémas sont utilisés côté client et côté serveur, avec des longueurs maximales et une détection des secrets collés. Conforme. |
| Origine | `Origin` doit désigner le même hôte (`x-forwarded-host`, fourni par Vercel) ou une valeur de `INTAKE_ORIGINES`. Une requête sans `Origin` est refusée. Conforme. |
| Adresse IP | **Corrigé** : priorité à `x-vercel-forwarded-for`, puis `x-real-ip`, puis `x-forwarded-for`. Ces en-têtes sont réécrits par Vercel. |
| `INTAKE_DEBIT_PAR_IP` | **Corrigé** : la variable est ignorée dès que `VERCEL` est défini (preview et production). Le test unitaire correspondant a été ajouté. |
| Limite entre instances | **Non résolu** : le compteur est en mémoire et propre à chaque instance. Voir la proposition ci-dessous. |
| Anti-abus | Champ piège, durée minimale de 3 s, réponse 202 factice aux robots, 32 Ko maximum, JSON obligatoire. Limite connue : la durée est déclarée par le navigateur, donc un robot ciblé peut la falsifier. |
| Soumissions multiples | Bouton inactif pendant l'envoi. La clé d'idempotence reste la même en cas de nouvelle tentative, ce qui donne la même référence et le même `eventId`. La déduplication réelle se fera côté n8n sur `eventId`. |
| Journaux | Aucun appel `console` dans `src` ; le contenu des demandes n'est jamais journalisé. |
| Erreurs et délais | Délai de 5 s vers n8n. Toute erreur renvoie 503 sans détail, et le formulaire propose alors le courriel tout en gardant la saisie. |
| HMAC | **Corrigé** : `live` exige un webhook en `https:` et un secret d'au moins 32 caractères, sinon la route répond 503. `redirect: "error"` empêche d'envoyer la demande signée vers une autre adresse. La signature est calculée sur `horodatage.corps`. |
| n8n indisponible | Réponse 503, invitation à écrire par courriel, aucune perte de saisie (test de bout en bout « réseau coupé »). |
| Mode | `INTAKE_MODE=mock` conservé par défaut. |

### Proposition : limite d'envois partagée entre instances (sans nouveau service payant)

1. **Règle de limitation du pare-feu Vercel (WAF)** sur `POST /api/demandes`, par exemple 5 requêtes par IP sur 10 minutes, puis refus. La règle se règle dans le tableau de bord, sans code ni dépendance, et s'applique avant la fonction. Vérifiez d'abord que la limitation de débit est incluse dans le forfait actuel.
2. **Cloudflare Turnstile** (gratuit) sur l'étape 2, vérifié côté serveur. Il remplace le contrôle de durée, qui peut être falsifié. Il faudrait autoriser `challenges.cloudflare.com` dans la CSP et mettre à jour la politique de confidentialité.
3. **Déduplication dans n8n** sur `eventId`, dans son propre stockage, à prévoir avant l'activation de `live`.

Le compteur en mémoire reste en place comme protection de secours. Un magasin Redis (Upstash ou autre) n'est pas proposé, car il ajouterait un fournisseur qui demande votre autorisation.

## 3. Qualité fonctionnelle

- Les 4 pôles sont présents dans le contenu et sur leurs pages : sites web, automatisation, infrastructure, applications.
- Statuts : Ivoire Connect « En développement ». NEOXIX LeadFlow apparaît comme « Concept en conception · non commercialisé » (Solutions) et « En conception » (Réalisations). Les autres solutions sont « sur devis ».
- Le mode test est signalé par le bandeau « Mode test. », la confirmation « Demande valide (mode test) », la FAQ et la page confidentialité.
- Mouvement réduit et clavier : couverts par `mouvement.spec.ts` et `accessibilite.spec.ts`, qui ont réussi lors du lot précédent et ne sont pas touchés par ce lot.
- Aucune adresse personnelle, aucun secret ni jeton dans `src`, `public` et `next.config.ts`. Les cartes de source navigateur sont désactivées (réglage par défaut).
- **Décision ouverte, section « Trois questions »** : elle a été retirée en V5 sans approbation explicite. La version précédente est conservée à l'étiquette Git `avant-v5`, qui pointe sur `ef738ad`. Les éléments utiles sont `src/content/fr/index.ts` (l. 65, bloc `surtitre: "Trois questions"`) et `src/app/(vitrine)/vitrine.css` (l. 177). Pour les restaurer : `git show avant-v5:src/content/fr/index.ts`.

## 4. Ressources graphiques (Google Drive `NEOXIX/NEOXIX-VISUAL-ASSETS`)

**Inventaire non réalisé.** Le connecteur Google Drive a échoué : « Incompatible auth server: does not support dynamic client registration ». Aucun actif n'a été intégré et le logo reste inchangé ; le candidat A n'est pas approuvé.

À faire : reconnecter Google Drive dans Claude, ou déposer une copie du dossier dans `design/assets/`. L'inventaire suivra ces règles : pour chaque fichier, licence et source, statut d'approbation, page visée (Services, Solutions ou Réalisations), et aucune illustration conceptuelle associée à une fonction présentée comme opérationnelle.

## 5. Erreurs de hooks Claude Code

Ces hooks ne viennent **pas** du projet : celui-ci n'a pas de `.claude/settings.json`. Ils viennent de plugins installés au niveau utilisateur, donc hors du périmètre autorisé. Rien n'a été modifié.

- **`python` absent** : le plugin `backend-design` appelle `python "${CLAUDE_PLUGIN_ROOT}/hooks/check_*.py"`, alors que seul `python3` existe sur le poste. Deux corrections possibles, à vous de choisir :
  - `sudo apt install python-is-python3` ;
  - désactiver le plugin `backend-design` pour ce projet.

  Modifier le plugin lui-même ne servirait à rien : il est synchronisé et serait écrasé.
- **JSON mal formé au `SessionStart:compact`** : les deux hooks concernés (`superpowers` et `hawkscan`) ont été relancés avec `source: compact` et produisent aujourd'hui un JSON valide. L'erreur n'a pas pu être reproduite ; elle venait probablement d'une ancienne version synchronisée du plugin.

## 6. Recette sur appareils réels (propriétaire)

Les tests de bout en bout ont tous tourné dans Chromium en émulation. Les étapes suivantes doivent être faites sur de vrais appareils.

**iPad Pro (Safari, portrait puis paysage)**
1. Connectez-vous à Vercel dans Safari, puis ouvrez l'alias de prévisualisation.
2. Accueil :
   - l'en-tête est complet en paysage (1194 px) ;
   - en portrait (834 px), le bouton Menu s'ouvre, se ferme avec un toucher à l'extérieur, et les liens mènent bien à leurs sections ;
   - le schéma du héros s'anime et le bouton pause l'arrête.
3. Réglages › Accessibilité › Mouvement › Réduire les animations, puis rechargez : aucune animation.
4. Services : ouvrez et refermez le détail de chaque pôle, puis suivez « Page complète du pôle ».
5. LeadFlow avec des données fictives :
   - laissez l'étape 1 vide : les erreurs s'affichent ;
   - remplissez-la, puis passez à l'étape 2 : le clavier n'empêche pas de voir le champ actif ;
   - envoyez : la référence `TEST-…` s'affiche ;
   - mettez l'appareil en mode Avion et renvoyez : le message d'erreur apparaît et la saisie est conservée.
6. Avec un clavier physique, s'il y en a un : la touche Tab parcourt la page dans l'ordre, et le focus ambre reste visible.

**Smartphone (iPhone Safari, et Android Chrome si possible)**
1. Mêmes étapes, en portrait. Vérifiez en plus :
   - aucun défilement horizontal ;
   - les cibles tactiles sont confortables ;
   - le bouton Menu est seul dans l'en-tête ;
   - les champs `tel` et `email` affichent le clavier adapté.
2. Rotation en paysage pendant l'étape 2 : la saisie est conservée.
3. Notez le modèle et la version du système de chaque appareil, avec une capture des éventuels défauts.

## 7. Recommandation

**Prêt pour votre validation en prévisualisation. Pas prêt pour une publication publique sur `neoxix.ca`.** Il reste à lever :
- les vérifications Vercel du § 1, faites avec votre session ;
- la recette sur appareils réels (§ 6) ;
- le texte de consentement et la politique de confidentialité (Loi 25) ;
- la décision sur « Trois questions » et le nom public de LeadFlow ;
- la limite d'envois partagée (WAF) avant tout passage en `live` ;
- le retrait du `noindex`.
