import path from "node:path";
import createMDX from "@next/mdx";

/** @type {import("next").NextConfig} */
const config = {
  // Fully static site. `next build` writes plain HTML and assets to ./out.
  output: "export",
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

// Plugins are given as strings so the config is serialisable for Turbopack.
// The MDX loader resolves them with require.resolve, so a local plugin needs
// an absolute path rather than a relative one.
const withMDX = createMDX({
  options: {
    remarkPlugins: [
      "remark-frontmatter",
      "remark-gfm",
      path.resolve(import.meta.dirname, "src/content/remark-outline.js"),
    ],
    rehypePlugins: [
      "rehype-slug",
      ["rehype-pretty-code", { theme: "github-dark", keepBackground: false }],
    ],
  },
});

export default withMDX(config);
