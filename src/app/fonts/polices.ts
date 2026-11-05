import localFont from "next/font/local";

/** Polices auto-hébergées (SIL OFL 1.1, voir LICENCES.md). Aucune requête vers un service tiers. */
export const plexSans = localFont({
  src: [
    { path: "./ibm-plex-sans-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./ibm-plex-sans-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "./ibm-plex-sans-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./ibm-plex-sans-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./ibm-plex-sans-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--police-sans",
  display: "swap",
});

export const plexMono = localFont({
  src: [
    { path: "./ibm-plex-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./ibm-plex-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./ibm-plex-mono-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--police-mono",
  display: "swap",
  preload: false,
});

export const bricolage = localFont({
  src: "./bricolage-latin.woff2",
  weight: "200 800",
  variable: "--police-titre",
  display: "swap",
});

export const classesPolices = `${plexSans.variable} ${plexMono.variable} ${bricolage.variable}`;
