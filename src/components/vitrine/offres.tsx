import Link from "next/link";
import { contenu, lienCourriel } from "@/content";
import type { ElementCatalogue, OffreDemarrage } from "@/content/types";
import { elementsDeLOffre } from "@/lib/catalogue";
import { etiquetteStatut, formatMontant, montantsAffiches, montantsProposesVisibles } from "@/lib/tarification";
import { Icone } from "./icones";
import { EnTete } from "./sections";

/** Repère de prix d'une offre : son premier élément référencé (prix de départ). */
export function repereOffre(offre: OffreDemarrage): { intitule: string; montant: string } | null {
  const [premier] = elementsDeLOffre(offre);
  if (!premier) return null;
  return { intitule: premier.intitule, montant: formatMontant(premier) };
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
          {offres.items.map((offre) => {
            const repere = repereOffre(offre);
            return (
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
                  {repere && (
                    <span className="statut">
                      <span className="sr-seul">Repère tarifaire : </span>
                      {repere.intitule} : {repere.montant}
                    </span>
                  )}
                  <Link className="lien-fleche" href={`/offres/${offre.slug}`}>
                    Voir l&apos;offre<span className="sr-seul"> : {offre.titre}</span> <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
        <p className="note-bas">{offres.tarification}</p>
      </div>
    </section>
  );
}

/** Tableau d'une catégorie du catalogue, page Tarifs. */
export function TableauCategorie({ titre, texte, elements }: { titre: string; texte: string; elements: ElementCatalogue[] }) {
  return (
    <div className="tableau-categorie revele">
      <h3 className="tableau-categorie-titre">{titre}</h3>
      <p className="tableau-categorie-texte">{texte}</p>
      <div className="tableau-tarifs-cadre">
        <table className="tableau-tarifs">
          <caption className="sr-seul">{titre}</caption>
          <thead>
            <tr>
              <th scope="col">Prestation</th>
              <th scope="col">Montant</th>
              <th scope="col">Exclusions et conditions</th>
            </tr>
          </thead>
          <tbody>
            {elements.map((element) => (
              <tr key={element.id}>
                <th scope="row">
                  {element.intitule}
                  <span className="tableau-desc">{element.description}</span>
                  {element.perimetre && (
                    <ul className="tableau-perimetre">
                      {element.perimetre.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  )}
                </th>
                <td className="tableau-montant">
                  {formatMontant(element)}
                  {etiquetteStatut(element) && <span className="tableau-desc">{etiquetteStatut(element)}</span>}
                </td>
                <td>
                  {[...(element.conditions ?? []), ...element.exclusions].length > 0 ? (
                    <ul className="tableau-notes">
                      {[...(element.conditions ?? []), ...element.exclusions].map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="sr-seul">Aucune exclusion particulière</span>
                  )}
                  {montantsProposesVisibles() && element.pointArbitrage && <p className="tableau-arbitrage">{element.pointArbitrage}</p>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Mention de statut affichée hors production : montants proposés, non approuvés. */
export function StatutMontants() {
  if (!montantsAffiches()) {
    return <p className="statut-prose">Tarifs sur devis : une proposition écrite précise le montant avant tout travail.</p>;
  }
  return <p className="statut-prose">{contenu.tarifs.statutMontants}</p>;
}
