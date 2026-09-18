import { z } from "zod";

export const exampleKinds = [
  "frontend",
  "backend",
  "fullstack",
  "infrastructure",
] as const;

export type ExampleKind = (typeof exampleKinds)[number];

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const pageRefSchema = z.object({
  slug: z.string().regex(slugPattern, "page slug must be lowercase kebab-case"),
  title: z.string().min(1),
});

/**
 * External source files shown with <SourceFile>. Pinned to a full commit SHA so
 * snippets never drift from the code they describe. Fetched into
 * content/.sources by `npm run content:fetch`.
 */
export const sourceSchema = z.object({
  repo: z
    .string()
    .regex(
      /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/,
      "repo must be a GitHub repository URL without a trailing path",
    ),
  ref: z
    .string()
    .regex(/^[0-9a-f]{40}$/, "ref must be a full 40-character commit SHA"),
  files: z.array(z.string().min(1)).min(1),
});

export type ExampleSource = z.infer<typeof sourceSchema>;

export const exampleMetaSchema = z
  .object({
    title: z.string().min(1),
    summary: z.string().min(1),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
    kind: z.enum(exampleKinds),
    stack: z.array(z.string().min(1)).min(1),
    pages: z.array(pageRefSchema).min(1),
    related: z.array(z.string().regex(slugPattern)).optional(),
    source: sourceSchema.optional(),
    featured: z.boolean().optional(),
  })
  .strict()
  .superRefine((meta, ctx) => {
    if (meta.pages[0]?.slug !== "index") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pages", 0, "slug"],
        message: 'the first page must have slug "index"',
      });
    }
    const seen = new Set<string>();
    meta.pages.forEach((page, i) => {
      if (seen.has(page.slug)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pages", i, "slug"],
          message: `duplicate page slug "${page.slug}"`,
        });
      }
      seen.add(page.slug);
    });
  });

export type PageRef = z.infer<typeof pageRefSchema>;
export type ExampleMeta = z.infer<typeof exampleMetaSchema>;
