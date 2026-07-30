import "server-only";

import { randomUUID } from "node:crypto";
import type { Row } from "@libsql/client";
import { getDb } from "@/lib/db";
import type {
  ChatAnswerSource,
  ChatConversation,
  ChatLocale,
  ChatMessage,
} from "@/types/chat";

function newId(prefix: "CHAT" | "MSG" | "T"): string {
  return `${prefix}-${randomUUID().toUpperCase()}`;
}

function rowToConversation(row: Row): ChatConversation {
  return {
    id: String(row.id),
    locale: row.locale === "bg" ? "bg" : "en",
    status:
      row.status === "needs_follow_up" ||
      row.status === "contacted" ||
      row.status === "closed"
        ? row.status
        : "active",
    visitorName: row.visitor_name ? String(row.visitor_name) : undefined,
    visitorEmail: row.visitor_email ? String(row.visitor_email) : undefined,
    visitorPhone: row.visitor_phone ? String(row.visitor_phone) : undefined,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    lastMessage: row.last_message ? String(row.last_message) : undefined,
    messageCount: Number(row.message_count ?? 0),
  };
}

function rowToMessage(row: Row): ChatMessage {
  const source =
    row.source === "openai" || row.source === "catalog"
      ? (row.source as ChatAnswerSource)
      : undefined;
  return {
    id: String(row.id),
    conversationId: String(row.conversation_id),
    role: row.role === "assistant" ? "assistant" : "user",
    content: String(row.content),
    source,
    createdAt: String(row.created_at),
  };
}

export async function getOrCreateChatConversation(
  requestedId: string | undefined,
  locale: ChatLocale,
): Promise<ChatConversation> {
  const db = await getDb();
  if (requestedId) {
    const { rows } = await db.execute({
      sql: `SELECT c.*,
              (SELECT content FROM chat_messages
                WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_message,
              (SELECT COUNT(*) FROM chat_messages WHERE conversation_id = c.id) AS message_count
            FROM chat_conversations c WHERE c.id = ? LIMIT 1`,
      args: [requestedId],
    });
    if (rows[0]) {
      if (rows[0].locale !== locale) {
        await db.execute({
          sql: "UPDATE chat_conversations SET locale = ? WHERE id = ?",
          args: [locale, requestedId],
        });
      }
      return { ...rowToConversation(rows[0]), locale };
    }
  }

  const id = newId("CHAT");
  const now = new Date().toISOString();
  await db.execute({
    sql: `INSERT INTO chat_conversations
            (id, locale, status, created_at, updated_at)
          VALUES (?, ?, 'active', ?, ?)`,
    args: [id, locale, now, now],
  });
  return {
    id,
    locale,
    status: "active",
    createdAt: now,
    updatedAt: now,
    messageCount: 0,
  };
}

export async function getChatMessages(
  conversationId: string,
  limit = 10,
): Promise<ChatMessage[]> {
  const db = await getDb();
  const { rows } = await db.execute({
    sql: `SELECT * FROM (
            SELECT * FROM chat_messages
            WHERE conversation_id = ?
            ORDER BY created_at DESC
            LIMIT ?
          ) ORDER BY created_at ASC`,
    args: [conversationId, limit],
  });
  return rows.map(rowToMessage);
}

async function ensureChatTicket(
  conversationId: string,
  question: string,
  customer: string,
): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.execute({
    sql: `INSERT INTO tickets
            (id, subject, customer, channel, status, priority, opened_at,
             first_response_mins, source_ref)
          VALUES (?, ?, ?, 'ai_chat', 'open', 'normal', ?, NULL, ?)
          ON CONFLICT(source_ref) WHERE source_ref IS NOT NULL DO UPDATE SET
            subject = excluded.subject,
            customer = excluded.customer`,
    args: [
      newId("T"),
      `AI follow-up — ${question.slice(0, 160)}`,
      customer,
      now,
      conversationId,
    ],
  });
}

export async function recordChatTurn(input: {
  conversationId: string;
  userMessage: string;
  assistantMessage: string;
  source: ChatAnswerSource;
  needsFollowUp: boolean;
}): Promise<void> {
  const db = await getDb();
  const now = new Date();
  const assistantTime = new Date(now.getTime() + 1).toISOString();
  await db.batch(
    [
      {
        sql: `INSERT INTO chat_messages
                (id, conversation_id, role, content, source, created_at)
              VALUES (?, ?, 'user', ?, NULL, ?)`,
        args: [newId("MSG"), input.conversationId, input.userMessage, now.toISOString()],
      },
      {
        sql: `INSERT INTO chat_messages
                (id, conversation_id, role, content, source, created_at)
              VALUES (?, ?, 'assistant', ?, ?, ?)`,
        args: [
          newId("MSG"),
          input.conversationId,
          input.assistantMessage,
          input.source,
          assistantTime,
        ],
      },
      {
        sql: `UPDATE chat_conversations
              SET status = CASE
                    WHEN ? = 1 THEN 'needs_follow_up'
                    ELSE status
                  END,
                  updated_at = ?
              WHERE id = ?`,
        args: [
          input.needsFollowUp ? 1 : 0,
          assistantTime,
          input.conversationId,
        ],
      },
    ],
    "write",
  );

  if (input.needsFollowUp) {
    await ensureChatTicket(
      input.conversationId,
      input.userMessage,
      "Website visitor",
    );
  }
}

export async function saveChatContact(input: {
  conversationId: string;
  name: string;
  email: string;
  phone: string;
}): Promise<boolean> {
  const db = await getDb();
  const now = new Date().toISOString();
  const result = await db.execute({
    sql: `UPDATE chat_conversations
          SET visitor_name = ?, visitor_email = ?, visitor_phone = ?,
              status = 'needs_follow_up', updated_at = ?
          WHERE id = ?`,
    args: [
      input.name,
      input.email,
      input.phone,
      now,
      input.conversationId,
    ],
  });
  if (result.rowsAffected === 0) return false;

  const messages = await getChatMessages(input.conversationId, 10);
  const question =
    [...messages].reverse().find((message) => message.role === "user")?.content ??
    "Customer requested a checked answer";
  await ensureChatTicket(
    input.conversationId,
    question,
    `${input.name} · ${input.email} · ${input.phone}`,
  );
  return true;
}

export async function getRecentChatConversations(
  limit = 20,
): Promise<ChatConversation[]> {
  const db = await getDb();
  const { rows } = await db.execute({
    sql: `SELECT c.*,
            (SELECT content FROM chat_messages
              WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_message,
            (SELECT COUNT(*) FROM chat_messages WHERE conversation_id = c.id) AS message_count
          FROM chat_conversations c
          ORDER BY c.updated_at DESC
          LIMIT ?`,
    args: [limit],
  });
  return rows.map(rowToConversation);
}

export async function getChatConversation(
  id: string,
): Promise<ChatConversation | undefined> {
  const db = await getDb();
  const { rows } = await db.execute({
    sql: `SELECT c.*,
            (SELECT content FROM chat_messages
              WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_message,
            (SELECT COUNT(*) FROM chat_messages WHERE conversation_id = c.id) AS message_count
          FROM chat_conversations c WHERE c.id = ? LIMIT 1`,
    args: [id],
  });
  return rows[0] ? rowToConversation(rows[0]) : undefined;
}
