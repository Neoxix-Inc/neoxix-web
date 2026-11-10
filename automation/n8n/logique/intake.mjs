// @ts-check
/**
 * Logique du workflow n8n « NEOXIX — Lead Intake — Website to HubSpot ».
 * Fonctions pures : testées par Vitest (tests/unit/automation.test.ts), puis injectées telles quelles
 * dans les nœuds Code du workflow par `automation/n8n/construire.mjs` (le mot-clé `export` est retiré).
 * Aucune dépendance : `crypto` est passé en paramètre (dans n8n : `require('crypto')`).
 */

/** Fenêtre de validité de l'horodatage signé (anti-rejeu), en secondes. */
export const FENETRE_SIGNATURE_S = 300;

/** Libellés des services du formulaire (src/content/fr, champ `leadflow.services`). */
export const LIBELLES_SERVICES = {
  "presence-en-ligne": "Présence en ligne",
  "automatisation-demandes": "Automatisation des demandes",
  "gestion-clients": "Gestion des clients",
  "securisation-reseau": "Sécurisation du réseau",
  "outils-metiers": "Outils métiers",
  indecis: "Je ne sais pas encore",
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const COURRIEL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REFERENCE = /^NX-\d{4}-[2-9A-Z]{6}$/;

/**
 * Vérifie la signature HMAC-SHA256 calculée par neoxix.ca sur `horodatage.corps`
 * (src/lib/demande/traitement.ts, fonction `signer`) et la fraîcheur de l'horodatage.
 * @param {{ corpsBrut: string, entetes: Record<string, string | undefined>, secret: string, maintenantS: number, crypto: any }} p
 * @returns {{ ok: true } | { ok: false, code: string }}
 */
export function verifierSignature({ corpsBrut, entetes, secret, maintenantS, crypto }) {
  if (!secret || secret.length < 32) return { ok: false, code: "configuration" };
  const horodatage = String(entetes["x-neoxix-timestamp"] ?? "");
  const signature = String(entetes["x-neoxix-signature"] ?? "");
  if (!/^\d{10}$/.test(horodatage) || !/^sha256=[0-9a-f]{64}$/.test(signature)) return { ok: false, code: "signature_absente" };
  if (Math.abs(maintenantS - Number(horodatage)) > FENETRE_SIGNATURE_S) return { ok: false, code: "horodatage_expire" };
  const attendue = "sha256=" + crypto.createHmac("sha256", secret).update(`${horodatage}.${corpsBrut}`).digest("hex");
  const a = Buffer.from(attendue);
  const b = Buffer.from(signature);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return { ok: false, code: "signature_invalide" };
  return { ok: true };
}

/** @param {unknown} v @param {number} max */
const texte = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/**
 * Contrôle défensif du message (déjà validé par Zod côté site) et normalisation.
 * @param {any} message
 * @returns {{ ok: true, demande: Record<string, any> } | { ok: false, code: string }}
 */
export function normaliserDemande(message) {
  if (!message || message.event !== "service_request.created") return { ok: false, code: "evenement" };
  const r = message.request ?? {};
  const courriel = texte(r.courriel, 254).toLowerCase();
  if (!UUID.test(String(message.eventId ?? ""))) return { ok: false, code: "event_id" };
  if (!REFERENCE.test(String(message.reference ?? ""))) return { ok: false, code: "reference" };
  if (!COURRIEL.test(courriel)) return { ok: false, code: "courriel" };
  if (!(r.service in LIBELLES_SERVICES)) return { ok: false, code: "service" };
  if (r.consentements?.traitement !== true) return { ok: false, code: "consentement" };
  return {
    ok: true,
    demande: {
      eventId: String(message.eventId).toLowerCase(),
      reference: message.reference,
      environnement: message.environment === "production" ? "production" : "staging",
      recueLe: texte(message.occurredAt, 40),
      service: r.service,
      serviceLibelle: LIBELLES_SERVICES[/** @type {keyof typeof LIBELLES_SERVICES} */ (r.service)],
      nom: texte(r.nom, 160),
      courriel,
      telephone: texte(r.telephone, 30),
      preference: r.preference === "telephone" ? "telephone" : "courriel",
      lieu: texte(r.lieu, 120),
      objectif: texte(r.objectif, 1000),
      description: texte(r.description, 2000),
      versionConsentement: texte(r.consentements?.versionTexte, 40) || "non-versionne",
    },
  };
}

/**
 * Contact HubSpot : création si absent ; s'il existe, seuls les champs vides sont complétés
 * (aucune donnée saisie manuellement n'est remplacée). Jamais d'abonnement marketing.
 * @param {Record<string, any>} d demande normalisée
 * @param {{ id: string, properties: Record<string, string | null> } | null} existant
 */
export function preparerContact(d, existant) {
  const souhaites = { firstname: d.nom, phone: d.telephone, city: d.lieu };
  if (!existant) {
    /** @type {Record<string, string>} */
    const properties = { email: d.courriel, lifecyclestage: "lead" };
    for (const [k, v] of Object.entries(souhaites)) if (v) properties[k] = v;
    return { action: "creer", id: "", properties };
  }
  /** @type {Record<string, string>} */
  const properties = {};
  for (const [k, v] of Object.entries(souhaites)) if (v && !existant.properties?.[k]) properties[k] = v;
  return { action: Object.keys(properties).length ? "completer" : "aucune", id: existant.id, properties };
}

/** Résumé court, sans coordonnées, pour la transaction, la tâche et la notification. @param {Record<string, any>} d @param {number} [max] */
export function resume(d, max = 280) {
  const base = [d.objectif, d.description].filter(Boolean).join(" — ");
  return base.length > max ? base.slice(0, max - 1) + "…" : base;
}

/**
 * Corps de création de la transaction, associée au contact, à l'étape « Nouvelle demande ».
 * `neoxix_request_id` est une propriété à valeur unique : un second envoi identique est refusé par HubSpot.
 * @param {Record<string, any>} d @param {string} contactId
 * @param {{ pipelineId: string, etapeNouvelleDemande: string, proprietaireId?: string }} config
 */
export function preparerTransaction(d, contactId, config) {
  /** @type {Record<string, string>} */
  const properties = {
    dealname: `${d.reference} · ${d.serviceLibelle} · ${d.nom}`.slice(0, 250),
    pipeline: config.pipelineId,
    dealstage: config.etapeNouvelleDemande,
    neoxix_request_id: d.eventId,
    neoxix_reference: d.reference,
    neoxix_service: d.service,
    neoxix_source: "neoxix.ca",
    neoxix_version_consentement: d.versionConsentement,
    description: [
      `Service : ${d.serviceLibelle}`,
      d.objectif && `Objectif : ${d.objectif}`,
      `Description : ${d.description}`,
      d.lieu && `Région : ${d.lieu}`,
      `Préférence de contact : ${d.preference}`,
    ]
      .filter(Boolean)
      .join("\n"),
  };
  if (config.proprietaireId) properties.hubspot_owner_id = config.proprietaireId;
  return {
    properties,
    associations: [{ to: { id: contactId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 3 }] }],
  };
}

