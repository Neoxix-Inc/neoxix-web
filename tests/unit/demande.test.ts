import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/demandes/route";
import { contenu } from "@/content";
import { contientSecret, erreursParChamp, schemaDemande, schemaEtape1, schemaEtape2 } from "@/lib/demande/schema";
import { accepterDebit, adresseClient, maxParIp, origineAutorisee, reinitialiserDebit } from "@/lib/demande/protection";
import { modeFormulaire, modeIntake, referencePour, signer, traiterDemande } from "@/lib/demande/traitement";

/** Données fictives uniquement (domaine réservé example.com). */
const DEMANDE = {
  service: "automatisation-demandes",
  objectif: "Je perds le suivi des demandes reçues par courriel.",
  lieu: "Gatineau",
  description: "Formulaire de demande relié à un suivi simple.",
  nom: "Camille Test, Entreprise Fictive",
  courriel: "camille.test@example.com",
  telephone: "",
  preference: "courriel",
  consentement: true,
};

const CLE = "3f1c2a9e-8b7d-4c6e-9f10-2a3b4c5d6e7f";

function requete(corps: unknown, entetes: Record<string, string> = {}) {
  return new Request("http://localhost:3000/api/demandes", {
    method: "POST",
    headers: { host: "localhost:3000", origin: "http://localhost:3000", "content-type": "application/json", "x-forwarded-for": "203.0.113.7", ...entetes },
    body: typeof corps === "string" ? corps : JSON.stringify(corps),
  });
}

const envoi = (demande: unknown = DEMANDE, extra: Record<string, unknown> = {}) => ({ demande, piege: "", dureeRemplissageMs: 42_000, cle: CLE, ...extra });

describe("schéma de demande", () => {
  it("accepte une demande complète", () => {
    expect(schemaDemande.safeParse(DEMANDE).success).toBe(true);
  });

  it("étape 1 : service requis et description d'au moins 10 caractères (après espaces retirés)", () => {
    const r = schemaEtape1.safeParse({ service: "", description: "   court   " });
    expect(r.success).toBe(false);
    if (!r.success) expect(erreursParChamp(r.error)).toEqual({ service: "service_requis", description: "description_courte" });
  });

  it("étape 2 : nom, courriel, consentement", () => {
    const r = schemaEtape2.safeParse({ nom: "", courriel: "pas-un-courriel", consentement: false });
    expect(r.success).toBe(false);
    if (!r.success) expect(erreursParChamp(r.error)).toEqual({ nom: "nom_requis", courriel: "courriel_invalide", consentement: "consentement_requis" });
  });

  it("téléphone facultatif, mais requis si la préférence est le téléphone, et vérifié", () => {
    expect(schemaDemande.safeParse({ ...DEMANDE, preference: "telephone" }).error?.issues[0].message).toBe("telephone_requis");
    expect(schemaDemande.safeParse({ ...DEMANDE, telephone: "abc" }).error?.issues[0].message).toBe("telephone_invalide");
    expect(schemaDemande.safeParse({ ...DEMANDE, telephone: "+1 819 555-0100", preference: "telephone" }).success).toBe(true);
  });

  it("refuse un service hors liste et les textes trop longs", () => {
    expect(schemaDemande.safeParse({ ...DEMANDE, service: "hebergement" }).success).toBe(false);
    expect(erreursParChamp(schemaDemande.safeParse({ ...DEMANDE, description: "x".repeat(2001) }).error!)).toEqual({ description: "trop_long" });
  });

  it("détecte les secrets évidents", () => {
    expect(contientSecret("mot de passe : Hunter2!")).toBe(true);
    expect(contientSecret("-----BEGIN OPENSSH PRIVATE KEY-----")).toBe(true);
    expect(contientSecret("password=abc123")).toBe(true);
    expect(contientSecret("Je dois changer le mot de passe du routeur")).toBe(false);
    expect(erreursParChamp(schemaDemande.safeParse({ ...DEMANDE, description: "Accès VPN, mdp: Secret123" }).error!)).toEqual({ description: "secret_detecte" });
  });

  it("chaque code d'erreur a un message", () => {
    for (const code of ["service_requis", "description_courte", "nom_requis", "courriel_invalide", "telephone_invalide", "telephone_requis", "consentement_requis", "trop_long", "secret_detecte"]) {
      expect(contenu.leadflow.erreurs[code], code).toBeTruthy();
    }
  });
});

