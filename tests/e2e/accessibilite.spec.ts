import { expect, test } from "@playwright/test";
import { estMobile } from "./outils";

test.describe("clavier", () => {
  test("lien d'évitement puis focus sur le contenu", async ({ page }) => {
    await page.goto("/services");
    await page.keyboard.press("Tab");
    const saut = page.getByRole("link", { name: "Aller au contenu" });
    await expect(saut).toBeFocused();
    await expect(saut).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page.locator("main#contenu")).toBeFocused();
  });

  for (const chemin of ["/", "/services/automatisation", "/contact"]) {
    test(`${chemin} : chaque élément atteint au Tab a un focus visible d'au moins 2 px`, async ({ page }) => {
      await page.goto(chemin);
      const vus = new Set<string>();
      for (let i = 0; i < 90; i++) {
        await page.keyboard.press("Tab");
        const etat = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || el === document.body) return null;
          const s = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return {
            cle: `${el.tagName}|${el.id}|${el.textContent?.trim().slice(0, 40)}|${el.getAttribute("href") ?? ""}`,
            contour: s.outlineStyle !== "none" && parseFloat(s.outlineWidth) >= 2,
            visible: r.width > 0 && r.height > 0,
          };
        });
        if (!etat) break;
        if (vus.has(etat.cle)) continue;
        vus.add(etat.cle);
        if (!etat.visible) continue;
        expect(etat.contour, `contour de focus : ${etat.cle}`).toBe(true);
      }
      expect(vus.size).toBeGreaterThan(5);
    });
  }

  test("cibles tactiles : boutons et liens de navigation d'au moins 44 px de haut", async ({ page }, info) => {
    test.skip(!estMobile(info), "Vérifié sur les largeurs tactiles");
    await page.goto("/");
    const petites = await page.locator(".btn, .bouton-menu, details summary, .pause").evaluateAll((els) =>
      els
        .filter((el) => (el as HTMLElement).offsetParent !== null)
        .map((el) => ({ t: el.textContent?.trim().slice(0, 30), h: el.getBoundingClientRect().height }))
        .filter((x) => x.h > 0 && x.h < 44),
    );
    expect(petites).toEqual([]);
  });
});

test.describe("menu mobile (critère V5 2)", () => {
  test.beforeEach(({}, info) => {
    test.skip(!estMobile(info), "Menu mobile affiché sous 960 px");
  });

  test("ouverture, Échap ferme et rend le focus au bouton", async ({ page }) => {
    await page.goto("/");
    const bouton = page.getByRole("button", { name: "Ouvrir le menu" });
    await expect(page.getByRole("navigation", { name: "Navigation principale" })).toBeHidden();
    await bouton.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: "Fermer le menu" })).toHaveAttribute("aria-expanded", "true");
    const panneau = page.getByRole("navigation", { name: "Navigation mobile" });
    await expect(panneau.getByRole("link", { name: "Présenter mon projet" })).toBeVisible();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Ouvrir le menu" })).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByRole("button", { name: "Ouvrir le menu" })).toBeFocused();
    await expect(panneau.getByRole("link", { name: "Services" })).toBeHidden();
  });

  test("un lien du menu ferme le menu et mène à la section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    await page.getByRole("navigation", { name: "Navigation mobile" }).getByRole("link", { name: "Présenter mon projet" }).click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.getByRole("button", { name: "Ouvrir le menu" })).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByRole("heading", { name: "Décrivez votre situation en quelques lignes." })).toBeInViewport();
  });
});

test.describe("navigation ordinateur", () => {
  test("navigation principale et bouton d'action visibles", async ({ page }, info) => {
    test.skip(estMobile(info), "Navigation complète au-delà de 960 px");
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navigation principale" });
    for (const nom of ["Services", "Solutions", "Réalisations", "Méthode", "Questions", "Présenter mon projet"]) {
      await expect(nav.getByRole("link", { name: nom })).toBeVisible();
    }
    await expect(page.getByRole("button", { name: "Ouvrir le menu" })).toBeHidden();
  });
});
