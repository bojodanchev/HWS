/**
 * Internal admin panel types — operational data (staff, support tickets,
 * orders). Catalog/product types stay in src/types/catalog.ts.
 */

export type StaffRole = "admin" | "support" | "orders";

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  email: string;
  lastActive: string; // ISO datetime
  actionsThisWeek: number;
  focus: string;
}

export type TicketChannel = "phone" | "email" | "quote_form" | "trade_form";
export type TicketStatus = "open" | "pending" | "resolved";
export type TicketPriority = "low" | "normal" | "high";

export interface SupportTicket {
  id: string;
  subject: string;
  customer: string;
  channel: TicketChannel;
  status: TicketStatus;
  priority: TicketPriority;
  openedAt: string; // ISO datetime
  firstResponseMins?: number;
  assignedTo: string; // StaffMember id
}

export type OrderStatus =
  | "awaiting_payment"
  | "processing"
  | "picking"
  | "dispatched"
  | "delivered"
  | "on_hold";

export interface AdminOrder {
  id: string;
  customer: string;
  account: "trade" | "retail";
  skus: string[];
  units: number;
  value: number; // GBP
  status: OrderStatus;
  placedAt: string; // ISO datetime
  nextDay: boolean;
  handledBy: string; // StaffMember id
}

export interface LeadDay {
  day: string; // e.g. "Mon 22"
  quotes: number;
  tradeApps: number;
}

/** Where a stored record came from: one-time demo seed or the live site. */
export type RecordSource = "seed" | "live";

export type LeadKind = "quote" | "trade_application";
export type LeadStatus = "new" | "contacted" | "closed";

export interface LeadRecord {
  id: string;
  kind: LeadKind;
  name: string;
  email: string;
  phone: string;
  /** Message excerpt (quote) or company + volume summary (trade). */
  detail: string;
  status: LeadStatus;
  source: RecordSource;
  createdAt: string; // ISO datetime
}

export interface StoredTicket extends SupportTicket {
  source: RecordSource;
}

export interface StoredOrder extends AdminOrder {
  source: RecordSource;
}
