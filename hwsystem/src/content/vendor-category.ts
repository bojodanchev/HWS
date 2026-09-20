/** Prefer the manufacturer's installation category; then the exact product type. */
export function vendorCategory(record: {
  name: string; category: string; sourceCategoryUrl?: string;
}, productTypes: string[] = []): string {
  const source = record.sourceCategoryUrl ?? "";
  if (source.includes("automations-for-swinging-gates")) return "swing-gates";
  if (source.includes("automations-for-sliding-gates")) return "sliding-gates";
  if (source.includes("automations-for-garage-industrial-doors")) return "garage-door-automation";
  if (source.includes("road-barriers")) return "barriers";
  if (/control-units|\/receivers/.test(source)) return "control-panels";
  if (source.includes("/transmitters")) return "remotes";
  const name = record.name.toUpperCase();
  if (/\b(TAHOMA|CONNECTIVITY KIT)\b/.test(name)) return "control-panels";
  if (/\b(PLUG END|BOX OUTLET|WALL MOUNT|MOUNTING BOX)\b/.test(name)) return "accessories";
  // Accessories can be tagged under Motors on the manufacturer's site.
  if (/\b(CHARGER|BATTERY PACK|BATTERY STICK|BATTERIES|ADAPTOR|ADAPTER|BRACKET|CROWN|WHEEL|PLATE|BEARING|SCREWS|EXTENSION CABLE|CONNECTION CABLE|SETTING TOOL|RAIL|FRAME ONLY)\b/.test(name) || /^(?:MOTOR )?CABLE\b/.test(name)) return "accessories";
  if (/\b(OXIMO|ALTUS|SONESSE2?|ILMO|OREA|MAESTRIA|LT50|LT60|RS100|ROLL UP2?|CORD LIFT)\b/.test(name)) return "tubular-motors";
  if (/\b(?:TILT\s*(?:&|AND)\s*LIFT|GLYDEA|IRISMO|MOVELITE|TLV25|TO 50 CENTRAL)\b/.test(name)) return "blind-and-curtain-automation";
  if (/\b(VIDEO DOOR PHONE|VIDEOPHONE|INTERCOM|V100\+?|V350|V500)\b/.test(name)) return "access-control";
  if (/\b(TAHOMA|CONNECTIVITY KIT|RECEIVER|RS485|INTERFACE|CONTROL BOX|CONTROL UNIT)\b/.test(name)) return "control-panels";
  if (/\b(SMOOVE|SITUO|KEYGO|KEYTIS|TELIS|INIS|AMY|YSIA)\b/.test(name)) return "remotes";
  if (/\b(PHOTOCELL|SAFETY EDGE|SENSOR|EOLIS|SUNIS|SOLIRIS)\b/.test(name)) return "safety";
  if (/\b(IXENGO|AXOVIA|EXAVIA)\b/.test(name)) return "swing-gates";
  if (/\b(ELIXO|SLIDYMO)\b/.test(name)) return "sliding-gates";
  if (/\b(DEXXO|GDK|KEASY|AXORN|ROLLIXO)\b/.test(name)) return "garage-door-automation";
  if (/\b(CENTREO|CENTRIS)\b/.test(name)) return "side-motors";
  if (productTypes.includes("Accessories")) return "accessories";
  if (productTypes.includes("Sensors")) return "safety";
  if (productTypes.includes("Controls")) return "control-panels";
  return record.category;
}
