import type { Metadata } from "next";
import { contenu } from "@/content";
import { EnTetePage } from "@/components/vitrine/sections";
import { modeFormulaire } from "@/lib/demande/traitement";
import { sectionsConfidentialite } from "@/lib/confidentialite";

export const metadata: Metadata = {
  title: "Confidentialité",
  description: contenu.confidentialite.statut,
};

export default function PageConfidentialite() {
  const { confidentialite } = contenu;
  // La politique décrit le traitement réellement actif ; la conservation reste visible quel que soit le mode.
  const sections = sectionsConfidentialite(confidentialite, modeFormulaire());
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
            {sections.map((s) => (
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
