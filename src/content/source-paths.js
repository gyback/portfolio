// Shared between the fetch script (plain Node) and the app, so it is JS with JSDoc.

import path from "node:path";

/** Where fetched source files live, relative to the repo root. Committed. */
export const SOURCE_CACHE_DIR = path.join("content", ".sources");

/**
 * @param {string} repo GitHub repository URL, e.g. https://github.com/owner/name
 * @returns {{ owner: string; name: string }}
 */
export function parseRepo(repo) {
  const match = /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+)$/.exec(repo);
  if (!match) throw new Error(`Unsupported repository URL: ${repo}`);
  return { owner: match[1] ?? "", name: match[2] ?? "" };
}

/**
 * @param {string} root repo root (process.cwd())
 * @param {string} slug example slug
 * @param {string} ref commit SHA
 * @param {string} file path within the source repo
 */
export function cachePath(root, slug, ref, file) {
  return path.join(root, SOURCE_CACHE_DIR, slug, ref, file);
}

/**
 * @param {string} repo
 * @param {string} ref
 * @param {string} file
 */
export function rawUrl(repo, ref, file) {
  const { owner, name } = parseRepo(repo);
  return `https://raw.githubusercontent.com/${owner}/${name}/${ref}/${file}`;
}

/**
 * @param {string} repo
 * @param {string} ref
 * @param {string} file
 * @param {[number, number] | null} [lines]
 */
export function blobUrl(repo, ref, file, lines) {
  const base = `${repo}/blob/${ref}/${file}`;
  if (!lines) return base;
  const [start, end] = lines;
  return start === end ? `${base}#L${start}` : `${base}#L${start}-L${end}`;
}
