import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { contenu, lienCourriel, trouverPole } from "@/content";
import { elementsDuPole } from "@/lib/catalogue";
import { EnTetePage } from "@/components/vitrine/sections";
import { metadonneesPage } from "@/lib/metadonnees";
import { formatMontant } from "@/lib/tarification";

export const dynamicParams = false;

export function generateStaticParams() {
  return contenu.services.poles.map((pole) => ({ pole: pole.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[pole]">): Promise<Metadata> {
  const { pole: slug } = await params;
  const pole = trouverPole(slug);
  return pole ? metadonneesPage({ titre: pole.titre, description: pole.resume, chemin: `/services/${pole.slug}` }) : {};
}

export default async function PagePole({ params }: PageProps<"/services/[pole]">) {
  const { pole: slug } = await params;
  const pole = trouverPole(slug);
  if (!pole) notFound();
  const autres = contenu.services.poles.filter((p) => p.slug !== pole.slug);
  const tarifs = elementsDuPole(pole.slug);
  const colonnes: [string, string[]][] = [
    ["Peut être inclus", pole.detail.inclus],
    ["Dépend du périmètre", pole.detail.perimetre],
    ["Non inclus par défaut", pole.detail.nonInclus],
    ["Pour démarrer", pole.detail.demarrer],
  ];

  return (
    <>
      <EnTetePage
        surtitre={`Service ${pole.numero}`}
        titre={pole.titre}
        chapo={pole.resume}
        fil={[{ libelle: "Accueil", href: "/" }, { libelle: "Services", href: "/services" }, { libelle: pole.titreCourt }]}
      />
      <section>
        <div className="wrap">
          <div className="pole-grille">
            <div>
              {pole.probleme && <p className="citation revele">{pole.probleme}</p>}
              <div className="rubrique revele">
                <h2>Ce que nous faisons</h2>
                <ul className="liste">
                  {pole.prestations.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
              <div className="rubrique revele scenario scenario-page">
                <h2>{pole.exemple.titre}</h2>
                <p>{pole.exemple.texte}</p>
                <p className="scenario-mention">Scénario type, adapté à chaque mandat.</p>
              </div>
              {pole.paliers && (
                <div className="rubrique revele">
                  <h2>Trois paliers d&apos;engagement</h2>
                  <ol className="paliers">
                    {pole.paliers.map((palier, i) => (
                      <li key={palier.titre}>
                        <h3>
                          {i + 1}. {palier.titre}
                        </h3>
                        <p>{palier.texte}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              <div className="rubrique revele">
                <h2>Résultat recherché</h2>
                <p>{pole.resultatRecherche.replace(/^Résultat recherché : /, "").replace(/^./, (c) => c.toUpperCase())}</p>
              </div>
              <div className="rubrique revele">
                <h2>Périmètre</h2>
                <div className="detail-grille">
                  {colonnes.map(([titre, items]) => (
                    <div key={titre}>
                      <h3>{titre}</h3>
                      <ul>
                        {items.map((i) => (
                          <li key={i}>{i}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              {pole.deroulement && (
                <div className="rubrique revele">
                  <h2>Déroulement</h2>
                  <p>{pole.deroulement}</p>
                </div>
              )}
              {pole.ensuite && (
                <div className="rubrique revele">
                  <h2>Ensuite</h2>
                  <p>{pole.ensuite}</p>
                </div>
              )}
              {pole.choixTechnologique && (
                <div className="rubrique revele choix-techno">
                  <h2>{pole.choixTechnologique.titre}</h2>
                  <p>{pole.choixTechnologique.texte}</p>
                  <ul className="liste">
                    {pole.choixTechnologique.avis.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
              {pole.note && <p className="note-marques">{pole.note}</p>}
            </div>
            <aside className="encart-pole revele" aria-label="Demander une proposition">
              <div>
                <h2>Pour votre devis</h2>
                <p>{pole.pourDevis}</p>
              </div>
              <div>
                <h2>Tarifs de référence</h2>
                {tarifs.length > 0 ? (
                  <ul className="tarifs-pole">
                    {tarifs.map((element) => (
                      <li key={element.id}>
                        <span>{element.intitule}</span>
                        <strong>{formatMontant(element)}</strong>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Sur devis</p>
                )}
                <p className="encart-mention">Montants en dollars canadiens, hors licences tierces, matériel, déplacements et taxes applicables.</p>
              </div>
              <Link className="btn btn-principal" href="/contact">
                {contenu.actionPrincipale.libelle}
              </Link>
              <a className="lien-courriel" href={lienCourriel(`Demande : ${pole.titre}`)}>
                Ou écrire à {contenu.site.courriel}
              </a>
            </aside>
          </div>

          <div className="autres">
            <h2>Les autres services</h2>
            <ul className="grille-autres">
              {autres.map((p) => (
                <li key={p.slug}>
                  <Link className="carte lien-carte" href={`/services/${p.slug}`}>
                    <span className="service-num" aria-hidden="true">
                      {p.numero}
                    </span>
                    <span className="lien-carte-titre">{p.titre}</span>
                    <span className="lien-carte-texte">{p.accroche}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
