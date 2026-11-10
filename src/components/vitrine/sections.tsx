import Link from "next/link";
import type { ReactNode } from "react";
import { contenu, lienCourriel } from "@/content";
import type { EnTeteSection, Pole, TitreMarque as TitreMarqueType } from "@/content/types";
import { Apercu, Icone } from "./icones";
import { LeadFlow } from "./leadflow";
import { Marque } from "./logo";
import { Schema } from "./schema";

/** Sections de la maquette V5, dans l'ordre de l'accueil. */

export function TitreMarque({ titre }: { titre: TitreMarqueType }) {
  return (
    <>
      {titre.avant}
      <span className="accent">{titre.marque}</span>
      {titre.apres}
    </>
  );
}

function EnTete({ section, idTitre, Niveau = "h2" }: { section: EnTeteSection; idTitre: string; Niveau?: "h1" | "h2" }) {
  return (
    <div className={`entete-section revele${section.intro ? "" : " simple"}`}>
      <div>
        <p className="surtitre">{section.surtitre}</p>
        <Niveau id={idTitre}>
          <TitreMarque titre={section.titre} />
        </Niveau>
      </div>
      {section.intro && <p className="lede">{section.intro}</p>}
    </div>
  );
}

export function Heros() {
  const { accueil, actionPrincipale } = contenu;
  return (
    <section className="heros" aria-labelledby="titre-heros">
      <div className="wrap heros-grille">
        <div>
          <p className="surtitre">{accueil.surtitre}</p>
          <h1 id="titre-heros">
            <TitreMarque titre={accueil.titre} />
          </h1>
          <p className="lede">{accueil.chapo}</p>
          <div className="actions">
            <a className="btn btn-principal" href="#contact">
              {actionPrincipale.libelle}{" "}
              <span className="flecha" aria-hidden="true">
                →
              </span>
            </a>
            <a className="btn btn-secondaire" href={accueil.actionSecondaire.href}>
              {accueil.actionSecondaire.libelle}
            </a>
          </div>
          <ul className="preuves" aria-label="Pour qui">
            {accueil.publics.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <Schema />
      </div>
    </section>
  );
}

export function Confiance() {
  return (
    <div className="bandeau">
      <div className="wrap">
        <ul aria-label="Repères">
          {contenu.accueil.confiance.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Solutions() {
  const { solutions } = contenu;
  return (
    <section id="solutions" aria-labelledby="titre-solutions">
      <div className="wrap">
        <EnTete section={solutions} idTitre="titre-solutions" />
        <div className="grille-solutions">
          {solutions.items.map((s) => (
            <article key={s.titre} className={`carte revele${s.concept ? " concept" : ""}`}>
              <div className="icone" aria-hidden="true">
                <Icone nom={s.icone} />
              </div>
              <h3>{s.titre}</h3>
              <p>{s.texte}</p>
              <span className={`statut${s.concept ? " turquoise" : ""}`}>
                <span className="sr-seul">Statut : </span>
                {s.statut}
              </span>
            </article>
          ))}
        </div>
        <p className="note-bas">{solutions.note}</p>
      </div>
    </section>
  );
}

export function CarteService({ pole, Niveau = "h3" }: { pole: Pole; Niveau?: "h2" | "h3" }) {
  const colonnes: [string, string[]][] = [
    ["Peut être inclus", pole.detail.inclus],
    ["Dépend du périmètre", pole.detail.perimetre],
    ["Non inclus par défaut", pole.detail.nonInclus],
    ["Pour démarrer", pole.detail.demarrer],
  ];
  return (
    <article className="service revele" id={`pole-${pole.slug}`}>
      <div className="service-tete">
        <span className="service-num" aria-hidden="true">
          {pole.numero}
        </span>
        <div>
          <Niveau>{pole.titre}</Niveau>
          <p className="probleme">{pole.accroche}</p>
        </div>
      </div>
      <p className="resultat">{pole.resultatRecherche}</p>
      <ul className="tags" aria-label="Technologies">
        {pole.etiquettes.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
      <details className="detail">
        <summary>Voir le détail du pôle</summary>
        <div className="contenu">
          {colonnes.map(([titre, items]) => (
            <div key={titre}>
              <h4>{titre}</h4>
              <ul>
                {items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Link className="lien-pole" href={`/services/${pole.slug}`}>
          Page complète du pôle <span aria-hidden="true">→</span>
        </Link>
      </details>
    </article>
  );
}

export function Services({ Titre = "h2" }: { Titre?: "h1" | "h2" }) {
  const { services } = contenu;
  return (
    <section id="services" className="fond-blanc" aria-labelledby="titre-services">
      <div className="wrap">
        <EnTete section={services} idTitre="titre-services" Niveau={Titre} />
        <div className="grille-services">
          {services.poles.map((pole) => (
            <CarteService key={pole.slug} pole={pole} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Realisations() {
  const { realisations } = contenu;
  return (
    <section id="realisations" aria-labelledby="titre-realisations">
      <div className="wrap">
        <EnTete section={realisations} idTitre="titre-realisations" />
        <div className="grille-realisations">
          {realisations.items.map((r) => (
            <article key={r.titre} className="realisation revele">
              <div className="apercu" aria-hidden="true">
                <Apercu type={r.apercu} />
              </div>
              <span className="statut">
                <span className="sr-seul">Statut : </span>
                {r.statut}
              </span>
              <h3>{r.titre}</h3>
              <p>{r.texte}</p>
            </article>
          ))}
        </div>
        <dl className="legende" aria-label="Légende des statuts">
          {realisations.legende.map((l) => (
            <div key={l.terme}>
              <dt className="mono">{l.terme}</dt>
              <dd>· {l.sens}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Methode({ sansTete = false }: { sansTete?: boolean }) {
  const { methode } = contenu;
  return (
    <section id="methode" className="methode" aria-labelledby={sansTete ? "titre-etapes" : "titre-methode"}>
      <div className="wrap">
        {sansTete ? (
          <h2 id="titre-etapes" className="sr-seul">
            Les cinq étapes
          </h2>
        ) : (
          <EnTete section={methode} idTitre="titre-methode" />
        )}
        <ol className="grille-methode revele">
          {methode.etapes.map((e) => (
            <li key={e.numero}>
              <div className="num" aria-hidden="true">
                {e.numero}
              </div>
              <h3>
                <span className="sr-seul">Étape {e.numero} : </span>
                {e.titre}
              </h3>
              <p>{e.texte}</p>
            </li>
          ))}
        </ol>
        <div className="double revele">
          {methode.encarts.map((e) => (
            <div key={e.titre} className="encart">
              <h3>{e.titre}</h3>
              <p>{e.texte}</p>
            </div>
          ))}
        </div>
        <div className="encart revele exemple">
          <h3>{methode.exemple.titre}</h3>
          <ol className="calendrier" aria-label="Exemple illustratif de déroulement">
            {methode.exemple.etapes.map((texte, i) => (
              <li key={texte}>
                <span className="etape-num">Étape {i + 1}</span>
                <span>{texte}</span>
              </li>
            ))}
          </ol>
          <p className="fictif">{methode.exemple.note}</p>
        </div>
      </div>
    </section>
  );
}

export function Engagements() {
  const { engagements } = contenu;
  return (
    <section id="engagements" className="engagements sombre" aria-labelledby="titre-engagements">
      <div className="wrap">
        <EnTete section={engagements} idTitre="titre-engagements" />
        <div className="grille-engagements">
          {[engagements.oui, engagements.non].map((bloc, i) => (
            <div key={bloc.titre} className={`bloc-eng revele${i === 1 ? " non" : ""}`}>
              <h3>{bloc.titre}</h3>
              <ul>
                {bloc.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Formules() {
  const { formules } = contenu;
  return (
    <section id="formules" aria-labelledby="titre-formules">
      <div className="wrap">
        <EnTete section={formules} idTitre="titre-formules" />
        <div className="grille-formules">
          {formules.items.map((f) => (
            <article key={f.titre} className="formule revele">
              <span className="statut">{f.statut}</span>
              <h3>{f.titre}</h3>
              <p>{f.texte}</p>
              <a className="btn btn-secondaire fonce" href="#contact">
                {formules.action}
                <span className="sr-seul"> : formule {f.titre}</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  const { faq } = contenu;
  return (
    <section id="faq" className="fond-clair" aria-labelledby="titre-faq">
      <div className="wrap">
        <EnTete section={faq} idTitre="titre-faq" />
        <div className="faq revele">
          {faq.entrees.map((entree) => (
            <details key={entree.question}>
              <summary>{entree.question}</summary>
              <div className="reponse">
                <p>{entree.reponse}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact({ mode, Titre = "h2" }: { mode: "mock" | "live" | "off"; Titre?: "h1" | "h2" }) {
  const { contact, site } = contenu;
  return (
    <section id="contact" className="contact" aria-labelledby="titre-contact">
      <div className="wrap contact-grille">
        <div className="revele">
          <p className="surtitre">{contact.surtitre}</p>
          <Titre id="titre-contact">
            <TitreMarque titre={contact.titre} />
          </Titre>
          <p className="lede">{contact.intro}</p>
          <div className="contact-coords">
            <p>
              <strong>Courriel :</strong> <a href={lienCourriel()}>{site.courriel}</a>
            </p>
            <p>{contact.coordonnees}</p>
          </div>
        </div>
        <LeadFlow mode={mode} />
      </div>
    </section>
  );
}

export function Pied() {
  const { site, services, actionPrincipale } = contenu;
  return (
    <footer className="pied">
      <div className="wrap">
        <div className="pied-grille">
          <div>
            <Marque href="/" libelle="NEOXIX, accueil" inverse />
            <p className="pied-texte">{site.descriptionPied}</p>
            <p className="pied-texte">
              <a href={lienCourriel()}>{site.courriel}</a>
            </p>
          </div>
          <div>
            <h2>Services</h2>
            <ul>
              {services.poles.map((pole) => (
                <li key={pole.slug}>
                  <Link href={`/services/${pole.slug}`}>{pole.titreCourt}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Neoxix</h2>
            <ul>
              <li>
                <Link href="/#solutions">Solutions</Link>
              </li>
              <li>
                <Link href="/#realisations">Réalisations</Link>
              </li>
              <li>
                <Link href="/methode">Méthode</Link>
              </li>
              <li>
                <Link href={actionPrincipale.href}>{actionPrincipale.libelle}</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="pied-bas">
          <span>{site.lieuPied}</span>
        </div>
      </div>
    </footer>
  );
}

export function EnTetePage({
  surtitre,
  titre,
  chapo,
  fil,
}: {
  surtitre: string;
  titre: ReactNode;
  chapo?: string;
  fil: { libelle: string; href?: string }[];
}) {
  return (
    <section className="page-tete sombre" aria-labelledby="titre-page">
      <div className="wrap">
        <nav className="fil" aria-label="Fil d'Ariane">
          <ol>
            {fil.map((etape) => (
              <li key={etape.libelle}>
                {etape.href ? <Link href={etape.href}>{etape.libelle}</Link> : <span aria-current="page">{etape.libelle}</span>}
              </li>
            ))}
          </ol>
        </nav>
        <p className="surtitre">{surtitre}</p>
        <h1 id="titre-page">{titre}</h1>
        {chapo && <p className="lede">{chapo}</p>}
      </div>
    </section>
  );
}
