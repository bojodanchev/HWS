import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Bot, Mail, Phone, UserRound } from "lucide-react";
import { notFound } from "next/navigation";
import { formatShortDateTime } from "@/lib/adminOps";
import { getChatConversation, getChatMessages } from "@/lib/chatStore";

export const metadata: Metadata = { title: "AI conversation" };

export default async function AdminChatConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [conversation, messages] = await Promise.all([
    getChatConversation(id),
    getChatMessages(id, 100),
  ]);
  if (!conversation) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/support"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink underline-offset-2 hover:underline"
      >
        <ArrowLeft aria-hidden className="size-4" strokeWidth={1.5} />
        Back to customer support
      </Link>

      <section className="border-b border-line pb-6">
        <p className="font-mono text-sm text-steel">{conversation.id}</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-h2 text-ink">AI conversation</h2>
            <p className="mt-1 text-sm text-steel">
              {conversation.locale.toUpperCase()} ·{" "}
              {conversation.status.replaceAll("_", " ")} ·{" "}
              {conversation.messageCount} messages
            </p>
          </div>
          <p className="text-sm text-steel">
            Updated {formatShortDateTime(conversation.updatedAt)}
          </p>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section>
          <h3 className="text-h3 text-ink">Transcript</h3>
          <ol className="mt-4 space-y-3">
            {messages.map((message) => (
              <li
                key={message.id}
                className={`max-w-[760px] rounded-md border px-4 py-3 ${
                  message.role === "user"
                    ? "ml-auto border-ink bg-ink text-white"
                    : "border-line bg-white text-ink"
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-xs">
                  <span className="flex items-center gap-1.5 font-medium">
                    {message.role === "assistant" ? (
                      <Bot aria-hidden className="size-3.5" strokeWidth={1.5} />
                    ) : (
                      <UserRound
                        aria-hidden
                        className="size-3.5"
                        strokeWidth={1.5}
                      />
                    )}
                    {message.role === "assistant" ? "Assistant" : "Visitor"}
                    {message.source ? ` · ${message.source}` : ""}
                  </span>
                  <span
                    className={
                      message.role === "user" ? "text-white/70" : "text-mist"
                    }
                  >
                    {formatShortDateTime(message.createdAt)}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">
                  {message.content}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <aside className="border-l border-line pl-6">
          <h3 className="text-h3 text-ink">Contact</h3>
          {conversation.visitorEmail ? (
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="flex items-center gap-2 text-steel">
                  <UserRound aria-hidden className="size-4" strokeWidth={1.5} />
                  Name
                </dt>
                <dd className="mt-1 text-ink">
                  {conversation.visitorName ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-steel">
                  <Mail aria-hidden className="size-4" strokeWidth={1.5} />
                  Email
                </dt>
                <dd className="mt-1 break-all text-ink">
                  {conversation.visitorEmail}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-steel">
                  <Phone aria-hidden className="size-4" strokeWidth={1.5} />
                  Phone
                </dt>
                <dd className="mt-1 text-ink">
                  {conversation.visitorPhone ?? "—"}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="mt-4 text-sm leading-relaxed text-steel">
              The visitor has not left contact details. The transcript remains
              available for support review.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
