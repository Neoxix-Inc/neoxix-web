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

test.describe("catalogue 26 prestations et option Zapier (PRICING-002)", () => {
  test("tarifs : trois offres Express présentes, avec leur périmètre", async ({ page }) => {
    await page.goto("/tarifs");
    await expect(page.getByText("Google Workspace Express").first()).toBeVisible();
    await expect(page.getByText("Installation Wi-Fi petite entreprise").first()).toBeVisible();
    await expect(page.getByText("Automatisation Express").first()).toBeVisible();
    await expect(page.locator(".tableau-perimetre")).toHaveCount(3);
  });

  test("tarifs : Wazuh/SIEM et prestations sur devis sans montant", async ({ page }) => {
    await page.goto("/tarifs");
    const ligne = page.locator("tr", { hasText: "Wazuh ou supervision SIEM" });
    await expect(ligne.locator(".tableau-montant")).toContainText("Sur devis");
  });

  test("pôle Automatisation : n8n reste le socle, Zapier est présenté comme option étudiée", async ({ page }) => {
    await page.goto("/services/automatisation");
    const bloc = page.locator(".choix-techno");
    await expect(bloc).toContainText("n8n");
    await expect(bloc).toContainText("Zapier");
    await expect(bloc).toContainText("sélectionnée après analyse de vos besoins");
    await expect(bloc).not.toContainText(/certifi|partenaire officiel/i);
    await expect(page.locator("body")).not.toContainText(/Zapier\s+Partner|expert Zapier/i);
  });
});
