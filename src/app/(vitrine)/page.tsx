import type { Metadata } from "next";
import { contenu } from "@/content";
import { modeFormulaire } from "@/lib/demande/traitement";
import { metadonneesPage } from "@/lib/metadonnees";
import { Offres } from "@/components/vitrine/offres";
import {
  APropos,
  AppelAction,
  Confiance,
  Contact,
  Engagements,
  Faq,
  Formules,
  Heros,
  Methode,
  Realisations,
  Services,
  Solutions,
} from "@/components/vitrine/sections";

/** Accueil : titre absolu (sans suffixe), canonical racine. */
export const metadata: Metadata = {
  ...metadonneesPage({ titre: contenu.site.titre, description: contenu.site.description, chemin: "/" }),
  title: { absolute: contenu.site.titre },
  openGraph: { ...metadonneesPage({ titre: contenu.site.titre, description: contenu.site.description, chemin: "/" }).openGraph, title: contenu.site.titre },
};

/** Accueil : identité V5 ; ordre : offres de démarrage, prestations, besoins, méthode, preuves, contact. */
export default function Accueil() {
  return (
    <>
      <Heros />
      <Confiance />
      <Offres />
      <Services />
      <Solutions />
      <AppelAction />
      <Methode />
      <Realisations />
      <APropos />
      <Engagements />
      <Formules />
      <Faq />
      <Contact mode={modeFormulaire()} />
    </>
  );
}
