import crypto from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { schemaDemande } from "@/lib/demande/schema";
import { traiterDemande } from "@/lib/demande/traitement";
import {
  accuseReception,
  echeanceOuvrable,
  normaliserDemande,
  notificationInterne,
  preparerContact,
  preparerTache,
  preparerTransaction,
  reprise,
  verifierSignature,
} from "../../automation/n8n/logique/intake.mjs";
import { recherchesSuivi, resumeQuotidien, tachesSuivi } from "../../automation/n8n/logique/suivi.mjs";

/** Données fictives uniquement (domaine réservé example.com). */
const DEMANDE = schemaDemande.parse({
  service: "automatisation-demandes",
  objectif: "Je perds le suivi des demandes reçues par courriel.",
  lieu: "Gatineau",
  description: "Relier le formulaire du site à notre outil de suivi.",
  nom: "Camille Test, Atelier Fictif",
  courriel: "Camille.Test@example.com",
  telephone: "819 555 0100",
  preference: "courriel",
  consentement: true,
});
const CLE = "3f1c2a4e-9b7d-4c1e-8a2f-6d5e4c3b2a10";
const SECRET = "secret-de-test-0123456789abcdef0123";
const CONFIG = { pipelineId: "p1", etapeNouvelleDemande: "s1", proprietaireId: "", portailId: "123" };

/** Capture le message exact envoyé par neoxix.ca au webhook n8n (mode live). */
async function messageEnvoye() {
  const env = {
    INTAKE_MODE: "live",
    N8N_WEBHOOK_URL: "https://n8n.example.com/webhook/neoxix-lead-intake",
    N8N_HMAC_SECRET: SECRET,
    INTAKE_VERSION_CONSENTEMENT: "2026-11-10",
  } as unknown as NodeJS.ProcessEnv;
  const fetcher = vi.fn(async (_u: string | URL | Request, _i?: RequestInit) => new Response(null, { status: 202 }));
  await traiterDemande(DEMANDE, { cle: CLE, dureeRemplissageMs: 9000, env, fetcher: fetcher as unknown as typeof fetch });
  const init = fetcher.mock.calls[0][1]!;
  return { corps: init.body as string, entetes: init.headers as Record<string, string> };
}

describe("n8n · vérification de la signature (cohérente avec neoxix.ca)", () => {
  it("accepte une requête signée par le site", async () => {
    const { corps, entetes } = await messageEnvoye();
    const maintenantS = Number(entetes["x-neoxix-timestamp"]);
    expect(verifierSignature({ corpsBrut: corps, entetes, secret: SECRET, maintenantS, crypto })).toEqual({ ok: true });
  });

  it("refuse : corps modifié, mauvais secret, horodatage expiré, en-têtes absents, secret trop court", async () => {
    const { corps, entetes } = await messageEnvoye();
    const maintenantS = Number(entetes["x-neoxix-timestamp"]);
    const v = (o: Partial<Parameters<typeof verifierSignature>[0]>) =>
      verifierSignature({ corpsBrut: corps, entetes, secret: SECRET, maintenantS, crypto, ...o });
    expect(v({ corpsBrut: corps.replace("Gatineau", "Montréal") })).toEqual({ ok: false, code: "signature_invalide" });
    expect(v({ secret: SECRET.replace("0", "1") })).toEqual({ ok: false, code: "signature_invalide" });
    expect(v({ maintenantS: maintenantS + 301 })).toEqual({ ok: false, code: "horodatage_expire" });
    expect(v({ entetes: {} })).toEqual({ ok: false, code: "signature_absente" });
    expect(v({ secret: "court" })).toEqual({ ok: false, code: "configuration" });
  });
});

