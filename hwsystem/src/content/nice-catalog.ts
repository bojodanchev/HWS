import type { Product } from "@/types/catalog";
import imageManifest from "@/content/nice-image-manifest.json";

const NICE_CATALOGUE_URL =
  "https://www.niceforyou.com/sites/default/files/upload/catalogues-brochures/nice_gate_door_catalogue_en.pdf";

const catalogueDocument = {
  type: "datasheet" as const,
  title: "Nice Gate & Door 2026 catalogue",
  url: NICE_CATALOGUE_URL,
  language: "en" as const,
};

function niceProduct({
  sku,
  name,
  shortDescription,
  description,
  specs = [],
  category = "garage-door-automation",
}: {
  sku: string;
  name: string;
  shortDescription: string;
  description: string;
  specs?: Product["specs"];
  category?: string;
}): Product {
  const image = (imageManifest as Record<string, {localPath: string; width: number; height: number}>)[sku];
  return {
    id: `nice-${sku.toLowerCase()}`,
    sku,
    name,
    slug: sku.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    brand: "Nice",
    category,
    shortDescription,
    description,
    images: image ? [{url:image.localPath,alt:name,width:image.width,height:image.height,caption:"Manufacturer range image. Exact model and kit contents are confirmed with your quote."}] : [],
    specs,
    compatibility: [],
    documents: [catalogueDocument],
    price: { quoteOnly: true },
    stock: { status: "unknown" },
    relatedSkus: [],
    replacesSkus: [],
  };
}

/**
 * UK-relevant Nice garage-door families selected from the supplied 2026
 * catalogue. Commercial values remain quote-only until current UK pricing is
 * supplied by the owner.
 */
