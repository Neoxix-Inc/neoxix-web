import type { CSSProperties } from "react";
import Link from "next/link";
import { contenu } from "@/content";
import { Flux } from "@/components/vitrine/flux";
import { Contact, Engagements, Faq, Methode, Questions, Services, TitreMarque } from "@/components/vitrine/sections";

const retard = (secondes: number) => ({ "--retard": `${secondes}s` }) as CSSProperties;

export default function Accueil() {
  const { accueil } = contenu;
  return (
    <>
      <section className="hero nuit" id="accueil" aria-labelledby="t-hero">
        <div className="enveloppe">
          <div>
            <p className="surtitre enfant" style={retard(0.05)}>
              {accueil.surtitre}
            </p>
            <h1 id="t-hero" className="enfant" style={retard(0.15)}>
              <TitreMarque titre={accueil.titre} />
            </h1>
            <p className="chapo enfant" style={retard(0.3)}>
              {accueil.chapo}
            </p>
            <div className="actions enfant" style={retard(0.45)}>
              <Link className="btn btn-ambre-vif btn-grand" href="/contact">
                {accueil.actionPrincipale}{" "}
                <span className="fleche" aria-hidden="true">
                  →
                </span>
              </Link>
              <Link className="btn btn-nuit-secondaire btn-grand" href="/services">
                {accueil.actionSecondaire}
              </Link>
            </div>
            <p className="pour enfant" style={retard(0.6)}>
              {accueil.publics.map((p) => (
                <span key={p}>{p}</span>
              ))}
            </p>
          </div>
          <Flux />
        </div>
      </section>

      <div className="bande nuit">
        <div className="enveloppe">
          <ul aria-label="Repères">
            {accueil.reperes.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </div>

      <Questions />
      <Services />
      <Methode />
      <Engagements />
      <Faq />
      <Contact />
    </>
  );
}
