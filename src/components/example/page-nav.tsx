"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { PageRef } from "~/content/schema";
import { pageHref } from "~/content/urls";

export type PageNavData = {
  slug: string;
  title: string;
  pages: PageRef[];
};

export function PageNav({ example }: { example: PageNavData }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Pages in this example">
      <p className="mb-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">
        {example.title}
      </p>
      <ul className="space-y-1">
        {example.pages.map((page) => {
          const href = pageHref(example.slug, page.slug);
          const active = pathname === href;
          return (
            <li key={page.slug}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "block rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-900"
                    : "block rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
              >
                {page.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
