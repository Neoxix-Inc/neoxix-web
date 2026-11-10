// @ts-check
/**
 * Essai du circuit réel neoxix.ca → n8n → HubSpot avec des données fictives, puis nettoyage.
 *
 *   N8N_WEBHOOK_URL=https://hooks.neoxix.ca/webhook/neoxix-lead-intake \
 *   NEOXIX_INTAKE_HMAC_SECRET=… HUBSPOT_TOKEN=… \
 *   node automation/tests/circuit-reel.mjs [--via-site] [--garder]
 *
 * --via-site : envoie aussi une demande par https://neoxix.ca/api/demandes (formulaire actif requis ; consomme 1 des 5 envois/10 min).
 * --garder   : ne supprime pas les enregistrements d'essai (sinon : tâches, transactions et contact archivés).
 * Aucun secret n'est affiché. Les enregistrements d'essai portent le nom « TEST NEOXIX (à supprimer) ».
 */
import crypto from "node:crypto";

const URL_WEBHOOK = process.env.N8N_WEBHOOK_URL ?? "";
const SECRET = process.env.NEOXIX_INTAKE_HMAC_SECRET ?? "";
const JETON = process.env.HUBSPOT_TOKEN ?? "";
const VIA_SITE = process.argv.includes("--via-site");
const GARDER = process.argv.includes("--garder");
if (!URL_WEBHOOK.startsWith("https://") || SECRET.length < 32 || !JETON) {
  console.error("Variables requises : N8N_WEBHOOK_URL (https), NEOXIX_INTAKE_HMAC_SECRET (≥ 32), HUBSPOT_TOKEN. Rien n'a été fait.");
  process.exit(2);
}

const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const stamp = Date.now();
const COURRIEL = `test.leadflow+${stamp}@example.com`;
const resultats = /** @type {[string, boolean, string][]} */ ([]);
const noter = (nom, ok, detail = "") => {
  resultats.push([nom, ok, detail]);
  console.log(`${ok ? "RÉUSSI" : "ÉCHEC "} · ${nom}${detail ? ` · ${detail}` : ""}`);
};

function message(eventId) {
  const code = Array.from(crypto.randomBytes(6), (b) => ALPHABET[b % ALPHABET.length]).join("");
  return {
    event: "service_request.created",
    eventId,
    occurredAt: new Date().toISOString(),
    reference: `NX-${new Date().getUTCFullYear()}-${code}`,
    environment: "staging",
    request: {
      service: "automatisation-demandes",
      objectif: "Essai technique du circuit LeadFlow.",
      lieu: "Gatineau",
      description: "Demande fictive envoyée par automation/tests/circuit-reel.mjs.",
      nom: "TEST NEOXIX (à supprimer)",
      courriel: COURRIEL,
      telephone: "",
      preference: "courriel",
      consentement: true,
      consentements: { traitement: true, marketing: false, versionTexte: "essai" },
    },
    meta: { langue: "fr-CA", source: "essai", dureeRemplissageMs: 5000 },
  };
}

/** @param {object} corpsObjet @param {{ secret?: string, decalageS?: number }} [o] */
async function envoyer(corpsObjet, o = {}) {
  const corps = JSON.stringify(corpsObjet);
  const ts = String(Math.floor(Date.now() / 1000) + (o.decalageS ?? 0));
  const sig = "sha256=" + crypto.createHmac("sha256", o.secret ?? SECRET).update(`${ts}.${corps}`).digest("hex");
  const r = await fetch(URL_WEBHOOK, {
    method: "POST",
    headers: { "content-type": "application/json", "x-neoxix-signature": sig, "x-neoxix-timestamp": ts },
    body: corps,
    signal: AbortSignal.timeout(15_000),
  });
  return { statut: r.status, corps: await r.json().catch(() => ({})) };
}

/** @param {string} chemin @param {RequestInit} [init] */
async function hs(chemin, init = {}) {
  const r = await fetch("https://api.hubapi.com" + chemin, {
    ...init,
    headers: { authorization: `Bearer ${JETON}`, "content-type": "application/json" },
  });
  if (r.status === 204) return null;
  const j = await r.json().catch(() => null);
  if (!r.ok) throw new Error(`HubSpot ${r.status} ${j?.message ?? ""}`);
  return j;
}
const chercher = (objet, propriete, valeur) =>
  hs(`/crm/v3/objects/${objet}/search`, { method: "POST", body: JSON.stringify({ filterGroups: [{ filters: [{ propertyName: propriete, operator: "EQ", value: valeur }] }], limit: 10 }) });
const associes = (de, id, vers) => hs(`/crm/v4/objects/${de}/${id}/associations/${vers}`).then((j) => j.results ?? []);
const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

const crees = { deals: new Set(), tasks: new Set(), contacts: new Set() };

