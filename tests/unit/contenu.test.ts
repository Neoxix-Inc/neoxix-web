import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { contenu, lienCourriel, trouverPole } from "@/content";
import { catalogue, trouverElement } from "@/lib/catalogue";
import { sectionsConfidentialite } from "@/lib/confidentialite";
import { modeFormulaire } from "@/lib/demande/traitement";
import { donneesStructurees } from "@/lib/donnees-structurees";
import { etiquetteStatut, formatMontant, montantPublieAutorise, montantsAffiches, montantsProposesVisibles } from "@/lib/tarification";
import { autorisationPublication } from "@/content/fr/catalogue";

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

describe("catalogue et offres de démarrage (PRICING-002)", () => {
  // Grille retenue par le propriétaire pour la maquette (dollars canadiens). Non publiée.
  const grille: [string, number][] = [
    ["site-essentiel", 990],
    ["site-professionnel-reservation", 1990],
    ["site-avance-automatisation", 3490],
    ["maintenance-web", 149],
    ["workspace-express", 295],
    ["workspace-configuration-initiale", 495],
    ["workspace-migration", 95],
    ["workspace-forfait-cinq-utilisateurs", 895],
    ["workspace-assistance", 199],
    ["assistance-distance", 95],
    ["assistance-sur-place", 125],
    ["assistance-banque-cinq-heures", 425],
    ["assistance-pme-essentiel", 299],
    ["assistance-pme-suivi", 599],
    ["audit-wifi-reseau", 695],
    ["installation-wifi-petite-entreprise", 990],
    ["installation-reseau", 3000],
    ["nas-sauvegardes", 1490],
    ["migration-proxmox", 5000],
    ["automatisation-express", 990],
    ["automatisation-n8n", 3000],
    ["hubspot-formulaires", 1990],
    ["audit-securite-pme", 1500],
  ];

  it("26 prestations : 23 montants numériques et 3 prestations sur devis", () => {
    expect(catalogue.elements).toHaveLength(26);
    expect(catalogue.elements.filter((e) => e.montant !== null)).toHaveLength(23);
    expect(catalogue.elements.filter((e) => e.montant === null)).toHaveLength(3);
  });

  it("chaque montant de la grille figure au catalogue, en CAD, sans altération", () => {
    for (const [id, montant] of grille) {
      const element = trouverElement(id);
      expect(element, id).toBeDefined();
      expect(element?.montant, id).toBe(montant);
      expect(element?.devise, id).toBe("CAD");
    }
  });

  it("les trois prestations sur devis sont celles de la grille", () => {
    const surDevis = catalogue.elements.filter((e) => e.montant === null).map((e) => e.id).sort();
    expect(surDevis).toEqual(["applications-sur-mesure", "maintenance-supervision-automatisation", "wazuh-supervision-siem"]);
  });

  it("les trois offres Express sont présentes, tarifées et délimitées par un périmètre", () => {
    for (const id of ["workspace-express", "installation-wifi-petite-entreprise", "automatisation-express"]) {
      const e = trouverElement(id);
      expect(e?.montant, id).not.toBeNull();
      expect(e?.perimetre?.length, id).toBeGreaterThan(2);
      expect(e?.exclusions.length, id).toBeGreaterThan(2);
    }
  });

  it("aucun élément n'est approuvé : tous au statut « proposé »", () => {
    for (const e of catalogue.elements) expect(e.statut, e.id).toBe("propose");
  });

  it("« à partir de » pour les forfaits et prestations à périmètre ; jamais pour l'horaire, la banque ou la prestation sur devis", () => {
    for (const e of catalogue.elements) {
      if (["par-heure", "par-banque", "sur-devis"].includes(e.unite)) expect(e.aPartirDe, e.id).toBe(false);
    }
    expect(trouverElement("maintenance-web")?.aPartirDe).toBe(true);
    expect(trouverElement("assistance-banque-cinq-heures")?.aPartirDe).toBe(false);
  });

  it("chaque pôle du catalogue existe, et chaque offre ne référence que des éléments existants", () => {
    const slugs = contenu.services.poles.map((p) => p.slug);
    for (const e of catalogue.elements) expect(slugs, e.id).toContain(e.pole);
    for (const o of contenu.offres.items) {
      expect(o.references.length, o.slug).toBeGreaterThan(0);
      for (const id of o.references) expect(trouverElement(id), `${o.slug} -> ${id}`).toBeDefined();
    }
  });

  it("trois cartes d'accueil : site et réservation, Google Workspace professionnel, assistance PME ; Express accessible depuis Workspace", () => {
    expect(contenu.offres.items.map((o) => o.titre)).toEqual([
      "Site web et réservation",
      "Google Workspace professionnel",
      "Assistance informatique PME",
    ]);
    expect(contenu.offres.items[0].references[0]).toBe("site-professionnel-reservation");
    expect(contenu.offres.items[1].references[0]).toBe("workspace-forfait-cinq-utilisateurs");
    expect(contenu.offres.items[1].references).toContain("workspace-express");
  });

  it("Workspace : le forfait cinq utilisateurs comprend la configuration standard ; le 495 $ n'est pas ajouté automatiquement", () => {
    expect(trouverElement("workspace-forfait-cinq-utilisateurs")?.description).toMatch(/configuration initiale standard comprise/);
    expect(trouverElement("workspace-forfait-cinq-utilisateurs")?.pointArbitrage).toMatch(/ne pas ajouter automatiquement les 495/);
    expect(trouverElement("workspace-migration")?.exclusions.join(" ")).toMatch(/Non incluse/);
  });

  it("banque de cinq heures : 425 $ CA, assistance à distance uniquement, avantage de 50 $ CA signalé", () => {
    const banque = trouverElement("assistance-banque-cinq-heures");
    expect(banque?.montant).toBe(425);
    expect(banque?.exclusions.join(" ")).toMatch(/Assistance à distance uniquement/);
    expect(banque?.pointArbitrage).toMatch(/475/);
    expect(banque?.pointArbitrage).toMatch(/50 \$ CA/);
  });

  it("assistance : minimum de deux heures sur place ; aucun nombre d'heures ni de tickets promis", () => {
    expect(trouverElement("assistance-sur-place")?.conditions?.join(" ")).toMatch(/deux heures/);
    for (const id of ["assistance-pme-essentiel", "assistance-pme-suivi"]) {
      expect(trouverElement(id)?.exclusions.join(" "), id).toMatch(/à confirmer par écrit/);
    }
  });

  it("Wazuh/SIEM sans montant, et aucune promesse de SOC 24/7 ni de délai garanti", () => {
    expect(trouverElement("wazuh-supervision-siem")?.montant).toBeNull();
    const texte = chaines([contenu.offres, contenu.tarifs, catalogue]).join(" ");
    // Les négations (« Aucun SOC 24/7 », « Assistance 24/7 : non incluse ») sont admises ; pas les promesses.
    expect(texte).not.toMatch(/(?<!Aucun SOC )24\s?\/\s?7(?!\s*:\s*non incluse)/i);
    expect(texte).not.toMatch(/SLA\s+(garanti|de\s+\d)/i);
    expect(texte).not.toMatch(/helpdesk\s+(24|disponible)/i);
  });

  it("Zapier : option présentée sur le pôle Automatisation, n8n reste le socle, aucun tarif Zapier chiffré", () => {
    const pole = contenu.services.poles.find((p) => p.slug === "automatisation");
    const choix = pole?.choixTechnologique;
    expect(choix).toBeDefined();
    const texte = chaines(choix).join(" ");
    expect(texte).toMatch(/n8n/);
    expect(texte).toMatch(/Zapier/);
    expect(texte).toMatch(/sélectionnée après analyse de vos besoins/);
    expect(texte).not.toMatch(/\d+\s?\$|\$\s?CA/);
    expect(texte).not.toMatch(/certifi|partenaire (officiel|agréé)|expert Zapier|Zapier Partner/i);
    // Aucun tarif Zapier dans le catalogue NEOXIX.
    expect(catalogue.elements.map((e) => e.intitule + e.description).join(" ")).not.toMatch(/Zapier.*\d/);
  });

  it("aucune revendication de partenariat, de revente ou de certification", () => {
    const texte = chaines([contenu.offres, contenu.tarifs, catalogue]).join(" ");
    expect(texte).not.toMatch(/revendeur|partenaire (agréé|officiel)|Google Partner|certifi[ée]/i);
    expect(texte).toMatch(/n'est pas affiliée à Google/);
  });

  it("données structurées : identité locale, sans téléphone, sans prix ni zone « Québec » non justifiée", () => {
    const json = JSON.stringify(donneesStructurees());
    expect(json).toMatch(/"addressLocality":"Gatineau"/);
    expect(json).toMatch(/info@neoxix\.ca/);
    expect(json).not.toMatch(/telephone|"price"|priceSpecification|"name":"Québec"/);
    expect(donneesStructurees().hasOfferCatalog.itemListElement).toHaveLength(3);
  });
});

describe("affichage des montants et publication (trois niveaux)", () => {
  const sitesEssentiel = trouverElement("site-essentiel")!;
  const maintenance = trouverElement("maintenance-web")!;
  const migration = trouverElement("workspace-migration")!;
  const heure = trouverElement("assistance-distance")!;
  const banque = trouverElement("assistance-banque-cinq-heures")!;
  const surDevis = trouverElement("applications-sur-mesure")!;
  const local = {} as unknown as NodeJS.ProcessEnv;
  const preview = { VERCEL_ENV: "preview" } as unknown as NodeJS.ProcessEnv;
  const prod = { VERCEL_ENV: "production" } as unknown as NodeJS.ProcessEnv;
  const apercuProtege = { VERCEL_ENV: "preview", TARIFS_APERCU: "protege" } as unknown as NodeJS.ProcessEnv;

  it("formate les montants en CAD, avec « à partir de » et l'unité (build local)", () => {
    expect(formatMontant(sitesEssentiel, local)).toBe("à partir de 990\u00a0$\u00a0CA");
    expect(formatMontant(maintenance, local)).toBe("à partir de 149\u00a0$\u00a0CA / mois");
    expect(formatMontant(migration, local)).toBe("à partir de 95\u00a0$\u00a0CA par boîte");
    expect(formatMontant(heure, local)).toBe("95\u00a0$\u00a0CA / heure");
    expect(formatMontant(banque, local)).toBe("425\u00a0$\u00a0CA");
    expect(formatMontant(surDevis, local)).toBe("Sur devis");
  });

  it("niveau 1 : aucun montant proposé en production", () => {
    expect(montantsProposesVisibles(prod)).toBe(false);
    expect(formatMontant(sitesEssentiel, prod)).toBe("Sur devis");
    expect(formatMontant(maintenance, prod)).toBe("Sur devis");
  });

  it("aperçu : hors production sans protection déclarée, aucun montant de preview public", () => {
    expect(montantsProposesVisibles(preview)).toBe(false);
    expect(formatMontant(sitesEssentiel, preview)).toBe("Sur devis");
    expect(montantsAffiches(preview)).toBe(false);
  });

  it("aperçu protégé : montants proposés visibles seulement si TARIFS_APERCU=protege est déclaré", () => {
    expect(montantsProposesVisibles(apercuProtege)).toBe(true);
    expect(formatMontant(sitesEssentiel, apercuProtege)).toBe("à partir de 990\u00a0$\u00a0CA");
    expect(etiquetteStatut(sitesEssentiel, apercuProtege)).toBe("Proposé, non approuvé");
  });

  it("niveau 3 : l'autorisation de publication est désactivée par défaut, et ne s'active pas par la seule variable d'environnement", () => {
    expect(autorisationPublication.autorisee).toBe(false);
    const autorise = { PUBLICATION_TARIFS: "autorisee" } as unknown as NodeJS.ProcessEnv;
    for (const e of catalogue.elements) expect(montantPublieAutorise(e, autorise), e.id).toBe(false);
    expect(formatMontant(sitesEssentiel, { ...prod, ...autorise })).toBe("Sur devis");
  });

  it("niveau 2 : aucun élément approuvé sans référence écrite d'approbation", () => {
    for (const e of catalogue.elements) {
      if (e.statut === "approuve") expect(e.approbation, e.id).toBeTruthy();
    }
    expect(catalogue.elements.filter((e) => e.statut === "approuve")).toHaveLength(0);
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
