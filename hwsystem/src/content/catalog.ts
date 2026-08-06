import type { Category, Product } from "@/types/catalog";
import { vendorProducts } from "@/content/vendor-catalog";
import { niceProducts } from "@/content/nice-catalog";
import { bftProducts } from "@/content/bft-catalog";

/**
 * Catalog content — the MVP data layer.
 *
 * This is the standalone typed catalogue source. src/lib/catalog.ts is the
 * only consumer, so an optional commerce adapter can be added later without
 * becoming a runtime requirement. Product images marked "real" come from SBI
 * Group's own sites (sbigaragedoors.co.uk / sbi-bg.com); items without
 * photography yet use specs-first cards.
 */

export const categories: Category[] = [
  {
    slug: "tubular-motors",
    name: "Tubular motors",
    description:
      "Somfy, SBI and compatible tube motors for roller shutters, roller garage doors and awnings. Ø45–Ø59, 10–120 Nm.",
    image: "/images/products/tube-link.jpg",
    filters: ["brand", "torque", "tubeDiameter", "voltage", "inStock", "nextDay"],
  },
  {
    slug: "side-motors",
    name: "Side motors",
    description:
      "Axial and side-mounted operators for sectional and industrial doors, including chain and shaft drives.",
    image: "/images/products/automation.jpg",
    filters: ["brand", "torque", "voltage", "inStock", "nextDay"],
  },
  {
    slug: "sliding-gates",
    name: "Sliding gate automation",
    description:
      "Complete sliding-gate operators, motors and rack systems for residential, commercial and heavy gates.",
    image: "/images/products/automation.jpg",
    filters: ["brand", "voltage", "frequency", "inStock", "nextDay"],
  },
  {
    slug: "swing-gates",
    name: "Swing gate automation",
    description:
      "Articulated-arm, linear and hydraulic operators for single- and double-leaf swing gates.",
    image: "/images/doors/thumb-sliding.jpg",
    filters: ["brand", "voltage", "frequency", "inStock", "nextDay"],
  },
  {
    slug: "garage-door-automation",
    name: "Garage door automation",
    description:
      "Ceiling and shaft-drive operators for sectional, up-and-over and roller garage-door installations.",
    image: "/images/doors/sectional-installed.jpg",
    filters: ["brand", "voltage", "frequency", "inStock", "nextDay"],
  },
  {
    slug: "controls-and-safety",
    name: "Controls & safety",
    description:
      "Receivers, transmitters, photocells, flashing lights and installation controls for safer automation.",
    image: "/images/products/bft-remote.jpg",
    filters: ["brand", "voltage", "frequency", "inStock", "nextDay"],
  },
  {
    slug: "gate-automation",
    name: "Gate automation",
    description:
      "Beninca automation systems for swinging and sliding gates, imported from the public manufacturer catalogue.",
    image: "/images/products/automation.jpg",
    filters: ["brand", "torque", "voltage", "frequency", "inStock", "nextDay"],
  },
  {
    slug: "barriers",
    name: "Barriers & car park automation",
    description:
      "Public Beninca barrier and car-park automation metadata, available for quotation pending commercial confirmation.",
    image: "/images/products/moovi-barrier.png",
    filters: ["brand", "voltage", "frequency", "inStock", "nextDay"],
  },
  {
    slug: "control-panels",
    name: "Control panels & receivers",
    description:
      "Single and three-phase control units, plug-in receivers and smart-home gateways for door automation.",
    image: "/images/products/moovi-barrier.png",
    filters: ["brand", "voltage", "frequency", "inStock", "nextDay"],
  },
  {
    slug: "remotes",
    name: "Remotes & handsets",
    description:
      "Replacement transmitters, wall switches and keypads. 433.92 MHz and 868 MHz, rolling and fixed code.",
    image: "/images/products/bft-remote.jpg",
    filters: ["brand", "frequency", "inStock", "nextDay"],
  },
  {
    slug: "safety",
    name: "Photocells & safety edges",
    description:
      "Photocell pairs, resistive safety edges and flashing lamps for EN 12453 compliant installations.",
    image: "/images/doors/h105-commercial.png",
    filters: ["brand", "voltage", "inStock", "nextDay"],
  },
  {
    slug: "springs",
    name: "Springs & counterbalance",
    description:
      "Torsion springs, spring breaks and counterbalance hardware for sectional and up-and-over doors.",
    image: "/images/doors/thumb-sectional.jpg",
    filters: ["inStock", "nextDay"],
  },
  {
    slug: "cables",
    name: "Cables & wire rope",
    description:
      "Lifting cables, wire rope on the reel and cable accessories, cut to length or boxed.",
    image: "/images/doors/thumb-roller.jpg",
    filters: ["inStock", "nextDay"],
  },
  {
    slug: "locks",
    name: "Locks & anti-lift",
    description:
      "Roller door bullet locks, sectional latch kits and anti-lift protection.",
    image: "/images/doors/thumb-sliding.jpg",
    filters: ["inStock", "nextDay"],
  },
  {
    slug: "accessories",
    name: "Accessories",
    description:
      "Tube links, adapter kits, barrel rings, safety brakes and everything else that finishes the job.",
    image: "/images/products/tube-link.jpg",
    filters: ["brand", "inStock", "nextDay"],
  },
  {
    slug: "doors",
    name: "Doors",
    description:
      "Complete SBI sectional and roller doors, made in our own European factory. Quoted, not carted.",
    image: "/images/doors/sectional-installed.jpg",
    filters: [],
  },
  {
    slug: "supplier-products",
    name: "Supplier catalogue",
    description:
      "Public supplier product metadata imported without account-gated pricing, stock promises, or unapproved assets.",
    image: "/images/products/automation.jpg",
    filters: ["brand", "voltage", "frequency", "inStock", "nextDay"],
  },
];

