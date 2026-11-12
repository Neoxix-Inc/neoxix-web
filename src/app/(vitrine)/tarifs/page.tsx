import type { Metadata } from "next";
import Link from "next/link";
import { contenu, elementsDuPole } from "@/content";
import { EnTetePage, TitreMarque } from "@/components/vitrine/sections";
import { StatutMontants, TableauCategorie } from "@/components/vitrine/offres";
import { formatMontant } from "@/lib/tarification";
import { metadonneesPage } from "@/lib/metadonnees";

export const metadata: Metadata = metadonneesPage({
  titre: "Tarifs",
  description:
    "Tarifs NEOXIX : honoraires, services ponctuels, forfaits mensuels et tarifs horaires pour les PME de Gatineau, d'Ottawa et à distance. Périmètre écrit et exclusions précisées.",
  chemin: "/tarifs",
});

/** Page Tarifs : compacte, lit tout le catalogue (`contenu.catalogue`) ; ne recopie pas les pôles. */
export default function PageTarifs() {
  const { actionPrincipale, site, appelAction, tarifs, catalogue, services } = contenu;
  return (
    <>
      <EnTetePage
        surtitre={tarifs.surtitre}
        titre={<TitreMarque titre={tarifs.titre} />}
        chapo={tarifs.intro}
        fil={[{ libelle: "Accueil", href: "/" }, { libelle: "Tarifs" }]}
      />

      <section aria-labelledby="titre-catalogue">
        <div className="wrap">
          <h2 id="titre-catalogue" className="sr-seul">
            Catalogue des tarifs
          </h2>
          <StatutMontants />
          <p className="mention-commune">{catalogue.mention}</p>

          {catalogue.categories.map((categorie) => (
            <TableauCategorie
              key={categorie.id}
              titre={categorie.titre}
              texte={categorie.texte}
              elements={catalogue.elements.filter((e) => e.categorie === categorie.id)}
            />
          ))}
        </div>
      </section>

      <section className="fond-blanc" aria-labelledby="titre-hors-honoraires">
        <div className="wrap">
          <div className="entete-section simple revele">
            <div>
              <p className="surtitre">Hors honoraires</p>
              <h2 id="titre-hors-honoraires">
                Ce qui <span className="accent">n&apos;est pas dans nos honoraires.</span>
              </h2>
            </div>
          </div>
          <ul className="grille-hors">
            {catalogue.horsHonoraires.map((item) => (
              <li key={item.titre} className="carte revele">
                <h3>{item.titre}</h3>
                <p>{item.texte}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="titre-poles-tarifs">
        <div className="wrap">
          <h2 id="titre-poles-tarifs" className="rubrique-titre">
            Par pôle de service
          </h2>
          <p className="lede-court">Le détail des périmètres est à la page de chaque service.</p>
          <ul className="grille-poles-tarifs">
            {services.poles.map((pole) => {
              const [premier] = elementsDuPole(pole.slug);
              return (
                <li key={pole.slug}>
                  <Link className="carte lien-carte" href={`/services/${pole.slug}`}>
                    <span className="service-num" aria-hidden="true">
                      {pole.numero}
                    </span>
                    <span className="lien-carte-titre">{pole.titre}</span>
                    <span className="statut">
                      {premier ? `${premier.intitule} : ${formatMontant(premier)}` : "Sur devis"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
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
