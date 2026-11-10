import type { NextConfig } from "next";

/**
 * Politique de sécurité du contenu : aucune ressource tierce. `unsafe-inline` reste nécessaire pour les
 * scripts d'hydratation de Next.js tant qu'aucun nonce n'est mis en place ; `unsafe-eval` seulement en dev.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "form-action 'self' mailto:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

/** En-têtes de sécurité appliqués à toutes les routes. */
const enTetesSecurite = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Hors production (prévisualisations, local) : jamais indexé.
  ...(process.env.VERCEL_ENV === "production" ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
];

/**
 * Anciennes adresses du portfolio (branche feat/services-platform et prévisualisation),
 * redirigées vers l'accueil. Préparation seulement : non déployé sur neoxix.ca.
 * Sur main (production), le portfolio n'avait qu'une adresse publique, « / », qui devient la vitrine.
 */
const anciennesAdressesPortfolio = ["/portfolio", "/portfolio/:chemin*", "/projects/:chemin*", "/technologies/:chemin*"];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // The default CLI checker cannot parse TypeScript's --showConfig output in this runtime.
    useTypeScriptCli: false,
    // 404 commune (app/global-not-found.tsx), indépendante des layouts.
    globalNotFound: true,
  },
  async redirects() {
    return anciennesAdressesPortfolio.map((source) => ({ source, destination: "/", statusCode: 301 as const }));
  },
  async headers() {
    return [{ source: "/:path*", headers: enTetesSecurite }];
  },
};

export default nextConfig;
