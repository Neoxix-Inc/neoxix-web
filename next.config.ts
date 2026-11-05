import type { NextConfig } from "next";

/** En-têtes de sécurité appliqués à toutes les routes (prévisualisation locale). */
const enTetesSecurite = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // The default CLI checker cannot parse TypeScript's --showConfig output in this runtime.
    useTypeScriptCli: false,
    // Deux layouts racines (vitrine, portfolio) : la 404 commune passe par app/global-not-found.tsx.
    globalNotFound: true,
  },
  async headers() {
    return [{ source: "/:path*", headers: enTetesSecurite }];
  },
};

export default nextConfig;
