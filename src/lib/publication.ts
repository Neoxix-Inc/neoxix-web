/**
 * Indexation : seul le déploiement de production Vercel (`VERCEL_ENV=production`, neoxix.ca) est
 * indexable. Prévisualisations, poste local et tests restent en `noindex`. Évalué au build.
 */
export const SITE_URL = "https://neoxix.ca";

export function indexable(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.VERCEL_ENV === "production";
}
