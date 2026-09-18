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

| Field      | Type                                         | Notes                                                           |
| ---------- | -------------------------------------------- | --------------------------------------------------------------- |
| `title`    | string                                       |                                                                 |
| `summary`  | string                                       | Shown on catalog cards                                          |
| `date`     | ISO date string                              |                                                                 |
| `kind`     | frontend, backend, fullstack, infrastructure |                                                                 |
| `stack`    | string[]                                     | Free-form tags                                                  |
| `pages`    | `{ slug, title }[]`                          | Ordered. First slug must be `index`. File is `<slug>.mdx`       |
| `related`  | string[] (optional)                          | Example slugs                                                   |
| `source`   | `{ repo, ref, files }` (optional)            | GitHub repo URL, full commit SHA, file paths for `<SourceFile>` |
| `featured` | boolean (optional)                           | Shown on the landing page                                       |

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

- [x] Add routes `/examples/[slug]` and `/examples/[slug]/[page]` with `generateStaticParams` and `notFound()`
- [x] Root layout: global header with site name, catalog link, and a breadcrumb slot
- [x] Example layout: three-column grid `[240px_minmax(0,1fr)_220px]`, sticky asides with own scroll
- [x] Left nav: page list for the current example, active page marked with `aria-current`
- [x] Page component: renders compiled MDX, passes outline to the right column
- [x] Outline component (client): scroll-position based. Every section with content on screen is highlighted, where a section runs from its heading to the next heading. A visible h3 also lights its parent h2. Marked with `aria-current`.
- [x] Headings get `scroll-margin-top` matching the header height
- [x] Prev/next links at the bottom of each page from the ordered page list
- [x] Responsive: outline hidden below `xl`, left nav becomes a drawer below `lg`, centre column has a max reading width

## Phase 4: Catalog and cross-navigation

- [x] Catalog page at `/examples` with cards showing title, summary, kind, and stack tags
- [x] Filters for kind and stack, state kept in URL query params, filtering client-side
- [x] Landing page at `/` with intro and featured examples
- [x] Related examples block on each example index page, from `related` in meta, falling back to shared stack tags
- [x] Breadcrumb in header: Examples / example title / page title

## Phase 5: External source examples

For examples whose code lives in another repo (.NET, deployment configs).

- [x] Build-time script that fetches named files from external repos at a pinned commit into a cache folder
- [x] `<SourceFile>` MDX component: renders a cached file with language, optional line range, and a link to the file in the source repo
- [x] Document the pinning convention in the README

## Phase 6: Polish and deploy

- [x] Prose typography via `@tailwindcss/typography` and code block styling (done in Phase 3)
- [ ] Dark mode from system preference
- [x] Per-page metadata from frontmatter (done in Phase 3)
- [ ] Open Graph image per example
- [ ] Confirm fully static output and deploy
- [ ] CI: lint, typecheck, build
- [ ] Link check across built output so broken internal links fail the build

## Changelog

Record dated notes when a phase completes or a decision changes.

- 2026-09-18: Plan written. Repo is an untouched create-t3-app scaffold.
- 2026-09-18: Phase 1 complete. Prisma, NextAuth, tRPC, react-query, and env validation removed. MDX tooling added. Build and checks pass with no `.env`.
- 2026-09-18: Upgraded to Next 16, React 19.3, and `eslint-config-next` 16. Removed `@eslint/eslintrc`.
- 2026-09-18: Phase 2 complete. Content module, schema, outline plugin, and placeholder example in place. Page refs use `slug` (file is `<slug>.mdx`) instead of `file`. The home page temporarily lists all examples so the build exercises validation until Phase 4 replaces it.
- 2026-09-18: Phase 3 complete. Routes, header with breadcrumb, three-column example layout, page nav with mobile drawer, outline, prev/next, per-page metadata, and typography styling in place. Verified in the browser at 1440px and 800px. The outline uses scroll position instead of IntersectionObserver: the observer approach never updated in testing, and a short final section can never enter the observation band, so the last entry is now forced when scrolled to the bottom. Site name lives in `src/site.ts`. `/examples` is a plain list until Phase 4.
- 2026-09-18: Outline changed from single active heading to highlighting all sections currently in view, per review of the Phase 3 milestone.
- 2026-09-18: Phase 4 complete. Catalog with URL-backed kind and stack filters, landing page with featured examples, related examples block on example index pages. Added a second placeholder example (`placeholder-api`) so filters and related links can be exercised. Both placeholders are to be deleted once real examples exist.
- 2026-09-19: Phase 5 complete. `source` in meta.json declares a GitHub repo, a full commit SHA, and file paths. `scripts/fetch-sources.mjs` downloads them into `content/.sources/<slug>/<ref>/` (committed, pruned on ref change) and runs before `dev` and `build`. `<SourceFile>` renders a cached file with shiki, line numbers, an optional line range, and a link to the file at the pinned commit. Replaced the `repo` meta field with `source`. The content loader no longer caches parsed meta in development, so meta.json edits show without a restart. Placeholder API pins two files from `dotnet/samples` as a working demo.
