// @ts-check
/**
 * Génère les définitions importables des workflows n8n à partir de la logique testée.
 *   node automation/n8n/construire.mjs
 * Sorties : automation/n8n/workflows/*.json (versionnées, sans aucun secret).
 * Les secrets restent dans n8n : identifiant HubSpot (credential « NEOXIX-HubSpot-CRM »), identifiant SMTP (« SMTP account »),
 * et variable d'environnement NEOXIX_INTAKE_HMAC_SECRET.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ici = dirname(fileURLToPath(import.meta.url));
const source = (nom) => readFileSync(join(ici, "logique", nom), "utf8").replace(/^\/\/ @ts-check\n/, "").replace(/^export /gm, "");
const INTAKE = source("intake.mjs");
const SUIVI = source("suivi.mjs");
const HUBSPOT = "https://api.hubapi.com";

/** Nœud Code : logique partagée + instructions propres au nœud. */
const code = (nom, position, corps, logique = INTAKE) => ({
  parameters: { jsCode: `${logique}\n// ─── Nœud « ${nom} » ───\n${corps.trim()}\n` },
  name: nom,
  type: "n8n-nodes-base.code",
  typeVersion: 2,
  position,
});

/** Appel HubSpot authentifié par la credential « NEOXIX-HubSpot-CRM » (Service Key ou jeton d'application privée). */
const hubspot = (nom, position, methode, url, corps, { erreurs = true } = {}) => ({
  parameters: {
    method: methode,
    url,
    authentication: "predefinedCredentialType",
    nodeCredentialType: "hubspotAppToken",
    sendBody: corps !== null,
    ...(corps !== null ? { specifyBody: "json", jsonBody: corps } : {}),
    options: { timeout: 8000 },
  },
  name: nom,
  type: "n8n-nodes-base.httpRequest",
  typeVersion: 4.2,
  position,
  credentials: { hubspotAppToken: { id: "REMPLACER_APRES_IMPORT", name: "NEOXIX-HubSpot-CRM" } },
  retryOnFail: true,
  maxTries: 3,
  waitBetweenTries: 1500,
  ...(erreurs ? { onError: "continueErrorOutput" } : {}),
});

const repondre = (nom, position, statut, corps) => ({
  parameters: {
    respondWith: "json",
    responseBody: corps,
    options: { responseCode: statut, responseHeaders: { entries: [{ name: "cache-control", value: "no-store" }] } },
  },
  name: nom,
  type: "n8n-nodes-base.respondToWebhook",
  typeVersion: 1.1,
  position,
});

const si = (nom, position, expression) => ({
  parameters: {
    conditions: {
      options: { caseSensitive: true, typeValidation: "loose" },
      conditions: [{ leftValue: expression, rightValue: true, operator: { type: "boolean", operation: "true", singleValue: true } }],
      combinator: "and",
    },
  },
  name: nom,
  type: "n8n-nodes-base.if",
  typeVersion: 2,
  position,
});

const courriel = (nom, position, vers, sujet, texte, desactive) => ({
  parameters: { fromEmail: "NEOXIX <info@neoxix.ca>", toEmail: vers, subject: sujet, emailFormat: "text", text: texte, options: { appendAttribution: false } },
  name: nom,
  type: "n8n-nodes-base.emailSend",
  typeVersion: 2.1,
  position,
  credentials: { smtp: { id: "REMPLACER_APRES_IMPORT", name: "SMTP account" } },
  disabled: desactive,
  onError: "continueRegularOutput",
});

/** Paramètres non secrets, à compléter après `automation/hubspot/configurer.mjs`. */
const configuration = (position, valeurs) => ({
  parameters: { mode: "raw", jsonOutput: JSON.stringify(valeurs, null, 2), options: {} },
  name: "Configuration",
  type: "n8n-nodes-base.set",
  typeVersion: 3.4,
  position,
});

const lien = (de, vers, sortie = 0) => ({ de, vers, sortie });
function connexions(liens) {
  /** @type {Record<string, { main: { node: string, type: string, index: number }[][] }>} */
  const c = {};
  for (const { de, vers, sortie } of liens) {
    c[de] ??= { main: [] };
    while (c[de].main.length <= sortie) c[de].main.push([]);
    c[de].main[sortie].push({ node: vers, type: "main", index: 0 });
  }
  return c;
}

