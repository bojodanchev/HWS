import Link from "next/link";
import { Search, UserRound } from "lucide-react";

const NAV = [
  { href: "/products", label: "Products" },
  { href: "/trade", label: "Trade account" },
  { href: "/doors", label: "Doors" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="border-b border-line bg-concrete">
        <div className="mx-auto flex h-9 max-w-[1280px] items-center justify-between gap-4 px-6 text-[13px] text-steel">
          <p className="flex items-center gap-4">
            <a href="tel:+443301234567" className="hover:text-ink">
              +44 (0)330 123 4567
            </a>
            <span aria-hidden className="hidden text-line sm:inline">
              |
            </span>
            <span className="hidden sm:inline">Order by 2pm for next-day delivery</span>
          </p>
          <Link href="/trade" className="font-medium text-signal hover:text-signal-hover">
            Open trade account
          </Link>
        </div>
      </div>
      <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-6 px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="HWSystem home">
          <span className="flex size-8 items-center justify-center rounded-sm bg-ink font-heading text-sm font-semibold text-white">
            HW
          </span>
          <span className="font-heading text-lg font-semibold text-ink">HWSystem</span>
        </Link>
        <nav aria-label="Main" className="hidden flex-1 lg:block">
          <ul className="flex items-center justify-center gap-7">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-steel transition-colors duration-150 hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <form action="/search" className="relative hidden md:block">
            <label htmlFor="header-search" className="sr-only">
              Search by SKU or product name
            </label>
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-mist"
              strokeWidth={1.5}
            />
            <input
              id="header-search"
              name="q"
              type="search"
              placeholder="Search SKU or product"
              className="h-11 w-56 rounded-md border border-line bg-white pl-10 pr-3 text-sm text-ink outline-none transition-colors duration-150 placeholder:text-mist focus:border-ink focus:ring-2 focus:ring-signal/20"
            />
          </form>
          <Link
            href="/search"
            className="flex size-11 items-center justify-center rounded-md text-steel transition-colors duration-150 hover:bg-concrete hover:text-ink md:hidden"
            aria-label="Search"
          >
            <Search className="size-5" strokeWidth={1.5} />
          </Link>
          <Link
            href="/trade"
            className="flex size-11 items-center justify-center rounded-md text-steel transition-colors duration-150 hover:bg-concrete hover:text-ink"
            aria-label="Trade account"
          >
            <UserRound className="size-5" strokeWidth={1.5} />
          </Link>
          <Link
            href="/trade"
            className="hidden h-11 items-center rounded-md bg-signal px-6 text-sm font-medium text-white transition-colors duration-150 hover:bg-signal-hover sm:flex"
          >
            Get trade pricing
          </Link>
        </div>
      </div>
      <nav aria-label="Main mobile" className="border-t border-line lg:hidden">
        <ul className="mx-auto flex max-w-[1280px] items-center gap-5 overflow-x-auto px-6 py-2.5">
          {NAV.map((item) => (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                className="text-sm font-medium text-steel transition-colors duration-150 hover:text-ink"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
