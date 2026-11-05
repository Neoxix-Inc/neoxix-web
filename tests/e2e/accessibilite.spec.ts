import { expect, test } from "@playwright/test";
import { PAGES_VITRINE, defilerTout } from "./outils";

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
    test(`${chemin} : chaque élément atteint au Tab a un focus visible`, async ({ page }) => {
      await page.goto(chemin);
      const vus = new Set<string>();
      for (let i = 0; i < 80; i++) {
        await page.keyboard.press("Tab");
        const etat = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || el === document.body) return null;
          const s = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return {
            cle: `${el.tagName}|${el.textContent?.trim().slice(0, 40)}|${el.getAttribute("href") ?? ""}`,
            contour: s.outlineStyle !== "none" && parseFloat(s.outlineWidth) >= 2,
            visible: r.width > 0 && r.height > 0,
            focusVisible: el.matches(":focus-visible"),
          };
        });
        if (!etat) break;
        if (vus.has(etat.cle)) continue;
        vus.add(etat.cle);
        if (!etat.visible) continue;
        expect(etat.focusVisible, etat.cle).toBe(true);
        expect(etat.contour, `contour de focus : ${etat.cle}`).toBe(true);
      }
      expect(vus.size).toBeGreaterThan(5);
    });
  }
});

test.describe("menu mobile et barre d'action", () => {
  test.beforeEach(({}, info) => {
    test.skip(info.project.name === "ordinateur-1440", "Menu mobile affiché sous 1100 px seulement");
  });

  test("ouverture au clavier, Échap ferme et rend le focus", async ({ page }) => {
    await page.goto("/");
    const menu = page.locator("details.menu-mobile");
    const bouton = menu.locator("summary");
    await expect(bouton).toBeVisible();
    await bouton.focus();
    await page.keyboard.press("Enter");
    await expect(menu).toHaveAttribute("open", "");
    const panneau = page.getByRole("navigation", { name: "Navigation mobile" });
    await expect(panneau.getByRole("link", { name: "Services" })).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(panneau.getByRole("link").first()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(menu).not.toHaveAttribute("open", "");
    await expect(bouton).toBeFocused();
  });

  test("un lien du menu navigue et referme le menu", async ({ page }) => {
    await page.goto("/");
    await page.locator("details.menu-mobile summary").click();
    await page.getByRole("navigation", { name: "Navigation mobile" }).getByRole("link", { name: "Méthode" }).click();
    await expect(page).toHaveURL(/\/methode$/);
    await expect(page.locator("details.menu-mobile")).not.toHaveAttribute("open", "");
  });

  test("barre d'action fixe sur mobile", async ({ page }, info) => {
    test.skip(info.project.name !== "mobile-390", "Barre affichée sous 768 px");
    await page.goto("/");
    const barre = page.getByRole("navigation", { name: "Actions rapides" });
    await expect(barre).toBeVisible();
    expect(await barre.evaluate((el) => getComputedStyle(el).position)).toBe("fixed");
    await page.mouse.wheel(0, 2500);
    await expect(barre).toBeInViewport();
    await expect(barre.getByRole("link", { name: "Nous écrire" })).toHaveAttribute("href", "/contact");
  });
});

test.describe("contraste de l'ambre", () => {
  for (const chemin of PAGES_VITRINE) {
    test(`${chemin} : aucun texte ambre vif ou ambre moyen sur fond clair`, async ({ page }) => {
      await page.goto(chemin);
      await defilerTout(page);
      const violations = await page.evaluate(() => {
        const rgb = (c: string) => (c.match(/[\d.]+/g) ?? []).map(Number);
        const lum = ([r, g, b]: number[]) => {
          const f = (v: number) => {
            const s = v / 255;
            return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
          };
          return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
        };
        const fond = (el: Element | null): number[] => {
          for (let n = el; n; n = n.parentElement) {
            const s = getComputedStyle(n);
            const c = rgb(s.backgroundColor);
            if (c.length >= 3 && (c[3] === undefined || c[3] > 0.5)) return c;
            if (s.backgroundImage !== "none" && !s.backgroundClip.includes("text")) {
              // Dégradé : on retient la première couleur.
              const m = s.backgroundImage.match(/rgba?\([^)]+\)/);
              if (m) return rgb(m[0]);
            }
          }
          return [250, 248, 245];
        };
        const ambresInterdits = ["255,139,71", "232,116,54"];
        const sortie: string[] = [];
        document.querySelectorAll("body *").forEach((el) => {
          const aTexte = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent?.trim());
          if (!aTexte) return;
          const s = getComputedStyle(el);
          const couleur = rgb(s.color).slice(0, 3).join(",");
          const estDegrade = s.backgroundClip.includes("text") && s.backgroundImage !== "none";
          const ambre = ambresInterdits.includes(couleur) || (estDegrade && /255, 139, 71|232, 116, 54/.test(s.backgroundImage));
          if (!ambre) return;
          const parent = estDegrade ? el.parentElement : el;
          if (lum(fond(parent)) > 0.4) sortie.push(`${el.tagName}.${el.className} « ${el.textContent?.trim().slice(0, 30)} »`);
        });
        return sortie;
      });
      expect(violations).toEqual([]);
    });
  }

  test("le mot mis en valeur sur fond clair est en ambre foncé #B44D29", async ({ page }) => {
    await page.goto("/");
    const couleurs = await page
      .locator(".mot")
      .evaluateAll((els) => els.filter((e) => !e.closest(".nuit")).map((e) => getComputedStyle(e).color));
    expect(couleurs.length).toBeGreaterThan(0);
    for (const c of couleurs) expect(c).toBe("rgb(180, 77, 41)");
  });
});
