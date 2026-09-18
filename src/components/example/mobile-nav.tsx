"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

/**
 * Collapsible wrapper for the page nav below the lg breakpoint.
 * Open state is keyed to the pathname it was opened on, so navigating
 * to another page closes it without needing an effect.
 */
export function MobileNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;

  return (
    <div className="border-line border-b py-3 lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-page-nav"
        onClick={() => setOpenFor(open ? null : pathname)}
        className="flex items-center gap-2 text-sm font-medium"
      >
        <span aria-hidden="true">{open ? "▾" : "▸"}</span>
        Pages
      </button>
      {open && (
        <div id="mobile-page-nav" className="mt-3">
          {children}
        </div>
      )}
    </div>
  );
}
