import type { Example } from "~/content";

import { ExampleCard } from "../catalog/example-card";

export function RelatedExamples({ examples }: { examples: Example[] }) {
  if (examples.length === 0) return null;

  return (
    <section
      aria-labelledby="related-heading"
      className="mt-12 border-t border-gray-200 pt-8"
    >
      <h2 id="related-heading" className="text-lg font-semibold">
        Related examples
      </h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {examples.map((example) => (
          <li key={example.slug}>
            <ExampleCard example={example} />
          </li>
        ))}
      </ul>
    </section>
  );
}
