import Link from "next/link";

import { listExamples } from "~/content";

export default function Home() {
  const examples = listExamples();

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">Portfolio</h1>
      <p className="mt-4 text-lg text-gray-600">
        Engineering examples across frontend, backend, fullstack, and
        infrastructure.
      </p>
      <ul className="mt-8 space-y-2">
        {examples.map((example) => (
          <li key={example.slug}>
            <Link
              href={`/examples/${example.slug}`}
              className="underline underline-offset-4"
            >
              {example.title}
            </Link>{" "}
            <span className="text-sm text-gray-500">{example.kind}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
