import Link from "next/link";
import { contenu, lienCourriel, trouverPole } from "@/content";
import type { OffreDemarrage } from "@/content/types";
import { Icone } from "./icones";
import { EnTete } from "./sections";

/** Montant affiché : valeur validée, ou « Sur devis » tant qu'elle ne l'est pas. */
export function montantOffre(offre: OffreDemarrage): string {
  return offre.prix ?? "Sur devis";
}

/** Lien de demande pré-rempli pour une offre (sujet du courriel = titre de l'offre). */
export function lienDevisOffre(offre: OffreDemarrage): string {
  return lienCourriel(`Proposition : ${offre.titre}`);
}

/** Section « Offres pour démarrer rapidement » de l'accueil. */
export function Offres() {
  const { offres } = contenu;
  return (
    <section id="offres" className="fond-blanc" aria-labelledby="titre-offres">
      <div className="wrap">
        <EnTete section={offres} idTitre="titre-offres" />
        <div className="grille-offres">
          {offres.items.map((offre) => (
            <article key={offre.slug} className="carte offre revele">
              <div className="icone" aria-hidden="true">
                <Icone nom={offre.icone} />
              </div>
              <h3>{offre.titre}</h3>
              <p>{offre.accroche}</p>
              <p className="offre-pour">
                <span className="mono">Pour :</span> {offre.pour}
              </p>
              <div className="carte-pied offre-pied">
                <span className="statut">
                  <span className="sr-seul">Tarif : </span>
                  {montantOffre(offre)}
                </span>
                <Link className="lien-fleche" href={`/offres/${offre.slug}`}>
                  Voir l&apos;offre<span className="sr-seul"> : {offre.titre}</span> <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
        <p className="note-bas">{offres.tarification}</p>
      </div>
    </section>
  );
}

/** Tableau centralisé des offres de démarrage, page Tarifs. */
export function TableauTarifs() {
  const { offres } = contenu;
  return (
    <div className="tableau-tarifs-cadre revele">
      <table className="tableau-tarifs">
        <caption className="sr-seul">Offres de démarrage et montants</caption>
        <thead>
          <tr>
            <th scope="col">Offre</th>
            <th scope="col">Public</th>
            <th scope="col">Montant</th>
            <th scope="col">
              <span className="sr-seul">Action</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {offres.items.map((offre) => {
            const pole = offre.pole ? trouverPole(offre.pole) : undefined;
            return (
              <tr key={offre.slug}>
                <th scope="row">
                  <Link href={`/offres/${offre.slug}`}>{offre.titre}</Link>
                  {pole && <span className="tableau-pole">Lié au service : {pole.titreCourt}</span>}
                </th>
                <td>{offre.pour}</td>
                <td className="tableau-montant">{montantOffre(offre)}</td>
                <td>
                  <a className="lien-fleche" href={lienDevisOffre(offre)}>
                    Demander une proposition<span className="sr-seul"> : {offre.titre}</span>
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
