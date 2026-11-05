/**
 * LOGO PROVISOIRE (décision V6) : monogramme de maquette, à remplacer par le fichier officiel
 * fourni par le propriétaire. Ne pas utiliser comme logo définitif.
 */
export function Monogramme({ inverse = false, taille = 32 }: { inverse?: boolean; taille?: number }) {
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
