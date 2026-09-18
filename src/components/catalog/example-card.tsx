import Link from "next/link";

import { formatDate, kindLabels } from "~/content/labels";
import type { ExampleKind } from "~/content/schema";
import { exampleHref } from "~/content/urls";

/** The subset of example meta a card needs. Serialisable, so usable from client components. */
export type CardExample = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  kind: ExampleKind;
  stack: string[];
};

export function ExampleCard({ example }: { example: CardExample }) {
  return (
    <Link
      href={exampleHref(example.slug)}
      className="group border-line hover:border-muted flex h-full flex-col rounded-lg border p-5 transition-colors"
    >
      <div className="text-muted flex items-center justify-between gap-3 text-xs">
        <span className="bg-subtle text-fg rounded-full px-2 py-0.5 font-medium">
          {kindLabels[example.kind]}
        </span>
        <time dateTime={example.date}>{formatDate(example.date)}</time>
      </div>
      <h3 className="mt-3 text-lg font-semibold group-hover:underline">
        {example.title}
      </h3>
      <p className="text-muted mt-2 flex-1 text-sm">{example.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Stack">
        {example.stack.map((tag) => (
          <li
            key={tag}
            className="border-line text-muted rounded border px-1.5 py-0.5 font-mono text-xs"
          >
            {tag}
          </li>
        ))}
      </ul>
    </Link>
  );
}
