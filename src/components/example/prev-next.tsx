import Link from "next/link";

import type { PageRef } from "~/content/schema";
import { pageHref } from "~/content/urls";

export function PrevNext({
  exampleSlug,
  prev,
  next,
}: {
  exampleSlug: string;
  prev: PageRef | null;
  next: PageRef | null;
}) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Previous and next page"
      className="border-line mt-12 flex justify-between gap-4 border-t pt-6 text-sm"
    >
      {prev ? (
        <Link
          href={pageHref(exampleSlug, prev.slug)}
          rel="prev"
          className="group flex flex-col"
        >
          <span className="text-muted">Previous</span>
          <span className="font-medium group-hover:underline">
            ← {prev.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link
          href={pageHref(exampleSlug, next.slug)}
          rel="next"
          className="group flex flex-col text-right"
        >
          <span className="text-muted">Next</span>
          <span className="font-medium group-hover:underline">
            {next.title} →
          </span>
        </Link>
      )}
    </nav>
  );
}
