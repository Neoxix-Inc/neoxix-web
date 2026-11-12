import type { Metadata } from "next";
import Link from "next/link";
import { contenu } from "@/content";
import { CarteService, EnTetePage, TitreMarque } from "@/components/vitrine/sections";
import { TableauTarifs } from "@/components/vitrine/offres";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Tarifs NEOXIX : offres de démarrage, accompagnement et pôles de services. Périmètre écrit, exclusions précisées et montant sur devis, à Gatineau, à Ottawa et à distance.",
};

/** Page Tarifs : source unique (`contenu.offres`, `contenu.formules`, `contenu.services`). */
export default function PageTarifs() {
  const { formules, services, actionPrincipale, site, appelAction, tarifs } = contenu;
  return (
    <>
      <EnTetePage
        surtitre={tarifs.surtitre}
        titre={<TitreMarque titre={tarifs.titre} />}
        chapo={tarifs.intro}
        fil={[{ libelle: "Accueil", href: "/" }, { libelle: "Tarifs" }]}
      />

      <section aria-labelledby="titre-offres-tarifs">
        <div className="wrap">
          <h2 id="titre-offres-tarifs" className="rubrique-titre">
            Offres de démarrage
          </h2>
          <p className="statut-prose">{tarifs.statutMontants}</p>
          <TableauTarifs />
          <p className="note-bas">{contenu.offres.tarification}</p>
        </div>
      </section>

      <section className="fond-blanc" aria-labelledby="titre-accompagnement">
        <div className="wrap">
          <div className="entete-section simple revele">
            <div>
              <p className="surtitre">{formules.surtitre}</p>
              <h2 id="titre-accompagnement">
                <TitreMarque titre={formules.titre} />
              </h2>
            </div>
            <p className="lede">{formules.intro}</p>
          </div>
          <div className="grille-formules">
            {formules.items.map((formule) => (
              <article key={formule.titre} className="carte revele">
                <h3>{formule.titre}</h3>
                <p>{formule.texte}</p>
                <span className="statut">{formule.statut}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="titre-poles-tarifs">
        <div className="wrap">
          <h2 id="titre-poles-tarifs" className="rubrique-titre">
            Pôles de services
          </h2>
          <p className="lede-court">{services.tarification}.</p>
          <div className="grille-services">
            {services.poles.map((pole) => (
              <CarteService key={pole.slug} pole={pole} />
            ))}
          </div>
        </div>
      </section>

      <section className="appel sombre" aria-labelledby="titre-appel-tarifs">
        <div className="wrap appel-grille revele">
          <div>
            <h2 id="titre-appel-tarifs">{appelAction.titre}</h2>
            <p className="lede">{appelAction.texte}</p>
          </div>
          <div className="actions">
            <Link className="btn btn-principal" href={actionPrincipale.href}>
              {actionPrincipale.libelle} <span className="flecha" aria-hidden="true">→</span>
            </Link>
            <a className="btn btn-secondaire" href={`mailto:${site.courriel}`}>
              {site.courriel}
            </a>
          </div>
        </div>
      </section>

      <section className="fond-blanc" aria-labelledby="titre-engagements-tarifs">
        <div className="wrap">
          <h2 id="titre-engagements-tarifs" className="rubrique-titre">
            Nos engagements sur les montants
          </h2>
          <ul className="liste">
            {tarifs.engagements.map((texte) => (
              <li key={texte}>{texte}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
