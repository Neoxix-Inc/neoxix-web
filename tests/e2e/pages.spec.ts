import { expect, test } from "@playwright/test";
import { ANCIENNES_ADRESSES, BANDEAU, PAGES_VITRINE, debordement, defilerTout, surveiller } from "./outils";

test.describe("pages de la vitrine", () => {
  for (const chemin of PAGES_VITRINE) {
    test(`${chemin} : accessible, bandeau, sans erreur, sans tiers, sans débordement`, async ({ page }) => {
      const { erreurs, tiers } = surveiller(page);
      const reponse = await page.goto(chemin, { waitUntil: "networkidle" });
      expect(reponse?.status()).toBe(200);
      await expect(page.getByText(BANDEAU, { exact: true })).toBeVisible();
      await expect(page.getByText("Logo provisoire", { exact: true })).toBeVisible();
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("html")).toHaveAttribute("lang", "fr-CA");
      await defilerTout(page);
      expect(await debordement(page)).toBeLessThanOrEqual(0);
      expect(erreurs).toEqual([]);
      expect(tiers).toEqual([]);
    });
  }

  test("404 : statut, bandeau et retour à l'accueil", async ({ page }) => {
    const { tiers } = surveiller(page);
    const reponse = await page.goto("/cette-page-nexiste-pas", { waitUntil: "networkidle" });
    expect(reponse?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: "Page introuvable" })).toBeVisible();
    await expect(page.getByText(BANDEAU, { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Retour à l'accueil" })).toHaveAttribute("href", "/");
    expect(await debordement(page)).toBeLessThanOrEqual(0);
    expect(tiers).toEqual([]);
  });

  test("un pôle inconnu renvoie 404", async ({ page }) => {
    const reponse = await page.goto("/services/hebergement");
    expect(reponse?.status()).toBe(404);
  });
});

test.describe("contact et données", () => {
  for (const chemin of PAGES_VITRINE) {
    test(`${chemin} : seul mailto:info@neoxix.ca, aucun formulaire`, async ({ page }) => {
      await page.goto(chemin);
      const liens = await page.locator("a[href]").evaluateAll((as) => as.map((a) => a.getAttribute("href") ?? ""));
      const externes = liens.filter((h) => /^(mailto:|tel:|sms:|https?:)/.test(h));
      expect(externes.length).toBeGreaterThan(0);
      for (const h of externes) expect(h).toMatch(/^mailto:info@neoxix\.ca(\?|$)/);
      await expect(page.locator("form, input, textarea, select")).toHaveCount(0);
      const cookies = await page.context().cookies();
      expect(cookies).toEqual([]);
    });
  }
});

test.describe("textes entre crochets conservés", () => {
  test("accueil", async ({ page }) => {
    await page.goto("/");
    const corps = await page.locator("body").innerText();
    expect(corps).toContain("[délai à valider]");
    expect(corps).toContain("Français, anglais sur demande [à valider]");
    expect(corps).toContain("[Fourchette indicative à valider.]");
  });

  test("contact", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByText("Nous répondons sous [délai à valider].")).toBeVisible();
  });
});

test.describe("anciennes adresses du portfolio", () => {
  for (const chemin of ANCIENNES_ADRESSES) {
    test(`${chemin} : redirection 301 vers l'accueil`, async ({ request, page }) => {
      const reponse = await request.get(chemin, { maxRedirects: 0 });
      expect(reponse.status()).toBe(301);
      expect(reponse.headers()["location"]).toBe("/");
      await page.goto(chemin);
      await expect(page).toHaveURL(/\/$/);
      await expect(page.getByRole("heading", { level: 1 })).toContainText("Votre site, vos outils");
    });
  }
});

test.describe("parcours", () => {
  test("accueil → services → un pôle → contact", async ({ page }, info) => {
    await page.goto("/");
    if (info.project.name === "ordinateur-1440") {
      await page.getByRole("navigation", { name: "Navigation principale" }).getByRole("link", { name: "Services" }).click();
    } else {
      await page.getByRole("link", { name: "Voir les services" }).click();
    }
    await expect(page).toHaveURL(/\/services$/);
    await page.getByRole("link", { name: /Infrastructure et sécurité/ }).first().click();
    await expect(page).toHaveURL(/\/services\/infrastructure$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Infrastructure et sécurité");
    const courriel = page.getByRole("link", { name: "Écrire à info@neoxix.ca" });
    await expect(courriel).toHaveAttribute("href", /^mailto:info@neoxix\.ca\?subject=Demande/);
    await page.goto("/");
    await page.getByRole("link", { name: /Nous écrire pour mon projet/ }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Décrivez votre situation");
  });
});
