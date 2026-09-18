# Portfolio

A markdown-driven portfolio of engineering examples built with Next.js, MDX, and
Tailwind CSS. Content lives in the repo and the site builds statically.

See [docs/PLAN.md](docs/PLAN.md) for the plan and progress.

## Development

```
npm install
npm run dev
```

## Checks

```
npm run check   # lint + typecheck
npm run build
```

## Deploying

`npm run build` produces a fully static site in `out/`. Every route is plain
HTML plus assets, so it can be served by any static host or web server.

- Set `NEXT_PUBLIC_SITE_URL` to the public origin at build time so Open Graph
  URLs are absolute. Locally it falls back to `http://localhost:3000`.
- Routes are emitted as `path.html` (for example `out/examples.html`). Hosts
  such as Vercel, Netlify, and Cloudflare Pages serve these for `/examples`
  automatically. For nginx use `try_files $uri $uri.html $uri/ =404;`.
- `npm run preview` builds and serves `out/` locally.

The build fails if any internal link or fragment in the output is broken
(`scripts/check-links.mjs`). CI runs lint, typecheck, format check, and the
build on every push and pull request, and uploads `out/` as an artifact.

## Adding an example

Create `content/examples/<slug>/` with a `meta.json` and one `.mdx` file per
page. The first page must have slug `index`. See the placeholder examples for
the shape, and `src/content/schema.ts` for the full schema. Invalid meta or a
missing page file fails the build.

## Showing source from another repository

Examples whose code lives elsewhere (a .NET API, deployment configs) render
real files from that repository rather than hand-copied snippets. The files are
pinned to a commit so they cannot drift from the text that describes them.

1. Declare the source in the example's `meta.json`:

   ```json
   "source": {
     "repo": "https://github.com/owner/name",
     "ref": "<full 40-character commit SHA>",
     "files": ["src/Program.cs", "deploy/Dockerfile"]
   }
   ```

   Only GitHub repositories are supported. `ref` must be a full SHA, not a
   branch or tag, so the pin is unambiguous.

2. Run `npm run content:fetch`. Each listed file is downloaded into
   `content/.sources/<slug>/<ref>/`. That folder is committed, so builds do not
   need network access and a changed pin shows up as a reviewable diff. The
   script also runs automatically before `dev` and `build`, and it is a no-op
   when everything is already cached.

3. Use the file in any page of that example:

   ```mdx
   <SourceFile file="src/Program.cs" lines="10-25" title="Program.cs" />
   ```

   `lines` is an inclusive 1-based range or a single line. `title` defaults to
   the file path. `lang` overrides the language guessed from the extension.
   Every rendered block links to the file at the pinned commit on GitHub.

To update the snippets, change `ref` to the new commit SHA and run
`npm run content:fetch` again. The old commit's folder is removed.
