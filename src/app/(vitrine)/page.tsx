import { modeFormulaire } from "@/lib/demande/traitement";
import {
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

/** Accueil : maquette V5, sections dans l'ordre du dossier de transfert (§ 3). */
export default function Accueil() {
  return (
    <>
      <Heros />
      <Confiance />
      <Solutions />
      <Services />
      <Realisations />
      <Methode />
      <Engagements />
      <Formules />
      <Faq />
      <Contact mode={modeFormulaire()} />
    </>
  );
}
