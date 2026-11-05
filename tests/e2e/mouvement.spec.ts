import { expect, test } from "@playwright/test";
import { PAGES_VITRINE, defilerTout } from "./outils";

test.describe("animations actives par défaut", () => {
  test.beforeEach(({}, info) => {
    test.skip(info.project.name !== "ordinateur-1440", "Vérifié une fois, sur ordinateur");
  });

  test("flux en boucle avec bouton pause", async ({ page }) => {
    await page.goto("/");
    const flux = page.locator("figure.flux");
    const enCours = await flux.evaluate((el) => el.getAnimations({ subtree: true }).filter((a) => a.playState === "running").length);
    expect(enCours).toBeGreaterThan(0);
    const pause = page.getByRole("button", { name: "Mettre l'animation en pause" });
    await pause.click();
    await expect(page.getByRole("button", { name: "Reprendre l'animation" })).toHaveAttribute("aria-pressed", "true");
    const actives = await flux.evaluate((el) =>
      el.getAnimations({ subtree: true }).filter((a) => a.playState === "running" && String((a as CSSAnimation).animationName).match(/trace|allume|attente/)).length,
    );
    expect(actives).toBe(0);
  });

  test("entrées au défilement et tracé de la méthode", async ({ page }) => {
    await page.goto("/");
    const carte = page.locator(".questions article").first();
    expect(await carte.evaluate((el) => getComputedStyle(el).opacity)).toBe("0");
    await carte.scrollIntoViewIfNeeded();
    await expect(carte).toHaveClass(/visible/);
    await expect.poll(() => carte.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
    const methode = page.locator("ol.methode");
    await methode.scrollIntoViewIfNeeded();
    await expect(methode).toHaveClass(/visible/);
  });

  test("survol d'une carte de service", async ({ page }) => {
    await page.goto("/services");
    const carte = page.locator("a.service").first();
    await carte.scrollIntoViewIfNeeded();
    await expect(carte).toHaveClass(/visible/);
    await page.waitForTimeout(800);
    await carte.hover();
    await expect.poll(() => carte.evaluate((el) => getComputedStyle(el).transform)).not.toBe("none");
  });

  test("FAQ animée à l'ouverture", async ({ page }) => {
    await page.goto("/contact");
    const question = page.locator(".faq details").nth(1);
    await question.locator("summary").click();
    await expect(question).toHaveAttribute("open", "");
    const nom = await question.locator("p").evaluate((el) => getComputedStyle(el).animationName);
    expect(nom).toBe("surgir");
  });
});

test.describe("prefers-reduced-motion : aucune animation", () => {
  test.use({ reducedMotion: "reduce" });

  for (const chemin of PAGES_VITRINE) {
    test(`${chemin}`, async ({ page }) => {
      await page.goto(chemin);
      await defilerTout(page);
      const etat = await page.evaluate(() => {
        const animations = document.getAnimations().filter((a) => a.playState === "running");
        const cachees = Array.from(document.querySelectorAll(".revele, .enfant")).filter(
          (el) => getComputedStyle(el).opacity !== "1",
        ).length;
        const transitions = Array.from(document.querySelectorAll("body *")).filter((el) => {
          const d = getComputedStyle(el).transitionDuration.split(",").map(parseFloat);
          return d.some((v) => v > 0);
        }).length;
        return { animations: animations.length, cachees, transitions };
      });
      expect(etat).toEqual({ animations: 0, cachees: 0, transitions: 0 });
      await expect(page.getByRole("button", { name: /animation/ })).toBeHidden();
    });
  }
});

test.describe("sans JavaScript : contenu visible", () => {
  test.use({ javaScriptEnabled: false });

  for (const chemin of ["/", "/services/sites-web", "/methode", "/contact"]) {
    test(`${chemin}`, async ({ page }) => {
      await page.goto(chemin);
      await page.waitForTimeout(1200);
      const cachees = await page.evaluate(
        () => Array.from(document.querySelectorAll(".revele")).filter((el) => getComputedStyle(el).opacity !== "1").length,
      );
      expect(cachees).toBe(0);
      expect(await page.evaluate(() => document.documentElement.classList.contains("js"))).toBe(false);
    });
  }

  test("FAQ et menu mobile restent utilisables (details natif)", async ({ page }) => {
    await page.goto("/");
    const question = page.locator(".faq details").nth(2);
    await question.locator("summary").click();
    await expect(question).toHaveAttribute("open", "");
  });
});
