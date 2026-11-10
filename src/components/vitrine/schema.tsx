"use client";

import { useState, type CSSProperties } from "react";
import { contenu } from "@/content";

/**
 * Schéma du héros (V5) : un signal parcourt la ligne et chaque étape s'allume à tour de rôle (cycle de 8 s).
 * Écart assumé avec la maquette : l'animation s'arrête après 7 cycles (≈ 56 s) et un bouton permet de la
 * mettre en pause avant (décision V4, WCAG 2.2.2). Désactivée sous `prefers-reduced-motion`.
 * L'animation ne porte aucune information seule : chaque étape garde son libellé.
 */
export function Schema() {
  const [enPause, setEnPause] = useState(false);
  const { schema } = contenu.accueil;
  return (
    <figure className={`schema${enPause ? " en-pause" : ""}`} aria-labelledby="titre-schema">
      <div className="schema-tete">
        <span id="titre-schema">{schema.titre}</span>
        <b>{schema.mention}</b>
      </div>
      <div className="etapes">
        <span className="signal" aria-hidden="true" />
        <ol className="liste-etapes">
          {schema.etapes.map((etape, i) => (
            <li key={etape.numero} className={`etape${etape.humain ? " humain" : ""}`} style={{ "--d": `${i}s` } as CSSProperties}>
              <span className="noeud" aria-hidden="true">
                {etape.numero}
              </span>
              <span className="lbl">
                <span className="sr-seul">Étape {etape.numero} : </span>
                {etape.libelle}
                <small>{etape.detail}</small>
              </span>
              <span className="etiq">{etape.etiquette}</span>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="schema-pied">
        <span>{schema.pied[0]}</span>
        <span>{schema.pied[1]}</span>
        <button type="button" className="pause" aria-pressed={enPause} onClick={() => setEnPause((v) => !v)}>
          {enPause ? "Reprendre l'animation" : "Mettre l'animation en pause"}
        </button>
      </figcaption>
    </figure>
  );
}
