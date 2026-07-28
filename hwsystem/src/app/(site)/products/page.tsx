import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategories, getProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Product catalogue",
  description:
    "Garage door motors, control panels, remotes, safety devices, springs, cables and locks. Trade pricing and next-day delivery across the UK.",
};

export default function ProductsPage() {
  const categories = getCategories();
  const counts = new Map<string, number>();
  for (const p of getProducts()) {
    counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] px-6 py-12 lg:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-mist">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span aria-hidden> / </span>
        <span className="text-steel">Products</span>
      </nav>
      <h1 className="mt-4 text-h1 text-ink">Product catalogue</h1>
      <p className="mt-3 max-w-2xl text-steel">
        Search by SKU in the header if you know exactly what you need — or
        browse by category below. Every product lists full specs, availability
        and compliance documents.
      </p>
      <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const count = counts.get(cat.slug) ?? 0;
          const href = cat.slug === "doors" ? "/doors" : `/products/${cat.slug}`;
          return (
            <li key={cat.slug}>
              <Link
                href={href}
                className="group flex h-full flex-col rounded-md border border-line bg-white transition-colors duration-150 hover:border-ink"
              >
                <div className="relative aspect-4/3 overflow-hidden rounded-t-md bg-concrete">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-h3 text-ink">{cat.name}</h2>
                  <p className="mt-1.5 flex-1 text-sm text-steel">{cat.description}</p>
                  <p className="mt-4 flex items-center gap-1.5 text-sm font-medium text-signal">
                    {cat.slug === "doors"
                      ? "Get a door quote"
                      : `${count} product${count === 1 ? "" : "s"}`}
                    <ArrowRight aria-hidden className="size-4" strokeWidth={1.5} />
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
