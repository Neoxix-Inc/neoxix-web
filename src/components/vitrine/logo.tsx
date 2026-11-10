import Link from "next/link";

/**
 * Mot-symbole NEOXIX existant, conservé jusqu'à la validation de la nouvelle identité graphique
 * (mission V5, point 6). À remplacer par les actifs de marque validés par le propriétaire.
 * Aucune mention « provisoire » n'est affichée au public (dossier V5, critère 7).
 */
export function Monogramme({ inverse = false, taille = 34 }: { inverse?: boolean; taille?: number }) {
  const fond = inverse ? "#FAF8F5" : "#10171A";
  const trait = inverse ? "#10171A" : "#FAF8F5";
  const point = inverse ? "#E87436" : "#FF8B47";
  return (
    <svg viewBox="0 0 32 32" width={taille} height={taille} aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="30" height="30" rx="7" fill={fond} />
      <path d="M9 23V9l14 14V9" fill="none" stroke={trait} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="23" cy="9" r="3" fill={point} />
    </svg>
  );
}

export function Marque({ href, libelle, inverse = false }: { href: string; libelle: string; inverse?: boolean }) {
  return (
    <Link className="marque" href={href} aria-label={libelle}>
      <Monogramme inverse={inverse} />
      <span>NEOXIX</span>
    </Link>
  );
}