/**
 * Ajoute `jours` jours ouvrables (lundi à vendredi) ; l'échéance tombe à 9 h (heure de l'Est, UTC−5 simplifié).
 * @param {Date} depuis @param {number} jours
 */
export function echeanceOuvrable(depuis, jours) {
  const d = new Date(depuis.getTime());
  let restants = jours;
  while (restants > 0) {
    d.setUTCDate(d.getUTCDate() + 1);
    const j = d.getUTCDay();
    if (j !== 0 && j !== 6) restants--;
  }
  d.setUTCHours(14, 0, 0, 0);
  return d;
}

/**
 * Tâche de suivi commercial liée à la transaction et au contact.
 * @param {string} sujet @param {string} corps @param {string} dealId @param {string} contactId
 * @param {{ proprietaireId?: string }} config @param {Date} echeance @param {"HIGH" | "MEDIUM" | "LOW"} [priorite]
 */
export function preparerTache(sujet, corps, dealId, contactId, config, echeance, priorite = "HIGH") {
  /** @type {Record<string, string>} */
  const properties = {
    hs_task_subject: sujet.slice(0, 250),
    hs_task_body: corps,
    hs_timestamp: echeance.toISOString(),
    hs_task_status: "NOT_STARTED",
    hs_task_priority: priorite,
    hs_task_type: "TODO",
  };
  if (config.proprietaireId) properties.hubspot_owner_id = config.proprietaireId;
  const associations = [{ to: { id: dealId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 216 }] }];
  if (contactId) associations.push({ to: { id: contactId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 204 }] });
  return { properties, associations };
}

/** Lien vers la transaction dans HubSpot. @param {string} portailId @param {string} dealId */
export const lienTransaction = (portailId, dealId) => `https://app.hubspot.com/contacts/${portailId}/record/0-3/${dealId}`;

/**
 * Notification interne : référence, service, nom et organisation, résumé, lien, date.
 * Ni courriel ni téléphone du prospect : ils restent dans HubSpot.
 * @param {Record<string, any>} d @param {string} dealId @param {{ portailId: string }} config
 */
export function notificationInterne(d, dealId, config) {
  return {
    sujet: `Nouvelle demande ${d.reference} · ${d.serviceLibelle}`,
    texte: [
      `Référence : ${d.reference}`,
      `Service : ${d.serviceLibelle}`,
      `Nom et organisation : ${d.nom}`,
      `Reçue le : ${d.recueLe}`,
      `Résumé : ${resume(d)}`,
      "",
      `Transaction HubSpot : ${lienTransaction(config.portailId, dealId)}`,
    ].join("\n"),
  };
}

/** Accusé de réception au client (modèle validé dans la mission ; aucun délai promis). @param {Record<string, any>} d */
export function accuseReception(d) {
  return {
    sujet: `NEOXIX · Demande reçue (${d.reference})`,
    texte: [
      "Bonjour,",
      "",
      `Nous avons bien reçu votre demande concernant ${d.serviceLibelle.toLowerCase()}.`,
      "",
      `Votre référence est ${d.reference}.`,
      "",
      "Nous allons examiner les informations transmises et vous recontacter pour préciser votre besoin.",
      "",
      "L'équipe NEOXIX",
      "info@neoxix.ca · https://neoxix.ca",
    ].join("\n"),
  };
}

/**
 * Reprise d'une demande déjà enregistrée (nouvelle tentative après un échec partiel) :
 * la transaction existe ; on recrée la tâche de suivi seulement si aucune n'y est associée.
 * Aucune seconde transaction n'est jamais créée.
 * @param {Record<string, any>} d @param {{ results?: { id: string }[] }} recherche résultat de la recherche par eventId
 * @param {{ results?: unknown[] }} associations tâches associées (API v4) @param {{ proprietaireId?: string }} config
 */
export function reprise(d, recherche, associations, config) {
  const dealId = String(recherche.results?.[0]?.id ?? "");
  const tacheManquante = Boolean(dealId) && (associations.results ?? []).length === 0;
  return {
    dealId,
    tacheManquante,
    tache: tacheManquante
      ? preparerTache(
          `Traiter la demande ${d.reference} (${d.serviceLibelle})`,
          `${resume(d, 600)}\n\nTâche recréée lors d'une nouvelle tentative d'envoi.`,
          dealId,
          "",
          config,
          echeanceOuvrable(new Date(), 1),
        )
      : null,
  };
}
