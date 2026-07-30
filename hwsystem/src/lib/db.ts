/**
 * Admin database — libSQL/SQLite behind a single seam.
 *
 * - Local dev: a SQLite file at data/hws-admin.db (gitignored).
 * - Production: set TURSO_DATABASE_URL + TURSO_AUTH_TOKEN (the convention
 *   used across our Vercel projects; DATABASE_URL/DATABASE_AUTH_TOKEN are
 *   accepted as a fallback). Without them, Vercel falls back to file:/tmp —
 *   functional but ephemeral per serverless instance, so leads still also
 *   go out through deliverLead (Slack/email/logs).
 *
 * Schema is created on first use. Tables start empty and fill with real
 * records only: leads and tickets come from live site form submissions;
 * chat conversations are stored locally; orders can be supplied by any
 * future commerce adapter.
 */

import "server-only";

import { mkdirSync } from "node:fs";
import path from "node:path";
import { createClient, type Client } from "@libsql/client";

function resolveUrl(): { url: string; authToken?: string } {
  if (process.env.TURSO_DATABASE_URL) {
    return {
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    };
  }
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
    source_ref TEXT
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
    next_day INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS chat_conversations (
    id TEXT PRIMARY KEY,
    locale TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    visitor_name TEXT,
    visitor_email TEXT,
    visitor_phone TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS chat_messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    source TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id)
  )`,
  `CREATE TABLE IF NOT EXISTS rate_limits (
    key TEXT PRIMARY KEY,
    count INTEGER NOT NULL,
    reset_at INTEGER NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS tickets_source_ref_unique
    ON tickets(source_ref) WHERE source_ref IS NOT NULL`,
  `CREATE INDEX IF NOT EXISTS chat_messages_conversation_time
    ON chat_messages(conversation_id, created_at)`,
  `CREATE INDEX IF NOT EXISTS chat_conversations_updated
    ON chat_conversations(updated_at DESC)`,
];

type DbGlobal = typeof globalThis & { __hwsDb?: Promise<Client> };

async function ensureColumn(
  client: Client,
  table: string,
  column: string,
  definition: string,
): Promise<void> {
  const { rows } = await client.execute(`PRAGMA table_info(${table})`);
  if (!rows.some((row) => String(row.name) === column)) {
    await client.execute(`ALTER TABLE ${table} ADD COLUMN ${definition}`);
  }
}

async function init(): Promise<Client> {
  const { url, authToken } = resolveUrl();
  const client = createClient({ url, authToken });
  for (const statement of SCHEMA.slice(0, 6)) {
    await client.execute(statement);
  }
  await ensureColumn(client, "tickets", "source_ref", "source_ref TEXT");
  for (const statement of SCHEMA.slice(6)) {
    await client.execute(statement);
  }
  return client;
}

/** Initialised database client (singleton across dev reloads). */
export function getDb(): Promise<Client> {
  const g = globalThis as DbGlobal;
  if (!g.__hwsDb) {
    g.__hwsDb = init();
  }
  return g.__hwsDb;
}
