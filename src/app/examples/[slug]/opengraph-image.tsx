import { ImageResponse } from "next/og";

import { getExample, listExamples } from "~/content";
import { kindLabels } from "~/content/labels";
import { site } from "~/site";

export const alt = "Example preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return listExamples().map((example) => ({ slug: example.slug }));
}

/** One Open Graph image per example, generated at build time. */
export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const example = getExample(slug);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#0b0f14",
        color: "#e6e8eb",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, color: "#9aa3ad" }}>
        {kindLabels[example.kind]} · {example.stack.join(" · ")}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
          {example.title}
        </div>
        <div style={{ fontSize: 32, color: "#9aa3ad", lineHeight: 1.4 }}>
          {example.summary}
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 28 }}>{site.name}</div>
    </div>,
    size,
  );
}
