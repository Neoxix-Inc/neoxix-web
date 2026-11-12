import { modeFormulaire } from "@/lib/demande/traitement";
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