const PARAMETRES_EXECUTION = {
  executionOrder: "v1",
  // Données personnelles : rien n'est conservé pour les exécutions réussies ; les échecs restent consultables
  // pour diagnostic et sont purgés par EXECUTIONS_DATA_MAX_AGE (voir README).
  saveDataSuccessExecution: "none",
  saveDataErrorExecution: "all",
  saveManualExecutions: false,
  saveExecutionProgress: false,
  timezone: "America/Toronto",
};

// ───────────────────────── Workflow 1 : réception des demandes ─────────────────────────
const CONFIG_INTAKE = {
  pipelineId: "À_COMPLÉTER",
  etapeNouvelleDemande: "À_COMPLÉTER",
  proprietaireId: "",
  portailId: "À_COMPLÉTER",
  notificationVers: "info@neoxix.ca",
};

const intake = {
  name: "NEOXIX — Lead Intake — Website to HubSpot",
  nodes: [
    {
      parameters: { httpMethod: "POST", path: "neoxix-lead-intake", responseMode: "responseNode", options: { rawBody: true } },
      name: "Webhook neoxix.ca",
      type: "n8n-nodes-base.webhook",
      typeVersion: 2,
      position: [0, 300],
      webhookId: "neoxix-lead-intake",
    },
    code(
      "Vérifier et normaliser",
      [220, 300],
      `
const crypto = require('crypto');
const item = $input.first();
const tampon = await this.helpers.getBinaryDataBuffer(0, 'data');
const corpsBrut = tampon.toString('utf8');
const verif = verifierSignature({
  corpsBrut,
  entetes: item.json.headers ?? {},
  secret: $env.NEOXIX_INTAKE_HMAC_SECRET ?? '',
  maintenantS: Math.floor(Date.now() / 1000),
  crypto,
});
if (!verif.ok) return [{ json: { valide: false, code: verif.code } }];
let message;
try { message = JSON.parse(corpsBrut); } catch { return [{ json: { valide: false, code: 'json' } }]; }
const n = normaliserDemande(message);
if (!n.ok) return [{ json: { valide: false, code: n.code } }];
// Seule la demande normalisée continue : le corps brut et les en-têtes ne sont pas propagés.
return [{ json: { valide: true, demande: n.demande } }];
`,
    ),
    si("Requête valide ?", [440, 300], "={{ $json.valide }}"),
    repondre("Refuser (401)", [660, 520], 401, '={"erreur":"non_autorise"}'),
    configuration([660, 200], CONFIG_INTAKE),
    hubspot(
      "HubSpot · Demande déjà enregistrée ?",
      [880, 200],
      "POST",
      `${HUBSPOT}/crm/v3/objects/deals/search`,
      `={{ JSON.stringify({ filterGroups: [{ filters: [{ propertyName: 'neoxix_request_id', operator: 'EQ', value: $('Vérifier et normaliser').first().json.demande.eventId }] }], properties: ['neoxix_reference'], limit: 1 }) }}`,
    ),
    si("Doublon ?", [1100, 120], "={{ $json.total > 0 }}"),
    repondre(
      "Confirmer (doublon)",
      [1320, 0],
      202,
      `={{ JSON.stringify({ statut: 'deja_enregistree', reference: $('Vérifier et normaliser').first().json.demande.reference }) }}`,
    ),
    hubspot(
      "HubSpot · Chercher le contact",
      [1320, 200],
      "POST",
      `${HUBSPOT}/crm/v3/objects/contacts/search`,
      `={{ JSON.stringify({ filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: $('Vérifier et normaliser').first().json.demande.courriel }] }], properties: ['firstname', 'phone', 'city'], limit: 1 }) }}`,
    ),
    code(
      "Préparer le contact",
      [1540, 200],
      `
const d = $('Vérifier et normaliser').first().json.demande;
const existant = ($input.first().json.results ?? [])[0] ?? null;
return [{ json: preparerContact(d, existant) }];
`,
    ),
    hubspot(
      "HubSpot · Créer ou compléter le contact",
      [1760, 200],
      "={{ { creer: 'POST', completer: 'PATCH', aucune: 'GET' }[$json.action] }}",
      `={{ '${HUBSPOT}/crm/v3/objects/contacts' + ($json.action === 'creer' ? '' : '/' + $json.id) }}`,
      "={{ JSON.stringify({ properties: $json.properties }) }}",
    ),
    hubspot(
      "HubSpot · Créer la transaction",
      [1980, 200],
      "POST",
      `${HUBSPOT}/crm/v3/objects/deals`,
      "={{ JSON.stringify({ properties: $json.properties, associations: $json.associations }) }}",
    ),
    code(
      "Corps de la transaction",
      [1870, 60],
      `
const d = $('Vérifier et normaliser').first().json.demande;
const config = $('Configuration').first().json;
const contactId = String($input.first().json.id);
return [{ json: { ...preparerTransaction(d, contactId, config), contactId } }];
`,
    ),
    code(
      "Préparer la tâche et les messages",
      [2200, 200],
      `
const d = $('Vérifier et normaliser').first().json.demande;
const config = $('Configuration').first().json;
const dealId = String($input.first().json.id);
const contactId = $('Corps de la transaction').first().json.contactId;
const tache = preparerTache(
  'Traiter la demande ' + d.reference + ' (' + d.serviceLibelle + ')',
  resume(d, 600) + '\\n\\nÉtape suivante : analyser le besoin, puis passer la transaction à « Besoin analysé ».',
  dealId, contactId, config, echeanceOuvrable(new Date(), 1),
);
return [{ json: { dealId, tache, notification: notificationInterne(d, dealId, config), accuse: accuseReception(d), courriel: d.courriel } }];
`,
    ),
    hubspot("HubSpot · Créer la tâche de suivi", [2420, 200], "POST", `${HUBSPOT}/crm/v3/objects/tasks`, "={{ JSON.stringify($json.tache) }}"),
    repondre(
      "Confirmer (enregistrée)",
      [2640, 200],
      202,
      `={{ JSON.stringify({ statut: 'enregistree', reference: $('Vérifier et normaliser').first().json.demande.reference }) }}`,
    ),
    courriel(
      "Notification interne",
      [2860, 120],
      "={{ $('Configuration').first().json.notificationVers }}",
      "={{ $('Préparer la tâche et les messages').first().json.notification.sujet }}",
      "={{ $('Préparer la tâche et les messages').first().json.notification.texte }}",
    ),
    courriel(
      "Accusé de réception",
      [2860, 300],
      "={{ $('Préparer la tâche et les messages').first().json.courriel }}",
      "={{ $('Préparer la tâche et les messages').first().json.accuse.sujet }}",
      "={{ $('Préparer la tâche et les messages').first().json.accuse.texte }}",
    ),
    // La tâche a échoué mais la transaction est enregistrée : la demande est durable, on confirme et on alerte.
    courriel(
      "Alerte : tâche non créée",
      [2640, 420],
      "={{ $('Configuration').first().json.notificationVers }}",
      "=Alerte NEOXIX : tâche de suivi non créée ({{ $('Vérifier et normaliser').first().json.demande.reference }})",
      "=La transaction {{ $('Préparer la tâche et les messages').first().json.dealId }} est enregistrée, mais la tâche de suivi n'a pas pu être créée. Créez-la manuellement dans HubSpot.",
    ),
    // Échec de la création : la transaction existe peut-être déjà (envoi concurrent, valeur unique). On revérifie.
    hubspot(
      "HubSpot · Revérifier après échec",
      [2200, 460],
      "POST",
      `${HUBSPOT}/crm/v3/objects/deals/search`,
      `={{ JSON.stringify({ filterGroups: [{ filters: [{ propertyName: 'neoxix_request_id', operator: 'EQ', value: $('Vérifier et normaliser').first().json.demande.eventId }] }], limit: 1 }) }}`,
    ),
    si("Enregistrée malgré l'erreur ?", [2420, 460], "={{ $json.total > 0 }}"),
    // Reprise : la transaction existe déjà ; on vérifie qu'une tâche de suivi y est associée.
    code(
      "Transaction existante",
      [1320, -120],
      `
const items = $input.all();
const recherche = items[0].json;
return [{ json: { dealId: String((recherche.results ?? [])[0]?.id ?? '') } }];
`,
    ),
    hubspot(
      "HubSpot · Tâches de la transaction",
      [1540, -120],
      "GET",
      `={{ '${HUBSPOT}/crm/v4/objects/deals/' + $json.dealId + '/associations/tasks' }}`,
      null,
    ),
    code(
      "Reprendre si nécessaire",
      [1760, -120],
      `
const d = $('Vérifier et normaliser').first().json.demande;
const config = $('Configuration').first().json;
const dealId = $('Transaction existante').first().json.dealId;
return [{ json: reprise(d, { results: [{ id: dealId }] }, $input.first().json, config) }];
`,
    ),
    si("Tâche manquante ?", [1980, -120], "={{ $json.tacheManquante }}"),
    hubspot("HubSpot · Recréer la tâche", [2200, -200], "POST", `${HUBSPOT}/crm/v3/objects/tasks`, "={{ JSON.stringify($json.tache) }}"),
    repondre(
      "Échec (503)",
      [2640, 640],
      503,
      '={"erreur":"indisponible"}',
    ),
  ],
  connections: connexions([
    lien("Webhook neoxix.ca", "Vérifier et normaliser"),
    lien("Vérifier et normaliser", "Requête valide ?"),
    lien("Requête valide ?", "Configuration", 0),
    lien("Requête valide ?", "Refuser (401)", 1),
    lien("Configuration", "HubSpot · Demande déjà enregistrée ?"),
    lien("HubSpot · Demande déjà enregistrée ?", "Doublon ?", 0),
    lien("HubSpot · Demande déjà enregistrée ?", "Échec (503)", 1),
    lien("Doublon ?", "Transaction existante", 0),
    lien("Transaction existante", "HubSpot · Tâches de la transaction"),
    lien("HubSpot · Tâches de la transaction", "Reprendre si nécessaire", 0),
    lien("HubSpot · Tâches de la transaction", "Confirmer (doublon)", 1),
    lien("Reprendre si nécessaire", "Tâche manquante ?"),
    lien("Tâche manquante ?", "HubSpot · Recréer la tâche", 0),
    lien("Tâche manquante ?", "Confirmer (doublon)", 1),
    lien("HubSpot · Recréer la tâche", "Confirmer (doublon)", 0),
    lien("HubSpot · Recréer la tâche", "Confirmer (doublon)", 1),
    lien("Doublon ?", "HubSpot · Chercher le contact", 1),
    lien("HubSpot · Chercher le contact", "Préparer le contact", 0),
    lien("HubSpot · Chercher le contact", "Échec (503)", 1),
    lien("Préparer le contact", "HubSpot · Créer ou compléter le contact"),
    lien("HubSpot · Créer ou compléter le contact", "Corps de la transaction", 0),
    lien("HubSpot · Créer ou compléter le contact", "Échec (503)", 1),
    lien("Corps de la transaction", "HubSpot · Créer la transaction"),
    lien("HubSpot · Créer la transaction", "Préparer la tâche et les messages", 0),
    lien("HubSpot · Créer la transaction", "HubSpot · Revérifier après échec", 1),
    lien("HubSpot · Revérifier après échec", "Enregistrée malgré l'erreur ?", 0),
    lien("HubSpot · Revérifier après échec", "Échec (503)", 1),
    lien("Enregistrée malgré l'erreur ?", "Transaction existante", 0),
    lien("Enregistrée malgré l'erreur ?", "Échec (503)", 1),
    lien("Préparer la tâche et les messages", "HubSpot · Créer la tâche de suivi"),
    lien("HubSpot · Créer la tâche de suivi", "Confirmer (enregistrée)", 0),
    lien("HubSpot · Créer la tâche de suivi", "Alerte : tâche non créée", 1),
    lien("Alerte : tâche non créée", "Confirmer (enregistrée)"),
    lien("Confirmer (enregistrée)", "Notification interne"),
    lien("Confirmer (enregistrée)", "Accusé de réception"),
  ]),
  settings: PARAMETRES_EXECUTION,
  active: false,
  tags: [],
};

