"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/support", label: "Customer support" },
  { href: "/admin/orders", label: "Order manager" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin sections" className="border-b border-line">
      <ul className="flex gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const active =
            tab.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`-mb-px inline-flex h-11 items-center whitespace-nowrap border-b-2 px-4 text-sm font-medium transition-colors duration-150 ${
                  active
                    ? "border-ink text-ink"
                    : "border-transparent text-steel hover:border-line hover:text-ink"
                }`}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