export const niceProducts: Product[] = [
  niceProduct({
    sku: "SPIDER1200BLW",
    name: "Nice Spider 1200BLW garage door operator",
    shortDescription: "Connected 1200 N operator for sectional and up-and-over garage doors.",
    description:
      "Brushless garage-door operator for sectional doors up to 16.9 m² and up-and-over doors up to 19.5 m². The catalogue specifies built-in Wi-Fi, a bidirectional receiver, LED courtesy light and support for intensive use up to 150 cycles per day. Price on request pending current UK commercial confirmation.",
    specs: [
      { key: "voltage", value: "230V AC" },
      { key: "maxDoorArea", value: 16.9, unit: "m² sectional" },
    ],
  }),
  niceProduct({
    sku: "SPIDER800W",
    name: "Nice Spider 800W garage door operator",
    shortDescription: "Connected 800 N operator for sectional and up-and-over garage doors.",
    description:
      "Compact connected operator from the Spider family for sectional and up-and-over garage doors. The supplied catalogue describes an integrated Wi-Fi connection, bidirectional control and a low-profile carriage system. Confirm the opening size and current UK configuration before ordering.",
    specs: [{ key: "voltage", value: "230V AC" }],
  }),
  niceProduct({
    sku: "SPIDO600",
    name: "Nice Spido 600 garage door operator",
    shortDescription: "600 N garage-door operator for domestic installations.",
    description:
      "Garage-door automation family listed in the supplied Nice Gate & Door catalogue. Selection depends on door construction, opening size, available headroom and required duty cycle; request a checked UK quotation before ordering.",
    specs: [{ key: "voltage", value: "230V AC" }],
  }),
  niceProduct({
    sku: "SPIDO1000",
    name: "Nice Spido 1000 garage door operator",
    shortDescription: "1000 N garage-door operator for larger domestic openings.",
    description:
      "Higher-force Spido family operator for garage-door automation. The correct configuration depends on the door type and measured opening, so the HWS team will confirm compatibility and the current UK supply price before quote acceptance.",
    specs: [{ key: "voltage", value: "230V AC" }],
  }),
  niceProduct({
    sku: "SPY650HSBDKCE",
    name: "Nice Spykit 650 HS BD garage door kit",
    shortDescription: "650 N Hi-Speed kit for sectional and up-and-over doors.",
    description:
      "24 VDC rack-on-track kit for sectional doors up to 10.5 m² and projecting or non-projecting up-and-over doors up to 11.5 m². The catalogue kit includes the SPY650 gearmotor, SPYBOXBHS control unit with LED courtesy light, OXIBD bidirectional receiver and one MYGO4 transmitter; the track is selected separately.",
    specs: [
      { key: "voltage", value: "24V DC" },
      { key: "maxDoorArea", value: 10.5, unit: "m² sectional" },
      { key: "ipRating", value: "IP41" },
      { key: "frequency", value: "433.92 MHz" },
    ],
  }),
  niceProduct({
    sku: "SPYKIT650BD",
    name: "Nice Spykit 650 BD garage door kit",
    shortDescription: "650 N kit for domestic sectional and up-and-over doors.",
    description:
      "Spykit 650 family garage-door automation for domestic sectional and up-and-over installations. Rail length, receiver and release accessories must be selected against the measured opening; request a checked quote for the complete kit.",
    specs: [{ key: "voltage", value: "24V DC" }],
  }),
  niceProduct({
    sku: "SPYKIT800BD",
    name: "Nice Spykit 800 BD garage door kit",
    shortDescription: "800 N kit for domestic sectional and up-and-over doors.",
    description:
      "Higher-force Spykit configuration for domestic garage doors. Final selection depends on door area, track geometry and the required rail accessories; the HWS team will confirm the complete bill of materials.",
    specs: [{ key: "voltage", value: "24V DC" }],
  }),
  niceProduct({
    sku: "SPYKIT550",
    name: "Nice Spykit 550 garage door kit",
    shortDescription: "550 N kit for domestic garage-door automation.",
    description:
      "Compact Spykit family operator for domestic garage doors. Use the measured door type and area to confirm the correct rail, release and safety accessories before ordering.",
    specs: [{ key: "voltage", value: "24V DC" }],
  }),
  niceProduct({
    sku: "TEN",
    name: "Nice Ten garage door operator",
    shortDescription: "Garage-door automation family for residential doors.",
    description:
      "Nice Ten family operator listed in the supplied Gate & Door catalogue for residential garage-door applications. Price, configuration and compatibility are confirmed by quotation because the current UK commercial price is not present in the supplied catalogue.",
    specs: [{ key: "voltage", value: "24V DC" }],
  }),
  niceProduct({
    sku: "TENKIT",
    name: "Nice Tenkit garage door kit",
    shortDescription: "Complete kit format for Nice Ten garage-door automation.",
    description:
      "Kit-format Nice Ten garage-door automation for residential installations. The final kit contents and rail length depend on the door and opening measurements supplied with the quote.",
    specs: [{ key: "voltage", value: "24V DC" }],
  }),
  niceProduct({
    sku: "SOON",
    name: "Nice Soon garage door operator",
    shortDescription: "Side-mounted garage-door operator for suitable installations.",
    description:
      "Nice Soon family operator for garage-door automation where a side-mounted solution is appropriate. Confirm shaft, door balance and available mounting space with the HWS team before quotation.",
    specs: [{ key: "voltage", value: "24V DC" }],
  }),
  niceProduct({
    sku: "SUMO",
    name: "Nice Sumo garage door operator",
    shortDescription: "Operator family for sectional and two-leaf sliding doors.",
    description:
      "Nice Sumo family automation for sectional and two-leaf sliding doors. Confirm the exact model, mounting arrangement and required accessories with the team; current UK pricing remains quote-only.",
    specs: [{ key: "voltage", value: "24V DC" }],
  }),
  niceProduct({
    sku: "HYPPO",
    name: "Nice Hyppo folding-door operator",
    category: "garage-door-automation",
    shortDescription: "Telescopic-arm automation family for two-leaf folding doors.",
    description:
      "The Hyppo range in the garage and industrial doors section of the Nice 2026 catalogue is for two-leaf folding doors. The exact HY7100 or HY7124 model determines the power supply and control unit; request a checked configuration and UK quotation.",
  }),
  niceProduct({
    sku: "RONDOROLSIDE",
    name: "Nice Rondo / RolSide garage door automation",
    shortDescription: "Rondo for balanced rolling doors; RolSide for unbalanced rolling shutters.",
    description:
      "Rondo and RolSide are separate rolling-door ranges in the Nice 2026 catalogue. Rondo is for balanced rolling doors; RolSide is for unbalanced rolling shutters. HWS will confirm the appropriate range, exact model, accessories and current UK price before quote acceptance.",
    specs: [{ key: "voltage", value: "230V AC" }],
  }),
];
