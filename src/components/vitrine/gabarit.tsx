import type { ReactNode } from "react";
import { Entete } from "./entete";
import { Revelateur } from "./revelateur";
import { Pied } from "./sections";
import { donneesStructurees } from "@/lib/donnees-structurees";

/** Script exécuté avant le rendu : active les entrées au défilement seulement si JS est disponible. */
const scriptJs = "document.documentElement.classList.add('js')";

export function GabaritVitrine({ classes, children }: { classes: string; children: ReactNode }) {
  return (
    <html lang="fr-CA" className={classes} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: scriptJs }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(donneesStructurees()).replace(/</g, "\\u003c") }}
        />
        <a className="lien-evitement" href="#contenu">
          Aller au contenu
        </a>
        <Entete />
        <main id="contenu" tabIndex={-1}>
          {children}
        </main>
        <Pied />
        <Revelateur />
      </body>
    </html>
  );
}
