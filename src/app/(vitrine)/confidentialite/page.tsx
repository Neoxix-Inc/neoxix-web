import type { Metadata } from "next";
import { contenu } from "@/content";
import { EnTetePage } from "@/components/vitrine/sections";

export const metadata: Metadata = {
  title: "Confidentialité",
  description: contenu.confidentialite.statut,
};

export default function PageConfidentialite() {
  const { confidentialite } = contenu;
  return (
    <>
      <EnTetePage
        surtitre="Confidentialité"
        titre={confidentialite.titre}
        fil={[{ libelle: "Accueil", href: "/" }, { libelle: confidentialite.titre }]}
      />
      <section>
        <div className="wrap">
          <div className="prose">
            <p className="statut-prose" role="note">
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
