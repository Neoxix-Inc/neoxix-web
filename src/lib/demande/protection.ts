/**
 * Protections de la route `POST /api/demandes` (doc 08 § sécurité, doc 05 § abus).
 * - Origine : seules les requêtes émises depuis le site lui-même sont acceptées.
 * - Débit : fenêtre glissante par adresse IP, plus un plafond global.
 *   Limite connue : en fonctions serverless, la mémoire est propre à chaque instance ;
 *   ce compteur freine un abus simple mais ne remplace pas un magasin partagé (Lot 2).
 * - Robots : champ piège et durée minimale de remplissage, sans signal visible pour le robot.
 */

export const TAILLE_MAX_OCTETS = 32 * 1024;
export const DUREE_MIN_REMPLISSAGE_MS = 3_000;

const FENETRE_MS = 10 * 60 * 1000;
/** 5 envois par IP et par fenêtre ; `INTAKE_DEBIT_PAR_IP` permet de l'ajuster (tests de bout en bout locaux). */
function maxParIp(): number {
  const valeur = Number(process.env.INTAKE_DEBIT_PAR_IP);
  return Number.isInteger(valeur) && valeur > 0 ? valeur : 5;
}
const MAX_GLOBAL = 200;
const MAX_ENTREES = 10_000;

const parIp = new Map<string, number[]>();
let global: number[] = [];

function purger(horodatages: number[], maintenant: number): number[] {
  return horodatages.filter((t) => maintenant - t < FENETRE_MS);
}

/** Retourne `true` si la requête est acceptée (et la comptabilise), `false` si la limite est atteinte. */
export function accepterDebit(ip: string, maintenant = Date.now()): boolean {
  global = purger(global, maintenant);
  const recents = purger(parIp.get(ip) ?? [], maintenant);
  if (recents.length >= maxParIp() || global.length >= Math.max(MAX_GLOBAL, maxParIp())) {
    parIp.set(ip, recents);
    return false;
  }
  recents.push(maintenant);
  global.push(maintenant);
  if (parIp.size >= MAX_ENTREES) parIp.clear();
  parIp.set(ip, recents);
  return true;
}

export function reinitialiserDebit(): void {
  parIp.clear();
  global = [];
}

/** Adresse IP du client, telle que transmise par la plateforme (Vercel renseigne `x-forwarded-for`). */
export function adresseClient(entetes: Headers): string {
  const transmise = entetes.get("x-forwarded-for")?.split(",")[0]?.trim();
  return transmise || entetes.get("x-real-ip")?.trim() || "inconnue";
}

/**
 * L'en-tête `Origin` doit désigner le même hôte que la requête, ou une origine listée dans
 * `INTAKE_ORIGINES` (séparées par des virgules). Une requête sans `Origin` est refusée :
 * les navigateurs l'envoient toujours pour un `fetch` POST.
 */
export function origineAutorisee(entetes: Headers, originesSupplementaires = process.env.INTAKE_ORIGINES ?? ""): boolean {
  const origine = entetes.get("origin");
  if (!origine) return false;
  let hoteOrigine: string;
  try {
    hoteOrigine = new URL(origine).host;
  } catch {
    return false;
  }
  const hote = entetes.get("x-forwarded-host") ?? entetes.get("host");
  if (hote && hoteOrigine === hote) return true;
  return originesSupplementaires
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean)
    .includes(origine);
}

/** Un robot remplit le champ piège ou envoie le formulaire trop vite. */
export function ressembleARobot(piege: string, dureeRemplissageMs: number): boolean {
  return piege.trim() !== "" || dureeRemplissageMs < DUREE_MIN_REMPLISSAGE_MS;
}
