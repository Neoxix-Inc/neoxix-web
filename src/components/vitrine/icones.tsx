import type { NomIcone, Realisation } from "@/content/types";

/** Icônes des cartes Solutions, reprises de la maquette V5 (SVG créés pour la maquette). */
export function Icone({ nom }: { nom: NomIcone }) {
  const commun = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, "aria-hidden": true, focusable: false } as const;
  switch (nom) {
    case "ecran":
      return (
        <svg {...commun} strokeLinecap="round">
          <rect x="3" y="4" width="18" height="13" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      );
    case "flux":
      return (
        <svg {...commun} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6h16M4 12h10M4 18h7" />
          <circle cx="18" cy="15" r="3" />
        </svg>
      );
    case "clients":
      return (
        <svg {...commun} strokeLinejoin="round">
          <circle cx="9" cy="8" r="3.5" />
          <path d="M3 20c.8-3.2 3.2-5 6-5s5.2 1.8 6 5M16 11l2 2 4-4" />
        </svg>
      );
    case "bouclier":
      return (
        <svg {...commun} strokeLinejoin="round">
          <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "blocs":
      return (
        <svg {...commun} strokeLinejoin="round">
          <rect x="3" y="3" width="8" height="8" rx="1.5" />
          <rect x="13" y="3" width="8" height="5" rx="1.5" />
          <rect x="13" y="11" width="8" height="10" rx="1.5" />
          <rect x="3" y="14" width="8" height="7" rx="1.5" />
        </svg>
      );
    case "courbe":
      return (
        <svg {...commun} strokeLinecap="round">
          <path d="M4 19V5M4 19h16" />
          <path d="M8 15l4-4 3 3 5-6" />
        </svg>
      );
  }
}

/** Aperçus abstraits des cartes Réalisations (aucune capture ni donnée réelle). */
export function Apercu({ type }: { type: Realisation["apercu"] }) {
  const commun = { viewBox: "0 0 200 110", fill: "none", "aria-hidden": true, focusable: false } as const;
  if (type === "plateforme") {
    return (
      <svg {...commun}>
        <rect x="10" y="10" width="180" height="90" rx="10" stroke="#4FD1C5" strokeWidth="2" />
        <circle cx="100" cy="55" r="18" stroke="#FF8B47" strokeWidth="2" />
        <path d="M60 80h80" stroke="#2C3D45" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "site") {
    return (
      <svg {...commun}>
        <rect x="14" y="12" width="172" height="86" rx="8" stroke="#4FD1C5" strokeWidth="2" />
        <path d="M14 28h172" stroke="#2C3D45" strokeWidth="2" />
        <circle cx="26" cy="20" r="2.5" fill="#FF8B47" />
        <path d="M30 48h70M30 60h50" stroke="#FF8B47" strokeWidth="4" strokeLinecap="round" />
        <rect x="120" y="42" width="50" height="40" rx="5" stroke="#4FD1C5" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M30 78h34" stroke="#2C3D45" strokeWidth="6" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "laboratoire") {
    return (
      <svg {...commun}>
        <circle cx="50" cy="55" r="12" stroke="#4FD1C5" strokeWidth="2" />
        <circle cx="150" cy="35" r="12" stroke="#FF8B47" strokeWidth="2" />
        <circle cx="150" cy="75" r="12" stroke="#FF8B47" strokeWidth="2" />
        <path d="M62 55L138 35M62 55L138 75" stroke="#4FD1C5" strokeWidth="2" strokeDasharray="4 5" />
      </svg>
    );
  }
  return (
    <svg {...commun}>
      <rect x="20" y="30" width="36" height="50" rx="6" stroke="#4FD1C5" strokeWidth="2" />
      <rect x="82" y="30" width="36" height="50" rx="6" stroke="#FF8B47" strokeWidth="2" />
      <rect x="144" y="30" width="36" height="50" rx="6" stroke="#4FD1C5" strokeWidth="2" />
    </svg>
  );
}
