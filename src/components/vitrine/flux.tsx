"use client";

import { useState } from "react";
import { contenu } from "@/content";

/**
 * Schéma illustratif en boucle. L'animation CSS s'arrête seule après 7 cycles (≈ 56 s) ;
 * le bouton permet de la mettre en pause avant. Désactivée sous `prefers-reduced-motion`.
 */
export function Flux() {
  const [enPause, setEnPause] = useState(false);
  const { flux } = contenu.accueil;
  return (
    <figure className={`flux enfant${enPause ? " en-pause" : ""}`} style={{ "--retard": ".35s" } as React.CSSProperties} aria-describedby="flux-legende">
      <div className="flux-titre">
        <span>{flux.titre}</span>
        <span>{flux.sousTitre}</span>
      </div>
      <ol>
        {flux.etapes.map((etape) => (
          <li key={etape.numero} className={etape.humain ? "humain" : undefined}>
            <span className="noeud" aria-hidden="true">
              {etape.numero}
            </span>
            <span className="lbl">
              {etape.libelle}
              <small>{etape.detail}</small>
            </span>
            <span className="etiq">{etape.etiquette}</span>
          </li>
        ))}
      </ol>
      <div className="legende">
        <span className="legende-texte" id="flux-legende">
          <span>
            <i aria-hidden="true">●</i> {flux.legende[0]}
          </span>
          <span>
            <i className="h" aria-hidden="true">◌</i> {flux.legende[1]}
          </span>
          <span>{flux.legende[2]}</span>
        </span>
        <button type="button" className="pause" aria-pressed={enPause} onClick={() => setEnPause((v) => !v)}>
          {enPause ? "Reprendre l'animation" : "Mettre l'animation en pause"}
        </button>
      </div>
    </figure>
  );
}
