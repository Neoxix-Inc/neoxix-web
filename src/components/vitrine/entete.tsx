"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { contenu } from "@/content";
import { Monogramme } from "./logo";

function estCourant(href: string, chemin: string): boolean {
  if (href.includes("#")) return false;
  return href === "/" ? chemin === "/" : chemin === href || chemin.startsWith(`${href}/`);
}

export function Entete() {
  const chemin = usePathname();
  const [defile, setDefile] = useState(false);
  const menu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const surDefilement = () => setDefile(window.scrollY > 8);
    surDefilement();
    window.addEventListener("scroll", surDefilement, { passive: true });
    return () => window.removeEventListener("scroll", surDefilement);
  }, []);

  // Échap ferme le menu mobile et rend le focus au bouton ; un clic à l'extérieur le ferme aussi.
  useEffect(() => {
    const details = menu.current;
    if (!details) return;
    const surTouche = (evenement: KeyboardEvent) => {
      if (evenement.key === "Escape" && details.open) {
        details.open = false;
        details.querySelector("summary")?.focus();
      }
    };
    const surClic = (evenement: MouseEvent) => {
      if (details.open && !details.contains(evenement.target as Node)) details.open = false;
    };
    document.addEventListener("keydown", surTouche);
    document.addEventListener("click", surClic);
    return () => {
      document.removeEventListener("keydown", surTouche);
      document.removeEventListener("click", surClic);
    };
  }, []);

  const fermerMenu = () => {
    if (menu.current) menu.current.open = false;
  };

  const { navigation, site } = contenu;

  return (
    <header className={`entete${defile ? " defile" : ""}`}>
      <div className="enveloppe">
        <Link className="logo" href="/" aria-label={`${site.nom}, accueil`}>
          <Monogramme />
          {site.nom}
        </Link>
        <span className="provisoire" title="Logo provisoire, non officiel">
          {site.logoProvisoire}
        </span>
        <nav className="nav" aria-label="Navigation principale">
          {navigation.map((lien) => (
            <Link key={lien.href} href={lien.href} aria-current={estCourant(lien.href, chemin) ? "page" : undefined}>
              {lien.libelle}
            </Link>
          ))}
        </nav>
        <details className="menu-mobile" ref={menu}>
          <summary aria-controls="panneau-navigation">Menu</summary>
          <nav className="panneau" id="panneau-navigation" aria-label="Navigation mobile">
            <Link href="/" onClick={fermerMenu} aria-current={chemin === "/" ? "page" : undefined}>
              Accueil
            </Link>
            {navigation.map((lien) => (
              <Link
                key={lien.href}
                href={lien.href}
                onClick={fermerMenu}
                aria-current={estCourant(lien.href, chemin) ? "page" : undefined}
              >
                {lien.libelle}
              </Link>
            ))}
          </nav>
        </details>
        <Link className="btn btn-primaire entete-action" href="/contact">
          Nous écrire
        </Link>
      </div>
    </header>
  );
}
