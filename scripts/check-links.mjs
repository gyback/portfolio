// Checks every internal link in the static export (./out) resolves to a file,
// and that fragment links point at an existing id. Runs after `next build`
// via the postbuild script and fails the build on any broken link.

import fs from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "out");
if (!fs.existsSync(outDir)) {
  console.error("check-links: ./out does not exist. Run `next build` first.");
  process.exit(1);
}

/**
 * @param {string} dir
 * @returns {string[]}
 */
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const htmlFiles = walk(outDir).filter((f) => f.endsWith(".html"));

/**
 * Resolve a site-absolute path to a file in ./out, or null.
 * @param {string} urlPath
 * @returns {string | null}
 */
function resolveTarget(urlPath) {
  const clean = decodeURIComponent(urlPath.replace(/\/+$/, "")) || "/index";
  const candidates = [
    path.join(outDir, clean),
    path.join(outDir, `${clean}.html`),
    path.join(outDir, clean, "index.html"),
  ];
  return (
    candidates.find((c) => fs.existsSync(c) && fs.statSync(c).isFile()) ?? null
  );
}

/** @type {Map<string, Set<string>>} */
const idCache = new Map();

/**
 * @param {string} file
 * @param {string} id
 */
function hasId(file, id) {
  let ids = idCache.get(file);
  if (!ids) {
    const html = fs.readFileSync(file, "utf8");
    ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1] ?? ""));
    idCache.set(file, ids);
  }
  return ids.has(id);
}

/** @type {string[]} */
const problems = [];
let checked = 0;

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const page = "/" + path.relative(outDir, file).replace(/\\/g, "/");
  const refs = [...html.matchAll(/\s(?:href|src)="([^"]*)"/g)].map(
    (m) => m[1] ?? "",
  );

  for (const ref of refs) {
    if (!ref || /^(https?:|mailto:|tel:|data:|javascript:|#$)/.test(ref)) {
      continue;
    }
    checked++;

    const [rawPath = "", hash = ""] = ref.split("#");
    const urlPath =
      (rawPath || page.replace(/\.html$/, "")).split("?")[0] ?? "";
    if (!urlPath.startsWith("/")) {
      problems.push(
        `${page}: relative link "${ref}" (use site-absolute paths)`,
      );
      continue;
    }

    const target = resolveTarget(urlPath);
    if (!target) {
      problems.push(`${page}: "${ref}" does not resolve to a file in ./out`);
      continue;
    }
    if (hash && target.endsWith(".html") && !hasId(target, hash)) {
      problems.push(`${page}: "${ref}" fragment #${hash} not found in target`);
    }
  }
}

if (problems.length > 0) {
  console.error(`check-links: ${problems.length} broken link(s)\n`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log(
  `check-links: ${checked} links across ${htmlFiles.length} pages, all resolve`,
);
