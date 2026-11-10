import { expect, test } from "@playwright/test";
import { ANCIENNES_ADRESSES, PAGES_VITRINE, debordement, defilerTout, surveiller } from "./outils";

test.describe("pages de la vitrine (critères V5 1, 5, 6, 7)", () => {
  for (const chemin of PAGES_VITRINE) {
    test(`${chemin} : 200, un h1, sans erreur, sans tiers, sans débordement, sans texte interdit`, async ({ page }) => {
      const { erreurs, tiers } = surveiller(page);
      const reponse = await page.goto(chemin, { waitUntil: "networkidle" });
      expect(reponse?.status()).toBe(200);
      expect(reponse?.headers()["x-robots-tag"]).toBe("noindex, nofollow");
      expect(reponse?.headers()["content-security-policy"]).toContain("default-src 'self'");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("html")).toHaveAttribute("lang", "fr-CA");
      await defilerTout(page);
      expect(await debordement(page)).toBeLessThanOrEqual(0);
      const texte = await page.locator("body").innerText();
      expect(texte).not.toMatch(/\[[^\]]*\]|provisoire|Maquette v\d|\(à venir\)/i);
      expect(erreurs).toEqual([]);
      expect(tiers).toEqual([]);
      expect(await page.context().cookies()).toEqual([]);
    });
  }

  test("liens externes : seulement mailto:info@neoxix.ca", async ({ page }) => {
    for (const chemin of PAGES_VITRINE) {
      await page.goto(chemin);
      const liens = await page.locator("a[href]").evaluateAll((as) => as.map((a) => a.getAttribute("href") ?? ""));
      for (const h of liens.filter((h) => /^(mailto:|tel:|sms:|https?:)/.test(h))) expect(h).toMatch(/^mailto:info@neoxix\.ca(\?|$)/);
    }
  });

  test("le formulaire n'existe que sur l'accueil et la page contact", async ({ page }) => {
    for (const chemin of PAGES_VITRINE) {
      await page.goto(chemin);
      await expect(page.locator("form")).toHaveCount(chemin === "/" || chemin === "/contact" ? 1 : 0);
    }
  });

  test("404 : statut et retour à l'accueil", async ({ page }) => {
    const reponse = await page.goto("/cette-page-nexiste-pas");
    expect(reponse?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: "Page introuvable" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Retour à l'accueil" })).toHaveAttribute("href", "/");
    expect(await debordement(page)).toBeLessThanOrEqual(0);
  });

  test("un pôle inconnu renvoie 404", async ({ page }) => {
    expect((await page.goto("/services/hebergement"))?.status()).toBe(404);
  });
});

test.describe("accueil : sections V5 dans l'ordre du dossier", () => {
  test("ordre et contenu clé", async ({ page }) => {
    await page.goto("/");
    const titres = await page.locator("main h1, main h2").allInnerTexts();
    expect(titres.map((t) => t.replace(/\s+/g, " ").trim())).toEqual([
      "Votre site, vos outils et votre réseau, avec un seul interlocuteur.",
      "Partez de votre besoin réel.",
      "Quatre pôles, une seule méthode.",
      "Ce qui existe, présenté avec son statut.",
      "Nous cadrons et validons avec vous avant la réalisation.",
      "Ce que vous pouvez attendre, et ce que nous ne promettons pas.",
      "Trois façons de continuer après la livraison.",
      "Avant de nous écrire.",
      "Décrivez votre situation en quelques lignes.",
    ]);
    await expect(page.locator(".etape")).toHaveCount(6);
    await expect(page.locator(".etape.humain")).toContainText("Validation humaine");
    await expect(page.locator(".grille-solutions .carte")).toHaveCount(6);
    await expect(page.getByText("Concept en conception · non commercialisé")).toBeVisible();
    await expect(page.locator(".grille-realisations .realisation")).toHaveCount(3);
    await expect(page.locator(".faq details")).toHaveCount(8);
    await expect(page.getByText("Livré", { exact: true })).toBeVisible();
    await expect(page.locator(".realisation .statut", { hasText: "Livré" })).toHaveCount(0);
  });

  test("détail repliable d'un pôle", async ({ page }) => {
    await page.goto("/");
    const detail = page.locator("#pole-infrastructure details");
    await detail.locator("summary").click();
    await expect(detail).toHaveAttribute("open", "");
    await expect(detail.getByText("Sauvegardes, selon le périmètre contractuel")).toBeVisible();
    await detail.getByRole("link", { name: /Page complète du pôle/ }).click();
    await expect(page).toHaveURL(/\/services\/infrastructure$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Infrastructure et sécurité");
  });
});

test.describe("anciennes adresses du portfolio", () => {
  for (const chemin of ANCIENNES_ADRESSES) {
    test(`${chemin} : redirection 301 vers l'accueil`, async ({ request }) => {
      const reponse = await request.get(chemin, { maxRedirects: 0 });
      expect(reponse.status()).toBe(301);
      expect(reponse.headers()["location"]).toBe("/");
    });
  }
});
