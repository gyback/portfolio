import type { Metadata } from "next";
import { Suspense } from "react";

import { Catalog } from "~/components/catalog/catalog";
import type { CardExample } from "~/components/catalog/example-card";
import { listExamples } from "~/content";

export const metadata: Metadata = {
  title: "Examples",
  description: "All examples, filterable by kind and stack.",
};

export default function ExamplesPage() {
  const examples: CardExample[] = listExamples().map(
    ({ slug, title, summary, date, kind, stack }) => ({
      slug,
      title,
      summary,
      date,
      kind,
      stack,
    }),
  );
  const stacks = [...new Set(examples.flatMap((e) => e.stack))].sort();

  return (
    <main className="mx-auto max-w-screen-2xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Examples</h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        Filter by what kind of work it is, or by the stack it uses.
      </p>
      <div className="mt-8">
        {/* useSearchParams needs a Suspense boundary to prerender statically. */}
        <Suspense fallback={null}>
          <Catalog examples={examples} stacks={stacks} />
        </Suspense>
      </div>
    </main>
  );
}
