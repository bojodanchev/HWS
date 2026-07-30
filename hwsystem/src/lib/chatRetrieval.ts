import type { Product } from "@/types/catalog";
import type { AssistantProduct, ChatLocale } from "@/types/chat";

export type ChatIntent = "compatibility" | "price" | "stock" | "product";
export type RetrievalConfidence = "high" | "medium" | "none";

export interface ChatRetrieval {
  intent: ChatIntent;
  confidence: RetrievalConfidence;
  products: Product[];
}

const CATEGORY_PATTERNS: { category: string; patterns: RegExp[] }[] = [
  {
    category: "remotes",
    patterns: [/\bremote(s)?\b/i, /\bhandset(s)?\b/i, /дистанцион/i],
  },
  {
    category: "tubular-motors",
    patterns: [/\btubular motor(s)?\b/i, /тръбен двигател/i, /тръбни двигател/i],
  },
  {
    category: "side-motors",
    patterns: [/\bside motor(s)?\b/i, /\baxial motor(s)?\b/i, /страничен двигател/i],
  },
  {
    category: "control-panels",
    patterns: [/\bcontrol panel(s)?\b/i, /\breceiver(s)?\b/i, /контролен панел/i, /приемник/i],
  },
  {
    category: "safety",
    patterns: [/\bphotocell(s)?\b/i, /\bsafety edge(s)?\b/i, /фотоклет/i, /защитен ръб/i],
  },
  {
    category: "springs",
    patterns: [/\bspring(s)?\b/i, /пружин/i],
  },
  {
    category: "cables",
    patterns: [/\bcable(s)?\b/i, /\bwire rope\b/i, /въже/i, /кабел/i],
  },
  {
    category: "locks",
    patterns: [/\block(s)?\b/i, /ключал/i],
  },
];

const STOP_WORDS = new Set([
  "a",
  "about",
  "and",
  "are",
  "can",
  "compatible",
  "compatibility",
  "for",
  "how",
  "is",
  "it",
  "me",
  "of",
  "price",
  "remote",
  "remotes",
  "stock",
  "the",
  "this",
  "what",
  "which",
  "with",
  "works",
  "в",
  "е",
  "за",
  "каква",
  "какви",
  "какво",
  "колко",
  "кои",
  "ли",
  "може",
  "на",
  "са",
  "с",
  "съвместим",
  "съвместима",
  "съвместими",
  "това",
  "цена",
]);

function normalise(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\u0400-\u04ff.-]+/g, " ")
    .trim();
}

function tokens(value: string): string[] {
  return normalise(value)
    .split(/\s+/)
    .filter((token) => token.length >= 2 && !STOP_WORDS.has(token));
}

function detectCategory(message: string): string | undefined {
  return CATEGORY_PATTERNS.find(({ patterns }) =>
    patterns.some((pattern) => pattern.test(message)),
  )?.category;
}

function detectIntent(message: string): ChatIntent {
  if (
    /\bcompatib(le|ility)\b|\bworks? with\b|\bfits?\b|съвместим|става ли|подходящ/i.test(
      message,
    )
  ) {
    return "compatibility";
  }
  if (/\bprice\b|\bcost\b|колко струва|цена/i.test(message)) return "price";
  if (/\bstock\b|\bavailable\b|налич/i.test(message)) return "stock";
  return "product";
}

function productHaystack(product: Product): string {
  return normalise(
    [
      product.sku,
      product.name,
      product.brand,
      product.category,
      product.shortDescription,
      product.compatibility.join(" "),
      product.replacesSkus.join(" "),
    ].join(" "),
  );
}

function exactIdentifierMatch(message: string, product: Product): boolean {
  const query = normalise(message);
  return (
    query.includes(normalise(product.sku)) ||
    query.includes(normalise(product.name))
  );
}

