import Link from "next/link";

import { ExampleCard } from "~/components/catalog/example-card";
import { listExamples } from "~/content";
import { site } from "~/site";

export default function Home() {
  const all = listExamples();
  const featured = all.filter((e) => e.featured);
  const shown = (featured.length > 0 ? featured : all).slice(0, 3);

  return (
    <main className="mx-auto max-w-screen-2xl px-4 py-16">
      <section className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight">{site.name}</h1>
        <p className="mt-4 text-lg text-gray-600">{site.description}</p>
        <p className="mt-6">
          <Link
            href="/examples"
            className="inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            Browse all examples
          </Link>
        </p>
      </section>

      {shown.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-semibold">
            {featured.length > 0 ? "Featured" : "Latest"}
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((example) => (
              <li key={example.slug}>
                <ExampleCard example={example} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
