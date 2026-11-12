import type { Page, TestInfo } from "@playwright/test";

export const PAGES_VITRINE = [
  "/",
  "/services",
  "/services/sites-web",
  "/services/automatisation",
  "/services/infrastructure",
  "/services/applications",
  "/tarifs",
  "/offres/google-workspace",
  "/offres/support-informatique-pme",
  "/offres/reservation-en-ligne",
  "/methode",
  "/contact",
  "/confidentialite",
] as const;

/** Anciennes adresses du portfolio : redirection 301 vers l'accueil. */
export const ANCIENNES_ADRESSES = ["/portfolio", "/projects/neoxix-homelab", "/technologies/cisco"] as const;

/** Menu mobile affiché sous 960 px (point de rupture V5). */
export const estMobile = (info: TestInfo) => (info.project.use.viewport?.width ?? 1440) <= 960;

/** Collecte les erreurs console, les exceptions et les requêtes vers un autre hôte que le serveur local. */
export function surveiller(page: Page) {
  const erreurs: string[] = [];
  const tiers: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") erreurs.push(m.text());
  });
  page.on("pageerror", (e) => erreurs.push(String(e)));
  page.on("request", (r) => {
    const url = new URL(r.url());
    if (!["http:", "https:"].includes(url.protocol)) return;
    if (url.hostname !== "127.0.0.1" && url.hostname !== "localhost") tiers.push(r.url());
  });
  return { erreurs, tiers };
}

/** Fait défiler toute la page (sans défilement doux) pour déclencher les entrées au défilement. */
export async function defilerTout(page: Page) {
  await page.evaluate(async () => {
    const hauteur = document.documentElement.scrollHeight;
    for (let y = 0; y <= hauteur; y += Math.round(window.innerHeight * 0.6)) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
}

/** Largeur de document au-delà de la largeur de la fenêtre configurée. */
export async function debordement(page: Page): Promise<number> {
  const largeur = page.viewportSize()?.width ?? 0;
  const doc = await page.evaluate(() => document.documentElement.scrollWidth);
  return doc - largeur;
}

/** Données fictives (domaine réservé example.com) : aucune donnée personnelle réelle. */
export const FICTIF = {
  description: "Formulaire de demande relié à un suivi simple, pour une PME fictive.",
  objectif: "Je reçois mes demandes par courriel et je perds le suivi.",
  lieu: "Gatineau",
  nom: "Camille Test, Entreprise Fictive",
  courriel: "camille.test@example.com",
  telephone: "+1 819 555-0100",
};
