import type { Metadata } from "next";
import Link from "next/link";
import { contenu } from "@/content";
import { Contact, Faq } from "@/components/vitrine/sections";

export const metadata: Metadata = {
  title: "Contact",
  description: contenu.contact.lead,
};

export default function PageContact() {
  const { contact, services } = contenu;
  return (
    <>
      <Contact titreNiveau={1} />
      <section className="bloc" aria-labelledby="t-preparer">
        <div className="enveloppe">
          <div className="tete">
            <div className="revele">
              <p className="surtitre">Préparer votre message</p>
              <h2 id="t-preparer">{contact.preparer.titre}</h2>
            </div>
            <p className="revele">{contact.preparer.intro}</p>
          </div>
          <div className="preparer">
            {services.poles.map((pole) => (
              <article key={pole.slug} className="revele">
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