describe("protections", () => {
  beforeEach(() => reinitialiserDebit());

  it("débit : 5 demandes par IP sur 10 minutes", () => {
    const t = 1_000_000;
    for (let i = 0; i < 5; i++) expect(accepterDebit("198.51.100.1", t + i)).toBe(true);
    expect(accepterDebit("198.51.100.1", t + 10)).toBe(false);
    expect(accepterDebit("198.51.100.2", t + 10)).toBe(true);
    expect(accepterDebit("198.51.100.1", t + 10 * 60 * 1000 + 1)).toBe(true);
  });

  it("origine : même hôte, ou liste explicite", () => {
    const h = (o: Record<string, string>) => new Headers(o);
    expect(origineAutorisee(h({ host: "neoxix.ca", origin: "https://neoxix.ca" }), "")).toBe(true);
    expect(origineAutorisee(h({ host: "neoxix.ca", origin: "https://malveillant.example" }), "")).toBe(false);
    expect(origineAutorisee(h({ host: "neoxix.ca" }), "")).toBe(false);
    expect(origineAutorisee(h({ host: "interne", origin: "https://neoxix.ca" }), "https://neoxix.ca")).toBe(true);
  });
});

describe("débit et adresse IP", () => {
  const env = (v: Record<string, string>) => v as unknown as NodeJS.ProcessEnv;
  it("INTAKE_DEBIT_PAR_IP est ignoré sur Vercel (preview comme production)", () => {
    expect(maxParIp(env({}))).toBe(5);
    expect(maxParIp(env({ INTAKE_DEBIT_PAR_IP: "10000" }))).toBe(10000);
    expect(maxParIp(env({ INTAKE_DEBIT_PAR_IP: "10000", VERCEL: "1" }))).toBe(5);
    expect(maxParIp(env({ INTAKE_DEBIT_PAR_IP: "-3" }))).toBe(5);
  });
  it("adresse IP : en-tête Vercel prioritaire", () => {
    expect(adresseClient(new Headers({ "x-vercel-forwarded-for": "203.0.113.7", "x-forwarded-for": "198.51.100.1" }))).toBe("203.0.113.7");
    expect(adresseClient(new Headers({ "x-forwarded-for": "198.51.100.1, 10.0.0.1" }))).toBe("198.51.100.1");
    expect(adresseClient(new Headers())).toBe("inconnue");
  });
});

