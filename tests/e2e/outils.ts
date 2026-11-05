import type { Page } from "@playwright/test";

export const PAGES_VITRINE = [
  "/",
  "/services",
  "/services/sites-web",
  "/services/automatisation",
  "/services/infrastructure",
  "/services/applications",
  "/methode",
  "/contact",
  "/confidentialite",
] as const;

/** Anciennes adresses du portfolio : redirection 301 vers l'accueil. */
export const ANCIENNES_ADRESSES = [
  "/portfolio",
  "/projects/neoxix-homelab",
  "/projects/fortigate-ikev2-vpn-lab",
  "/projects/category/networking",
  "/technologies/cisco",
  "/technologies/fortinet",
] as const;

export const BANDEAU = "Maquette / prévisualisation, non publiée";

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
