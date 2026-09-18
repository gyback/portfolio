import { valueToEstree } from "estree-util-value-to-estree";
import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";

/**
 * @typedef {{ id: string; text: string; depth: 2 | 3 }} OutlineEntry
 */

/**
 * Remark plugin that collects the h2 and h3 headings of a document and adds
 * `export const outline = [...]` to the MDX module, so a page can render an
 * "on this page" list without touching the DOM.
 *
 * Ids are produced with github-slugger over every heading, which is exactly
 * what rehype-slug does, so the two stay in sync including duplicate suffixes.
 *
 * @returns {(tree: import("mdast").Root) => void}
 */
export default function remarkOutline() {
  return (tree) => {
    const slugger = new GithubSlugger();
    /** @type {OutlineEntry[]} */
    const outline = [];

    visit(tree, "heading", (node) => {
      const text = toString(node);
      const id = slugger.slug(text);
      if (node.depth === 2 || node.depth === 3) {
        outline.push({ id, text, depth: node.depth });
      }
    });

    /** @type {import("mdast-util-mdxjs-esm").MdxjsEsm} */
    const exportNode = {
      type: "mdxjsEsm",
      value: `export const outline = ${JSON.stringify(outline)};`,
      data: {
        estree: {
          type: "Program",
          sourceType: "module",
          body: [
            {
              type: "ExportNamedDeclaration",
              specifiers: [],
              attributes: [],
              declaration: {
                type: "VariableDeclaration",
                kind: "const",
                declarations: [
                  {
                    type: "VariableDeclarator",
                    id: { type: "Identifier", name: "outline" },
                    init: valueToEstree(outline),
                  },
                ],
              },
            },
          ],
        },
      },
    };

    tree.children.unshift(exportNode);
  };
}
