import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import {
  getCategories,
  getCategory,
  getFacets,
  getProducts,
  type CatalogFilters,
} from "@/lib/catalog";
import { ProductGrid } from "@/components/ProductGrid";
import { FilterDrawer, FilterSidebar, SortSelect } from "@/components/FilterControls";

type Params = { category: string };
type SearchParams = Record<string, string | string[] | undefined>;

export function generateStaticParams(): Params[] {
  return getCategories()
    .filter((c) => c.slug !== "doors")
    .map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return {};
  return {
    title: `${cat.name} — trade & retail`,
    description: cat.description,
  };
}

function firstValue(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { category } = await params;
  if (category === "doors") redirect("/doors");
  const cat = getCategory(category);
  if (!cat) notFound();

  const sp = await searchParams;
  const filters: CatalogFilters = { category };
  for (const key of ["brand", "torque", "tubeDiameter", "voltage", "frequency", "inStock", "nextDay"] as const) {
    const v = firstValue(sp[key]);
    if (v) filters[key] = v;
  }
  const sort = firstValue(sp.sort);
  if (sort === "price-asc" || sort === "price-desc" || sort === "name") {
    filters.sort = sort;
  }

  const products = getProducts(filters);
  const facets = getFacets(getProducts({ category }));

  return (
    <main className="mx-auto w-full max-w-[1280px] px-6 py-12 lg:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-mist">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span aria-hidden> / </span>
        <Link href="/products" className="hover:text-ink">
          Products
        </Link>
        <span aria-hidden> / </span>
        <span className="text-steel">{cat.name}</span>
      </nav>
      <h1 className="mt-4 text-h1 text-ink">{cat.name}</h1>
      <p className="mt-3 max-w-2xl text-steel">{cat.description}</p>

      <div className="mt-10 flex gap-10">
        <Suspense>
          <FilterSidebar facets={facets} />
        </Suspense>
        <div className="min-w-0 flex-1">
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-sm text-steel">
              {products.length} product{products.length === 1 ? "" : "s"}
            </p>
            <div className="flex items-center gap-3">
              <Suspense>
                <FilterDrawer facets={facets} />
              </Suspense>
              <Suspense>
                <SortSelect />
              </Suspense>
            </div>
          </div>
          <ProductGrid products={products} />
        </div>
      </div>
    </main>
  );
}
