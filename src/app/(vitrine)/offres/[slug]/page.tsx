import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { contenu, trouverOffre, trouverPole } from "@/content";
import { EnTetePage } from "@/components/vitrine/sections";
import { lienDevisOffre, montantOffre } from "@/components/vitrine/offres";

export const dynamicParams = false;

export function generateStaticParams() {
  return contenu.offres.items.map((offre) => ({ slug: offre.slug }));
}

export async function generateMetadata({ params }: PageProps<"/offres/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const offre = trouverOffre(slug);
  return offre ? { title: `${offre.titre} · Gatineau et Ottawa`, description: offre.accroche } : {};
}

export default async function PageOffre({ params }: PageProps<"/offres/[slug]">) {
  const { slug } = await params;
  const offre = trouverOffre(slug);
  if (!offre) notFound();
  const pole = offre.pole ? trouverPole(offre.pole) : undefined;
  const autres = contenu.offres.items.filter((o) => o.slug !== offre.slug);

  return (
    <>
      <EnTetePage
        surtitre="Offre de démarrage"
        titre={offre.titre}
        chapo={offre.accroche}
        fil={[{ libelle: "Accueil", href: "/" }, { libelle: "Tarifs", href: "/tarifs" }, { libelle: offre.titre }]}
      />
      <section>
        <div className="wrap">
          <div className="pole-grille">
            <div>
              <p className="citation revele">Pour : {offre.pour}</p>
              <div className="rubrique revele">
                <h2>Résultat recherché</h2>
                <p>{offre.resultat}</p>
              </div>
              <div className="rubrique revele">
                <h2>Ce que comprend l&apos;offre</h2>
                <ul className="liste">
                  {offre.inclus.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rubrique revele">
                <h2>Ce qui n&apos;est pas inclus</h2>
                <ul className="liste">
                  {offre.nonInclus.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rubrique revele">
                <h2>Déroulement</h2>
                <ol className="paliers">
                  {offre.deroulement.map((etape, i) => (
                    <li key={etape}>
                      <h3>
                        {i + 1}. {etape}
                      </h3>
                    </li>
                  ))}
                </ol>
              </div>
              {pole && (
                <div className="rubrique revele">
                  <h2>Service associé</h2>
                  <p>
                    Cette offre relève du pôle{" "}
                    <Link href={`/services/${pole.slug}`}>{pole.titre}</Link>, qui couvre le périmètre plus large de ce type de mandat.
                  </p>
                </div>
              )}
              {offre.note && <p className="note-marques">{offre.note}</p>}
            </div>

            <aside className="encart-pole revele" aria-label="Demander une proposition">
              <div>
                <h2>Tarif</h2>
                <p className="prix-offre">{montantOffre(offre)}</p>
                <p>{contenu.offres.tarification}</p>
              </div>
              <div>
                <h2>Pour votre devis</h2>
                <p>{offre.pourDevis}</p>
              </div>
              <Link className="btn btn-principal" href="/contact">
                Demander une proposition <span className="flecha" aria-hidden="true">→</span>
              </Link>
              <a className="lien-courriel" href={lienDevisOffre(offre)}>
                Ou écrire à {contenu.site.courriel}
              </a>
              <p className="encart-mention">Proposition écrite, sans engagement.</p>
            </aside>
          </div>

          <div className="autres">
            <h2>Les autres offres</h2>
            <ul className="grille-autres">
              {autres.map((o) => (
                <li key={o.slug}>
                  <Link className="carte lien-carte" href={`/offres/${o.slug}`}>
                    <span className="lien-carte-titre">{o.titre}</span>
                    <span className="lien-carte-texte">{o.accroche}</span>
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
