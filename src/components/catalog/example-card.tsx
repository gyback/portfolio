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
      className="group flex h-full flex-col rounded-lg border border-gray-200 p-5 transition-colors hover:border-gray-400"
    >
      <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
        <span className="rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-700">
          {kindLabels[example.kind]}
        </span>
        <time dateTime={example.date}>{formatDate(example.date)}</time>
      </div>
      <h3 className="mt-3 text-lg font-semibold group-hover:underline">
        {example.title}
      </h3>
      <p className="mt-2 flex-1 text-sm text-gray-600">{example.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Stack">
        {example.stack.map((tag) => (
          <li
            key={tag}
            className="rounded border border-gray-200 px-1.5 py-0.5 font-mono text-xs text-gray-600"
          >
            {tag}
          </li>
        ))}
      </ul>
    </Link>
  );
}
