import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { contenu, lienCourriel } from "@/content";
import type { Pole } from "@/content";
import type { TitreMarque as TitreMarqueType } from "@/content/types";
import { Monogramme } from "./logo";

const retard = (secondes: number) => ({ "--retard": `${secondes}s` }) as CSSProperties;

export function TitreMarque({ titre }: { titre: TitreMarqueType }) {
  return (
    <>
      {titre.avant}
      <span className="mot">{titre.marque}</span>
      {titre.apres}
    </>
  );
}

export function Bandeau() {
  const { bandeau } = contenu.site;
  return (
    <div className="bandeau" role="region" aria-label="Statut de la maquette">
      <div className="enveloppe">
        <span>
          <b>{bandeau.principal}</b>
        </span>
        <span>
          <span className="pastille" aria-hidden="true" />
          {bandeau.secondaire}
        </span>
      </div>
    </div>
  );
}

export function Pied() {
  const { site, services } = contenu;
  return (
    <footer className="pied">
      <div className="enveloppe">
        <div className="grille">
          <div>
            <Link className="logo" href="/" aria-label={`${site.nom}, accueil`}>
              <Monogramme inverse taille={28} />
              {site.nom}
            </Link>
            <p style={{ marginTop: 14, maxWidth: "34ch" }}>{site.descriptionPied}</p>
            <p style={{ marginTop: 12 }}>
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
            <h2>Légal</h2>
            <ul>
              <li>
                <Link href="/confidentialite">Confidentialité (texte provisoire)</Link>
              </li>
              <li>
                <span>Conditions (à venir)</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="bas">
          <span>{site.lieuPied}</span>
          <span>{site.mentionPied}</span>
        </div>
      </div>
    </footer>
  );
}

export function BarreMobile() {
  return (
    <nav className="barre" aria-label="Actions rapides">
      <Link className="btn btn-ambre-vif" href="/contact">
        Nous écrire
      </Link>
      <Link className="btn btn-nuit-secondaire" href="/services">
        Services
      </Link>
    </nav>
  );
}

export function EnTetePage({
  surtitre,
  titre,
  chapo,
  fil,
  idTitre,
}: {
  surtitre: string;
  titre: ReactNode;
  chapo?: string;
  fil?: { libelle: string; href?: string }[];
  idTitre: string;
}) {
  return (
    <section className="page-tete nuit" aria-labelledby={idTitre}>
      <div className="enveloppe">
        {fil && (
          <nav className="fil" aria-label="Fil d'Ariane">
            {fil.map((etape, i) => (
              <span key={etape.libelle}>
                {i > 0 && <span aria-hidden="true">/</span>}
                {etape.href ? <Link href={etape.href}>{etape.libelle}</Link> : <span aria-current="page">{etape.libelle}</span>}
              </span>
            ))}
          </nav>
        )}
        <p className="surtitre enfant">{surtitre}</p>
        <h1 id={idTitre} className="enfant" style={retard(0.1)}>
          {titre}
        </h1>
        {chapo && (
          <p className="chapo enfant" style={retard(0.2)}>
            {chapo}
          </p>
        )}
      </div>
    </section>
  );
}

