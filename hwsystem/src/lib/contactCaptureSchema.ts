import { z } from "zod";

export const contactCaptureSchema = z.object({
  name: z.string().trim().max(200).optional().transform(value => value || "Website enquiry"),
  phone: z.string().trim().max(50).default(""),
  email: z.union([z.literal(""), z.string().trim().email().max(254)]).default(""),
  purpose: z.enum(["trade-pricing", "door-enquiry", "product-selection"]).default("product-selection"),
  message: z.string().trim().max(1000).default(""),
  company_website: z.string().max(80).optional(),
}).refine(value => Boolean(value.company_website) || value.phone.length >= 7 || value.email.length > 0, {
  message: "Enter a valid email address or callback phone number",
});
