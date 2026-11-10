import { schemaDemande, schemaEnvoi, erreursParChamp } from "@/lib/demande/schema";
import {
  TAILLE_MAX_OCTETS,
  accepterDebit,
  adresseClient,
  origineAutorisee,
  ressembleARobot,
} from "@/lib/demande/protection";
import { modeIntake, referencePour, traiterDemande } from "@/lib/demande/traitement";

/**
 * POST /api/demandes : réception d'une demande LeadFlow.
 * Ordre des contrôles : mode, origine, type et taille, débit, enveloppe, robots, schéma, traitement.
 * Aucune réponse ne contient de détail interne ; aucun contenu de demande n'est journalisé.
 */

/** Le workflow n8n dispose de 10 s ; la fonction garde une marge. */
export const maxDuration = 15;

const SANS_CACHE = { "cache-control": "no-store" };

function json(statut: number, corps: unknown, entetes: Record<string, string> = {}) {
  return Response.json(corps, { status: statut, headers: { ...SANS_CACHE, ...entetes } });
}

export async function POST(requete: Request): Promise<Response> {
  const mode = modeIntake();
  if (mode === "off" || mode === "indisponible") return json(503, { erreur: "indisponible" });

  const entetes = requete.headers;
  if (!origineAutorisee(entetes)) return json(403, { erreur: "origine" });
  if (!(entetes.get("content-type") ?? "").toLowerCase().startsWith("application/json")) {
    return json(415, { erreur: "type" });
  }
  const longueurAnnoncee = Number(entetes.get("content-length") ?? "0");
  if (longueurAnnoncee > TAILLE_MAX_OCTETS) return json(413, { erreur: "taille" });

  if (!accepterDebit(adresseClient(entetes))) {
    return json(429, { erreur: "debit" }, { "retry-after": "600" });
  }

  const brut = await requete.text();
  if (new TextEncoder().encode(brut).byteLength > TAILLE_MAX_OCTETS) return json(413, { erreur: "taille" });

  let donnees: unknown;
  try {
    donnees = JSON.parse(brut);
  } catch {
    return json(400, { erreur: "format" });
  }

  const enveloppe = schemaEnvoi.safeParse(donnees);
  if (!enveloppe.success) return json(400, { erreur: "format" });
  const { demande, piege, dureeRemplissageMs, cle } = enveloppe.data;

  // Robot probable : réponse identique à un succès, mais rien n'est traité (ne pas renseigner le robot).
  if (ressembleARobot(piege, dureeRemplissageMs)) {
    return json(202, { reference: referencePour(cle, mode === "live" ? "live" : "mock"), mode });
  }

  const validation = schemaDemande.safeParse(demande);
  if (!validation.success) return json(400, { erreur: "validation", champs: erreursParChamp(validation.error) });

  const resultat = await traiterDemande(validation.data, { cle, dureeRemplissageMs });
  if (!resultat.ok) return json(503, { erreur: "indisponible" });
  return json(202, { reference: resultat.reference, mode });
}