describe("n8n · normalisation et objets HubSpot", () => {
  it("normalise le message du site", async () => {
    const n = normaliserDemande(JSON.parse((await messageEnvoye()).corps));
    expect(n.ok).toBe(true);
    if (!n.ok) return;
    expect(n.demande).toMatchObject({ eventId: CLE, courriel: "camille.test@example.com", serviceLibelle: "Automatisation des demandes", versionConsentement: "2026-11-10" });
    expect(n.demande.reference).toMatch(/^NX-\d{4}-/);
  });

  it("refuse un message incomplet ou sans consentement", () => {
    expect(normaliserDemande({ event: "autre" })).toEqual({ ok: false, code: "evenement" });
    expect(normaliserDemande({ event: "service_request.created", eventId: CLE, reference: "NX-2026-ABCDEF", request: { courriel: "x@example.com", service: "indecis" } })).toEqual({
      ok: false,
      code: "consentement",
    });
  });

  it("contact : création en « lead », jamais abonné marketing ; existant : seuls les champs vides sont complétés", () => {
    const d = { nom: "Camille Test", courriel: "camille.test@example.com", telephone: "819 555 0100", lieu: "Gatineau" };
    const nouveau = preparerContact(d, null);
    expect(nouveau).toEqual({
      action: "creer",
      id: "",
      properties: { email: "camille.test@example.com", lifecyclestage: "lead", firstname: "Camille Test", phone: "819 555 0100", city: "Gatineau" },
    });
    expect(JSON.stringify(nouveau)).not.toMatch(/marketing|subscription/i);
    const existant = preparerContact(d, { id: "42", properties: { firstname: "Camille (saisi à la main)", phone: null, city: "Ottawa" } });
    expect(existant).toEqual({ action: "completer", id: "42", properties: { phone: "819 555 0100" } });
    expect(preparerContact(d, { id: "42", properties: { firstname: "x", phone: "y", city: "z" } }).action).toBe("aucune");
  });

  it("transaction : étape « Nouvelle demande », identifiant unique de demande, associée au contact", async () => {
    const n = normaliserDemande(JSON.parse((await messageEnvoye()).corps));
    if (!n.ok) throw new Error("normalisation");
    const t = preparerTransaction(n.demande, "42", CONFIG);
    expect(t.properties).toMatchObject({ pipeline: "p1", dealstage: "s1", neoxix_request_id: CLE, neoxix_reference: n.demande.reference, neoxix_service: "automatisation-demandes" });
    expect(t.associations[0]).toEqual({ to: { id: "42" }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 3 }] });
    const tache = preparerTache("Traiter", "corps", "99", "42", CONFIG, echeanceOuvrable(new Date("2026-11-13T15:00:00Z"), 1));
    expect(tache.properties.hs_timestamp).toBe("2026-11-16T14:00:00.000Z"); // vendredi → lundi
    expect(tache.associations.map((a) => a.types[0].associationTypeId)).toEqual([216, 204]);
  });

  it("notification interne sans courriel ni téléphone ; accusé de réception sans délai promis", async () => {
    const n = normaliserDemande(JSON.parse((await messageEnvoye()).corps));
    if (!n.ok) throw new Error("normalisation");
    const note = notificationInterne(n.demande, "99", CONFIG);
    expect(note.texte).toContain("https://app.hubspot.com/contacts/123/record/0-3/99");
    expect(note.texte).not.toMatch(/example\.com|555/);
    const accuse = accuseReception(n.demande);
    expect(accuse.texte).toContain(n.demande.reference);
    expect(accuse.texte).not.toMatch(/\d+ ?(h|heures?|jours?)\b/);
  });
});

