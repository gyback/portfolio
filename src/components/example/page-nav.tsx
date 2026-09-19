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
      <p className="text-muted mb-3 text-xs font-semibold tracking-wide uppercase">
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
                    ? "bg-subtle text-fg block rounded-md px-3 py-1.5 text-sm font-medium"
                    : "text-muted hover:bg-subtle hover:text-fg block rounded-md px-3 py-1.5 text-sm"
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
