import Link from "next/link";

import { site } from "~/site";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">{site.name}</h1>
      <p className="mt-4 text-lg text-gray-600">{site.description}</p>
      <p className="mt-8">
        <Link href="/examples" className="underline underline-offset-4">
          Browse the examples
        </Link>
      </p>
    </main>
  );
}
