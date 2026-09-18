// Display labels. Pure, safe for client components.

import type { ExampleKind } from "./schema";

export const kindLabels: Record<ExampleKind, string> = {
  frontend: "Frontend",
  backend: "Backend",
  fullstack: "Fullstack",
  infrastructure: "Infrastructure",
};

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}
