import Link from "next/link";

import { listExamples } from "~/content";
import { exampleHref } from "~/content/urls";

// Minimal list until Phase 4 replaces it with the filterable catalog.
export default function ExamplesPage() {
  const examples = listExamples();

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Examples</h1>
      <ul className="mt-8 space-y-4">
        {examples.map((example) => (
          <li key={example.slug}>
            <Link
              href={exampleHref(example.slug)}
              className="text-lg font-medium underline underline-offset-4"
            >
              {example.title}
            </Link>
            <p className="text-gray-600">{example.summary}</p>
            <p className="mt-1 text-sm text-gray-500">
              {example.kind} · {example.stack.join(", ")}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
