import ts from "typescript";
import { readFileSync, existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";

const cache = new Map();
function load(file) {
  if (!existsSync(file)) file += ".ts";
  if (cache.has(file)) return cache.get(file);
  if (file.endsWith(".json")) return JSON.parse(readFileSync(file,"utf8"));
  const loadedModule = { exports: {} };
  cache.set(file,loadedModule.exports);
  const code = ts.transpileModule(readFileSync(file,"utf8"), {compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText;
  const requireLocal = name => load(name.startsWith("@/") ? resolve("src",name.slice(2)) : resolve(dirname(file),name));
  new Function("require","module","exports",code)(requireLocal,loadedModule,loadedModule.exports);
  return loadedModule.exports;
}
const { products } = load(resolve("src/content/catalog.ts"));
if (process.argv.includes("--export-image-index")) {
  await writeFile("/tmp/hws-image-index.json", JSON.stringify(products.map(({sku,name,brand,category,images}) => ({sku,name,brand,category,images})), null, 2));
}
const seen = new Set();
const duplicateSkus = [];
for (const p of products) {
  const sku = p.sku.trim().toUpperCase().replace(/\.0$/, "");
  if (seen.has(sku)) duplicateSkus.push(sku);
  seen.add(sku);
}
const rows = products.filter(p => p.price.quoteOnly || !Number.isFinite(p.price.rrp)).map(p => ({
  sku: p.sku, brand: p.brand, name: p.name, category: p.category,
  url: `https://hwsystem.co.uk/products/${p.category}/${p.slug}`,
  required: "Confirm GBP selling price excluding VAT",
}));
const missingImages = products.filter(p => !p.images.length).map(p => ({sku:p.sku,name:p.name,brand:p.brand}));
const imported = JSON.parse(readFileSync("src/content/vendor-catalog.json", "utf8")).products;
const previousCategories = new Map(imported.map(p => [p.sku, p.category]));
const categoryChanges = products.filter(p => p.id.startsWith("vendor-") && previousCategories.has(p.sku) && previousCategories.get(p.sku) !== p.category).map(p => ({sku:p.sku,name:p.name,from:previousCategories.get(p.sku),to:p.category}));
const relationships = products.filter(p => p.relatedSkus.some(sku => seen.has(sku)));
const summary = { checkedAt: new Date().toISOString(), products: products.length, duplicateSkus, missingPriceCount: rows.length, missingImageCount: missingImages.length, productsWithImages: products.length - missingImages.length, categoryCorrections: categoryChanges.length, productsWithListedRecommendations: relationships.length };
const directory = resolve("../evals/catalogue-2026-09-20");
await mkdir(directory, {recursive:true});
const csv = [Object.keys(rows[0]), ...rows.map(Object.values)].map(row => row.map(v => `"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");
await writeFile(resolve(directory,"missing-prices.csv"),csv+"\n");
await writeFile(resolve(directory,"catalogue-audit.json"),JSON.stringify({...summary,missingImages,categoryChanges},null,2)+"\n");
console.log(JSON.stringify(summary));
if (process.argv.includes("--export-agent-knowledge")) {
  const reviewed = products.filter(product => /^(bft|commercial)-/.test(product.id));
  const lines = ["# HWS reviewed commercial catalogue", `Compiled from the reviewed catalogue. Public prices are indicative GBP excluding VAT, with 20% VAT shown separately. Availability, delivery, warranty and unlisted compatibility require team confirmation. Use exact SKU matches only.`, ""];
  for (const product of reviewed) {
    const price = product.price;
    lines.push(`## SKU ${product.sku} — ${product.name}`, product.shortDescription, `Category: ${product.category}.`,
      price.quoteOnly !== true && Number.isFinite(price.rrp) ? `Indicative public price GBP ${price.rrp.toFixed(2)} ex VAT; GBP ${(price.rrp * 1.2).toFixed(2)} inc VAT.` : "Price on request; no approved GBP price.",
      "Availability and delivery: not verified.", "");
  }
  const text = lines.join("\n");
  if (text.includes("purchaseCostExVat") || text.includes("tradeTiers")) throw new Error("Private pricing leaked into knowledge export");
  await writeFile(resolve("../integrations/elevenlabs/catalogue-knowledge.md"), text);
  console.log(JSON.stringify({agentKnowledgeProducts:reviewed.length}));
}
if (duplicateSkus.length) process.exitCode = 1;
