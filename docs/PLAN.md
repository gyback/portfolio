# Portfolio Plan

A markdown-driven portfolio of engineering examples. Each example is a set of MDX
pages rendered in a three-column layout: page navigation on the left, content in the
centre, and an "on this page" outline on the right. Examples span frontend, backend,
fullstack, and infrastructure work across several stacks.

Track progress by ticking the checkboxes. Record decisions and deviations in the
changelog at the bottom.

## Decisions

- Content lives in the repo as MDX and is built statically. No database, no auth,
  no runtime API.
- Left column is per-example navigation only. Examples are reached through the
  global header and a catalog page, not a global tree.
- Examples are tagged on two axes: `kind` (frontend, backend, fullstack,
  infrastructure) and `stack` (react, nextjs, dotnet, docker, azure, ...).
- Source for non-Next examples (.NET, deployment) stays in separate repos.
  Snippets are pulled at build time from a pinned commit so they never drift.
- The layout shell is hand-rolled. MDX compilation uses standard remark/rehype
  tooling.
- Next 16 with Turbopack for dev and build. Linting runs through the ESLint CLI
  since `next lint` was removed in 16.
- MDX plugins are listed as strings in `next.config.js` so the config is
  serialisable for Turbopack. Local plugins use an absolute path.

## Routes

| Route                     | Purpose                                        |
| ------------------------- | ---------------------------------------------- |
| `/`                       | Landing page, short intro, featured examples   |
| `/examples`               | Catalog with filters for kind and stack        |
| `/examples/[slug]`        | Example index page (first page of the example) |
| `/examples/[slug]/[page]` | Individual page within an example              |

## Content model

```
content/examples/<slug>/
  meta.json
  index.mdx
  <page>.mdx ...
```

`meta.json`, validated with zod at build time:

| Field      | Type                                         | Notes                                                     |
| ---------- | -------------------------------------------- | --------------------------------------------------------- |
| `title`    | string                                       |                                                           |
| `summary`  | string                                       | Shown on catalog cards                                    |
| `date`     | ISO date string                              |                                                           |
| `kind`     | frontend, backend, fullstack, infrastructure |                                                           |
| `stack`    | string[]                                     | Free-form tags                                            |
| `pages`    | `{ slug, title }[]`                          | Ordered. First slug must be `index`. File is `<slug>.mdx` |
| `related`  | string[] (optional)                          | Example slugs                                             |
| `repo`     | URL (optional)                               | External source repository                                |
| `featured` | boolean (optional)                           | Shown on the landing page                                 |

## Phase 1: Strip the scaffold and set the foundation

Leaves the repo as a plain Next 15 + Tailwind 4 app that builds without a database.

- [x] Remove Prisma, NextAuth, tRPC, react-query, superjson, and `start-database.sh`
- [x] Delete `src/server`, `src/trpc`, `src/app/api`, `generated`, `prisma`, and `src/app/_components/post.tsx`
- [x] Remove or trim `src/env.js` and its import in `next.config.js`
- [x] Add `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `remark-gfm`, `rehype-slug`, `rehype-pretty-code`, `shiki`, `gray-matter`
- [x] Reset `src/app/page.tsx` to a placeholder
- [x] Verify `npm run build` and `npm run check` pass with no `.env` required

## Phase 2: Content model

- [x] Create `content/examples/` with one placeholder example of three pages
- [x] Define the `meta.json` zod schema in `src/content/schema.ts`
- [x] Implement `src/content/` with `listExamples()`, `getExample(slug)`, `getPage(slug, page)`
- [x] Write a remark plugin that extracts h2/h3 headings into an outline
- [x] Fail the build on invalid `meta.json` or a page listed in meta that does not exist

## Phase 3: Routes and the example shell

Milestone: one placeholder example renders with working left nav, right outline,
and prev/next links.

- [ ] Add routes `/examples/[slug]` and `/examples/[slug]/[page]` with `generateStaticParams` and `notFound()`
- [ ] Root layout: global header with site name, catalog link, and a breadcrumb slot
- [ ] Example layout: three-column grid `[240px_minmax(0,1fr)_220px]`, sticky asides with own scroll
- [ ] Left nav: page list for the current example, active page marked with `aria-current`
- [ ] Page component: renders compiled MDX, passes outline to the right column
- [ ] Outline component (client): single IntersectionObserver, rootMargin `-80px 0px -70% 0px`, active heading marked with `aria-current`
- [ ] Headings get `scroll-margin-top` matching the header height
- [ ] Prev/next links at the bottom of each page from the ordered page list
- [ ] Responsive: outline hidden below `xl`, left nav becomes a drawer below `lg`, centre column has a max reading width

## Phase 4: Catalog and cross-navigation

- [ ] Catalog page at `/examples` with cards showing title, summary, kind, and stack tags
- [ ] Filters for kind and stack, state kept in URL query params, filtering client-side
- [ ] Landing page at `/` with intro and featured examples
- [ ] Related examples block on each example index page, from `related` in meta, falling back to shared stack tags
- [ ] Breadcrumb in header: Examples / example title / page title

## Phase 5: External source examples

For examples whose code lives in another repo (.NET, deployment configs).

- [ ] Build-time script that fetches named files from external repos at a pinned commit into a cache folder
- [ ] `<SourceFile>` MDX component: renders a cached file with language, optional line range, and a link to the file in the source repo
- [ ] Document the pinning convention in the README

## Phase 6: Polish and deploy

- [ ] Prose typography via `@tailwindcss/typography`, code block styling, dark mode from system preference
- [ ] Per-page metadata from frontmatter, Open Graph image per example
- [ ] Confirm fully static output and deploy
- [ ] CI: lint, typecheck, build
- [ ] Link check across built output so broken internal links fail the build

## Changelog

Record dated notes when a phase completes or a decision changes.

- 2026-09-18: Plan written. Repo is an untouched create-t3-app scaffold.
- 2026-09-18: Phase 1 complete. Prisma, NextAuth, tRPC, react-query, and env validation removed. MDX tooling added. Build and checks pass with no `.env`.
- 2026-09-18: Upgraded to Next 16, React 19.3, and `eslint-config-next` 16. Removed `@eslint/eslintrc`.
- 2026-09-18: Phase 2 complete. Content module, schema, outline plugin, and placeholder example in place. Page refs use `slug` (file is `<slug>.mdx`) instead of `file`. The home page temporarily lists all examples so the build exercises validation until Phase 4 replaces it.
