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

/** Longueur minimale du secret HMAC partagé avec n8n (32 caractères, par ex. `openssl rand -hex 32`). */
export const LONGUEUR_MIN_SECRET = 32;

/** Configuration `live` utilisable : webhook en HTTPS et secret assez long. Sinon, `indisponible`. */
export function configurationLiveValide(env: NodeJS.ProcessEnv): boolean {
  const secret = env.N8N_HMAC_SECRET ?? "";
  let url: URL;
  try {
    url = new URL(env.N8N_WEBHOOK_URL ?? "");
  } catch {
    return false;
  }
  return url.protocol === "https:" && secret.length >= LONGUEUR_MIN_SECRET;
}

/**
 * Prérequis supplémentaires du mode `live` en production :
 * - `INTAKE_VERSION_CONSENTEMENT` : version du texte de consentement affiché, transmise avec chaque demande ;
 * - `INTAKE_LIMITE_PARTAGEE=waf` : atteste qu'une règle de limitation du pare-feu Vercel couvre
 *   `POST /api/demandes` (le compteur en mémoire est propre à chaque instance).
 */
export function prerequisProductionLive(env: NodeJS.ProcessEnv): boolean {
  return Boolean(env.INTAKE_VERSION_CONSENTEMENT?.trim()) && env.INTAKE_LIMITE_PARTAGEE === "waf";
}

export function modeIntake(env: NodeJS.ProcessEnv = process.env): ModeIntake {
  const production = env.VERCEL_ENV === "production";
  const brut = (env.INTAKE_MODE ?? "").trim().toLowerCase();
  if (brut === "live") {
    if (!configurationLiveValide(env)) return "indisponible";
    if (production && !prerequisProductionLive(env)) return "indisponible";
    return "live";
  }
  // En production, aucun formulaire de démonstration : le visiteur réel est dirigé vers le courriel.
  if (brut === "off" || production) return "off";
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
      // Une redirection enverrait la demande signée ailleurs que vers le webhook configuré.
      redirect: "error",
    });
    return reponse.ok ? { ok: true, reference } : { ok: false };
  } catch {
    return { ok: false };
  }
}
