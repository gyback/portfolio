import fs from "node:fs/promises";
import { codeToHtml } from "shiki";

import type { Example } from "~/content";
import { blobUrl, cachePath } from "~/content/source-paths";

export type SourceFileProps = {
  /** Path within the source repo. Must be listed in meta.json `source.files`. */
  file: string;
  /** Inclusive 1-based range, "10-25", or a single line "10". */
  lines?: string;
  /** Caption. Defaults to the file path. */
  title?: string;
  /** Shiki language id. Defaults to a guess from the file name. */
  lang?: string;
};

/**
 * Renders a file fetched from an external repo at the pinned commit, with
 * syntax highlighting, line numbers, and a link to the file on GitHub.
 * Output mirrors rehype-pretty-code's markup so the same CSS applies.
 */
export async function SourceFile({
  example,
  file,
  lines,
  title,
  lang,
}: SourceFileProps & { example: Example }) {
  const { source, slug } = example;
  if (!source) {
    throw new Error(
      `Example "${slug}": <SourceFile> used but meta.json has no "source"`,
    );
  }
  if (!source.files.includes(file)) {
    throw new Error(
      `Example "${slug}": "${file}" is not listed in meta.json source.files`,
    );
  }

  const target = cachePath(process.cwd(), slug, source.ref, file);
  let text: string;
  try {
    text = await fs.readFile(target, "utf8");
  } catch {
    throw new Error(
      `Example "${slug}": "${file}" is not cached. Run "npm run content:fetch".`,
    );
  }

  const allLines = text.replace(/\r\n/g, "\n").replace(/\n$/, "").split("\n");
  const range = parseRange(lines, allLines.length, slug, file);
  const [start, end] = range ?? [1, allLines.length];
  const code = allLines.slice(start - 1, end).join("\n");
  const language = lang ?? languageFor(file);

  const highlighted = await codeToHtml(code, {
    lang: language,
    theme: "github-dark",
    transformers: [
      {
        pre(node) {
          delete node.properties.style;
          node.properties["data-language"] = language;
          node.properties["data-theme"] = "github-dark";
        },
        code(node) {
          node.properties["data-language"] = language;
          node.properties["data-line-numbers"] = "";
          node.properties.style = `counter-set: line ${start - 1}`;
        },
        line(node) {
          node.properties["data-line"] = "";
        },
      },
    ],
  });

  const caption = escapeHtml(title ?? file);
  const rangeLabel = range ? ` · lines ${start}–${end}` : "";
  const href = blobUrl(source.repo, source.ref, file, range);
  const html =
    `<figure data-rehype-pretty-code-figure="">` +
    `<figcaption data-rehype-pretty-code-title="" data-language="${language}" data-theme="github-dark">` +
    `<span>${caption}${rangeLabel}</span>` +
    `<a href="${href}" target="_blank" rel="noreferrer">View on GitHub ↗</a>` +
    `</figcaption>${highlighted}</figure>`;

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function parseRange(
  lines: string | undefined,
  total: number,
  slug: string,
  file: string,
): [number, number] | null {
  if (!lines) return null;
  const match = /^(\d+)(?:-(\d+))?$/.exec(lines.trim());
  const start = match ? Number(match[1]) : NaN;
  const end = match ? Number(match[2] ?? match[1]) : NaN;
  if (!match || start < 1 || end < start || end > total) {
    throw new Error(
      `Example "${slug}": invalid lines "${lines}" for "${file}" (${total} lines)`,
    );
  }
  return [start, end];
}

const byExtension: Record<string, string> = {
  cs: "csharp",
  csproj: "xml",
  sln: "text",
  ts: "typescript",
  tsx: "tsx",
  js: "javascript",
  jsx: "jsx",
  mjs: "javascript",
  cjs: "javascript",
  json: "json",
  yml: "yaml",
  yaml: "yaml",
  md: "markdown",
  mdx: "mdx",
  css: "css",
  html: "html",
  sh: "bash",
  ps1: "powershell",
  sql: "sql",
  tf: "terraform",
  bicep: "bicep",
  toml: "toml",
  xml: "xml",
  py: "python",
  go: "go",
};

function languageFor(file: string): string {
  const base = file.split("/").pop() ?? file;
  if (/^Dockerfile(\..*)?$/i.test(base)) return "dockerfile";
  const ext = base.includes(".") ? base.split(".").pop()! : "";
  return byExtension[ext] ?? "text";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
