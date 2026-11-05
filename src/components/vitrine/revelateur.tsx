"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Ajoute la classe `visible` aux éléments `.revele` et `[data-trace]` lorsqu'ils entrent à l'écran.
 * Sans JavaScript, la classe `.js` n'existe pas sur <html> et tout le contenu reste visible.
 * Avec `prefers-reduced-motion`, tout est rendu visible immédiatement.
 */
export function Revelateur() {
  const chemin = usePathname();

  useEffect(() => {
    const cibles = Array.from(document.querySelectorAll<HTMLElement>(".revele, [data-trace]"));
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduit || !("IntersectionObserver" in window)) {
      cibles.forEach((el) => el.classList.add("visible"));
      return;
    }
    const observateur = new IntersectionObserver(
      (entrees) => {
        entrees.forEach((entree) => {
          if (entree.isIntersecting) {
            entree.target.classList.add("visible");
            observateur.unobserve(entree.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    cibles.forEach((el) => observateur.observe(el));
    return () => observateur.disconnect();
  }, [chemin]);

  return null;
}
