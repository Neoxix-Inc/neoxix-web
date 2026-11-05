import type { NextConfig } from "next";

/** En-têtes de sécurité appliqués à toutes les routes (prévisualisation locale). */
const enTetesSecurite = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
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
