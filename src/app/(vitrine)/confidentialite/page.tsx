import type { Metadata } from "next";
import { contenu } from "@/content";
import { EnTetePage } from "@/components/vitrine/sections";
import { modeFormulaire } from "@/lib/demande/traitement";

export const metadata: Metadata = {
  title: "Confidentialité",
  description: contenu.confidentialite.statut,
};

export default function PageConfidentialite() {
  const { confidentialite } = contenu;
  // La politique décrit le traitement réellement actif : les sections du formulaire n'apparaissent qu'en mode `live`.
  const [premiere, ...autres] = confidentialite.sections;
  const sections =
    modeFormulaire() === "live"
      ? [premiere, ...confidentialite.avecFormulaire, ...autres]
      : [premiere, confidentialite.sansFormulaire, ...autres];
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
