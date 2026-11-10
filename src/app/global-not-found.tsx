import type { Metadata } from "next";
import Link from "next/link";
import { contenu } from "@/content";
import { classesPolices } from "./fonts/polices";
import { GabaritVitrine } from "@/components/vitrine/gabarit";
import "./(vitrine)/vitrine.css";

export const metadata: Metadata = {
  title: `${contenu.introuvable.titre} · NEOXIX`,
  robots: { index: false, follow: false },
};

/** 404 commune aux deux groupes de routes (vitrine et portfolio), qui ont chacun leur layout racine. */
export default function Introuvable() {
  const { introuvable } = contenu;
  return (
    <GabaritVitrine classes={classesPolices}>
      <section className="introuvable sombre" aria-labelledby="t-404">
        <div className="wrap">
          <p className="code">{introuvable.code}</p>
          <h1 id="t-404">{introuvable.titre}</h1>
          <p>{introuvable.texte}</p>
          <div className="actions">
            <Link className="btn btn-principal" href="/">
              {introuvable.retour}
            </Link>
            <Link className="btn btn-secondaire" href="/services">
              Voir les services
            </Link>
          </div>
        </div>
      </section>
    </GabaritVitrine>
  );
}
