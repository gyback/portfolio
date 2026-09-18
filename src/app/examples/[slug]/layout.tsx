import { notFound } from "next/navigation";

import { MobileNav } from "~/components/example/mobile-nav";
import { PageNav, type PageNavData } from "~/components/example/page-nav";
import { findExample } from "~/content";

export default async function ExampleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const example = findExample(slug);
  if (!example) notFound();

  const nav: PageNavData = {
    slug: example.slug,
    title: example.title,
    pages: example.pages,
  };

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[240px_minmax(0,1fr)_220px]">
      <MobileNav>
        <PageNav example={nav} />
      </MobileNav>
      <aside className="sticky top-(--header-height) hidden h-[calc(100vh-var(--header-height))] self-start overflow-y-auto py-10 lg:block">
        <PageNav example={nav} />
      </aside>
      {children}
    </div>
  );
}
