import {
  ExamplePageView,
  examplePageMetadata,
} from "~/components/example/example-page-view";
import { listExamples } from "~/content";

type Params = Promise<{ slug: string; page: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  // The index page is served at /examples/[slug], so it is excluded here.
  return listExamples().flatMap((example) =>
    example.pages
      .filter((page) => page.slug !== "index")
      .map((page) => ({ slug: example.slug, page: page.slug })),
  );
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug, page } = await params;
  return examplePageMetadata({ slug, page });
}

export default async function ExampleSubPage({ params }: { params: Params }) {
  const { slug, page } = await params;
  return <ExamplePageView slug={slug} page={page} />;
}