export function retrieveChatProducts(
  message: string,
  products: Product[],
): ChatRetrieval {
  const intent = detectIntent(message);
  const requestedCategory = detectCategory(message);
  const queryTokens = tokens(message);

  const scored = products
    .filter((product) => !requestedCategory || product.category === requestedCategory)
    .map((product) => {
      const haystack = productHaystack(product);
      const exact = exactIdentifierMatch(message, product);
      const matchedTokens = queryTokens.filter((token) => haystack.includes(token));
      const score =
        (exact ? 120 : 0) +
        (requestedCategory ? 35 : 0) +
        matchedTokens.length * 18;
      return { product, exact, matchedTokens, score };
    })
    .filter(({ exact, matchedTokens }) => {
      if (exact) return true;
      if (queryTokens.length === 0) return Boolean(requestedCategory);
      return matchedTokens.length > 0;
    })
    .sort((a, b) => b.score - a.score);

  const first = scored[0];
  if (!first) return { intent, confidence: "none", products: [] };

  const confidence: RetrievalConfidence =
    first.exact || first.matchedTokens.length >= 2
      ? "high"
      : requestedCategory && first.matchedTokens.length >= 1
        ? "high"
        : requestedCategory
          ? "medium"
          : "none";

  if (confidence === "none") return { intent, confidence, products: [] };

  const minimumScore = Math.max(first.score - 18, requestedCategory ? 35 : 1);
  const matches = scored
    .filter(({ score }) => score >= minimumScore)
    .slice(0, 3)
    .map(({ product }) => product);

  return { intent, confidence, products: matches };
}

function stockLabel(product: Product, locale: ChatLocale): string {
  const labels = {
    en: {
      in_stock: "in stock",
      low: "low stock",
      backorder: "available to backorder",
      out: "out of stock",
    },
    bg: {
      in_stock: "в наличност",
      low: "ограничена наличност",
      backorder: "с доставка по заявка",
      out: "изчерпан",
    },
  } as const;
  return labels[locale][product.stock.status];
}

export function toAssistantProduct(
  product: Product,
  locale: ChatLocale,
  formatPrice: (value: number) => string,
): AssistantProduct {
  return {
    name: product.name,
    sku: product.sku,
    brand: product.brand,
    category: product.category,
    shortDescription: product.shortDescription,
    compatibility: product.compatibility,
    price: `${formatPrice(product.price.rrp)} ex VAT`,
    stock: stockLabel(product, locale),
    specs: product.specs.map(
      (spec) => `${spec.key}: ${spec.value}${spec.unit ? ` ${spec.unit}` : ""}`,
    ),
    url: `/products/${product.category}/${product.slug}`,
  };
}

export function deterministicCatalogAnswer(
  retrieval: ChatRetrieval,
  locale: ChatLocale,
  formatPrice: (value: number) => string,
): { answer: string; needsFollowUp: boolean; products: AssistantProduct[] } {
  const products = retrieval.products.map((product) =>
    toAssistantProduct(product, locale, formatPrice),
  );

  if (products.length === 0) {
    return {
      answer:
        locale === "bg"
          ? "Не намирам достатъчно надеждни данни в каталога, за да препоръчам продукт. Мога да предам въпроса на екипа за проверен отговор."
          : "I cannot find enough reliable catalogue evidence to recommend a product. I can pass this to the team for a checked answer.",
      needsFollowUp: true,
      products: [],
    };
  }

  if (retrieval.intent === "compatibility") {
    const lines = products.map((product) => {
      const compatibility =
        product.compatibility.length > 0
          ? product.compatibility.join(", ")
          : locale === "bg"
            ? "няма описана съвместимост"
            : "no compatibility is listed";
      return `${product.name} (${product.sku}) — ${compatibility}.`;
    });
    return {
      answer:
        locale === "bg"
          ? `Каталогът посочва:\n${lines.join("\n")} Проверете точния модел и честота преди поръчка.`
          : `The catalogue lists:\n${lines.join("\n")} Confirm the exact model and frequency before ordering.`,
      needsFollowUp: false,
      products,
    };
  }

  const lines = products.map(
    (product) =>
      `${product.name} (${product.sku}) — ${product.price}, ${product.stock}.`,
  );
  return {
    answer:
      locale === "bg"
        ? `Намерих:\n${lines.join("\n")}`
        : `I found:\n${lines.join("\n")}`,
    needsFollowUp: false,
    products,
  };
}
