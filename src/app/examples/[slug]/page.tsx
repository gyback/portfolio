import {
  ExamplePageView,
  examplePageMetadata,
} from "~/components/example/example-page-view";
import { listExamples } from "~/content";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return listExamples().map((example) => ({ slug: example.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  return examplePageMetadata({ slug, page: "index" });
}

export default async function ExampleIndexPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  return <ExamplePageView slug={slug} page="index" />;
}
