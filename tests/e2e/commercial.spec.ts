import { expect, test } from "@playwright/test";

const OFFRES = [
  { chemin: "/offres/reservation-en-ligne", sujet: "Proposition : Site web et réservation" },
  { chemin: "/offres/google-workspace", sujet: "Proposition : Google Workspace professionnel" },
  { chemin: "/offres/support-informatique-pme", sujet: "Proposition : Assistance informatique PME" },
];

test.describe("parcours commercial (lot PRICING-001, phase 1C)", () => {
  for (const { chemin, sujet } of OFFRES) {
    test(`${chemin} : CTA de devis pré-rempli vers info@neoxix.ca, aucun formulaire`, async ({ page }) => {
      await page.goto(chemin);
      await expect(page.locator("form")).toHaveCount(0);
      const lien = page.locator("aside.encart-pole a.lien-courriel");
      await expect(lien).toHaveAttribute("href", /^mailto:info@neoxix\.ca\?subject=/);
      const href = (await lien.getAttribute("href")) ?? "";
      expect(decodeURIComponent(href.split("subject=")[1] ?? "")).toBe(sujet);
    });
  }

  test("tarifs : montants étiquetés « proposé, non approuvé » hors production, et points à arbitrer visibles", async ({ page }) => {
    await page.goto("/tarifs");
    await expect(page.locator(".tableau-montant").first()).toContainText("Proposé, non approuvé");
    await expect(page.locator(".tableau-arbitrage")).toHaveCount(2);
    await expect(page.locator(".tableau-arbitrage", { hasText: "à arbitrer" })).toHaveCount(2);
  });

  test("tarifs : aucun formulaire et repli courriel visible", async ({ page }) => {
    await page.goto("/tarifs");
    await expect(page.locator("form")).toHaveCount(0);
    await expect(page.locator('a[href^="mailto:info@neoxix.ca"]').first()).toBeVisible();
  });
});
