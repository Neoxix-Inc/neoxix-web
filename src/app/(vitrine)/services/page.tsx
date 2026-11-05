import type { Metadata } from "next";
import Link from "next/link";
import { contenu } from "@/content";
import { CarteService, EnTetePage, TitreMarque } from "@/components/vitrine/sections";

export const metadata: Metadata = {
  title: "Services",
  description: contenu.services.intro,
};

export default function PageServices() {
  const { services } = contenu;
  return (
    <>
      <EnTetePage
        idTitre="t-page"
        surtitre={services.surtitre}
        titre={<TitreMarque titre={services.titre} />}
        chapo={services.intro}
        fil={[{ libelle: "Accueil", href: "/" }, { libelle: "Services" }]}
      />
      <section className="bloc fond-lavis" aria-labelledby="t-poles">
        <div className="enveloppe">
          <h2 id="t-poles" className="sr-seul">
            Les quatre pôles
          </h2>
          <div className="services">
            {services.poles.map((pole, i) => (
              <CarteService key={pole.slug} pole={pole} index={i} />
            ))}
          </div>
          <div className="tarif revele">
            <strong>Tarification : {services.tarification}</strong>
            <p>{contenu.accueil.questions.items[2].texte}</p>
          </div>
          <div className="tarif revele">
            <strong>{services.maintenance.titre}</strong>
            <p>{services.maintenance.texte}</p>
          </div>
          <p style={{ marginTop: 32 }}>
            <Link className="btn btn-primaire" href="/contact">
              Nous écrire pour mon projet <span className="fleche" aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
