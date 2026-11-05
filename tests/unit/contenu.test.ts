import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contenu, lienCourriel, trouverPole } from "@/content";

const MAQUETTE_CHEMIN = "design/v3/index.html";
const MAQUETTE_SHA256 = "66621c78ba247d179fd35e9d1e1f3a7f31da409c0cfa228142e81e3949dfb1c8";

const maquetteBrute = readFileSync(MAQUETTE_CHEMIN, "utf8");

/** Texte visible de la maquette : balises, styles et scripts retirés, espaces normalisés. */
function texteMaquette(): string {
  const corps = maquetteBrute.split("<body")[1] ?? "";
  return corps
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
}

function chaines(valeur: unknown): string[] {
  if (typeof valeur === "string") return [valeur];
  if (Array.isArray(valeur)) return valeur.flatMap(chaines);
  if (valeur && typeof valeur === "object") return Object.values(valeur).flatMap(chaines);
  return [];
}

const tout = chaines(contenu).join("\n");
const texte = texteMaquette();

describe("maquette source", () => {
  it("a l'empreinte du Lot 0", () => {
    const sha = createHash("sha256").update(readFileSync(MAQUETTE_CHEMIN)).digest("hex");
    expect(sha).toBe(MAQUETTE_SHA256);
  });
});

describe("contenu copié depuis la maquette v3", () => {
  const sections = {
    accueil: contenu.accueil,
    methode: contenu.methode,
    engagements: contenu.engagements,
    faq: contenu.faq,
    contact: {
      titre: contenu.contact.titre,
      titreMarque: contenu.contact.titreMarque,
      lead: contenu.contact.lead,
      bouton: contenu.contact.bouton,
      delai: contenu.contact.delai,
      attente: contenu.contact.attente,
    },
    services: {
      intro: contenu.services.intro,
      titre: contenu.services.titre,
      poles: contenu.services.poles.map((p) => ({ titre: p.titre, resume: p.resume, etiquettes: p.etiquettes })),
    },
  };
  for (const [nom, section] of Object.entries(sections)) {
    it(`${nom} : chaque texte figure tel quel dans la maquette`, () => {
      const absents = chaines(section)
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !texte.includes(s));
      expect(absents).toEqual([]);
    });
  }
});

describe("textes entre crochets", () => {
  const crochetsMaquette = [...new Set(texte.match(/\[[^\]]+\]/g) ?? [])];

  it("la maquette contient bien des éléments à valider", () => {
    expect(crochetsMaquette).toEqual(
      expect.arrayContaining(["[à valider]", "[délai à valider]", "[Fourchette indicative à valider.]"]),
    );
  });

  it("chaque élément entre crochets de la maquette est repris tel quel", () => {
    for (const crochet of crochetsMaquette) expect(tout).toContain(crochet);
  });

  it("aucun délai n'est chiffré à la place d'un crochet", () => {
    expect(tout).not.toMatch(/sous \d/);
    expect(tout).not.toMatch(/\b\d+\s?(h|heures?|jours?)\s+ouvrables?/i);
  });
});

describe("contact et données personnelles", () => {
  it("info@neoxix.ca est la seule adresse publiée", () => {
    const adresses = [...new Set(tout.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g) ?? [])];
    expect(adresses).toEqual(["info@neoxix.ca"]);
  });

  it("aucun numéro de téléphone", () => {
    expect(tout).not.toMatch(/\+?\d[\d\s().-]{7,}\d/);
  });

  it("le lien de contact est un mailto vers info@neoxix.ca", () => {
    expect(lienCourriel()).toMatch(/^mailto:info@neoxix\.ca\?subject=/);
    expect(lienCourriel("Demande : Sites")).toContain(encodeURIComponent("Demande : Sites"));
  });
});

describe("éléments interdits", () => {
  it("aucun prix", () => {
    expect(tout).not.toMatch(/\d\s?(\$|€|CAD|USD|FCFA|XOF)/);
    expect(tout).not.toMatch(/\$\s?\d/);
  });

  it("aucune capacité conditionnelle ou future présentée comme disponible", () => {
    for (const interdit of [/hébergement géré/i, /kubernetes/i, /agents? IA/i, /terraform/i, /business suite/i, /booking/i]) {
      expect(tout).not.toMatch(interdit);
    }
  });

  it("aucun témoignage, certification ou partenariat revendiqué", () => {
    expect(tout).not.toMatch(/témoignage/i);
    expect(tout).not.toMatch(/\bcertifiée?s?\b/i);
    expect(tout).not.toMatch(/partenaire (certifié|officiel)(?! d'aucun)/i);
    expect(tout).not.toMatch(/audit de conformité/i);
  });
});

describe("structure", () => {
  it("bandeau de prévisualisation et logo provisoire", () => {
    expect(contenu.site.bandeau.principal).toBe("Maquette / prévisualisation, non publiée");
    expect(contenu.site.logoProvisoire.toLowerCase()).toBe("logo provisoire");
  });

  it("quatre pôles aux slugs uniques, chacun avec prestations et devis", () => {
    const { poles } = contenu.services;
    expect(poles).toHaveLength(4);
    expect(new Set(poles.map((p) => p.slug)).size).toBe(4);
    for (const pole of poles) {
      expect(pole.prestations.length).toBeGreaterThan(0);
      expect(pole.pourDevis.length).toBeGreaterThan(0);
      expect(trouverPole(pole.slug)).toBe(pole);
    }
    expect(trouverPole("inexistant")).toBeUndefined();
  });

  it("tarification sur devis", () => {
    expect(contenu.services.tarification).toBe("Sur devis");
  });

  it("langue par défaut : français", () => {
    expect(contenu.langue).toBe("fr");
  });
});
