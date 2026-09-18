import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPage } from "~/content";

import { Outline } from "./outline";
import { PrevNext } from "./prev-next";

type Props = { slug: string; page: string };

/** Metadata for one example page. Shared by the index and [page] routes. */
export async function examplePageMetadata({
  slug,
  page,
}: Props): Promise<Metadata> {
  const data = await getPage(slug, page);
  if (!data) return {};
  return {
    title: `${data.title} · ${data.example.title}`,
    description: data.description ?? data.example.summary,
  };
}

/**
 * Renders one page of an example. Returns a `display: contents` wrapper so the
 * article and the outline land directly in the example layout's grid columns.
 */
export async function ExamplePageView({ slug, page }: Props) {
  const data = await getPage(slug, page);
  if (!data) notFound();

  const { Content, outline, example, prev, next } = data;

  return (
    <div className="contents">
      <article className="min-w-0 py-8 lg:py-10">
        <div className="prose prose-neutral max-w-3xl">
          <Content />
        </div>
        <div className="max-w-3xl">
          <PrevNext exampleSlug={example.slug} prev={prev} next={next} />
        </div>
      </article>
      <aside className="sticky top-(--header-height) hidden h-[calc(100vh-var(--header-height))] self-start overflow-y-auto py-10 xl:block">
        <Outline entries={outline} />
      </aside>
    </div>
  );
}
