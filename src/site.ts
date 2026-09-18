/** Site-wide constants. Change the name here and it updates everywhere. */
export const site = {
  name: "Gustav Gybäck",
  description:
    "Engineering examples across frontend, backend, fullstack, and infrastructure.",
  /**
   * Public origin, used for absolute Open Graph URLs. Set NEXT_PUBLIC_SITE_URL
   * at build time on the host; the fallback only matters for local builds.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
