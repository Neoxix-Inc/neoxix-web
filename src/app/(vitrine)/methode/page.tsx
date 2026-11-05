import type { Metadata } from "next";
import { contenu } from "@/content";
import { Engagements, EnTetePage, Methode, TitreMarque } from "@/components/vitrine/sections";

export const metadata: Metadata = {
  title: "Méthode",
  description: contenu.methode.intro,
};

export default function PageMethode() {
  const { methode } = contenu;
  return (
    <>
      <EnTetePage
        idTitre="t-page"
        surtitre={methode.surtitre}
        titre={<TitreMarque titre={methode.titre} />}
        chapo={methode.intro}
        fil={[{ libelle: "Accueil", href: "/" }, { libelle: "Méthode" }]}
      />
      <Methode sansTete />
      <Engagements />
    </>
  );
}
