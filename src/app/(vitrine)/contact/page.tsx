import type { Metadata } from "next";
import Link from "next/link";
import { contenu } from "@/content";
import { modeFormulaire } from "@/lib/demande/traitement";
import { Contact, Faq } from "@/components/vitrine/sections";

export const metadata: Metadata = {
  title: "Présenter mon projet",
  description: contenu.contact.intro,
};

export default function PageContact() {
  const { contact, services } = contenu;
  return (
    <>
      <Contact mode={modeFormulaire()} Titre="h1" />
      <section aria-labelledby="titre-preparer">
        <div className="wrap">
          <div className="entete-section revele">
            <div>
              <p className="surtitre">Préparer votre demande</p>
              <h2 id="titre-preparer">{contact.preparer.titre}</h2>
            </div>
            <p className="lede">{contact.preparer.intro}</p>
          </div>
          <div className="preparer">
            {services.poles.map((pole) => (
              <article key={pole.slug} className="carte revele">
                <h3>
                  <Link href={`/services/${pole.slug}`}>{pole.titre}</Link>
                </h3>
                <p>{pole.pourDevis}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Faq />
    </>
  );
}
