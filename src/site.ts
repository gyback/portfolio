/** Site-wide constants. Change the name here and it updates everywhere. */
export const site = {
  name: "Gustav Gybäck",
  description:
    "Engineering examples across frontend, backend, fullstack, and infrastructure.",
  url: resolveSiteUrl(),
} as const;

/**
 * Public origin, used for absolute Open Graph URLs. Resolved at build time:
 *
 * 1. NEXT_PUBLIC_SITE_URL when set (custom domain, or any non-Vercel host)
 * 2. On Vercel, the production domain for production builds and the
 *    deployment URL for previews, so previews get working previews too
 * 3. localhost for local builds
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercelHost =
    process.env.VERCEL_ENV === "production"
      ? process.env.VERCEL_PROJECT_PRODUCTION_URL
      : process.env.VERCEL_URL;
  if (vercelHost) return `https://${vercelHost}`;

  return "http://localhost:3000";
}
