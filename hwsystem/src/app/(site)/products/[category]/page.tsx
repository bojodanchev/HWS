import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import {
  getCategories,
  getCategory,
  getFacets,
  getProducts,
  hasPublicPrice,
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

  const matchingProducts = getProducts(filters);
  const priced = matchingProducts.filter(product => hasPublicPrice(product.price));
  const specialOrder = matchingProducts.filter(product => !hasPublicPrice(product.price));
  const requestedView = firstValue(sp.view);
  const view = requestedView === "special-order" || requestedView === "all" || requestedView === "priced" ? requestedView : priced.length ? "priced" : "special-order";
  const products = view === "all" ? matchingProducts : view === "priced" ? priced : specialOrder;
  function viewHref(nextView: string) {
    const query = new URLSearchParams();
    for (const [key,value] of Object.entries(sp)) {
      const first = firstValue(value);
      if (first && key !== "view") query.set(key,first);
    }
    query.set("view",nextView);
    return `/products/${category}?${query}`;
  }
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
      <nav aria-label="Catalogue price availability" className="mt-6 flex flex-wrap gap-2 border-b border-line">
        {[
          {id:"priced",label:`Priced catalogue (${priced.length})`},
          {id:"special-order",label:`Special order (${specialOrder.length})`},
          {id:"all",label:`All products (${matchingProducts.length})`},
        ].map(item => <Link key={item.id} href={viewHref(item.id)} aria-current={view === item.id ? "page" : undefined}
          className={`inline-flex min-h-11 items-center border-b-2 px-4 text-sm font-medium ${view === item.id ? "border-ink text-ink" : "border-transparent text-steel hover:text-ink"}`}>{item.label}</Link>)}
      </nav>
      {view === "special-order" && <p className="mt-3 text-sm text-steel">Ask for a confirmed price and availability for these models. They remain searchable by SKU.</p>}

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
