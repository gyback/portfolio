"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { exampleHref, pageHref } from "~/content/urls";

/** Compact lookup passed from the server layout: slug -> title and page titles. */
export type BreadcrumbMap = Record<
  string,
  { title: string; pages: Record<string, string> }
>;

type Crumb = { href: string; label: string };

export function Breadcrumb({ examples }: { examples: BreadcrumbMap }) {
  const pathname = usePathname();
  const [, root, exampleSlug, pageSlug] = pathname.split("/");

  if (root !== "examples" || !exampleSlug) return null;
  const example = examples[exampleSlug];
  if (!example) return null;

  const crumbs: Crumb[] = [
    { href: "/examples", label: "Examples" },
    { href: exampleHref(exampleSlug), label: example.title },
  ];
  const pageTitle = pageSlug ? example.pages[pageSlug] : undefined;
  if (pageSlug && pageTitle) {
    crumbs.push({ href: pageHref(exampleSlug, pageSlug), label: pageTitle });
  }

  return (
    <nav aria-label="Breadcrumb" className="min-w-0 text-sm text-gray-500">
      <ol className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">/</span>}
              {last ? (
                <span aria-current="page" className="truncate text-gray-900">
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.href} className="truncate hover:text-gray-900">
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