export const products: Product[] = [
  // ── Tubular motors ────────────────────────────────────────────────
  {
    id: "tm-somfy-lt50",
    sku: "SOM-LT50-5012",
    name: "Somfy LT50 CSI 50/12 tubular motor",
    slug: "somfy-lt50-csi-50-12",
    brand: "Somfy",
    category: "tubular-motors",
    shortDescription:
      "50 Nm Ø45 tube motor with mechanical limits for roller garage doors up to 8 m².",
    description:
      "The LT50 CSI is the workhorse of roller garage door automation. Mechanical limit switches, manual override eyelet for power cuts, and Somfy's 5-year warranty. Fits 60 mm octagonal tube with the supplied crown and drive adaptors.",
    images: [],
    specs: [
      { key: "torque", value: 50, unit: "Nm" },
      { key: "tubeDiameter", value: 45 },
      { key: "voltage", value: "230V AC" },
      { key: "speed", value: 12, unit: "rpm" },
      { key: "limitSwitch", value: "mechanical" },
      { key: "ipRating", value: "IP44" },
      { key: "warrantyYears", value: 5 },
    ],
    compatibility: ["60mm octagonal tube", "SBI compact roller doors", "SeceuroGlide-type doors"],
    documents: [
      { type: "datasheet", title: "LT50 CSI datasheet", url: "/docs/placeholder.pdf", language: "en" },
      { type: "manual", title: "Installation manual", url: "/docs/placeholder.pdf", language: "en" },
    ],
    price: {
      rrp: 128.4,
      currency: "GBP",
      vatIncluded: false,
      tradeTiers: { bronze: 109.14, silver: 102.72, gold: 96.3 },
      priceBreaks: [
        { qty: 1, price: 128.4 },
        { qty: 5, price: 121.98 },
        { qty: 10, price: 115.56 },
      ],
    },
    stock: { status: "in_stock", qty: 40, nextDayEligible: true },
    variants: undefined,
    relatedSkus: ["SBI-CP1-433", "SOM-KEYGO-4"],
    replacesSkus: ["SOM-LT50-5012-OLD"],
  },
  {
    id: "tm-sbi-45-30",
    sku: "SBI-TM45-30",
    name: "SBI TM45 30 Nm tubular motor",
    slug: "sbi-tm45-30",
    brand: "SBI",
    category: "tubular-motors",
    shortDescription:
      "Factory-direct 30 Nm Ø45 motor for domestic roller doors and shutters up to 5 m².",
    description:
      "Made in SBI's own European factory and tested on the line with the doors it drives. Mechanical limits, 4-wire connection, compatible with standard 60 mm octagonal tube. The best price-to-torque ratio in our range.",
    images: [],
    specs: [
      { key: "torque", value: 30, unit: "Nm" },
      { key: "tubeDiameter", value: 45 },
      { key: "voltage", value: "230V AC" },
      { key: "speed", value: 15, unit: "rpm" },
      { key: "limitSwitch", value: "mechanical" },
      { key: "ipRating", value: "IP44" },
      { key: "warrantyYears", value: 3 },
    ],
    compatibility: ["60mm octagonal tube", "SBI compact roller doors"],
    documents: [
      { type: "DoP", title: "Declaration of Performance", url: "/docs/placeholder.pdf", language: "en" },
      { type: "manual", title: "Installation manual", url: "/docs/placeholder.pdf", language: "en" },
    ],
    price: {
      rrp: 64.9,
      currency: "GBP",
      vatIncluded: false,
      tradeTiers: { bronze: 55.17, silver: 51.92, gold: 48.68 },
      priceBreaks: [
        { qty: 1, price: 64.9 },
        { qty: 5, price: 61.66 },
        { qty: 10, price: 58.41 },
        { qty: 25, price: 55.17 },
      ],
    },
    stock: { status: "in_stock", qty: 120, nextDayEligible: true },
    relatedSkus: ["SBI-TM45-50", "SBI-CP1-433"],
    replacesSkus: [],
  },
  {
    id: "tm-sbi-45-50",
    sku: "SBI-TM45-50",
    name: "SBI TM45 50 Nm tubular motor",
    slug: "sbi-tm45-50",
    brand: "SBI",
    category: "tubular-motors",
    shortDescription:
      "Factory-direct 50 Nm Ø45 motor — the standard pick for single roller garage doors.",
    description:
      "The volume seller. 50 Nm lifts a standard 7'–8' insulated roller curtain with margin. Mechanical limits, manual override option, and same-day dispatch from UK stock.",
    images: [],
    specs: [
      { key: "torque", value: 50, unit: "Nm" },
      { key: "tubeDiameter", value: 45 },
      { key: "voltage", value: "230V AC" },
      { key: "speed", value: 12, unit: "rpm" },
      { key: "limitSwitch", value: "mechanical" },
      { key: "ipRating", value: "IP44" },
      { key: "warrantyYears", value: 3 },
    ],
    compatibility: ["60mm octagonal tube", "SBI compact roller doors", "SBI insulated roller doors"],
    documents: [
      { type: "DoP", title: "Declaration of Performance", url: "/docs/placeholder.pdf", language: "en" },
      { type: "manual", title: "Installation manual", url: "/docs/placeholder.pdf", language: "en" },
    ],
    price: {
      rrp: 79.9,
      currency: "GBP",
      vatIncluded: false,
      tradeTiers: { bronze: 67.92, silver: 63.92, gold: 59.93 },
      priceBreaks: [
        { qty: 1, price: 79.9 },
        { qty: 5, price: 75.91 },
        { qty: 10, price: 71.91 },
        { qty: 25, price: 67.92 },
      ],
    },
    stock: { status: "in_stock", qty: 85, nextDayEligible: true },
    relatedSkus: ["SBI-TM45-30", "SBI-TM59-100", "SBI-CP1-433"],
    replacesSkus: [],
  },
  {
    id: "tm-sbi-59-100",
    sku: "SBI-TM59-100",
    name: "SBI TM59 100 Nm tubular motor",
    slug: "sbi-tm59-100",
    brand: "SBI",
    category: "tubular-motors",
    shortDescription:
      "Heavy-duty 100 Nm Ø59 motor for double and commercial roller doors.",
    description:
      "For wide or heavy curtains: 100 Nm on a Ø59 frame, electronic limits, and a thermal cut-out rated for commercial duty cycles. Pairs with our safety brake for EN-compliant industrial installs.",
    images: [],
    specs: [
      { key: "torque", value: 100, unit: "Nm" },
      { key: "tubeDiameter", value: 59 },
      { key: "voltage", value: "230V AC" },
      { key: "speed", value: 9, unit: "rpm" },
      { key: "limitSwitch", value: "electronic" },
      { key: "ipRating", value: "IP44" },
      { key: "warrantyYears", value: 3 },
    ],
    compatibility: ["70mm octagonal tube", "102mm tube with adaptor", "SBI industrial roller doors"],
    documents: [
      { type: "DoP", title: "Declaration of Performance", url: "/docs/placeholder.pdf", language: "en" },
      { type: "wiring", title: "Wiring diagram", url: "/docs/placeholder.pdf", language: "en" },
    ],
    price: {
      rrp: 149.0,
      currency: "GBP",
      vatIncluded: false,
      tradeTiers: { bronze: 126.65, silver: 119.2, gold: 111.75 },
    },
    stock: { status: "low", qty: 8, nextDayEligible: true },
    relatedSkus: ["SBI-SBRAKE-1", "SBI-CP3-400"],
    replacesSkus: [],
  },
  // ── Side motors ───────────────────────────────────────────────────
  {
    id: "sm-novoport",
    sku: "NOV-NOVOPORT-4",
    name: "Novoferm NovoPort IV side operator",
    slug: "novoferm-novoport-iv",
    brand: "Generic",
    category: "side-motors",
    shortDescription:
      "Side-mounted sectional door operator — no boom, full headroom, whisper quiet.",
    description:
      "The NovoPort IV mounts directly on the door's torsion shaft, freeing the ceiling entirely. Soft start and stop, LED lighting, and integrated radio. Supplied with one wall button and two handsets. Ideal for garages with roof storage or high-lift tracks.",
    images: [
      {
        url: "/images/products/novoferm-vertical.png",
        alt: "Novoferm NovoPort IV side operator on sectional door",
        width: 800,
        height: 1000,
      },
      {
        url: "/images/products/novoferm-iso20.png",
        alt: "Novoferm iso20 sectional door with NovoPort operator",
        width: 1000,
        height: 750,
      },
    ],
    specs: [
      { key: "voltage", value: "230V AC" },
      { key: "power", value: 200, unit: "W" },
      { key: "maxDoorArea", value: 13.75, unit: "m²" },
      { key: "frequency", value: "433.92 MHz" },
      { key: "warrantyYears", value: 5 },
    ],
    compatibility: ["Novoferm iso20 sectional doors", "Sectional doors with 25.4mm torsion shaft"],
    documents: [
      { type: "CE", title: "CE declaration", url: "/docs/placeholder.pdf", language: "en" },
      { type: "manual", title: "Installation manual", url: "/docs/placeholder.pdf", language: "en" },
    ],
    price: {
      rrp: 429.0,
      currency: "GBP",
      vatIncluded: false,
      tradeTiers: { bronze: 364.65, silver: 343.2, gold: 321.75 },
    },
    stock: { status: "in_stock", qty: 14, nextDayEligible: true },
    relatedSkus: ["BFT-MITTO-B2", "SBI-PHOTO-KIT"],
    replacesSkus: ["NOV-NOVOPORT-3"],
  },
  {
    id: "sm-sbi-axial",
    sku: "SBI-AX140",
    name: "SBI AX140 axial side motor",
    slug: "sbi-ax140",
    brand: "SBI",
    category: "side-motors",
    shortDescription:
      "140 Nm axial operator for compact and mid-size roller doors, factory-matched to SBI curtains.",
    description:
      "Fitted as standard on SBI compact roller doors and available as a spare or upgrade. Built-in adjustable limits, manual override crank, and a duty cycle rated for daily domestic use.",
    images: [],
    specs: [
      { key: "torque", value: 140, unit: "Nm" },
      { key: "voltage", value: "230V AC" },
      { key: "limitSwitch", value: "mechanical" },
      { key: "ipRating", value: "IP44" },
      { key: "warrantyYears", value: 3 },
    ],
    compatibility: ["SBI compact roller doors", "Roller doors with 165mm barrel"],
    documents: [
      { type: "DoP", title: "Declaration of Performance", url: "/docs/placeholder.pdf", language: "en" },
    ],
    price: {
      rrp: 189.0,
      currency: "GBP",
      vatIncluded: false,
      tradeTiers: { bronze: 160.65, silver: 151.2, gold: 141.75 },
    },
    stock: { status: "in_stock", qty: 22, nextDayEligible: true },
    relatedSkus: ["SBI-CP1-433"],
    replacesSkus: [],
  },
  // ── Control panels ────────────────────────────────────────────────
  {
    id: "cp-sbi-1",
    sku: "SBI-CP1-433",
    name: "SBI CP1 single-phase control panel",
    slug: "sbi-cp1-control-panel",
    brand: "SBI",
    category: "control-panels",
    shortDescription:
      "230V control unit with built-in 433.92 MHz receiver for one motor, photocell and safety edge inputs.",
    description:
      "One box that runs the whole door: motor output, integrated rolling-code receiver, dedicated photocell and safety edge terminals, and courtesy light relay. DIN-rail or wall mount.",
    images: [],
    specs: [
      { key: "voltage", value: "230V AC" },
      { key: "frequency", value: "433.92 MHz" },
      { key: "channels", value: 2 },
      { key: "ipRating", value: "IP55" },
      { key: "warrantyYears", value: 2 },
    ],
    compatibility: ["SBI TM45/TM59 motors", "Somfy LT50", "Any 4-wire 230V tube motor"],
    documents: [
      { type: "wiring", title: "Wiring diagram", url: "/docs/placeholder.pdf", language: "en" },
      { type: "manual", title: "Programming guide", url: "/docs/placeholder.pdf", language: "en" },
    ],
    price: {
      rrp: 74.5,
      currency: "GBP",
      vatIncluded: false,
      tradeTiers: { bronze: 63.33, silver: 59.6, gold: 55.88 },
    },
    stock: { status: "in_stock", qty: 46, nextDayEligible: true },
    relatedSkus: ["SBI-PHOTO-KIT", "BFT-MITTO-B2"],
    replacesSkus: [],
  },
  // ── Remotes ───────────────────────────────────────────────────────
  {
    id: "rm-bft-mitto",
    sku: "BFT-MITTO-B2",
    name: "BFT Mitto B RCB02 remote control",
    slug: "bft-mitto-b-rcb02",
    brand: "Generic",
    category: "remotes",
    shortDescription:
      "Genuine BFT 2-button rolling-code transmitter, 433.92 MHz.",
    description:
      "Original BFT Mitto B replacement handset for BFT-driven gates, barriers and doors. Rolling code, clone-resistant, CR2032 battery included. Programs in seconds from an existing working remote or at the receiver.",
    images: [
      {
        url: "/images/products/bft-remote.jpg",
        alt: "BFT Mitto B RCB02 two-button remote",
        width: 400,
        height: 400,
      },
    ],
    specs: [
      { key: "frequency", value: "433.92 MHz" },
      { key: "channels", value: 2 },
      { key: "warrantyYears", value: 2 },
    ],
    compatibility: ["BFT receivers", "BFT Moovi barriers", "BFT Deimos / Ares gate kits"],
    documents: [
      { type: "manual", title: "Programming instructions", url: "/docs/placeholder.pdf", language: "en" },
    ],
    price: {
      rrp: 24.9,
      currency: "GBP",
      vatIncluded: false,
      tradeTiers: { bronze: 21.17, silver: 19.92, gold: 18.68 },
      priceBreaks: [
        { qty: 1, price: 24.9 },
        { qty: 5, price: 23.66 },
        { qty: 10, price: 22.41 },
        { qty: 25, price: 21.17 },
      ],
    },
    stock: { status: "in_stock", qty: 200, nextDayEligible: true },
    relatedSkus: ["SBI-RM4-433", "SBI-CP1-433"],
    replacesSkus: ["BFT-MITTO-2M"],
  },
  {
    id: "rm-sbi-4ch",
    sku: "SBI-RM4-433",
    name: "SBI 4-channel rolling-code remote",
    slug: "sbi-rm4-433",
    brand: "SBI",
    category: "remotes",
    shortDescription:
      "4-channel 433.92 MHz handset for SBI receivers — run four doors from one remote.",
    description:
      "Slim 4-button transmitter paired with SBI control panels and plug-in receivers. Rolling code, keyring loop, battery included.",
    images: [],
    specs: [
      { key: "frequency", value: "433.92 MHz" },
      { key: "channels", value: 4 },
      { key: "warrantyYears", value: 2 },
    ],
    compatibility: ["SBI CP1 control panel", "SBI plug-in receivers"],
    documents: [
      { type: "manual", title: "Pairing guide", url: "/docs/placeholder.pdf", language: "en" },
    ],
    price: {
      rrp: 18.5,
      currency: "GBP",
      vatIncluded: false,
      tradeTiers: { bronze: 15.73, silver: 14.8, gold: 13.88 },
      priceBreaks: [
        { qty: 1, price: 18.5 },
        { qty: 10, price: 16.65 },
        { qty: 25, price: 15.73 },
      ],
    },
    stock: { status: "in_stock", qty: 340, nextDayEligible: true },
    relatedSkus: ["BFT-MITTO-B2", "SBI-CP1-433"],
    replacesSkus: [],
  },
  // ── Safety ────────────────────────────────────────────────────────
  {
    id: "sf-photo-kit",
    sku: "SBI-PHOTO-KIT",
    name: "SBI photocell pair, surface mount",
    slug: "sbi-photocell-kit",
    brand: "SBI",
    category: "safety",
    shortDescription:
      "Infrared photocell transmitter + receiver pair, 12–24V, up to 20 m range.",
    description:
      "EN 12453 requires supplementary protection on automated doors in most settings — this is the standard fit. Relay output wires straight into SBI, Somfy and BFT control panels. IP54 housings, swivel brackets included.",
    images: [],
    specs: [
      { key: "voltage", value: "24V DC" },
      { key: "ipRating", value: "IP54" },
      { key: "cableLength", value: "20m max range" },
      { key: "warrantyYears", value: 2 },
    ],
    compatibility: ["SBI CP1", "Somfy control units", "BFT panels"],
    documents: [
      { type: "wiring", title: "Wiring diagram", url: "/docs/placeholder.pdf", language: "en" },
    ],
    price: {
      rrp: 21.9,
      currency: "GBP",
      vatIncluded: false,
      tradeTiers: { bronze: 18.62, silver: 17.52, gold: 16.43 },
    },
    stock: { status: "in_stock", qty: 150, nextDayEligible: true },
    relatedSkus: ["SBI-CP1-433", "SBI-EDGE-25"],
    replacesSkus: [],
  },
  {
    id: "sf-edge",
    sku: "SBI-EDGE-25",
    name: "SBI resistive safety edge, 2.5 m",
    slug: "sbi-safety-edge-25",
    brand: "SBI",
    category: "safety",
    shortDescription:
      "8.2 kΩ resistive bottom edge for roller and sectional doors, cut-to-size 2.5 m profile.",
    description:
      "Pressure-sensitive rubber profile with 8.2 kΩ terminating resistor, monitored by the control panel for EN 12978 compliance. Trims to width with standard tools; end caps and glue supplied.",
    images: [],
    specs: [
      { key: "cableLength", value: "2.5m profile" },
      { key: "material", value: "EPDM rubber" },
      { key: "warrantyYears", value: 2 },
    ],
    compatibility: ["SBI CP1", "Any 8.2kΩ monitored input"],
    documents: [
      { type: "datasheet", title: "Edge profile datasheet", url: "/docs/placeholder.pdf", language: "en" },
    ],
    price: {
      rrp: 34.0,
      currency: "GBP",
      vatIncluded: false,
      tradeTiers: { bronze: 28.9, silver: 27.2, gold: 25.5 },
    },
    stock: { status: "in_stock", qty: 60, nextDayEligible: true },
    relatedSkus: ["SBI-PHOTO-KIT"],
    replacesSkus: [],
  },
  // ── Springs ───────────────────────────────────────────────────────
  {
    id: "sp-torsion",
    sku: "SBI-TSPRING-152",
    name: "Torsion spring, 152 mm × 6.3 mm wire",
    slug: "torsion-spring-152-63",
    brand: "Generic",
    category: "springs",
    shortDescription:
      "Sectional door torsion spring, wound to order. State door make, width and wire size.",
    description:
      "Pattern torsion springs for the common sectional platforms. Wound left or right, standard 25.4 mm bore cones fitted. If you're unsure of the spec, send us the old spring's wire diameter, inside diameter and length — we'll match it.",
    images: [],
    specs: [
      { key: "material", value: "Oil-tempered spring steel" },
      { key: "warrantyYears", value: 1 },
    ],
    compatibility: ["Hörmann-pattern sectional doors", "Novoferm sectional doors", "SBI sectional doors"],
    documents: [
      { type: "datasheet", title: "Spring measurement guide", url: "/docs/placeholder.pdf", language: "en" },
    ],
    price: {
      rrp: 58.0,
      currency: "GBP",
      vatIncluded: false,
      tradeTiers: { bronze: 49.3, silver: 46.4, gold: 43.5 },
    },
    stock: { status: "backorder", nextDayEligible: false, leadTimeDays: 3 },
    relatedSkus: ["SBI-CABLE-3-6"],
    replacesSkus: [],
  },
  // ── Cables ────────────────────────────────────────────────────────
  {
    id: "cb-wire-rope",
    sku: "SBI-CABLE-3-6",
    name: "Lifting cable pair, 3 mm × 6 m",
    slug: "lifting-cable-3mm-6m",
    brand: "Generic",
    category: "cables",
    shortDescription:
      "Galvanised 7×19 wire rope pair with ferruled loops, for sectional doors up to 2.5 m high.",
    description:
      "Pre-made lifting cable pair with pressed loops, ready to fit. 3 mm galvanised 7×19 construction — flexible enough for drum winding, rated with a generous margin over standard door weights.",
    images: [],
    specs: [
      { key: "cableLength", value: "6m pair" },
      { key: "material", value: "Galvanised steel 7×19" },
      { key: "warrantyYears", value: 1 },
    ],
    compatibility: ["Sectional doors to 2.5m", "Up-and-over doors"],
    documents: [],
    price: {
      rrp: 14.5,
      currency: "GBP",
      vatIncluded: false,
      tradeTiers: { bronze: 12.33, silver: 11.6, gold: 10.88 },
      priceBreaks: [
        { qty: 1, price: 14.5 },
        { qty: 10, price: 13.05 },
      ],
    },
    stock: { status: "in_stock", qty: 90, nextDayEligible: true },
    relatedSkus: ["SBI-TSPRING-152"],
    replacesSkus: [],
  },
  // ── Locks ─────────────────────────────────────────────────────────
  {
    id: "lk-bullet",
    sku: "SBI-LOCK-BULLET",
    name: "Roller door bullet lock kit",
    slug: "roller-door-bullet-lock",
    brand: "Generic",
    category: "locks",
    shortDescription:
      "Keyed-alike bullet lock pair with guide-rail strikers for roller garage doors.",
    description:
      "Positive mechanical locking for manually operated roller doors, or secondary security on automated ones. Two locks keyed alike, strikers, and fixings included.",
    images: [],
    specs: [
      { key: "material", value: "Zinc alloy body, steel bolt" },
      { key: "warrantyYears", value: 2 },
    ],
    compatibility: ["77mm slat roller doors", "55mm compact roller doors"],
    documents: [],
    price: {
      rrp: 26.0,
      currency: "GBP",
      vatIncluded: false,
      tradeTiers: { bronze: 22.1, silver: 20.8, gold: 19.5 },
    },
    stock: { status: "in_stock", qty: 35, nextDayEligible: true },
    relatedSkus: [],
    replacesSkus: [],
  },
  // ── Accessories ───────────────────────────────────────────────────
  {
    id: "ac-tube-link",
    sku: "SBI-TUBELINK-60",
    name: "Tube link connector, 60 mm octagonal",
    slug: "tube-link-60mm",
    brand: "SBI",
    category: "accessories",
    shortDescription:
      "Joins two lengths of 60 mm octagonal tube on wide roller shutter barrels.",
    description:
      "Machined internal connector for joining octagonal tube on curtains wider than stock tube lengths. Zinc-plated steel, supplied with through-bolts.",
    images: [
      {
        url: "/images/products/tube-link.jpg",
        alt: "Tube link connector close-up",
        width: 400,
        height: 300,
      },
    ],
    specs: [
      { key: "tubeDiameter", value: 60 },
      { key: "material", value: "Zinc-plated steel" },
    ],
    compatibility: ["60mm octagonal tube"],
    documents: [],
    price: {
      rrp: 12.9,
      currency: "GBP",
      vatIncluded: false,
      tradeTiers: { bronze: 10.97, silver: 10.32, gold: 9.68 },
    },
    stock: { status: "in_stock", qty: 75, nextDayEligible: true },
    relatedSkus: ["SBI-TM45-50"],
    replacesSkus: [],
  },
  {
    id: "ac-safety-brake",
    sku: "SBI-SBRAKE-1",
    name: "Safety brake, 102 mm tube",
    slug: "safety-brake-102",
    brand: "SBI",
    category: "accessories",
    shortDescription:
      "Anti-fall safety brake for industrial roller shutters — mandatory on most commercial installs.",
    description:
      "Centrifugal safety brake that locks the barrel if the curtain free-falls. Microswitch output cuts the control circuit. Sized for 102 mm tube; other sizes to order.",
    images: [],
    specs: [
      { key: "tubeDiameter", value: 102 },
      { key: "material", value: "Cast housing, steel internals" },
      { key: "warrantyYears", value: 2 },
    ],
    compatibility: ["102mm barrel industrial shutters", "SBI TM59 installs"],
    documents: [
      { type: "DoP", title: "Declaration of Performance", url: "/docs/placeholder.pdf", language: "en" },
    ],
    price: {
      rrp: 89.0,
      currency: "GBP",
      vatIncluded: false,
      tradeTiers: { bronze: 75.65, silver: 71.2, gold: 66.75 },
    },
    stock: { status: "low", qty: 6, nextDayEligible: true },
    relatedSkus: ["SBI-TM59-100"],
    replacesSkus: [],
  },
  // ── Barriers (accessories/automation) ─────────────────────────────
  {
    id: "ba-moovi",
    sku: "BFT-MOOVI-30",
    name: "BFT Moovi 30 barrier, 3 m arm",
    slug: "bft-moovi-30-barrier",
    brand: "Generic",
    category: "side-motors",
    shortDescription:
      "230V electromechanical rising barrier with 3 m arm, for car parks and yard entrances.",
    description:
      "Complete BFT Moovi 30 kit: cabinet, balanced 3 m arm, and integrated control unit with receiver. Duty-rated for commercial traffic. Photocells and flashing lamp available as add-ons.",
    images: [
      {
        url: "/images/products/moovi-barrier.png",
        alt: "BFT Moovi 30 rising barrier with 3m arm",
        width: 800,
        height: 600,
      },
      {
        url: "/images/products/barriers.jpg",
        alt: "Rising barrier installed at site entrance",
        width: 800,
        height: 500,
      },
    ],
    specs: [
      { key: "voltage", value: "230V AC" },
      { key: "power", value: 300, unit: "W" },
      { key: "frequency", value: "433.92 MHz" },
      { key: "warrantyYears", value: 2 },
    ],
    compatibility: ["BFT Mitto remotes", "BFT photocells"],
    documents: [
      { type: "CE", title: "CE declaration", url: "/docs/placeholder.pdf", language: "en" },
      { type: "manual", title: "Installation manual", url: "/docs/placeholder.pdf", language: "en" },
    ],
    price: {
      rrp: 589.0,
      currency: "GBP",
      vatIncluded: false,
      tradeTiers: { bronze: 500.65, silver: 471.2, gold: 441.75 },
    },
    stock: { status: "backorder", nextDayEligible: false, leadTimeDays: 5 },
    relatedSkus: ["BFT-MITTO-B2", "SBI-PHOTO-KIT"],
    replacesSkus: [],
  },
  ...bftProducts,
  ...niceProducts,
  ...vendorProducts,
];
