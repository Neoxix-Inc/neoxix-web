"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { contenu } from "@/content";
import { Marque } from "./logo";

/**
 * En-tête collant (V5) : navigation, bouton d'action principal, et menu mobile à bouton unique
 * (`aria-expanded`). Échap ferme le menu et rend le focus au bouton ; un clic à l'extérieur le ferme.
 */
export function Entete() {
  const [ouvert, setOuvert] = useState(false);
  const bouton = useRef<HTMLButtonElement>(null);
  const entete = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ouvert) return;
    const surTouche = (evenement: KeyboardEvent) => {
      if (evenement.key === "Escape") {
        setOuvert(false);
        bouton.current?.focus();
      }
    };
    const surClic = (evenement: MouseEvent) => {
      if (!entete.current?.contains(evenement.target as Node)) setOuvert(false);
    };
    document.addEventListener("keydown", surTouche);
    document.addEventListener("click", surClic);
    return () => {
      document.removeEventListener("keydown", surTouche);
      document.removeEventListener("click", surClic);
    };
  }, [ouvert]);

  const { navigation, actionPrincipale } = contenu;
  const fermer = () => setOuvert(false);

  return (
    <header className="entete" ref={entete}>
      <div className="wrap">
        <Marque href="/" libelle="NEOXIX, accueil" />
        <nav className="nav-principale" aria-label="Navigation principale">
          {navigation.map((lien) => (
            <Link key={lien.href} href={lien.href}>
              {lien.libelle}
            </Link>
          ))}
          <Link className="btn btn-principal" href={actionPrincipale.href}>
            {actionPrincipale.libelle}
          </Link>
        </nav>
        <button
          ref={bouton}
          className="bouton-menu"
          type="button"
          aria-expanded={ouvert}
          aria-controls="menu-mobile"
          aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOuvert((v) => !v)}
        >
          <span aria-hidden="true" />
        </button>
      </div>
      <nav className={`menu-mobile${ouvert ? " ouvert" : ""}`} id="menu-mobile" aria-label="Navigation mobile">
        {navigation.map((lien) => (
          <Link key={lien.href} href={lien.href} onClick={fermer}>
            {lien.libelle}
          </Link>
        ))}
        <Link className="btn btn-principal" href={actionPrincipale.href} onClick={fermer}>
          {actionPrincipale.libelle}
        </Link>
      </nav>
    </header>
  );
}