describe("n8n · parcours simulé contre un HubSpot fictif (tests 1 à 4)", () => {
  /** HubSpot en mémoire : contacts par courriel, transactions à `neoxix_request_id` unique. */
  function hubspotFictif({ panne = false } = {}) {
    const contacts = new Map<string, { id: string; properties: Record<string, string | null> }>();
    const deals = new Map<string, { id: string; properties: Record<string, string> }>();
    const taches: unknown[] = [];
    let n = 100;
    return {
      contacts,
      deals,
      taches,
      async traiter(message: unknown): Promise<{ statut: number; corps: Record<string, string> }> {
        const r = normaliserDemande(message);
        if (!r.ok) return { statut: 401, corps: { erreur: "non_autorise" } };
        const d = r.demande;
        if (panne) return { statut: 503, corps: { erreur: "indisponible" } };
        if ([...deals.values()].some((x) => x.properties.neoxix_request_id === d.eventId)) return { statut: 202, corps: { statut: "deja_enregistree", reference: d.reference } };
        const existant = contacts.get(d.courriel) ?? null;
        const c = preparerContact(d, existant);
        const id = existant?.id ?? String(n++);
        contacts.set(d.courriel, { id, properties: { ...(existant?.properties ?? {}), ...c.properties } });
        const t = preparerTransaction(d, id, CONFIG);
        const dealId = String(n++);
        deals.set(dealId, { id: dealId, properties: t.properties });
        taches.push(preparerTache("Traiter " + d.reference, "", dealId, id, CONFIG, new Date()));
        return { statut: 202, corps: { statut: "enregistree", reference: d.reference } };
      },
    };
  }

  it("1 · demande valide → contact, transaction, tâche ; 2 · même envoi répété → aucune transaction en double", async () => {
    const hs = hubspotFictif();
    const message = JSON.parse((await messageEnvoye()).corps);
    expect((await hs.traiter(message)).corps.statut).toBe("enregistree");
    expect((await hs.traiter(message)).corps.statut).toBe("deja_enregistree");
    expect(hs.contacts.size).toBe(1);
    expect(hs.deals.size).toBe(1);
    expect(hs.taches).toHaveLength(1);
  });

  it("3 · adresse connue → contact conservé, nouvelle demande = nouvelle transaction", async () => {
    const hs = hubspotFictif();
    hs.contacts.set("camille.test@example.com", { id: "7", properties: { firstname: "Nom saisi à la main", phone: "613 555 0199", city: null } });
    const message = JSON.parse((await messageEnvoye()).corps);
    await hs.traiter(message);
    await hs.traiter({ ...message, eventId: "9a1c2a4e-9b7d-4c1e-8a2f-6d5e4c3b2a11" });
    expect(hs.contacts.get("camille.test@example.com")).toEqual({
      id: "7",
      properties: { firstname: "Nom saisi à la main", phone: "613 555 0199", city: "Gatineau" },
    });
    expect(hs.deals.size).toBe(2);
  });

  it("4 · HubSpot indisponible → 503 : le site affiche l'erreur et propose de réessayer ou d'écrire", async () => {
    const hs = hubspotFictif({ panne: true });
    expect((await hs.traiter(JSON.parse((await messageEnvoye()).corps))).statut).toBe(503);
    expect(hs.deals.size).toBe(0);
  });
});

describe("n8n · reprise après échec partiel", () => {
  it("transaction créée, tâche en échec : la nouvelle tentative recrée la tâche sans seconde transaction", async () => {
    const n = normaliserDemande(JSON.parse((await messageEnvoye()).corps));
    if (!n.ok) throw new Error("normalisation");
    const sansTache = reprise(n.demande, { results: [{ id: "99" }] }, { results: [] }, CONFIG);
    expect(sansTache.dealId).toBe("99");
    expect(sansTache.tacheManquante).toBe(true);
    expect(sansTache.tache?.associations).toEqual([{ to: { id: "99" }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 216 }] }]);
    const avecTache = reprise(n.demande, { results: [{ id: "99" }] }, { results: [{ toObjectId: 5 }] }, CONFIG);
    expect(avecTache).toMatchObject({ tacheManquante: false, tache: null });
  });

  it("le chemin « doublon » du workflow passe par la vérification de la tâche avant de confirmer", () => {
    const wf = JSON.parse(readFileSync("automation/n8n/workflows/lead-intake-website-to-hubspot.json", "utf8"));
    expect(wf.connections["Doublon ?"].main[0][0].node).toBe("Transaction existante");
    expect(wf.connections["Enregistrée malgré l'erreur ?"].main[0][0].node).toBe("Transaction existante");
    expect(wf.connections["Tâche manquante ?"].main[0][0].node).toBe("HubSpot · Recréer la tâche");
  });
});

