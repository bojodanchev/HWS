import Link from "next/link";
import { redirect } from "next/navigation";
import { products } from "@/content/catalog";
import { isAdminAuthed } from "@/lib/adminAuth";
import { formatGBP, getPriceBreakdown, hasPublicPrice } from "@/lib/catalog";

export const metadata = { title: "Catalogue & pricing" };

export default async function CatalogueAdmin({ searchParams }: {
  searchParams: Promise<{ q?: string; missing?: string }>;
}) {
  // Check in the page as well as the layout before rendering supplier costs.
  if (!(await isAdminAuthed())) redirect("/admin/login");
  const { q = "", missing } = await searchParams;
  const query = q.trim().toLowerCase();
  const selected = products.filter((p) =>
    (!query || `${p.sku} ${p.name} ${p.brand}`.toLowerCase().includes(query)) &&
    (missing !== "price" || !hasPublicPrice(p.price)) &&
    (missing !== "image" || p.images.length === 0),
  );
  return <section>
    <h2 className="text-h2 text-ink">Catalogue & pricing</h2>
    <p className="mt-2 text-sm text-steel">Supplier discount: 52% on the six supplied commercial workbooks. Cost = source RRP excluding VAT × 48%. Public prices remain GBP excluding VAT.</p>
    <p className="mt-2 text-sm text-steel">Garage-door quote policy: trade account, minimum 5 doors; cost × 1.60 before VAT. Door costs still need confirmation.</p>
    <form className="mt-6 flex flex-wrap items-end gap-4">
      <label className="text-sm text-steel">SKU or product
        <input name="q" defaultValue={q} className="mt-1 block h-11 rounded-md border border-line px-3 text-ink" />
      </label>
      <label className="text-sm text-steel">Show
        <select name="missing" defaultValue={missing ?? ""} className="mt-1 block h-11 rounded-md border border-line px-3 text-ink">
          <option value="">All products</option><option value="price">Missing prices</option><option value="image">Missing images</option>
        </select>
      </label>
      <button className="h-11 rounded-md bg-ink px-6 text-sm text-white">Filter</button>
    </form>
    <p className="mt-6 text-sm text-steel">{selected.length} products · {products.filter(p => !hasPublicPrice(p.price)).length} need prices · {products.filter(p => !p.images.length).length} need images</p>
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Internal catalogue pricing in GBP</caption>
        <thead><tr className="border-b border-line text-steel">{["SKU / product", "Category", "Public ex VAT", "Public inc VAT", "Supplier cost ex VAT", "Image"].map(label => <th key={label} className="p-3 font-medium">{label}</th>)}</tr></thead>
        <tbody>{selected.map(p => {
          const price = getPriceBreakdown(p.price);
          return <tr key={p.sku} className="border-b border-line">
            <td className="p-3"><Link href={`/products/${p.category}/${p.slug}`} className="font-medium underline-offset-4 hover:underline">{p.name}</Link><span className="mt-1 block font-mono text-xs text-steel">{p.sku}</span></td>
            <td className="p-3 text-steel">{p.category}</td>
            <td className="p-3 font-mono">{price ? formatGBP(price.exVat) : "Needs price"}</td>
            <td className="p-3 font-mono">{price ? formatGBP(price.incVat) : "—"}</td>
            <td className="p-3 font-mono">{p.price.purchaseCostExVat !== undefined ? formatGBP(p.price.purchaseCostExVat) : "Not supplied"}</td>
            <td className="p-3">{p.images.length ? "Available" : "Missing"}</td>
          </tr>;
        })}</tbody>
      </table>
    </div>
  </section>;
}
