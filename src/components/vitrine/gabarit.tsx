import type { ReactNode } from "react";
import { Entete } from "./entete";
import { Revelateur } from "./revelateur";
import { Bandeau, BarreMobile, Pied } from "./sections";

/** Script exécuté avant le rendu : active les entrées au défilement seulement si JS est disponible. */
const scriptJs = "document.documentElement.classList.add('js')";

export function GabaritVitrine({ classes, children }: { classes: string; children: ReactNode }) {
  return (
    <html lang="fr-CA" className={classes} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: scriptJs }} />
        <a className="saut" href="#contenu">
          Aller au contenu
        </a>
        <Bandeau />
        <Entete />
        <main id="contenu" tabIndex={-1}>
          {children}
        </main>
        <Pied />
        <BarreMobile />
        <Revelateur />
      </body>
    </html>
  );
}