describe("n8n · rappels quotidiens", () => {
  const config = {
    pipelineId: "p1",
    etapes: { nouvelleDemande: "s1", devisEnPreparation: "s3", devisEnvoye: "s4" },
    joursNonExaminee: 1,
    joursDevisEnvoye: 5,
    joursEntreRappels: 3,
    proprietaireId: "",
    portailId: "123",
  };

  it("recherches dans les limites de l'API HubSpot (5 groupes, 6 filtres par groupe)", () => {
    for (const r of recherchesSuivi(config, Date.UTC(2026, 10, 10))) {
      expect(r.corps.filterGroups.length).toBeLessThanOrEqual(5);
      for (const g of r.corps.filterGroups) expect(g.filters.length).toBeLessThanOrEqual(6);
    }
  });

  it("tâches internes et marquage anti-répétition ; résumé sans données personnelles", () => {
    const { taches, marquages } = tachesSuivi("devis_envoye", [{ id: "9", properties: { neoxix_reference: "NX-2026-ABCDEF", dealname: "x" } }], config, new Date(), 1);
    expect(taches[0].properties.hs_task_subject).toBe("Relancer le devis : NX-2026-ABCDEF");
    expect(marquages).toEqual([{ id: "9", properties: { neoxix_dernier_rappel: "1" } }]);
    const r = resumeQuotidien({ non_examinee: ["NX-2026-ABCDEF"], devis_en_preparation: [], devis_envoye: [] }, config, "2026-11-10T13:00:00Z");
    expect(r.texte).toContain("Demandes non examinées : 1 (NX-2026-ABCDEF)");
    expect(r.texte).not.toMatch(/@/);
  });
});

describe("n8n · définitions exportées", () => {
  const charger = (f: string) => JSON.parse(readFileSync(`automation/n8n/workflows/${f}`, "utf8"));
  const intake = charger("lead-intake-website-to-hubspot.json");
  const suivi = charger("suivi-commercial-rappels-quotidiens.json");

  it("aucun secret, exécutions réussies non conservées, envois de courriels désactivés par défaut", () => {
    for (const wf of [intake, suivi]) {
      const texte = JSON.stringify(wf);
      expect(texte).not.toMatch(/pat-(na|eu)\d-|sha256=[0-9a-f]{64}|"password"|"apiKey"/);
      expect(wf.settings.saveDataSuccessExecution).toBe("none");
      expect(wf.active).toBe(false);
      for (const n of wf.nodes.filter((x: { type: string }) => x.type === "n8n-nodes-base.emailSend")) expect(n.disabled).toBe(true);
    }
  });

  it("chaque connexion relie des nœuds existants ; le code de chaque nœud se compile", () => {
    for (const wf of [intake, suivi]) {
      const noms = new Set(wf.nodes.map((n: { name: string }) => n.name));
      for (const [de, c] of Object.entries(wf.connections as Record<string, { main: { node: string }[][] }>)) {
        expect(noms.has(de)).toBe(true);
        for (const sortie of c.main) for (const cible of sortie) expect(noms.has(cible.node)).toBe(true);
      }
      for (const n of wf.nodes.filter((x: { type: string }) => x.type === "n8n-nodes-base.code")) {
        expect(() => new Function("$input", "$", "$env", "require", `return (async function () {${n.parameters.jsCode}})`)).not.toThrow();
      }
    }
  });

  it("webhook POST avec corps brut (signature), réponse seulement après HubSpot", () => {
    const webhook = intake.nodes.find((n: { type: string }) => n.type === "n8n-nodes-base.webhook");
    expect(webhook.parameters).toMatchObject({ httpMethod: "POST", path: "neoxix-lead-intake", responseMode: "responseNode", options: { rawBody: true } });
    expect(intake.connections["HubSpot · Créer la tâche de suivi"].main[0][0].node).toBe("Confirmer (enregistrée)");
  });
});
