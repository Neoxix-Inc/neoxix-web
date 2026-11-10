// @ts-check
/**
 * Prépare le portail HubSpot existant pour LeadFlow (aucun nouveau portail, aucun pipeline créé).
 *
 *   HUBSPOT_TOKEN=… node automation/hubspot/configurer.mjs              # lecture seule : diagnostic
 *   HUBSPOT_TOKEN=… node automation/hubspot/configurer.mjs --appliquer  # crée les propriétés manquantes
 *   HUBSPOT_TOKEN=… node automation/hubspot/configurer.mjs --appliquer --verifier-ecriture
 *       # + crée puis archive une tâche d'essai pour confirmer la permission d'écriture des tâches
 *
 * Le jeton (Service Key ou application privée) est lu dans l'environnement et n'est jamais affiché.
 * Sortie : les identifiants non secrets à reporter dans les nœuds « Configuration » des workflows n8n.
 */

const JETON = process.env.HUBSPOT_TOKEN ?? "";
const APPLIQUER = process.argv.includes("--appliquer");
const VERIFIER_ECRITURE = process.argv.includes("--verifier-ecriture");
const API = "https://api.hubapi.com";

const PIPELINE = "NEOXIX — Services informatiques";
const ETAPES = {
  nouvelleDemande: "Nouvelle demande",
  besoinAnalyse: "Besoin analysé",
  devisEnPreparation: "Devis en préparation",
  devisEnvoye: "Devis envoyé",
  enDiscussion: "En discussion",
  gagne: "Gagné",
  perdu: "Perdu",
};

/** Propriétés personnalisées des transactions (groupe « NEOXIX »). */
const PROPRIETES = [
  { name: "neoxix_request_id", label: "NEOXIX · Identifiant de demande", type: "string", fieldType: "text", hasUniqueValue: true },
  { name: "neoxix_reference", label: "NEOXIX · Référence", type: "string", fieldType: "text" },
  {
    name: "neoxix_service",
    label: "NEOXIX · Service demandé",
    type: "enumeration",
    fieldType: "select",
    options: [
      ["presence-en-ligne", "Présence en ligne"],
      ["automatisation-demandes", "Automatisation des demandes"],
      ["gestion-clients", "Gestion des clients"],
      ["securisation-reseau", "Sécurisation du réseau"],
      ["outils-metiers", "Outils métiers"],
      ["indecis", "Je ne sais pas encore"],
    ].map(([value, label], displayOrder) => ({ value, label, displayOrder })),
  },
  { name: "neoxix_source", label: "NEOXIX · Source", type: "string", fieldType: "text" },
  { name: "neoxix_version_consentement", label: "NEOXIX · Version du consentement", type: "string", fieldType: "text" },
  { name: "neoxix_dernier_rappel", label: "NEOXIX · Dernier rappel interne", type: "datetime", fieldType: "date" },
];

/** @param {string} chemin @param {RequestInit} [init] */
async function hs(chemin, init = {}) {
  const r = await fetch(API + chemin, {
    ...init,
    headers: { authorization: `Bearer ${JETON}`, "content-type": "application/json", ...(init.headers ?? {}) },
  });
  const corps = r.status === 204 ? null : await r.json().catch(() => null);
  if (!r.ok) {
    const e = new Error(`${init.method ?? "GET"} ${chemin} → ${r.status} ${corps?.category ?? ""} ${corps?.message ?? ""}`.trim());
    Object.assign(e, { statut: r.status });
    throw e;
  }
  return corps;
}

const norme = (/** @type {string} */ t) => t.normalize("NFKC").replace(/[–—-]/g, "-").replace(/\s+/g, " ").trim().toLowerCase();