async function principal() {
  // 5 · Sécurité du webhook
  noter("signature invalide refusée", (await envoyer(message(crypto.randomUUID()), { secret: SECRET + "x" })).statut === 401);
  noter("message expiré refusé", (await envoyer(message(crypto.randomUUID()), { decalageS: -600 })).statut === 401);

  // 1 à 5 · Enregistrement
  const eventId = crypto.randomUUID();
  const m1 = message(eventId);
  const r1 = await envoyer(m1);
  noter("demande valide acceptée après enregistrement", r1.statut === 202 && r1.corps.statut === "enregistree", `HTTP ${r1.statut}`);
  await attendre(4000); // indexation de la recherche HubSpot
  const deals = (await chercher("deals", "neoxix_request_id", eventId)).results ?? [];
  noter("transaction créée (une seule)", deals.length === 1);
  const dealId = deals[0]?.id;
  if (dealId) crees.deals.add(dealId);
  const contacts = (await chercher("contacts", "email", COURRIEL)).results ?? [];
  noter("contact créé", contacts.length === 1);
  const contactId = contacts[0]?.id;
  if (contactId) crees.contacts.add(contactId);
  if (dealId) {
    const lies = await associes("deals", dealId, "contacts");
    noter("transaction associée au bon contact", lies.some((a) => String(a.toObjectId) === String(contactId)));
    const taches = await associes("deals", dealId, "tasks");
    taches.forEach((t) => crees.tasks.add(String(t.toObjectId)));
    noter("tâche de suivi créée", taches.length >= 1);
    const d = await hs(`/crm/v3/objects/deals/${dealId}?properties=dealstage,neoxix_reference`);
    noter("référence enregistrée", d.properties.neoxix_reference === m1.reference);

    // 6 · Doublon
    const r2 = await envoyer(m1);
    await attendre(3000);
    noter("envoi identique : aucun doublon", r2.statut === 202 && ((await chercher("deals", "neoxix_request_id", eventId)).results ?? []).length === 1, String(r2.corps.statut));

    // Reprise après échec partiel : la tâche disparaît, la nouvelle tentative la recrée sans nouvelle transaction.
    for (const t of taches) await hs(`/crm/v3/objects/tasks/${t.toObjectId}`, { method: "DELETE" });
    const r3 = await envoyer(m1);
    await attendre(3000);
    const tachesApres = await associes("deals", dealId, "tasks");
    tachesApres.forEach((t) => crees.tasks.add(String(t.toObjectId)));
    noter("reprise : tâche recréée, toujours une seule transaction", r3.statut === 202 && tachesApres.length >= 1 && ((await chercher("deals", "neoxix_request_id", eventId)).results ?? []).length === 1);
  }

  // 3 · Contact connu : nouvelle demande, même contact
  const eventId2 = crypto.randomUUID();
  const r4 = await envoyer({ ...message(eventId2) });
  await attendre(4000);
  const deals2 = (await chercher("deals", "neoxix_request_id", eventId2)).results ?? [];
  deals2.forEach((d) => crees.deals.add(d.id));
  const contacts2 = (await chercher("contacts", "email", COURRIEL)).results ?? [];
  noter("contact connu conservé, nouvelle transaction", r4.statut === 202 && contacts2.length === 1 && deals2.length === 1);
  for (const d of deals2) (await associes("deals", d.id, "tasks")).forEach((t) => crees.tasks.add(String(t.toObjectId)));

  // 8 · Par le site (formulaire actif)
  if (VIA_SITE) {
    const r = await fetch("https://neoxix.ca/api/demandes", {
      method: "POST",
      headers: { "content-type": "application/json", origin: "https://neoxix.ca" },
      body: JSON.stringify({ demande: { ...message("").request, consentements: undefined }, piege: "", dureeRemplissageMs: 6000, cle: crypto.randomUUID() }),
    });
    const j = await r.json().catch(() => ({}));
    noter("site : confirmation seulement après enregistrement", r.status === 202 && /^NX-/.test(j.reference ?? ""), `HTTP ${r.status}`);
    await attendre(4000);
    const viaSite = (await chercher("contacts", "email", COURRIEL)).results ?? [];
    for (const c of viaSite) for (const d of await associes("contacts", c.id, "deals")) crees.deals.add(String(d.toObjectId));
  }
}

async function nettoyer() {
  if (GARDER) return console.log("\nEnregistrements d'essai conservés (--garder).");
  for (const id of crees.deals) for (const t of await associes("deals", id, "tasks").catch(() => [])) crees.tasks.add(String(t.toObjectId));
  for (const [objet, ids] of [["tasks", crees.tasks], ["deals", crees.deals], ["contacts", crees.contacts]]) {
    for (const id of ids) await hs(`/crm/v3/objects/${objet}/${id}`, { method: "DELETE" }).catch(() => {});
  }
  console.log(`\nNettoyage : ${crees.tasks.size} tâche(s), ${crees.deals.size} transaction(s), ${crees.contacts.size} contact(s) archivés.`);
}

principal()
  .catch((e) => noter("exécution", false, e.message))
  .finally(async () => {
    await nettoyer();
    const echecs = resultats.filter(([, ok]) => !ok).length;
    console.log(`\n${resultats.length - echecs}/${resultats.length} vérifications réussies.`);
    process.exit(echecs ? 1 : 0);
  });
