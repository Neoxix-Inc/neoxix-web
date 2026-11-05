import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { contenu, lienCourriel, trouverPole } from "@/content";
import { CarteService, EnTetePage } from "@/components/vitrine/sections";

export const dynamicParams = false;

export function generateStaticParams() {
  return contenu.services.poles.map((pole) => ({ pole: pole.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[pole]">): Promise<Metadata> {
  const { pole: slug } = await params;
  const pole = trouverPole(slug);
  return pole ? { title: pole.titre, description: pole.resume } : {};
}

export default async function PagePole({ params }: PageProps<"/services/[pole]">) {
  const { pole: slug } = await params;
  const pole = trouverPole(slug);
  if (!pole) notFound();
  const autres = contenu.services.poles.filter((p) => p.slug !== pole.slug);

  return (
    <>
      <EnTetePage
        idTitre="t-page"
        surtitre={`Service ${pole.numero}`}
        titre={pole.titre}
        chapo={pole.resume}
        fil={[{ libelle: "Accueil", href: "/" }, { libelle: "Services", href: "/services" }, { libelle: pole.titreCourt }]}
      />
      <section className="bloc">
        <div className="enveloppe">
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
              {pole.resultat && (
                <div className="rubrique revele">
                  <h2>Résultat attendu</h2>
                  <p>{pole.resultat}</p>
                </div>
              )}
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
              {pole.nonInclus && (
                <div className="rubrique revele">
                  <h2>Non inclus</h2>
                  <p>{pole.nonInclus}</p>
                </div>
              )}
              {pole.note && <p className="note-marques">{pole.note}</p>}
            </div>
            <aside className="encart revele" aria-label="Demander une proposition">
              <div>
                <h2>Pour votre devis</h2>
                <p>{pole.pourDevis}</p>
              </div>
              <div>
                <h2>Tarification</h2>
                <p>{contenu.services.tarification}</p>
              </div>
              <a className="btn btn-primaire" href={lienCourriel(`Demande : ${pole.titre}`)}>
                Écrire à {contenu.site.courriel}
              </a>
            </aside>
          </div>

          <div className="autres">
            <h2>Les autres services</h2>
            <div className="services">
              {autres.map((p, i) => (
                <CarteService key={p.slug} pole={p} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
