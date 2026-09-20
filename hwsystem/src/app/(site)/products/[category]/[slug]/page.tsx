import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowRight, PhoneCall } from "lucide-react";
import {
  getCategory,
  getProductBySlug,
  getProducts,
  getRecommendationGroups,
  hasKnownStock,
  hasPublicPrice,
  type DisplayStockStatus,
} from "@/lib/catalog";
import { PriceBlock } from "@/components/PriceBlock";
import { StockBadge } from "@/components/StockBadge";
import { SpecTable } from "@/components/SpecTable";
import { DocumentList } from "@/components/DocumentList";
import { ProductCard } from "@/components/ProductCard";

type Params = { category: string; slug: string };

export function generateStaticParams(): Params[] {
  return getProducts().map((p) => ({ category: p.category, slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} (${product.sku})`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { category, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  if (product.category !== category) permanentRedirect(`/products/${product.category}/${product.slug}`);
  const cat = getCategory(product.category);
  const recommendations = getRecommendationGroups(product);
  const publicPrice = hasPublicPrice(product.price) ? product.price : undefined;
  const stockStatus: DisplayStockStatus = product.stock.status;
  const knownStock = hasKnownStock(product.stock);

  const offer = publicPrice
    ? {
        "@type": "Offer",
        price: publicPrice.rrp,
        ...(publicPrice.currency ? { priceCurrency: publicPrice.currency } : {}),
        ...(knownStock
          ? {
              availability:
                stockStatus === "out"
                  ? "https://schema.org/OutOfStock"
                  : stockStatus === "backorder"
                    ? "https://schema.org/BackOrder"
                    : "https://schema.org/InStock",
            }
          : {}),
      }
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    brand: { "@type": "Brand", name: product.brand },
    description: product.shortDescription,
    ...(product.images.length > 0 ? { image: product.images.map((i) => i.url) } : {}),
    ...(offer ? { offers: offer } : {}),
  };

  return (
    <main className="mx-auto w-full max-w-[1280px] px-6 py-12 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-mist">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span aria-hidden> / </span>
        <Link href="/products" className="hover:text-ink">
          Products
        </Link>
        <span aria-hidden> / </span>
        <Link href={`/products/${product.category}`} className="hover:text-ink">
          {cat?.name ?? product.category}
        </Link>
        <span aria-hidden> / </span>
        <span className="text-steel">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_1fr]">
        {/* Gallery */}
        <div className="space-y-4">
          {product.images.length > 0 ? (
            product.images.map((img, index) => (
              <figure key={img.url + img.alt}>
              <div
                className="relative aspect-4/3 overflow-hidden rounded-md border border-line bg-concrete"
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-contain p-4"
                  priority={index === 0}
                />
              </div>
              {img.caption && <figcaption className="mt-2 text-sm text-steel">{img.caption}</figcaption>}
              </figure>
            ))
          ) : (
            <div className="flex aspect-4/3 items-center justify-center rounded-md border border-line bg-concrete text-sm text-mist">
              Photo to follow — specs below are definitive
            </div>
          )}
        </div>

        {/* Buy box */}
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-steel">
            {product.brand}
          </p>
          <h1 className="mt-2 text-h1 text-ink">{product.name}</h1>
          <p className="mt-2 font-mono text-sm text-mist">SKU: {product.sku}</p>
          <p className="mt-4 text-steel">{product.shortDescription}</p>

          <div className="mt-6 rounded-md border border-line bg-white p-6">
            <PriceBlock price={product.price} quoteHref={`/quote?sku=${encodeURIComponent(product.sku)}`} />
            <StockBadge stock={product.stock} className="mt-4" />
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/quote?sku=${encodeURIComponent(product.sku)}`}
                className="flex h-11 items-center gap-2 rounded-md bg-signal px-6 text-sm font-medium text-white transition-colors duration-150 hover:bg-signal-hover"
              >
                Get a quote for this part
                <ArrowRight aria-hidden className="size-4" strokeWidth={1.5} />
              </Link>
              <a
                href="tel:+442045774094"
                className="flex h-11 items-center gap-2 rounded-md border border-line px-6 text-sm font-medium text-ink transition-colors duration-150 hover:bg-concrete"
              >
                <PhoneCall aria-hidden className="size-4" strokeWidth={1.5} />
                Phone enquiries
              </a>
            </div>
            <p className="mt-4 text-[13px] text-mist">
              Request a quote to confirm the price, availability and suitability for your installation.
            </p>
          </div>

          {product.replacesSkus.length > 0 && (
            <p className="mt-4 text-sm text-steel">
              Replaces:{" "}
              <span className="font-mono text-ink">{product.replacesSkus.join(", ")}</span>
            </p>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="mt-16 grid gap-12 lg:grid-cols-[1.1fr_1fr]">
        <section aria-labelledby={product.specs.length > 0 ? "spec-heading" : "description-heading"}>
          {product.specs.length > 0 && (
            <>
              <h2 id="spec-heading" className="text-h2 text-ink">
                Specifications
              </h2>
              <div className="mt-5 rounded-md border border-line bg-white p-6">
                <SpecTable specs={product.specs} />
              </div>
            </>
          )}
          <h2 id="description-heading" className="mt-10 text-h2 text-ink">
            Description
          </h2>
          <p className="mt-4 leading-relaxed text-steel">{product.description}</p>
          {product.compatibility.length > 0 && (
            <>
              <h2 className="mt-10 text-h2 text-ink">Works with</h2>
              <ul className="mt-4 list-inside list-disc space-y-1.5 text-steel">
                {product.compatibility.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </>
          )}
        </section>
        <section aria-labelledby="docs-heading">
          <h2 id="docs-heading" className="text-h2 text-ink">
            Documents
          </h2>
          <div className="mt-5">
            {product.documents.length > 0 ? (
              <DocumentList documents={product.documents} />
            ) : (
              <p className="rounded-md border border-line bg-white p-6 text-sm text-steel">
                Compliance documents for this product are available on request —
                email{" "}
                <a href="mailto:sales@hwsystem.co.uk" className="font-medium text-ink underline underline-offset-4">
                  sales@hwsystem.co.uk
                </a>
                .
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Recommendations */}
      {recommendations.curated.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-20">
          <h2 id="related-heading" className="text-h2 text-ink">
            Recommended for this installation
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.curated.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
      {recommendations.related.length > 0 && (
        <section aria-labelledby="related-products-heading" className="mt-20">
          <h2 id="related-products-heading" className="text-h2 text-ink">
            Related products
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recommendations.related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
