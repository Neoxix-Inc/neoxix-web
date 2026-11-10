import { createHash, createHmac, randomUUID } from "node:crypto";
import type { Demande } from "./schema";

/**
 * Mode de traitement des demandes, lu dans `INTAKE_MODE` :
 * - `mock` (défaut) : la demande est validée puis abandonnée. Rien n'est conservé, journalisé ni transmis.
 * - `live` : transmission signée (HMAC) au webhook n8n. Exige `N8N_WEBHOOK_URL` et `N8N_HMAC_SECRET`.
 *   À n'activer qu'après validation du texte de consentement et de la politique de confidentialité.
 * - `off` : formulaire masqué, seul le courriel reste proposé.
 * Un mode `live` incomplet est traité comme `indisponible` (503), jamais comme `mock` silencieux.
 */
export type ModeIntake = "mock" | "live" | "off" | "indisponible";

export function modeIntake(env: NodeJS.ProcessEnv = process.env): ModeIntake {
  const brut = (env.INTAKE_MODE ?? "mock").trim().toLowerCase();
  if (brut === "off") return "off";
  if (brut === "live") return env.N8N_WEBHOOK_URL && env.N8N_HMAC_SECRET ? "live" : "indisponible";
  return "mock";
}

/** Mode présenté au navigateur : `indisponible` s'affiche comme `off` (courriel seulement). */
export function modeFormulaire(env: NodeJS.ProcessEnv = process.env): "mock" | "live" | "off" {
  const mode = modeIntake(env);
  return mode === "indisponible" ? "off" : mode;
}

const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/** Référence lisible et stable pour une même clé d'idempotence : un double envoi donne la même référence. */
export function referencePour(cle: string, mode: "mock" | "live", annee = new Date().getUTCFullYear()): string {
  const empreinte = createHash("sha256").update(cle).digest();
  let code = "";
  for (let i = 0; i < 6; i++) code += ALPHABET[empreinte[i] % ALPHABET.length];
  return `${mode === "mock" ? "TEST" : "NX"}-${annee}-${code}`;
}

export function signer(corps: string, horodatage: string, secret: string): string {
  return `sha256=${createHmac("sha256", secret).update(`${horodatage}.${corps}`).digest("hex")}`;
}

export type ResultatTraitement = { ok: true; reference: string } | { ok: false };

type Contexte = { cle: string; dureeRemplissageMs: number; env?: NodeJS.ProcessEnv; fetcher?: typeof fetch };

export async function traiterDemande(demande: Demande, contexte: Contexte): Promise<ResultatTraitement> {
  const env = contexte.env ?? process.env;
  const mode = modeIntake(env);

  if (mode === "mock") {
    // Validation seulement : la demande n'est ni stockée, ni journalisée, ni transmise.
    return { ok: true, reference: referencePour(contexte.cle, "mock") };
  }
  if (mode !== "live") return { ok: false };

  const reference = referencePour(contexte.cle, "live");
  const corps = JSON.stringify({
    event: "service_request.created",
    eventId: contexte.cle,
    occurredAt: new Date().toISOString(),
    reference,
    environment: env.VERCEL_ENV === "production" ? "production" : "staging",
    request: {
      ...demande,
      consentements: { traitement: true, versionTexte: env.INTAKE_VERSION_CONSENTEMENT ?? "non-versionne" },
    },
    meta: { langue: "fr-CA", dureeRemplissageMs: contexte.dureeRemplissageMs },
  });
  const horodatage = Math.floor(Date.now() / 1000).toString();

  try {
    const reponse = await (contexte.fetcher ?? fetch)(env.N8N_WEBHOOK_URL as string, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-neoxix-signature": signer(corps, horodatage, env.N8N_HMAC_SECRET as string),
        "x-neoxix-timestamp": horodatage,
        "x-request-id": randomUUID(),
      },
      body: corps,
      signal: AbortSignal.timeout(5_000),
      cache: "no-store",
    });
    return reponse.ok ? { ok: true, reference } : { ok: false };
  } catch {
    return { ok: false };
  }
}