export function Questions() {
  const { questions } = contenu.accueil;
  return (
    <section className="bloc" aria-labelledby="t-questions">
      <div className="enveloppe">
        <div className="tete">
          <div className="revele">
            <p className="surtitre">{questions.surtitre}</p>
            <h2 id="t-questions">
              <TitreMarque titre={questions.titre} />
            </h2>
          </div>
          <p className="revele" style={retard(0.1)}>
            {questions.intro}
          </p>
        </div>
        <div className="questions">
          {questions.items.map((q, i) => (
            <article key={q.numero} className="revele" style={retard(i * 0.1)}>
              <div className="ico" aria-hidden="true">
                {q.numero}
              </div>
              <h3>{q.titre}</h3>
              <p>{q.texte}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CarteService({ pole, index, niveau = 3 }: { pole: Pole; index: number; niveau?: 2 | 3 }) {
  const Titre = niveau === 2 ? "h2" : "h3";
  return (
    <Link className="service revele" href={`/services/${pole.slug}`} style={retard(index * 0.08)}>
      <span className="num">
        <span>{pole.numero}</span>
        <span className="go" aria-hidden="true">
          →
        </span>
      </span>
      <Titre>{pole.titre}</Titre>
      <p>{pole.resume}</p>
      <ul className="puces" aria-label="Technologies">
        {pole.etiquettes.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
    </Link>
  );
}

export function Services() {
  const { services } = contenu;
  return (
    <section className="bloc fond-lavis" id="services" aria-labelledby="t-services">
      <div className="enveloppe">
        <div className="tete">
          <div className="revele">
            <p className="surtitre">{services.surtitre}</p>
            <h2 id="t-services">
              <TitreMarque titre={services.titre} />
            </h2>
          </div>
          <p className="revele" style={retard(0.1)}>
            {services.intro}
          </p>
        </div>
        <div className="services">
          {services.poles.map((pole, i) => (
            <CarteService key={pole.slug} pole={pole} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Methode({ avecChrono = true, sansTete = false }: { avecChrono?: boolean; sansTete?: boolean }) {
  const { methode } = contenu;
  return (
    <section className="bloc" id="methode" aria-labelledby={sansTete ? "t-etapes" : "t-methode"}>
      <div className="enveloppe">
        {sansTete ? (
          <h2 id="t-etapes" className="sr-seul">
            Les cinq étapes
          </h2>
        ) : (
          <div className="tete">
            <div className="revele">
              <p className="surtitre">{methode.surtitre}</p>
              <h2 id="t-methode">
                <TitreMarque titre={methode.titre} />
              </h2>
            </div>
            <p className="revele" style={retard(0.1)}>
              {methode.intro}
            </p>
          </div>
        )}
        <ol className="methode" data-trace>
          {methode.etapes.map((etape, i) => (
            <li key={etape.numero} className="revele" style={retard(i * 0.12)}>
              <span className="point" aria-hidden="true">
                {etape.numero}
              </span>
              <h3>
                <span className="sr-seul">Étape {etape.numero} : </span>
                {etape.titre}
              </h3>
              <p>{etape.texte}</p>
            </li>
          ))}
        </ol>
        {avecChrono && (
          <figure className="chrono revele">
            <div className="chrono-entete">
              <span>{methode.chrono.titre}</span>
              <span>{methode.chrono.mention}</span>
            </div>
            <ol>
              {methode.chrono.jours.map((j) => (
                <li key={j.jour} className={j.alerte ? "alerte" : undefined}>
                  <span className="jour">{j.jour}</span>
                  <span>{j.texte}</span>
                </li>
              ))}
            </ol>
            <figcaption className="note">{methode.chrono.note}</figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}

export function Engagements() {
  const { engagements } = contenu;
  return (
    <section className="bloc nuit" id="engagements" aria-labelledby="t-eng">
      <div className="enveloppe">
        <div className="tete simple">
          <div className="revele">
            <p className="surtitre">{engagements.surtitre}</p>
            <h2 id="t-eng">
              <TitreMarque titre={engagements.titre} />
            </h2>
          </div>
        </div>
        <div className="engagements">
          {[engagements.oui, engagements.non].map((carte, i) => (
            <div key={carte.titre} className={`carte-nuit ${i === 0 ? "oui" : "non"} revele`} style={retard(i * 0.12)}>
              <h3>
                <span aria-hidden="true" />
                {carte.titre}
              </h3>
              <ul>
                {carte.items.map((item) => (
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

export function Faq() {
  const { faq } = contenu;
  return (
    <section className="bloc" id="faq" aria-labelledby="t-faq">
      <div className="enveloppe">
        <div className="tete simple">
          <div className="revele">
            <p className="surtitre">{faq.surtitre}</p>
            <h2 id="t-faq">{faq.titre}</h2>
          </div>
        </div>
        <div className="faq revele">
          {faq.entrees.map((entree) => (
            <details key={entree.question} open={entree.ouverte}>
              <summary>{entree.question}</summary>
              <p>{entree.reponse}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact({ titreNiveau = 2 }: { titreNiveau?: 1 | 2 }) {
  const { contact, site } = contenu;
  const Titre = titreNiveau === 1 ? "h1" : "h2";
  return (
    <section className="contact" id="contact" aria-labelledby="t-contact">
      <div className="enveloppe">
        <div className="boite">
          <div className="revele">
            <p className="surtitre">{contact.surtitre}</p>
            <Titre id="t-contact">
              {contact.titre}
              <span className="mot">{contact.titreMarque}</span>
            </Titre>
            <p className="lead">{contact.lead}</p>
          </div>
          <div className="carte-contact revele" style={retard(0.12)}>
            <div className="actions">
              <a className="btn btn-primaire btn-grand" href={lienCourriel()}>
                {contact.bouton}{" "}
                <span className="fleche" aria-hidden="true">
                  →
                </span>
              </a>
            </div>
            <p className="courriel-texte">
              <span className="sr-seul">Adresse : </span>
              {site.courriel}
            </p>
            <small>{contact.delai}</small>
            <p className="attente" role="note">
              {contact.attente}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