describe("mode et traitement", () => {
  it("mock par défaut ; live incomplet = indisponible ; off", () => {
    expect(modeIntake({} as unknown as NodeJS.ProcessEnv)).toBe("mock");
    expect(modeIntake({ INTAKE_MODE: "live" } as unknown as NodeJS.ProcessEnv)).toBe("indisponible");
    expect(modeFormulaire({ INTAKE_MODE: "live" } as unknown as NodeJS.ProcessEnv)).toBe("off");
    expect(modeIntake({ INTAKE_MODE: "off" } as unknown as NodeJS.ProcessEnv)).toBe("off");
    expect(modeIntake({ INTAKE_MODE: "live", N8N_WEBHOOK_URL: "https://hooks.example.com/x", N8N_HMAC_SECRET: "0123456789abcdef0123456789abcdef" } as unknown as NodeJS.ProcessEnv)).toBe("live");
  });

  it("live refusé si secret trop court ou webhook non HTTPS", () => {
    const base = { INTAKE_MODE: "live", N8N_WEBHOOK_URL: "https://hooks.example.com/x", N8N_HMAC_SECRET: "0123456789abcdef0123456789abcdef" };
    expect(modeIntake({ ...base, N8N_HMAC_SECRET: "court" } as unknown as NodeJS.ProcessEnv)).toBe("indisponible");
    expect(modeIntake({ ...base, N8N_WEBHOOK_URL: "http://hooks.example.com/x" } as unknown as NodeJS.ProcessEnv)).toBe("indisponible");
    expect(modeIntake({ ...base, N8N_WEBHOOK_URL: "pas une url" } as unknown as NodeJS.ProcessEnv)).toBe("indisponible");
  });

  it("référence stable pour une même clé", () => {
    expect(referencePour(CLE, "mock", 2026)).toBe(referencePour(CLE, "mock", 2026));
    expect(referencePour(CLE, "mock", 2026)).toMatch(/^TEST-2026-[2-9A-Z]{6}$/);
    expect(referencePour(CLE, "live", 2026)).toMatch(/^NX-2026-/);
  });

  it("mock : n'appelle aucun service externe", async () => {
    const fetcher = vi.fn();
    const r = await traiterDemande(schemaDemande.parse(DEMANDE), { cle: CLE, dureeRemplissageMs: 1, env: {} as unknown as NodeJS.ProcessEnv, fetcher });
    expect(r.ok).toBe(true);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("live : POST signé HMAC vers le webhook ; échec = indisponible", async () => {
    const env = { INTAKE_MODE: "live", N8N_WEBHOOK_URL: "https://hooks.example.com/w", N8N_HMAC_SECRET: "secret-de-test-0123456789abcdef0123" } as unknown as NodeJS.ProcessEnv;
    const fetcher = vi.fn(async (_url: string | URL | Request, _init?: RequestInit) => new Response(null, { status: 200 }));
    const r = await traiterDemande(schemaDemande.parse(DEMANDE), { cle: CLE, dureeRemplissageMs: 1, env, fetcher: fetcher as unknown as typeof fetch });
    expect(r).toEqual({ ok: true, reference: expect.stringMatching(/^NX-/) });
    const [url, init] = fetcher.mock.calls[0];
    expect(url).toBe("https://hooks.example.com/w");
    expect(init!.redirect).toBe("error");
    const entetes = init!.headers as Record<string, string>;
    const attendu = "sha256=" + createHmac("sha256", "secret-de-test-0123456789abcdef0123").update(`${entetes["x-neoxix-timestamp"]}.${init!.body}`).digest("hex");
    expect(entetes["x-neoxix-signature"]).toBe(attendu);
    expect(signer("a", "1", "k")).toMatch(/^sha256=[0-9a-f]{64}$/);
    const corps = JSON.parse(init!.body as string);
    expect(corps).toMatchObject({ event: "service_request.created", eventId: CLE, environment: "staging" });
    expect(corps.request).not.toHaveProperty("piege");

    const enEchec = vi.fn(async () => new Response(null, { status: 500 }));
    expect(await traiterDemande(schemaDemande.parse(DEMANDE), { cle: CLE, dureeRemplissageMs: 1, env, fetcher: enEchec as unknown as typeof fetch })).toEqual({ ok: false });
  });
});

describe("POST /api/demandes (mode mock)", () => {
  beforeEach(() => {
    reinitialiserDebit();
    vi.stubEnv("INTAKE_MODE", "mock");
  });
  afterEach(() => vi.unstubAllEnvs());

  it("202 avec une référence de test pour une demande valide", async () => {
    const r = await POST(requete(envoi()));
    expect(r.status).toBe(202);
    expect(r.headers.get("cache-control")).toBe("no-store");
    expect(await r.json()).toEqual({ reference: expect.stringMatching(/^TEST-/), mode: "mock" });
  });

  it("400 avec les codes par champ", async () => {
    const r = await POST(requete(envoi({ ...DEMANDE, courriel: "x", consentement: false })));
    expect(r.status).toBe(400);
    expect(await r.json()).toEqual({ erreur: "validation", champs: { courriel: "courriel_invalide", consentement: "consentement_requis" } });
  });

  it("403 si l'origine diffère", async () => {
    expect((await POST(requete(envoi(), { origin: "https://malveillant.example" }))).status).toBe(403);
  });

  it("415 si le corps n'est pas du JSON", async () => {
    expect((await POST(requete("service=x", { "content-type": "application/x-www-form-urlencoded" }))).status).toBe(415);
  });

  it("413 au-delà de 32 Ko", async () => {
    expect((await POST(requete(envoi({ ...DEMANDE, description: "x".repeat(40_000) })))).status).toBe(413);
  });

  it("400 si l'enveloppe est invalide (clé absente, JSON cassé)", async () => {
    expect((await POST(requete({ demande: DEMANDE }))).status).toBe(400);
    expect((await POST(requete("{pas du json"))).status).toBe(400);
  });

  it("robot (piège ou trop rapide) : 202 factice, sans validation", async () => {
    const piege = await POST(requete(envoi({}, { piege: "https://spam.example" })));
    expect(piege.status).toBe(202);
    const rapide = await POST(requete(envoi({}, { dureeRemplissageMs: 500 })));
    expect(rapide.status).toBe(202);
  });

  it("429 avec Retry-After au-delà de 5 envois", async () => {
    for (let i = 0; i < 5; i++) expect((await POST(requete(envoi()))).status).toBe(202);
    const r = await POST(requete(envoi()));
    expect(r.status).toBe(429);
    expect(r.headers.get("retry-after")).toBe("600");
  });

  it("503 si le mode est off ou live incomplet", async () => {
    vi.stubEnv("INTAKE_MODE", "off");
    expect((await POST(requete(envoi()))).status).toBe(503);
    vi.stubEnv("INTAKE_MODE", "live");
    expect((await POST(requete(envoi()))).status).toBe(503);
  });
});
