import type { Metadata } from "next";
import { contenu } from "@/content";
import { EnTetePage } from "@/components/vitrine/sections";

export const metadata: Metadata = {
  title: "Confidentialité (texte provisoire)",
  description: contenu.confidentialite.statut,
};

export default function PageConfidentialite() {
  const { confidentialite } = contenu;
  return (
    <>
      <EnTetePage
        idTitre="t-page"
        surtitre="Légal"
        titre={confidentialite.titre}
        fil={[{ libelle: "Accueil", href: "/" }, { libelle: confidentialite.titre }]}
      />
      <section className="bloc">
        <div className="enveloppe">
          <div className="prose">
            <p className="statut" role="note">
              {confidentialite.statut}
            </p>
            {confidentialite.sections.map((s) => (
              <section key={s.titre}>
                <h2>{s.titre}</h2>
                <p>{s.texte}</p>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
