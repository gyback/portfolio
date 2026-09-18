// Fetches the external source files declared in each example's meta.json
// (`source.files`) at the pinned commit into content/.sources/<slug>/<ref>/.
//
// The cache is committed, so this is a no-op when nothing changed. Bumping
// `source.ref` fetches fresh copies and removes the old ref's folder.
//
//   node scripts/fetch-sources.mjs          fetch missing files
//   node scripts/fetch-sources.mjs --force  refetch everything

import fs from "node:fs";
import path from "node:path";

import {
  SOURCE_CACHE_DIR,
  cachePath,
  rawUrl,
} from "../src/content/source-paths.js";

const root = process.cwd();
const force = process.argv.includes("--force");
const examplesDir = path.join(root, "content", "examples");
const cacheDir = path.join(root, SOURCE_CACHE_DIR);

/** @type {Map<string, { repo: string; ref: string; files: string[] }>} */
const sources = new Map();

for (const entry of fs.readdirSync(examplesDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const metaPath = path.join(examplesDir, entry.name, "meta.json");
  if (!fs.existsSync(metaPath)) continue;
  const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
  if (meta.source) sources.set(entry.name, meta.source);
}

let fetched = 0;
let skipped = 0;
let failed = 0;

for (const [slug, source] of sources) {
  for (const file of source.files) {
    const target = cachePath(root, slug, source.ref, file);
    if (!force && fs.existsSync(target)) {
      skipped++;
      continue;
    }
    const url = rawUrl(source.repo, source.ref, file);
    const res = await fetch(url);
    if (!res.ok) {
      console.error(
        `✗ ${slug}: ${file} (${res.status} ${res.statusText})\n  ${url}`,
      );
      failed++;
      continue;
    }
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, await res.text());
    console.log(`✓ ${slug}: ${file}`);
    fetched++;
  }
}

// Prune cache folders for examples or refs that are no longer referenced.
let pruned = 0;
if (fs.existsSync(cacheDir)) {
  for (const slugDir of fs.readdirSync(cacheDir, { withFileTypes: true })) {
    if (!slugDir.isDirectory()) continue;
    const current = sources.get(slugDir.name);
    const slugPath = path.join(cacheDir, slugDir.name);
    for (const refDir of fs.readdirSync(slugPath, { withFileTypes: true })) {
      if (!current || refDir.name !== current.ref) {
        fs.rmSync(path.join(slugPath, refDir.name), { recursive: true });
        pruned++;
      }
    }
    if (fs.readdirSync(slugPath).length === 0) fs.rmdirSync(slugPath);
  }
}

console.log(
  `sources: ${fetched} fetched, ${skipped} cached, ${pruned} pruned, ${failed} failed`,
);
if (failed > 0) process.exit(1);
