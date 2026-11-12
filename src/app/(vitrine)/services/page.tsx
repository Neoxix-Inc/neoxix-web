import type { Metadata } from "next";
import Link from "next/link";
import { contenu } from "@/content";
import { CarteService, EnTetePage, TitreMarque } from "@/components/vitrine/sections";
import { metadonneesPage } from "@/lib/metadonnees";

export const metadata: Metadata = metadonneesPage({
  titre: "Services",
  description: contenu.services.intro ?? contenu.site.description,
  chemin: "/services",
});

export default function PageServices() {
  const { services, formules, actionPrincipale } = contenu;
  return (
    <>
      <EnTetePage
        surtitre={services.surtitre}
        titre={<TitreMarque titre={services.titre} />}
        chapo={services.intro}
        fil={[{ libelle: "Accueil", href: "/" }, { libelle: "Services" }]}
      />
      <section className="fond-blanc" aria-labelledby="titre-poles">
        <div className="wrap">
          <h2 id="titre-poles" className="sr-seul">
            Les quatre pôles
          </h2>
          <div className="grille-services">
            {services.poles.map((pole) => (
              <CarteService key={pole.slug} pole={pole} />
            ))}
          </div>
          <div className="tarif revele">
            <strong>Tarification : {services.tarification}</strong>
            <p>{formules.intro}</p>
          </div>
          <p className="action-bas">
            <Link className="btn btn-principal" href={actionPrincipale.href}>
              {actionPrincipale.libelle} <span className="flecha" aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
