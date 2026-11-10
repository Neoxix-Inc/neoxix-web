import { expect, test, type Page } from "@playwright/test";
import { FICTIF, surveiller } from "./outils";

/** Parcours LeadFlow (dossier V5 § 5), en mode test (`INTAKE_MODE=mock`), avec des données fictives. */

const formulaire = (page: Page) => page.locator("#contact .cadre-form");

async function remplirEtape1(page: Page) {
  const f = formulaire(page);
  await f.getByLabel("Service recherché").selectOption({ label: "Automatisation des demandes" });
  await f.getByLabel("Objectif ou difficulté rencontrée").fill(FICTIF.objectif);
  await f.getByLabel("Localisation générale").fill(FICTIF.lieu);
  await f.getByLabel("Description courte du projet").fill(FICTIF.description);
}

async function remplirEtape2(page: Page) {
  const f = formulaire(page);
  await f.getByLabel("Nom et organisation").fill(FICTIF.nom);
  await f.getByRole("textbox", { name: "Courriel" }).fill(FICTIF.courriel);
  await f.getByLabel("J'accepte que NEOXIX utilise mes informations pour répondre à ma demande.").check();
}

test.describe("LeadFlow : parcours complet", () => {
  test("validation, deux étapes, envoi réel au serveur (mode test), confirmation", async ({ page }) => {
    const { erreurs, tiers } = surveiller(page);
    await page.goto("/#contact");
    const f = formulaire(page);
    await expect(f.getByText("Mode test.")).toBeVisible();
    await expect(f.locator('[aria-current="step"]')).toContainText("Comprendre le besoin");

    // Étape 1 : champs requis manquants.
    await f.getByRole("button", { name: /Continuer/ }).click();
    await expect(f.getByText("Choisissez un service, ou « Je ne sais pas encore ».")).toBeVisible();
    await expect(f.getByText("Décrivez votre projet en quelques mots (au moins 10 caractères).")).toBeVisible();
    await expect(f.getByLabel("Service recherché")).toBeFocused();
    await expect(f.getByLabel("Service recherché")).toHaveAttribute("aria-invalid", "true");

    // Secret détecté côté client (même schéma que le serveur).
    await f.getByLabel("Service recherché").selectOption({ label: "Sécurisation du réseau" });
    await f.getByLabel("Description courte du projet").fill("Accès VPN à revoir, mdp: Secret123");
    await f.getByRole("button", { name: /Continuer/ }).click();
    await expect(f.getByText(/Retirez tout mot de passe ou clé/)).toBeVisible();

    await remplirEtape1(page);
    await f.getByRole("button", { name: /Continuer/ }).click();
    await expect(f.getByLabel("Nom et organisation")).toBeFocused();
    await expect(f.locator('[aria-current="step"]')).toContainText("Vous identifier");
    await expect(f.getByText("Mode test.")).toBeVisible();

    // Retour : les valeurs de l'étape 1 sont conservées.
    await f.getByRole("button", { name: "Retour" }).click();
    await expect(f.getByLabel("Description courte du projet")).toHaveValue(FICTIF.description);
    await f.getByRole("button", { name: /Continuer/ }).click();

    // Étape 2 : courriel invalide et consentement manquant.
    await f.getByLabel("Nom et organisation").fill(FICTIF.nom);
    await f.getByRole("textbox", { name: "Courriel" }).fill("camille.test@");
    await f.getByRole("button", { name: "Envoyer la demande (test)" }).click();
    await expect(f.getByText("Saisissez une adresse courriel valide, par exemple nom@entreprise.ca.")).toBeVisible();
    await expect(f.getByText("Cochez cette case pour envoyer votre demande.")).toBeVisible();
    await expect(f.getByRole("textbox", { name: "Courriel" })).toBeFocused();

    // Préférence téléphone sans numéro.
    await f.getByRole("radio", { name: "Téléphone" }).check();
    await remplirEtape2(page);
    await f.getByRole("button", { name: "Envoyer la demande (test)" }).click();
    await expect(f.getByText("Indiquez un numéro de téléphone, ou choisissez le courriel.")).toBeVisible();
    await f.getByRole("textbox", { name: /Téléphone/ }).fill(FICTIF.telephone);

    // Envoi : le serveur reçoit, valide, puis abandonne la demande (mode test). Délai > 3 s (garde anti-robot).
    await page.waitForTimeout(3100);
    const reponse = page.waitForResponse((r) => r.url().endsWith("/api/demandes") && r.request().method() === "POST");
    await f.getByRole("button", { name: "Envoyer la demande (test)" }).click();
    const r = await reponse;
    expect(r.status()).toBe(202);
    expect(await r.json()).toEqual({ reference: expect.stringMatching(/^TEST-\d{4}-[2-9A-Z]{6}$/), mode: "mock" });
    const corps = r.request().postDataJSON();
    expect(corps.demande).toMatchObject({ courriel: FICTIF.courriel, preference: "telephone", consentement: true });
    expect(corps.piege).toBe("");
    expect(corps.dureeRemplissageMs).toBeGreaterThanOrEqual(3000);

    await expect(f.getByRole("heading", { name: "Demande valide (mode test)" })).toBeVisible();
    await expect(f.getByText(/rien n'a été conservé ni transmis/)).toBeVisible();
    await expect(f.getByText(/^TEST-/)).toBeVisible();
    await expect(f.getByRole("button", { name: "Recommencer" })).toBeFocused();
    await expect(f.getByText(/demande envoyée/i)).toHaveCount(0);

    await f.getByRole("button", { name: "Recommencer" }).click();
    await expect(f.getByLabel("Description courte du projet")).toHaveValue("");
    await expect(f.getByLabel("Service recherché")).toBeFocused();

    expect(erreurs).toEqual([]);
    expect(tiers).toEqual([]);
  });

  test("au clavier seulement : Entrée passe à l'étape 2", async ({ page }) => {
    await page.goto("/contact");
    const f = formulaire(page);
    await remplirEtape1(page);
    await f.getByLabel("Localisation générale").press("Enter");
    await expect(f.getByLabel("Nom et organisation")).toBeFocused();
  });
});

test.describe("LeadFlow : états d'erreur", () => {
  async function jusquaEnvoi(page: Page) {
    await page.goto("/contact");
    await remplirEtape1(page);
    await formulaire(page).getByRole("button", { name: /Continuer/ }).click();
    await remplirEtape2(page);
  }

  test("erreur temporaire, puis nouvelle tentative réussie avec la même clé", async ({ page }) => {
    const cles: string[] = [];
    let echouer = true;
    await page.route("**/api/demandes", async (route) => {
      cles.push(route.request().postDataJSON().cle);
      if (echouer) return route.fulfill({ status: 503, json: { erreur: "indisponible" } });
      return route.fulfill({ status: 202, json: { reference: "TEST-2026-ABCDEF", mode: "mock" } });
    });
    await jusquaEnvoi(page);
    const f = formulaire(page);
    await f.getByRole("button", { name: "Envoyer la demande (test)" }).click();
    await expect(f.getByRole("heading", { name: "Erreur temporaire" })).toBeVisible();
    await expect(f.getByRole("button", { name: "Réessayer" })).toBeFocused();
    echouer = false;
    await f.getByRole("button", { name: "Réessayer" }).click();
    await expect(f.getByRole("heading", { name: "Demande valide (mode test)" })).toBeVisible();
    expect(cles).toHaveLength(2);
    expect(cles[0]).toBe(cles[1]);
  });

  test("trop de tentatives (429)", async ({ page }) => {
    await page.route("**/api/demandes", (route) => route.fulfill({ status: 429, headers: { "retry-after": "600" }, json: { erreur: "debit" } }));
    await jusquaEnvoi(page);
    await formulaire(page).getByRole("button", { name: "Envoyer la demande (test)" }).click();
    await expect(formulaire(page).getByRole("heading", { name: "Trop de tentatives" })).toBeVisible();
  });

  test("erreur de validation renvoyée par le serveur : retour à l'étape concernée", async ({ page }) => {
    await page.route("**/api/demandes", (route) => route.fulfill({ status: 400, json: { erreur: "validation", champs: { description: "trop_long" } } }));
    await jusquaEnvoi(page);
    const f = formulaire(page);
    await f.getByRole("button", { name: "Envoyer la demande (test)" }).click();
    await expect(f.getByText("Ce texte est trop long. Raccourcissez-le.")).toBeVisible();
    await expect(f.getByLabel("Description courte du projet")).toBeFocused();
  });

  test("réseau coupé : erreur temporaire, aucune perte de saisie", async ({ page }) => {
    await page.route("**/api/demandes", (route) => route.abort("internetdisconnected"));
    await jusquaEnvoi(page);
    const f = formulaire(page);
    await f.getByRole("button", { name: "Envoyer la demande (test)" }).click();
    await expect(f.getByRole("heading", { name: "Erreur temporaire" })).toBeVisible();
    await f.getByRole("button", { name: "Retour" }).click();
    await expect(f.getByLabel("Nom et organisation")).toHaveValue(FICTIF.nom);
  });
});

test.describe("API /api/demandes sur le build de production", () => {
  test.beforeEach(({}, info) => {
    test.skip(info.project.name !== "ordinateur-1440", "Vérifié une fois");
  });

  const corps = {
    demande: {
      service: "indecis",
      description: FICTIF.description,
      nom: FICTIF.nom,
      courriel: FICTIF.courriel,
      consentement: true,
    },
    piege: "",
    dureeRemplissageMs: 20_000,
    cle: "0d6c1f9e-2b3a-4c5d-8e7f-9a0b1c2d3e4f",
  };

  test("origine requise, type JSON requis, GET refusé", async ({ request, baseURL }) => {
    expect((await request.post("/api/demandes", { data: corps })).status()).toBe(403);
    expect((await request.post("/api/demandes", { data: corps, headers: { origin: baseURL! } })).status()).toBe(202);
    expect((await request.post("/api/demandes", { form: { a: "b" }, headers: { origin: baseURL! } })).status()).toBe(415);
    expect((await request.get("/api/demandes")).status()).toBe(405);
  });
});
