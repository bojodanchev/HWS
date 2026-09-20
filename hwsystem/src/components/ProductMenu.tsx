"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { productNavigation } from "@/content/product-navigation";

export function ProductMenu() {
  const [openPath, setOpenPath] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const open = openPath === pathname;
  const menuId = useId();
  useEffect(() => {
    function outside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpenPath(null);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  return (
    <div ref={root} onKeyDown={(event) => {
      if (event.key === "Escape") { setOpenPath(null); button.current?.focus(); }
    }}>
      <button ref={button} type="button" aria-expanded={open} aria-controls={menuId}
        onClick={() => setOpenPath(open ? null : pathname)}
        className="inline-flex h-11 items-center gap-2 text-sm font-medium text-steel hover:text-ink focus-visible:outline-2 focus-visible:outline-signal">
        Products <ChevronDown aria-hidden className="size-4" />
      </button>
      {open && <nav key={pathname} id={menuId} aria-label="Product categories"
        className="absolute inset-x-0 top-full max-h-[70svh] overflow-y-auto border-b border-line bg-white">
        <div className="mx-auto grid max-w-[1280px] gap-6 px-6 py-6 sm:grid-cols-3">
          {productNavigation.map((group) => <div key={group.title}>
            <p className="mb-2 text-sm font-semibold text-ink">{group.title}</p>
            <ul>{group.links.map((link) => <li key={link.href}>
              <Link href={link.href} onClick={() => setOpenPath(null)} className="flex min-h-11 items-center text-sm text-steel hover:text-ink focus-visible:outline-2 focus-visible:outline-signal">{link.label}</Link>
            </li>)}</ul>
          </div>)}
        </div>
      </nav>}
    </div>
  );
}