// ───────────────────────── Workflow 2 : rappels quotidiens ─────────────────────────
const CONFIG_SUIVI = {
  pipelineId: "À_COMPLÉTER",
  etapes: { nouvelleDemande: "À_COMPLÉTER", devisEnPreparation: "À_COMPLÉTER", devisEnvoye: "À_COMPLÉTER" },
  joursNonExaminee: 1,
  joursDevisEnvoye: 5,
  joursEntreRappels: 3,
  proprietaireId: "",
  portailId: "À_COMPLÉTER",
  resumeVers: "info@neoxix.ca",
};

const suivi = {
  name: "NEOXIX — Suivi commercial — Rappels quotidiens",
  nodes: [
    {
      parameters: { rule: { interval: [{ field: "cronExpression", expression: "0 8 * * 1-5" }] } },
      name: "Chaque jour ouvrable à 8 h",
      type: "n8n-nodes-base.scheduleTrigger",
      typeVersion: 1.2,
      position: [0, 300],
    },
    configuration([220, 300], CONFIG_SUIVI),
    code(
      "Construire les recherches",
      [440, 300],
      `return recherchesSuivi($input.first().json, Date.now()).map((r) => ({ json: r }));`,
      SUIVI,
    ),
    hubspot("HubSpot · Rechercher les transactions", [660, 300], "POST", `${HUBSPOT}/crm/v3/objects/deals/search`, "={{ JSON.stringify($json.corps) }}", {
      erreurs: false,
    }),
    code(
      "Construire les tâches",
      [880, 300],
      `
const config = $('Configuration').first().json;
const recherches = $('Construire les recherches').all();
const maintenant = Date.now();
const echeance = new Date(maintenant + 2 * 3600 * 1000);
const taches = [], marquages = [], references = {};
$input.all().forEach((item, i) => {
  const regle = recherches[i].json.regle;
  const resultats = item.json.results ?? [];
  references[regle] = resultats.map((r) => r.properties.neoxix_reference || r.id);
  const lot = tachesSuivi(regle, resultats, config, echeance, maintenant);
  taches.push(...lot.taches); marquages.push(...lot.marquages);
});
return [{ json: { taches, marquages, resume: resumeQuotidien(references, config, new Date(maintenant).toISOString()), aFaire: taches.length > 0 } }];
`,
      SUIVI,
    ),
    si("Des actions ?", [1100, 300], "={{ $json.aFaire }}"),
    hubspot(
      "HubSpot · Créer les tâches",
      [1320, 200],
      "POST",
      `${HUBSPOT}/crm/v3/objects/tasks/batch/create`,
      "={{ JSON.stringify({ inputs: $json.taches }) }}",
      { erreurs: false },
    ),
    hubspot(
      "HubSpot · Marquer les transactions",
      [1540, 200],
      "POST",
      `${HUBSPOT}/crm/v3/objects/deals/batch/update`,
      "={{ JSON.stringify({ inputs: $('Construire les tâches').first().json.marquages }) }}",
      { erreurs: false },
    ),
    courriel(
      "Résumé quotidien (sans données personnelles)",
      [1760, 200],
      "={{ $('Configuration').first().json.resumeVers }}",
      "={{ $('Construire les tâches').first().json.resume.sujet }}",
      "={{ $('Construire les tâches').first().json.resume.texte }}",
      true,
    ),
  ],
  connections: connexions([
    lien("Chaque jour ouvrable à 8 h", "Configuration"),
    lien("Configuration", "Construire les recherches"),
    lien("Construire les recherches", "HubSpot · Rechercher les transactions"),
    lien("HubSpot · Rechercher les transactions", "Construire les tâches"),
    lien("Construire les tâches", "Des actions ?"),
    lien("Des actions ?", "HubSpot · Créer les tâches", 0),
    lien("HubSpot · Créer les tâches", "HubSpot · Marquer les transactions"),
    lien("HubSpot · Marquer les transactions", "Résumé quotidien (sans données personnelles)"),
  ]),
  settings: { ...PARAMETRES_EXECUTION, saveDataSuccessExecution: "none" },
  active: false,
  tags: [],
};

mkdirSync(join(ici, "workflows"), { recursive: true });
for (const [fichier, wf] of [
  ["lead-intake-website-to-hubspot.json", intake],
  ["suivi-commercial-rappels-quotidiens.json", suivi],
]) {
  writeFileSync(join(ici, "workflows", fichier), JSON.stringify(wf, null, 2) + "\n");
  console.log(`écrit : automation/n8n/workflows/${fichier} (${wf.nodes.length} nœuds)`);
}
export { intake, suivi };
