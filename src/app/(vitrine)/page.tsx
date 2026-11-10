import { modeFormulaire } from "@/lib/demande/traitement";
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

/** Accueil : identité V5 ; ordre de lancement : prestations d'abord, puis besoins, méthode, preuves, contact. */
export default function Accueil() {
  return (
    <>
      <Heros />
      <Confiance />
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
