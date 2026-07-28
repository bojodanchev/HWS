/**
 * Admin database — libSQL/SQLite behind a single seam.
 *
 * - Local dev: a SQLite file at data/hws-admin.db (gitignored).
 * - Production: set DATABASE_URL (+ DATABASE_AUTH_TOKEN for Turso/libSQL
 *   remote). Without it, Vercel falls back to file:/tmp — functional but
 *   ephemeral per serverless instance, so leads still also go out through
 *   deliverLead (Slack/email/logs).
 *
 * Schema is created on first use; empty tables are seeded once from
 * src/content/adminOps.ts so the dashboards are readable from day one.
 * Seeded rows carry source='seed', live site submissions source='live'.
 */

import "server-only";

import { mkdirSync } from "node:fs";
import path from "node:path";
import { createClient, type Client } from "@libsql/client";
import { orders, seedLeads, supportTickets } from "@/content/adminOps";

function resolveUrl(): { url: string; authToken?: string } {
  if (process.env.DATABASE_URL) {
    return {
      url: process.env.DATABASE_URL,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    };
  }
  if (process.env.VERCEL) {
    return { url: "file:/tmp/hws-admin.db" };
  }
  const dir = path.join(process.cwd(), "data");
  mkdirSync(dir, { recursive: true });
  return { url: `file:${path.join(dir, "hws-admin.db")}` };
}

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    kind TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    detail TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    source TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS tickets (
    id TEXT PRIMARY KEY,
    subject TEXT NOT NULL,
    customer TEXT NOT NULL,
    channel TEXT NOT NULL,
    status TEXT NOT NULL,
    priority TEXT NOT NULL,
    opened_at TEXT NOT NULL,
    first_response_mins INTEGER,
    assigned_to TEXT NOT NULL,
    source TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer TEXT NOT NULL,
    account TEXT NOT NULL,
    skus TEXT NOT NULL,
    units INTEGER NOT NULL,
    value REAL NOT NULL,
    status TEXT NOT NULL,
    placed_at TEXT NOT NULL,
    next_day INTEGER NOT NULL,
    handled_by TEXT NOT NULL,
    source TEXT NOT NULL
  )`,
];

async function seedIfEmpty(client: Client): Promise<void> {
  const { rows } = await client.execute("SELECT COUNT(*) AS n FROM tickets");
  if (Number(rows[0].n) > 0) return;

  const statements = [
    ...seedLeads.map((l) => ({
      sql: `INSERT OR IGNORE INTO leads (id, kind, name, email, phone, detail, status, source, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'seed', ?)`,
      args: [l.id, l.kind, l.name, l.email, l.phone, l.detail, l.status, l.createdAt],
    })),
    ...supportTickets.map((t) => ({
      sql: `INSERT OR IGNORE INTO tickets (id, subject, customer, channel, status, priority, opened_at, first_response_mins, assigned_to, source)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'seed')`,
      args: [
        t.id,
        t.subject,
        t.customer,
        t.channel,
        t.status,
        t.priority,
        t.openedAt,
        t.firstResponseMins ?? null,
        t.assignedTo,
      ],
    })),
    ...orders.map((o) => ({
      sql: `INSERT OR IGNORE INTO orders (id, customer, account, skus, units, value, status, placed_at, next_day, handled_by, source)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'seed')`,
      args: [
        o.id,
        o.customer,
        o.account,
        JSON.stringify(o.skus),
        o.units,
        o.value,
        o.status,
        o.placedAt,
        o.nextDay ? 1 : 0,
        o.handledBy,
      ],
    })),
  ];
  await client.batch(statements, "write");
}

type DbGlobal = typeof globalThis & { __hwsDb?: Promise<Client> };

async function init(): Promise<Client> {
  const { url, authToken } = resolveUrl();
  const client = createClient({ url, authToken });
  for (const statement of SCHEMA) {
    await client.execute(statement);
  }
  await seedIfEmpty(client);
  return client;
}

/** Initialised, seeded database client (singleton across dev reloads). */
export function getDb(): Promise<Client> {
  const g = globalThis as DbGlobal;
  if (!g.__hwsDb) {
    g.__hwsDb = init();
  }
  return g.__hwsDb;
}
