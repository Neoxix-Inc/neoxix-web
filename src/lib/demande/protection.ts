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
const MAX_PAR_IP = 5;
/**
 * 5 envois par IP et par fenêtre. `INTAKE_DEBIT_PAR_IP` sert uniquement aux tests de bout en bout
 * locaux : il est ignoré dès que le code s'exécute sur Vercel (`VERCEL` est défini en preview comme
 * en production), ce qui empêche une variable oubliée d'affaiblir la limite déployée.
 */
export function maxParIp(env: NodeJS.ProcessEnv = process.env): number {
  if (env.VERCEL) return MAX_PAR_IP;
  const valeur = Number(env.INTAKE_DEBIT_PAR_IP);
  return Number.isInteger(valeur) && valeur > 0 ? valeur : MAX_PAR_IP;
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

/**
 * Adresse IP du client. Sur Vercel, `x-vercel-forwarded-for`, `x-real-ip` et `x-forwarded-for` sont
 * renseignés par la plateforme, qui écrase les valeurs envoyées par le client (pas d'usurpation possible).
 * Hors Vercel (poste local), ces en-têtes ne sont pas fiables ; la limite n'y protège rien d'exposé.
 */
export function adresseClient(entetes: Headers): string {
  for (const nom of ["x-vercel-forwarded-for", "x-real-ip", "x-forwarded-for"]) {
    const valeur = entetes.get(nom)?.split(",")[0]?.trim();
    if (valeur) return valeur;
  }
  return "inconnue";
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
