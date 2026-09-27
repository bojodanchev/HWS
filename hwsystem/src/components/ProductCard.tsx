import Image from "@/components/OptimizedImage";
import Link from "next/link";
import type { Product } from "@/types/catalog";
import { formatGBP, formatVatRate, getPriceBreakdown, hasPublicPrice } from "@/lib/catalog";
import { StockBadge } from "@/components/StockBadge";

function specChips(product: Product): string[] {
  const chips: string[] = [];
  for (const s of product.specs) {
    if (s.key === "torque") chips.push(`${s.value} Nm`);
    if (s.key === "tubeDiameter") chips.push(`Ø${s.value}`);
    if (s.key === "voltage") chips.push(String(s.value));
    if (s.key === "frequency") chips.push(String(s.value));
    if (s.key === "channels") chips.push(`${s.value}-ch`);
  }
  return chips.slice(0, 3);
}

/**
 * The most important component on the site. Installers choose by specs,
 * not photos — specs are always visible on the card.
 */
export function ProductCard({ product }: { product: Product }) {
  const href = `/products/${product.category}/${product.slug}`;
  const chips = specChips(product);
  const image = product.images[0];
  const publicPrice = hasPublicPrice(product.price) ? product.price : undefined;
  const breakdown = publicPrice ? getPriceBreakdown(publicPrice) : undefined;

  return (
    <article className="group flex flex-col rounded-md border border-line bg-white transition-colors duration-150 hover:border-ink">
      <Link href={href} className="flex flex-1 flex-col p-4">
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-sm bg-concrete">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain p-2"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-mist">
              Photo to follow
            </div>
          )}
        </div>
        {image?.caption && <p className="mt-2 text-xs leading-relaxed text-steel">{image.caption}</p>}
        <p className="mt-4 text-xs font-medium uppercase tracking-[0.08em] text-steel">
          {product.brand}
        </p>
        <h3 className="mt-1 text-h3 text-ink">{product.name}</h3>
        <p className="mt-1 font-mono text-[13px] text-mist">SKU: {product.sku}</p>
        {chips.length > 0 && (
          <p className="mt-2 text-[13px] text-steel">{chips.join(" · ")}</p>
        )}
        <div className="mt-4 border-t border-line pt-4">
          {breakdown ? (
            <p className="text-xl font-semibold text-ink">
              {formatGBP(breakdown.exVat)}
              <span className="ml-1.5 text-sm font-normal text-mist">ex VAT</span>
            </p>
          ) : (
            <p className="text-xl font-semibold text-ink">Price on request</p>
          )}
          {breakdown ? (
            <>
              <p className="mt-0.5 text-sm text-steel">
                + VAT ({formatVatRate(breakdown.vatRate)}): {formatGBP(breakdown.vat)}
              </p>
              <p className="mt-0.5 text-sm font-medium text-ink">
                {formatGBP(breakdown.incVat)} <span className="font-normal text-mist">inc VAT</span>
              </p>
              <p className="mt-1 text-sm text-steel">Trade accounts available</p>
            </>
          ) : (
            <p className="mt-0.5 text-sm text-steel">Request a quote for this part</p>
          )}
          <StockBadge stock={product.stock} className="mt-2" />
        </div>
      </Link>
    </article>
  );
}
