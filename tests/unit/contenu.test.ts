import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contenu, lienCourriel, trouverPole } from "@/content";

const MAQUETTE_CHEMIN = "design/v5/index.html";
const MAQUETTE_SHA256 = "5ad1cd451257280f66c8bcd070a19daf8951a578d44cfdd936ac0c96f245b62a";

function chaines(valeur: unknown): string[] {
  if (typeof valeur === "string") return [valeur];
  if (Array.isArray(valeur)) return valeur.flatMap(chaines);
  if (valeur && typeof valeur === "object") return Object.values(valeur).flatMap(chaines);
  return [];
}

describe("contenu de lancement", () => {
  it("quatre pôles, chacun avec un scénario type et une page", () => {
    expect(contenu.services.poles.map((p) => p.slug)).toEqual(["sites-web", "automatisation", "infrastructure", "applications"]);
    for (const p of contenu.services.poles) expect(p.exemple.texte.length).toBeGreaterThan(80);
  });

  it("chaque solution mène à un pôle existant", () => {
    for (const s of contenu.solutions.items) expect(trouverPole(s.pole ?? "")).toBeDefined();
  });

  it("aucun produit non commercialisé présenté sur le site public", () => {
    expect(chaines(contenu.solutions).join(" ")).not.toMatch(/LeadFlow/);
    expect(chaines(contenu.realisations).join(" ")).not.toMatch(/LeadFlow/);
    expect(contenu.realisations.items.find((r) => r.titre === "Ivoire Connect")?.statut).toBe("En développement");
  });

  it("confidentialité : aucune durée de conservation ni validation juridique affirmées", () => {
    const texte = chaines(contenu.confidentialite).join(" ");
    expect(texte).not.toMatch(/\d+ mois|validée? juridiquement|avis juridique/i);
  });
});

describe("critères d'acceptation V5 (§ 10, points 7 et 8) sur tout le contenu", () => {
  const tout = chaines(contenu).join("\n");

  it("aucun texte entre crochets", () => {
    expect(tout).not.toMatch(/\[[^\]]*\]/);
  });

  it("aucune mention interne ou provisoire", () => {
    expect(tout).not.toMatch(/provisoire|maquette v\d|proposition v\d|(délai|fourchette|texte) à valider|\(à venir\)/i);
  });

  it("aucune promesse non validée (sauvegarde testée, délai chiffré, prix, certification)", () => {
    expect(tout).not.toMatch(/(sauvegardes?|restauration)[^.\n]{0,40}test[ée]/i);
    expect(tout).not.toMatch(/sous \d+ ?(h|heures?|jours?)/i);
    expect(tout).not.toMatch(/\d+ ?(\$|€|CAD|FCFA)/);
    expect(tout).not.toMatch(/certifi[ée]s? (cisco|fortinet|microsoft)|partenaire officiel de/i);
  });

  it("aucune « demande envoyée » affichée tant que le mode réel n'existe pas", () => {
    expect(chaines(contenu.leadflow.modes.mock).join(" ")).not.toMatch(/envoyée|transmise à NEOXIX/i);
  });
});

describe("utilitaires", () => {
  it("lienCourriel encode le sujet", () => {
    expect(lienCourriel("Demande : test")).toBe("mailto:info@neoxix.ca?subject=Demande%20%3A%20test");
  });

  it("trouverPole", () => {
    expect(trouverPole("infrastructure")?.numero).toBe("03");
    expect(trouverPole("inconnu")).toBeUndefined();
  });

  it("les services du formulaire couvrent les six options V5", () => {
    expect(contenu.leadflow.services).toHaveLength(6);
  });
});