async function principal() {
  if (!JETON) {
    console.error("HUBSPOT_TOKEN manquant (Service Key ou jeton d'application privée). Rien n'a été fait.");
    process.exit(2);
  }
  const resultats = { permissions: /** @type {Record<string, string>} */ ({}) };

  const compte = await hs("/account-info/v3/details");
  console.log(`Portail HubSpot : ${compte.portalId} (fuseau ${compte.timeZone}, centre de données ${compte.dataHostingLocation ?? "non indiqué"})`);

  const pipelines = await hs("/crm/v3/pipelines/deals");
  const pipeline = pipelines.results.find((/** @type {any} */ p) => norme(p.label) === norme(PIPELINE));
  if (!pipeline) throw new Error(`Pipeline « ${PIPELINE} » introuvable. Pipelines présents : ${pipelines.results.map((/** @type {any} */ p) => p.label).join(", ")}`);
  /** @type {Record<string, string>} */
  const etapes = {};
  for (const [cle, libelle] of Object.entries(ETAPES)) {
    const e = pipeline.stages.find((/** @type {any} */ s) => norme(s.label) === norme(libelle));
    if (!e) throw new Error(`Étape « ${libelle} » introuvable dans le pipeline.`);
    etapes[cle] = e.id;
  }
  console.log(`Pipeline trouvé : ${pipeline.id}, ${Object.keys(etapes).length} étapes reconnues.`);

  for (const [objet, chemin] of [
    ["contacts (lecture)", "/crm/v3/objects/contacts?limit=1"],
    ["transactions (lecture)", "/crm/v3/objects/deals?limit=1"],
    ["tâches (lecture)", "/crm/v3/objects/tasks?limit=1"],
  ]) {
    try {
      await hs(chemin);
      resultats.permissions[objet] = "ok";
    } catch (e) {
      resultats.permissions[objet] = `refusé (${/** @type {any} */ (e).statut})`;
    }
  }

  const existantes = new Set((await hs("/crm/v3/properties/deals")).results.map((/** @type {any} */ p) => p.name));
  const manquantes = PROPRIETES.filter((p) => !existantes.has(p.name));
  console.log(`Propriétés NEOXIX : ${PROPRIETES.length - manquantes.length} présentes, ${manquantes.length} à créer.`);
  if (APPLIQUER && manquantes.length) {
    try {
      await hs("/crm/v3/properties/deals/groups", { method: "POST", body: JSON.stringify({ name: "neoxix", label: "NEOXIX", displayOrder: -1 }) });
    } catch (e) {
      if (/** @type {any} */ (e).statut !== 409) throw e;
    }
    for (const p of manquantes) {
      await hs("/crm/v3/properties/deals", { method: "POST", body: JSON.stringify({ ...p, groupName: "neoxix" }) });
      console.log(`  créée : ${p.name}${p.hasUniqueValue ? " (valeur unique)" : ""}`);
    }
  } else if (manquantes.length) {
    console.log("  (lecture seule : relancez avec --appliquer pour les créer)");
  }

  if (VERIFIER_ECRITURE) {
    const tache = await hs("/crm/v3/objects/tasks", {
      method: "POST",
      body: JSON.stringify({ properties: { hs_task_subject: "Essai de permission NEOXIX (à ignorer)", hs_timestamp: new Date().toISOString(), hs_task_status: "COMPLETED" } }),
    });
    await hs(`/crm/v3/objects/tasks/${tache.id}`, { method: "DELETE" });
    resultats.permissions["tâches (écriture)"] = "ok (tâche d'essai créée puis archivée)";
  }

  const proprietaires = await hs("/crm/v3/owners?limit=20").catch(() => ({ results: [] }));
  console.log("\nPermissions :", resultats.permissions);
  console.log("\nPropriétaires (pour proprietaireId) :");
  for (const o of proprietaires.results) console.log(`  ${o.id} · ${[o.firstName, o.lastName].filter(Boolean).join(" ")}`);

  console.log("\nÀ reporter dans le nœud « Configuration » de chaque workflow n8n :");
  console.log(
    JSON.stringify(
      {
        pipelineId: pipeline.id,
        etapeNouvelleDemande: etapes.nouvelleDemande,
        etapes: { nouvelleDemande: etapes.nouvelleDemande, devisEnPreparation: etapes.devisEnPreparation, devisEnvoye: etapes.devisEnvoye },
        portailId: String(compte.portalId),
      },
      null,
      2,
    ),
  );
}

principal().catch((e) => {
  console.error(`Échec : ${e.message}`);
  process.exit(1);
});
