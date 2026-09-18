import Link from "next/link";

import { listExamples } from "~/content";
import { site } from "~/site";

import { Breadcrumb, type BreadcrumbMap } from "./breadcrumb";

export function SiteHeader() {
  const examples: BreadcrumbMap = Object.fromEntries(
    listExamples().map((example) => [
      example.slug,
      {
        title: example.title,
        pages: Object.fromEntries(
          example.pages.map((page) => [page.slug, page.title]),
        ),
      },
    ]),
  );

  return (
    <header className="border-line bg-bg/90 sticky top-0 z-20 h-(--header-height) border-b backdrop-blur">
      <div className="mx-auto flex h-full max-w-screen-2xl items-center gap-4 px-4">
        <Link href="/" className="shrink-0 font-semibold tracking-tight">
          {site.name}
        </Link>
        <span aria-hidden="true" className="text-line">
          |
        </span>
        <Breadcrumb examples={examples} />
        <nav
          aria-label="Site"
          className="ml-auto flex items-center gap-4 text-sm"
        >
          <Link href="/examples" className="hover:underline">
            Examples
          </Link>
        </nav>
      </div>
    </header>
  );
}
