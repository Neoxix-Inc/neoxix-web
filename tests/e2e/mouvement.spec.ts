import { expect, test } from "@playwright/test";
import { PAGES_VITRINE, defilerTout } from "./outils";

test.describe("animations actives par défaut", () => {
  test.beforeEach(({}, info) => {
    test.skip(info.project.name !== "ordinateur-1440", "Vérifié une fois, sur ordinateur");
  });

  test("schéma du héros : signal et étapes animés, bouton pause", async ({ page }) => {
    await page.goto("/");
    const schema = page.locator("figure.schema");
    const enCours = () => schema.evaluate((el) => el.getAnimations({ subtree: true }).filter((a) => a.playState === "running").length);
    expect(await enCours()).toBeGreaterThanOrEqual(7);
    await page.getByRole("button", { name: "Mettre l'animation en pause" }).click();
    await expect(page.getByRole("button", { name: "Reprendre l'animation" })).toHaveAttribute("aria-pressed", "true");
    expect(await enCours()).toBe(0);
  });

  test("apparition au défilement et survol des cartes", async ({ page }) => {
    await page.goto("/");
    const carte = page.locator(".grille-solutions .carte").first();
    expect(await carte.evaluate((el) => getComputedStyle(el).opacity)).toBe("0");
    await carte.scrollIntoViewIfNeeded();
    await expect(carte).toHaveClass(/visible/);
    await expect.poll(() => carte.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
    await page.waitForTimeout(800);
    await carte.hover();
    await expect.poll(() => carte.evaluate((el) => getComputedStyle(el).transform)).not.toBe("none");
  });

  test("FAQ animée à l'ouverture", async ({ page }) => {
    await page.goto("/");
    const question = page.locator(".faq details").nth(1);
    await question.locator("summary").click();
    await expect(question).toHaveAttribute("open", "");
    expect(await question.locator(".reponse").evaluate((el) => getComputedStyle(el).animationName)).toBe("apparait");
  });
});

test.describe("prefers-reduced-motion : aucune animation (critère V5 4)", () => {
  test.use({ reducedMotion: "reduce" });

  for (const chemin of PAGES_VITRINE) {
    test(`${chemin}`, async ({ page }) => {
      await page.goto(chemin);
      await defilerTout(page);
      const etat = await page.evaluate(() => {
        const animations = document.getAnimations().filter((a) => a.playState === "running");
        const cachees = Array.from(document.querySelectorAll(".revele")).filter((el) => getComputedStyle(el).opacity !== "1").length;
        const transitions = Array.from(document.querySelectorAll("body *")).filter((el) =>
          getComputedStyle(el).transitionDuration.split(",").map(parseFloat).some((v) => v > 0),
        ).length;
        return { animations: animations.length, cachees, transitions };
      });
      expect(etat).toEqual({ animations: 0, cachees: 0, transitions: 0 });
      await expect(page.getByRole("button", { name: /animation/ })).toBeHidden();
    });
  }

  test("le schéma reste lisible : six étapes et leurs libellés", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".etape .lbl")).toHaveCount(6);
    await expect(page.locator(".etape").nth(3)).toContainText("Validation humaine");
  });
});

test.describe("sans JavaScript : contenu visible, aucun envoi possible", () => {
  test.use({ javaScriptEnabled: false });

  for (const chemin of ["/", "/services/sites-web", "/methode", "/contact"]) {
    test(`${chemin}`, async ({ page }) => {
      await page.goto(chemin);
      const cachees = await page.evaluate(
        () => Array.from(document.querySelectorAll(".revele")).filter((el) => getComputedStyle(el).opacity !== "1").length,
      );
      expect(cachees).toBe(0);
    });
  }

  test("FAQ utilisable ; formulaire bloqué à l'étape 1 avec le courriel proposé", async ({ page }) => {
    await page.goto("/");
    const question = page.locator(".faq details").nth(2);
    await question.locator("summary").click();
    await expect(question).toHaveAttribute("open", "");
    await expect(page.getByRole("button", { name: /Continuer/ })).toBeDisabled();
    await expect(page.locator("input[type=email]")).toHaveCount(0);
    await expect(page.locator("#contact").getByRole("link", { name: "info@neoxix.ca" })).toBeVisible();
  });
});
