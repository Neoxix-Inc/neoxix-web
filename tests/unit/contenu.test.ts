import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contenu, lienCourriel, trouverPole } from "@/content";
import type { TitreMarque } from "@/content/types";

const MAQUETTE_CHEMIN = "design/v5/index.html";
const MAQUETTE_SHA256 = "5ad1cd451257280f66c8bcd070a19daf8951a578d44cfdd936ac0c96f245b62a";

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

const titre = (t: TitreMarque) => `${t.avant}${t.marque}${t.apres ?? ""}`;
const texte = texteMaquette();

/** Textes adaptés au site réel (la maquette parlait d'elle-même ou du formulaire simulé). */
const ADAPTATIONS = new Set([
  "Votre demande est examinée par une personne. Le délai dépend du périmètre et des informations fournies. Pour l'instant, le formulaire de ce site fonctionne en mode test et ne transmet aucune demande.",
]);

describe("maquette source V5", () => {
  it("a l'empreinte du dossier de transfert", () => {
    const sha = createHash("sha256").update(readFileSync(MAQUETTE_CHEMIN)).digest("hex");
    expect(sha).toBe(MAQUETTE_SHA256);
  });
});

describe("textes de l'accueil repris mot pour mot de la V5", () => {
  const { accueil, solutions, services, realisations, methode, engagements, formules, faq, contact, leadflow } = contenu;
  const sections: Record<string, string[]> = {
    heros: [accueil.surtitre, titre(accueil.titre), accueil.chapo, accueil.actionSecondaire.libelle, ...accueil.publics],
    schema: chaines({ ...accueil.schema, etapes: accueil.schema.etapes.map(({ humain: _h, ...e }) => e) }),
    confiance: accueil.confiance,
    solutions: [solutions.surtitre, titre(solutions.titre), solutions.intro!, solutions.note, ...chaines(solutions.items.map(({ icone: _i, concept: _c, ...s }) => s))],
    services: [
      services.surtitre,
      titre(services.titre),
      services.intro!,
      ...services.poles.flatMap((p) => [p.titre, p.accroche, p.resultatRecherche, ...p.etiquettes, ...chaines(p.detail)]),
    ],
    realisations: [
      realisations.surtitre,
      titre(realisations.titre),
      realisations.intro!,
      ...chaines(realisations.items.map(({ apercu: _a, ...r }) => r)),
      ...realisations.legende.map((l) => `${l.terme} · ${l.sens}`),
    ],
    methode: [methode.surtitre, titre(methode.titre), methode.intro!, ...chaines(methode.etapes), ...chaines(methode.encarts), methode.exemple.titre, ...methode.exemple.etapes, methode.exemple.note],
    engagements: [engagements.surtitre, titre(engagements.titre), ...chaines(engagements.oui), ...chaines(engagements.non)],
    formules: [formules.surtitre, titre(formules.titre), formules.intro!, formules.action, ...chaines(formules.items)],
    faq: [faq.surtitre, titre(faq.titre), ...chaines(faq.entrees)],
    contact: [contact.surtitre, titre(contact.titre), contact.intro!, contact.coordonnees],
    leadflow: [
      ...leadflow.etapes,
      ...leadflow.services.map((s) => s.libelle),
      leadflow.champs.service.placeholder,
      leadflow.champs.objectif.libelle,
      leadflow.champs.objectif.aide,
      leadflow.champs.lieu.libelle,
      leadflow.champs.lieu.aide,
      leadflow.champs.description.libelle,
      leadflow.champs.nom.libelle,
      leadflow.champs.consentement,
      leadflow.erreurs.service_requis,
      leadflow.erreurs.description_courte,
      leadflow.erreurs.nom_requis,
      leadflow.erreurs.courriel_invalide,
      leadflow.erreurs.consentement_requis,
    ],
  };

  for (const [nom, valeurs] of Object.entries(sections)) {
    it(nom, () => {
      const manquants = valeurs.filter((v) => v && !ADAPTATIONS.has(v) && !texte.includes(v));
      expect(manquants).toEqual([]);
    });
  }

  it("les adaptations sont bien utilisées", () => {
    const tout = chaines(contenu);
    for (const a of ADAPTATIONS) expect(tout).toContain(a);
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
