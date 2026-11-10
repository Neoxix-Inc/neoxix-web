import { z } from "zod";

/**
 * Schéma d'une demande LeadFlow, partagé entre le formulaire (validation immédiate) et
 * la route `POST /api/demandes` (validation qui fait foi).
 * Chaque erreur porte un code (`service_requis`, `courriel_invalide`…) ; le texte affiché
 * vient de `contenu.leadflow.erreurs`, pour que le serveur ne renvoie jamais de texte libre.
 */

export const SERVICES = [
  "presence-en-ligne",
  "automatisation-demandes",
  "gestion-clients",
  "securisation-reseau",
  "outils-metiers",
  "indecis",
] as const;

export const LIMITES = {
  objectif: 1000,
  lieu: 120,
  description: 2000,
  nom: 160,
  courriel: 254,
  telephone: 30,
} as const;

/** Motifs évidents de secrets (doc 05) : la demande ne doit contenir ni mot de passe ni clé. */
const MOTIFS_SECRETS = [
  /-----BEGIN [A-Z ]*(PRIVATE KEY|CERTIFICATE)/i,
  /\b(password|passwd|pwd|mot de passe|mdp)\s*[:=]\s*\S+/i,
  /\b(api[_-]?key|secret|token|jeton)\s*[:=]\s*\S{8,}/i,
  /\bsk_(live|test)_[A-Za-z0-9]{10,}/,
  /\bAKIA[0-9A-Z]{16}\b/,
];

export function contientSecret(texte: string): boolean {
  return MOTIFS_SECRETS.some((motif) => motif.test(texte));
}

const texteLibre = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: "trop_long" })
    .refine((v) => !contientSecret(v), { error: "secret_detecte" });

const TELEPHONE = /^\+?[0-9 ().-]{7,30}$/;

export const schemaEtape1 = z.object({
  service: z.enum(SERVICES, { error: "service_requis" }),
  objectif: texteLibre(LIMITES.objectif).default(""),
  lieu: texteLibre(LIMITES.lieu).default(""),
  description: texteLibre(LIMITES.description).pipe(z.string().min(10, { error: "description_courte" })),
});

const baseEtape2 = z.object({
  nom: z.string().trim().min(2, { error: "nom_requis" }).max(LIMITES.nom, { error: "trop_long" }),
  courriel: z
    .string()
    .trim()
    .max(LIMITES.courriel, { error: "courriel_invalide" })
    .pipe(z.email({ error: "courriel_invalide" })),
  telephone: z
    .string()
    .trim()
    .max(LIMITES.telephone, { error: "telephone_invalide" })
    .refine((v) => v === "" || (TELEPHONE.test(v) && (v.match(/[0-9]/g)?.length ?? 0) >= 7), {
      error: "telephone_invalide",
    })
    .default(""),
  preference: z.enum(["courriel", "telephone"]).default("courriel"),
  consentement: z.literal(true, { error: "consentement_requis" }),
});

function exigerTelephone<T extends { preference: string; telephone: string }>(valeur: T, ctx: z.RefinementCtx) {
  if (valeur.preference === "telephone" && valeur.telephone === "") {
    ctx.addIssue({ code: "custom", path: ["telephone"], message: "telephone_requis" });
  }
}

export const schemaEtape2 = baseEtape2.superRefine(exigerTelephone);

export const schemaDemande = schemaEtape1.extend(baseEtape2.shape).superRefine(exigerTelephone);

export type Demande = z.infer<typeof schemaDemande>;
export type ChampDemande = keyof Demande;

/** Enveloppe envoyée par le formulaire : la demande, plus les champs anti-abus. */
export const schemaEnvoi = z.object({
  demande: z.unknown(),
  /** Champ piège, invisible pour une personne : doit rester vide. */
  piege: z.string().max(500).default(""),
  /** Temps écoulé entre l'affichage du formulaire et l'envoi, en millisecondes. */
  dureeRemplissageMs: z.number().int().nonnegative().max(86_400_000),
  /** Clé d'idempotence générée par le navigateur (une par demande). */
  cle: z.uuid(),
});

export type Envoi = z.infer<typeof schemaEnvoi>;

/** Codes d'erreur par champ, au plus un par champ (le premier rencontré). */
export function erreursParChamp(erreur: z.ZodError): Partial<Record<ChampDemande, string>> {
  const resultat: Partial<Record<ChampDemande, string>> = {};
  for (const probleme of erreur.issues) {
    const champ = probleme.path[0] as ChampDemande | undefined;
    if (!champ || resultat[champ]) continue;
    resultat[champ] = /^[a-z_]+$/.test(probleme.message) ? probleme.message : "invalide";
  }
  return resultat;
}
