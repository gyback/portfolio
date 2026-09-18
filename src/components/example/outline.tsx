"use client";

import { useEffect, useState } from "react";

import type { OutlineEntry } from "~/content/remark-outline";

/**
 * Top of the visible band, in viewport pixels. Content above this line sits
 * under the sticky header and does not count as visible.
 */
const VIEW_TOP = 56;

/**
 * "On this page" list. Every section with content currently on screen is
 * highlighted. A section spans from its heading to the next heading of any
 * depth (or the end of the article for the last one). When an h3 section is
 * visible its parent h2 is highlighted too.
 */
export function Outline({ entries }: { entries: OutlineEntry[] }) {
  // Stored as a joined string so equal results do not trigger a re-render.
  const [activeKey, setActiveKey] = useState("");

  useEffect(() => {
    const headings = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const article = headings[0]!.closest("article") ?? document.body;
    let frame = 0;

    const update = () => {
      frame = 0;
      const viewBottom = window.innerHeight;
      const tops = headings.map((h) => h.getBoundingClientRect().top);
      const articleBottom = article.getBoundingClientRect().bottom;

      const visible = new Set<string>();
      headings.forEach((heading, i) => {
        const top = tops[i]!;
        const bottom = tops[i + 1] ?? articleBottom;
        if (top < viewBottom && bottom > VIEW_TOP) visible.add(heading.id);
      });

      // Keep the parent h2 lit while any of its h3 children are visible.
      let currentH2: string | null = null;
      for (const entry of entries) {
        if (entry.depth === 2) currentH2 = entry.id;
        else if (visible.has(entry.id) && currentH2) visible.add(currentH2);
      }

      setActiveKey(
        entries
          .filter((e) => visible.has(e.id))
          .map((e) => e.id)
          .join(" "),
      );
    };

    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [entries]);

  if (entries.length === 0) return null;

  const activeIds = new Set(activeKey.split(" "));

  return (
    <nav aria-label="On this page">
      <p className="mb-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">
        On this page
      </p>
      <ul className="space-y-1 border-l border-gray-200 text-sm">
        {entries.map((entry) => {
          const active = activeIds.has(entry.id);
          return (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                aria-current={active ? "location" : undefined}
                className={[
                  "-ml-px block border-l py-1 pr-2 transition-colors",
                  entry.depth === 3 ? "pl-6" : "pl-3",
                  active
                    ? "border-gray-900 font-medium text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-900",
                ].join(" ")}
              >
                {entry.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
