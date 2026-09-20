import type { Product } from "@/types/catalog";
import { ProductCard } from "@/components/ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-md border border-line bg-white p-12 text-center">
        <p className="text-h3 text-ink">No products match those filters</p>
        <p className="mt-2 text-sm text-steel">
          Try removing a filter, or call us on +44 (0)20 4577 4094 — if it fits
          a garage door, we can usually get it.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((p) => (
        <li key={p.id}>
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}
