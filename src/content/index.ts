import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ComponentType } from "react";
import { z } from "zod";

import { exampleMetaSchema, type ExampleMeta, type PageRef } from "./schema";
import type { OutlineEntry } from "./remark-outline";

export type { ExampleKind, ExampleMeta, PageRef } from "./schema";
export type { OutlineEntry };

const CONTENT_DIR = path.join(process.cwd(), "content", "examples");

export type Example = ExampleMeta & { slug: string };

export type ExamplePage = {
  example: Example;
  slug: string;
  title: string;
  description?: string;
  Content: ComponentType;
  outline: OutlineEntry[];
  prev: PageRef | null;
  next: PageRef | null;
};

type MdxModule = {
  default: ComponentType;
  outline?: OutlineEntry[];
};

const cache = new Map<string, Example>();

function pagePath(slug: string, page: string): string {
  return path.join(CONTENT_DIR, slug, `${page}.mdx`);
}

/** Read and validate one example's meta.json. Throws on any problem so the build fails. */
export function getExample(slug: string): Example {
  const cached = cache.get(slug);
  if (cached) return cached;

  const metaPath = path.join(CONTENT_DIR, slug, "meta.json");
  if (!fs.existsSync(metaPath)) {
    throw new Error(`Example "${slug}": missing ${metaPath}`);
  }

  let raw: unknown;
  try {
    raw = JSON.parse(fs.readFileSync(metaPath, "utf8"));
  } catch (err) {
    throw new Error(
      `Example "${slug}": meta.json is not valid JSON (${String(err)})`,
    );
  }

  const parsed = exampleMetaSchema.safeParse(raw);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Example "${slug}": invalid meta.json\n${issues}`);
  }

  for (const page of parsed.data.pages) {
    if (!fs.existsSync(pagePath(slug, page.slug))) {
      throw new Error(
        `Example "${slug}": page "${page.slug}" is listed in meta.json but ${page.slug}.mdx does not exist`,
      );
    }
  }

  const example: Example = { ...parsed.data, slug };
  cache.set(slug, example);
  return example;
}

/** All examples, newest first. Validates every one, so the build fails on bad content. */
export function listExamples(): Example[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => getExample(entry.name))
    .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Examples to show alongside one example. Uses the explicit `related` list when
 * present (throws on an unknown slug so the build fails), otherwise other
 * examples that share stack tags, most shared first, then newest first.
 */
export function getRelatedExamples(example: Example, limit = 2): Example[] {
  if (example.related && example.related.length > 0) {
    return example.related.slice(0, limit).map((slug) => {
      const related = findExample(slug);
      if (!related) {
        throw new Error(
          `Example "${example.slug}": related example "${slug}" does not exist`,
        );
      }
      return related;
    });
  }

  const shared = (other: Example) =>
    other.stack.filter((tag) => example.stack.includes(tag)).length;

  return listExamples()
    .filter((other) => other.slug !== example.slug && shared(other) > 0)
    .sort((a, b) => shared(b) - shared(a) || b.date.localeCompare(a.date))
    .slice(0, limit);
}

/** Like getExample but returns null for an unknown slug. Validation errors still throw. */
export function findExample(slug: string): Example | null {
  if (!fs.existsSync(path.join(CONTENT_DIR, slug, "meta.json"))) return null;
  return getExample(slug);
}

/** Load one page of an example: compiled MDX, outline, frontmatter, and neighbours. */
export async function getPage(
  slug: string,
  page: string,
): Promise<ExamplePage | null> {
  const example = findExample(slug);
  if (!example) return null;

  const index = example.pages.findIndex((p) => p.slug === page);
  if (index === -1) return null;
  const ref = example.pages[index]!;

  const { data } = matter(fs.readFileSync(pagePath(slug, page), "utf8"));
  const frontmatter = z
    .object({ description: z.string().optional() })
    .parse(data);

  const mod = (await import(
    `../../content/examples/${slug}/${page}.mdx`
  )) as MdxModule;

  return {
    example,
    slug: page,
    title: ref.title,
    description: frontmatter.description,
    Content: mod.default,
    outline: mod.outline ?? [],
    prev: example.pages[index - 1] ?? null,
    next: example.pages[index + 1] ?? null,
  };
}
