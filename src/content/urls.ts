// Pure URL helpers. Safe to import from client components (no Node APIs).

export function exampleHref(exampleSlug: string): string {
  return `/examples/${exampleSlug}`;
}

export function pageHref(exampleSlug: string, pageSlug: string): string {
  return pageSlug === "index"
    ? exampleHref(exampleSlug)
    : `${exampleHref(exampleSlug)}/${pageSlug}`;
}
