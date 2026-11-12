import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { contenu, lienCourriel, trouverOffre, trouverPole } from "@/content";
import { sectionsConfidentialite } from "@/lib/confidentialite";
import { modeFormulaire } from "@/lib/demande/traitement";
import { donneesStructurees } from "@/lib/donnees-structurees";

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

  it("confidentialité : seule la durée approuvée (12 mois) est publiée ; aucune durée non décidée ; jamais de validation juridique affirmée", () => {
    const { sections, sansFormulaire, avecFormulaire } = contenu.confidentialite;
    const texte = chaines([sections, sansFormulaire, avecFormulaire]).join(" ");
    expect(texte).not.toMatch(/24 mois/);
    expect(texte).not.toMatch(/\b(2|6) ans\b|30 jours|7 jours/);
    expect(chaines(contenu.confidentialite).join(" ")).not.toMatch(/validée? juridiquement|avis juridique/i);
    // Les sections du mode live décrivent le circuit réel : n8n puis HubSpot, sans usage marketing.
    expect(chaines(avecFormulaire).join(" ")).toMatch(/n8n[\s\S]*HubSpot/);
    expect(chaines(avecFormulaire).join(" ")).toMatch(/jamais utilisés pour vous envoyer des communications marketing/);
  });

  it("non-régression : la conservation de 12 mois reste visible lorsque INTAKE_MODE=off (aucun formulaire actif)", () => {
    vi.stubEnv("INTAKE_MODE", "off");
    try {
      const mode = modeFormulaire();
      expect(mode).toBe("off");
      const visibles = sectionsConfidentialite(contenu.confidentialite, mode);
      const texte = chaines(visibles).join(" ");
      expect(visibles.map((s) => s.titre)).toContain("Accès et conservation des demandes");
      expect(texte).toMatch(/au plus tard 12 mois après le dernier échange/);
      // Les sections du formulaire actif ne sont pas affichées hors mode live.
      expect(texte).not.toMatch(/Formulaire de demande/);
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it("le mode live affiche la conservation et les sections du circuit réel", () => {
    const visibles = sectionsConfidentialite(contenu.confidentialite, "live");
    const titres = visibles.map((s) => s.titre);
    expect(titres).toContain("Accès et conservation des demandes");
    expect(titres).toContain("Formulaire de demande");
    expect(titres).not.toContain("Formulaire en ligne");
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

describe("offres de démarrage et tarifs (lot PRICING-001)", () => {
  it("trois offres, chacune avec une page, un périmètre exclu et un déroulement", () => {
    expect(contenu.offres.items.map((o) => o.slug)).toEqual(["google-workspace", "support-informatique-pme", "reservation-en-ligne"]);
    for (const o of contenu.offres.items) {
      expect(o.inclus.length).toBeGreaterThan(2);
      expect(o.nonInclus.length).toBeGreaterThan(0);
      expect(o.deroulement.length).toBeGreaterThan(1);
      expect(trouverOffre(o.slug)).toBe(o);
    }
  });

  it("aucun montant inventé : chaque tarif reste « Sur devis » (prix null) tant qu'il n'est pas validé", () => {
    for (const o of contenu.offres.items) expect(o.prix).toBeNull();
  });

  it("chaque offre liée renvoie à un pôle existant", () => {
    for (const o of contenu.offres.items) if (o.pole) expect(trouverPole(o.pole)).toBeDefined();
  });

  it("aucune revendication de partenariat, de revente ou de certification pour les offres et la page Tarifs", () => {
    const texte = chaines([contenu.offres, contenu.tarifs]).join(" ");
    expect(texte).not.toMatch(/revendeur|partenaire (agréé|officiel)|Google Partner|certifi[ée]/i);
    // Google Workspace : mention de marque, sans affiliation.
    expect(texte).toMatch(/n'est pas affiliée à Google/);
  });

  it("données structurées : identité locale publiée uniquement, sans téléphone ni prix non validé", () => {
    const json = JSON.stringify(donneesStructurees());
    expect(json).toMatch(/"addressLocality":"Gatineau"/);
    expect(json).toMatch(/info@neoxix\.ca/);
    expect(json).not.toMatch(/telephone|"price"/);
    expect(donneesStructurees().hasOfferCatalog.itemListElement).toHaveLength(3);
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
