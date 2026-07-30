# Data Model

> This document is written BEFORE any component. The catalog IS the business.
> If this model is wrong, the entire frontend gets rewritten.

## Hierarchy

```
Category → Subcategory → Product → Variant (SKU)
```

## Category

```typescript
type Category = {
  slug: string;
  name: string;
  description: string;
  image: string;
  parent?: string;
  filters: FilterKey[];   // which filters are relevant for this category
};
```

### Initial Categories

| Slug | Name |
|------|------|
| `tubular-motors` | Tubular motors |
| `side-motors` | Side / axial motors |
| `control-panels` | Control panels & receivers |
| `remotes` | Remotes & handsets |
| `safety` | Photocells, safety edges |
| `springs` | Springs & counterbalance |
| `cables` | Cables & wire rope |
| `locks` | Locks & anti-lift |
| `profiles` | Slats, guides, hoods |
| `accessories` | Accessories |
| `doors` | Doors (lead-gen, not ecom) |

---

## Product

```typescript
type Product = {
  id: string;
  sku: string;                 // key: installers search by SKU
  name: string;
  slug: string;
  brand: Brand;                // Somfy | Nice | Beninca | Teleco | SBI | Generic
  category: string;
  shortDescription: string;
  description: string;         // rich text from WP
  images: Image[];
  specs: Spec[];               // structured, FILTERABLE
  compatibility: string[];     // which systems/models it works with
  documents: Document[];       // DoP, UKCA, manual, wiring diagram
  price: Price;
  stock: Stock;
  variants?: Variant[];
  relatedSkus: string[];
  replacesSkus: string[];      // "replaces old model X" — big SEO/UX win
};

type Brand = 'Somfy' | 'Nice' | 'Beninca' | 'Teleco' | 'SBI' | 'Generic';

type Image = {
  url: string;
  alt: string;
  width: number;
  height: number;
};
```

---

## Spec (Typed, Not Free Text)

```typescript
type Spec = {
  key: SpecKey;
  value: string | number;
  unit?: string;
};

type SpecKey =
  | 'torque'        // Nm
  | 'tubeDiameter'  // 45 | 59 | 70
  | 'voltage'       // 230V AC | 24V DC
  | 'power'         // W
  | 'speed'         // rpm
  | 'limitSwitch'   // mechanical | electronic
  | 'ipRating'
  | 'frequency'     // 433.92 MHz | 868 MHz
  | 'channels'
  | 'maxDoorArea'   // m²
  | 'cableLength'
  | 'material'
  | 'warrantyYears';
```

> **Rule:** If a spec isn't in this enum, it's not shown as a filter. Free text goes in `description`.

---

## Price (Heart of B2B/B2C Hybrid)

```typescript
type Price = {
  rrp: number;                        // always visible (B2C)
  currency: 'GBP';
  vatIncluded: boolean;
  tradeTiers?: {                      // VISIBLE ONLY AFTER LOGIN
    bronze: number;
    silver: number;
    gold: number;
  };
  priceBreaks?: { qty: number; price: number }[];  // 1 / 5 / 10 / 25
};
```

**Frontend Logic:**
- Unauthenticated → show `rrp` + button `Log in for trade price`
- Trade user → show price for their tier + price breaks
- **Never** send `tradeTiers` to client if not logged in. Filter on server.

---

## Stock

```typescript
type Stock = {
  status: 'in_stock' | 'low' | 'backorder' | 'out';
  qty?: number;                // show only "10+ in stock", not exact number
  nextDayEligible: boolean;    // key promise
  leadTimeDays?: number;
};
```

---

## Document (Compliance = Product)

```typescript
type Document = {
  type: 'DoP' | 'UKCA' | 'CE' | 'manual' | 'wiring' | 'datasheet' | 'warranty';
  title: string;
  url: string;
  language: 'en' | 'bg';
};
```

---

## TradeAccount

```typescript
type TradeAccount = {
  companyName: string;
  vatNumber?: string;
  tier: 'bronze' | 'silver' | 'gold';
  status: 'pending' | 'approved' | 'suspended';
  approvedAt?: Date;
  creditTerms?: 'prepay' | 'net30';
};
```

> Registration requires **manual approval**. No one gets trade prices automatically.

---

## FilterKey

```typescript
type FilterKey =
  | 'brand'
  | 'category'
  | 'torque'
  | 'tubeDiameter'
  | 'voltage'
  | 'frequency'
  | 'inStock'
  | 'nextDay'
  | 'priceRange';
```

---

## Search (Algolia Index)

Index: `sku`, `name`, `brand`, `replacesSkus`, `compatibility`, `specs`.

> Searching by SKU and by "what it replaces" is the most common use case on-site. Optimize for it.

---

## Operational Support Records

These records live behind `src/lib/db.ts` and are separate from the product
catalogue.

### ChatConversation

```typescript
type ChatConversation = {
  id: `CHAT-${string}`;
  locale: 'en' | 'bg';
  status: 'active' | 'needs_follow_up' | 'contacted' | 'closed';
  visitorName?: string;
  visitorEmail?: string;
  visitorPhone?: string;
  createdAt: string;
  updatedAt: string;
};
```

### ChatMessage

```typescript
type ChatMessage = {
  id: `MSG-${string}`;
  conversationId: ChatConversation['id'];
  role: 'user' | 'assistant';
  content: string;
  source?: 'catalog' | 'openai';
  createdAt: string;
};
```

The server owns message history. Browser requests never supply prior turns.
`tickets.source_ref` links at most one support ticket to a conversation through
a partial unique index. Rate-limit counters are stored in `rate_limits` using a
hashed IP/user-agent fingerprint; raw fingerprints are not stored.
