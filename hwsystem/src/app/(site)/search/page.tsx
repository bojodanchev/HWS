import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { searchProducts } from "@/lib/catalog";
import { ProductGrid } from "@/components/ProductGrid";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the HWSystem catalogue by SKU, product name or compatibility.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const sp = await searchParams;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q)?.trim() ?? "";
  const results = q ? searchProducts(q) : [];

  return (
    <main className="mx-auto w-full max-w-[1280px] px-6 py-12 lg:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-mist">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span aria-hidden> / </span>
        <span className="text-steel">Search</span>
      </nav>
      <h1 className="mt-4 text-h1 text-ink">
        {q ? `Results for "${q}"` : "Search the catalogue"}
      </h1>
      <form action="/search" className="relative mt-6 max-w-xl">
        <label htmlFor="search-page-input" className="sr-only">
          Search by SKU or product name
        </label>
        <Search
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-mist"
          strokeWidth={1.5}
        />
        <input
          id="search-page-input"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Try a SKU first — e.g. SBI-TM45-50"
          className="h-11 w-full rounded-md border border-line bg-white pl-10 pr-3 text-sm text-ink outline-none transition-colors duration-150 placeholder:text-mist focus:border-ink focus:ring-2 focus:ring-signal/20"
        />
      </form>
      <div className="mt-10">
        {q ? (
          <>
            <p className="mb-6 text-sm text-steel">
              {results.length} result{results.length === 1 ? "" : "s"} — SKU and
              &ldquo;replaces&rdquo; matches rank first
            </p>
            <ProductGrid products={results} />
          </>
        ) : (
          <p className="text-steel">
            Installers search by SKU — it&apos;s printed on the motor head or the
            old part&apos;s label. Name, brand and compatibility work too.
          </p>
        )}
      </div>
    </main>
  );
}
