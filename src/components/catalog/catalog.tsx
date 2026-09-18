"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { kindLabels } from "~/content/labels";
import { exampleKinds, type ExampleKind } from "~/content/schema";

import { ExampleCard, type CardExample } from "./example-card";

function isKind(value: string | null): value is ExampleKind {
  return exampleKinds.includes(value as ExampleKind);
}

/**
 * Filterable list of examples. Filter state lives in the URL
 * (`?kind=backend&stack=dotnet&stack=docker`) so a filtered view is linkable.
 * Filtering runs client-side over the prebuilt list.
 */
export function Catalog({
  examples,
  stacks,
}: {
  examples: CardExample[];
  stacks: string[];
}) {
  const pathname = usePathname();
  const params = useSearchParams();

  const kindParam = params.get("kind");
  const kind = isKind(kindParam) ? kindParam : null;
  const selectedStacks = params
    .getAll("stack")
    .filter((s) => stacks.includes(s));

  const filtered = examples.filter(
    (example) =>
      (kind === null || example.kind === kind) &&
      selectedStacks.every((s) => example.stack.includes(s)),
  );

  const hrefWith = (mutate: (next: URLSearchParams) => void) => {
    const next = new URLSearchParams(params.toString());
    mutate(next);
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const anyFilter = kind !== null || selectedStacks.length > 0;

  return (
    <div>
      <div className="flex flex-col gap-4">
        <FilterGroup label="Kind">
          {exampleKinds.map((k) => (
            <Chip
              key={k}
              active={kind === k}
              href={hrefWith((next) => {
                if (kind === k) next.delete("kind");
                else next.set("kind", k);
              })}
            >
              {kindLabels[k]}
            </Chip>
          ))}
        </FilterGroup>
        <FilterGroup label="Stack">
          {stacks.map((s) => {
            const active = selectedStacks.includes(s);
            return (
              <Chip
                key={s}
                active={active}
                mono
                href={hrefWith((next) => {
                  const rest = next.getAll("stack").filter((v) => v !== s);
                  next.delete("stack");
                  for (const v of rest) next.append("stack", v);
                  if (!active) next.append("stack", s);
                })}
              >
                {s}
              </Chip>
            );
          })}
        </FilterGroup>
      </div>

      <p className="text-muted mt-6 text-sm" aria-live="polite">
        {filtered.length === examples.length
          ? `${examples.length} examples`
          : `${filtered.length} of ${examples.length} examples`}
        {anyFilter && (
          <>
            {" · "}
            <Link href={pathname} className="underline underline-offset-4">
              Clear filters
            </Link>
          </>
        )}
      </p>

      {filtered.length === 0 ? (
        <p className="text-muted mt-8">
          No examples match this combination of filters.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((example) => (
            <li key={example.slug}>
              <ExampleCard example={example} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-muted w-12 text-xs font-semibold tracking-wide uppercase">
        {label}
      </span>
      {children}
    </div>
  );
}

function Chip({
  href,
  active,
  mono,
  children,
}: {
  href: string;
  active: boolean;
  mono?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      replace
      scroll={false}
      aria-pressed={active}
      className={[
        "rounded-full border px-3 py-1 text-sm transition-colors",
        mono ? "font-mono text-xs" : "",
        active
          ? "border-fg bg-fg text-bg"
          : "border-line text-fg hover:border-muted",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
