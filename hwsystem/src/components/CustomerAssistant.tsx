"use client";

import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { chatRequestSchema, type ChatMessage } from "@/lib/chatSchema";

const welcome: ChatMessage = {
  role: "assistant",
  content:
    "Hello! I can help with products, compatibility, stock and public prices. Мога да отговоря и на български.",
};

export function CustomerAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcome]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const history = messages.slice(1);
    const payload = { message: input, history, company_website: "" };
    const parsed = chatRequestSchema.safeParse(payload);
    if (!parsed.success || sending) return;

    const customerMessage: ChatMessage = { role: "user", content: parsed.data.message };
    setMessages((current) => [...current, customerMessage]);
    setInput("");
    setError(null);
    setSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await response.json()) as { answer?: string };
      if (!response.ok || !data.answer) throw new Error("No assistant response");
      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.answer ?? "" },
      ]);
    } catch {
      setError("The assistant is unavailable. Please try again or send a quote request.");
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  return (
    <aside className="fixed bottom-6 right-6 z-50" aria-label="Customer assistant">
      {open && (
        <section
          role="dialog"
          aria-modal="false"
          aria-labelledby="assistant-title"
          className="mb-3 flex h-[520px] max-h-[70vh] w-[calc(100vw-48px)] max-w-sm flex-col overflow-hidden rounded-lg border border-line bg-white shadow-overlay"
        >
          <header className="flex items-center justify-between border-b border-line px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-md bg-ink text-white">
                <Bot aria-hidden className="size-5" strokeWidth={1.5} />
              </span>
              <div>
                <h2 id="assistant-title" className="font-heading font-semibold text-ink">
                  Product assistant
                </h2>
                <p className="text-xs text-success">Online · English & Bulgarian</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close customer assistant"
              className="grid size-11 place-items-center rounded-md text-steel transition-colors duration-150 hover:bg-concrete hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
            >
              <X aria-hidden className="size-5" strokeWidth={1.5} />
            </button>
          </header>

          <div aria-live="polite" className="flex-1 space-y-3 overflow-y-auto bg-concrete p-4">
            {messages.map((message, index) => (
              <p
                key={`${message.role}-${index}`}
                className={`max-w-[88%] rounded-md border px-3 py-2 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "ml-auto border-ink bg-ink text-white"
                    : "border-line bg-white text-ink"
                }`}
              >
                {message.content}
              </p>
            ))}
            {sending && (
              <p className="w-fit rounded-md border border-line bg-white px-3 py-2 text-sm text-steel">
                Checking the catalogue…
              </p>
            )}
            {error && <p role="alert" className="text-sm text-danger">{error}</p>}
          </div>

          <form onSubmit={submit} className="border-t border-line bg-white p-3">
            <div className="flex gap-2">
              <label htmlFor="assistant-message" className="sr-only">Your question</label>
              <input
                ref={inputRef}
                id="assistant-message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                minLength={2}
                maxLength={1200}
                placeholder="Ask about a product…"
                className="h-11 min-w-0 flex-1 rounded-md border border-line bg-white px-3 text-sm text-ink outline-none placeholder:text-mist focus:border-ink focus:ring-2 focus:ring-signal/20"
              />
              <button
                type="submit"
                disabled={sending || input.trim().length < 2}
                aria-label="Send message"
                className="grid size-11 place-items-center rounded-md bg-signal text-white transition-colors duration-150 hover:bg-signal-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send aria-hidden className="size-5" strokeWidth={1.5} />
              </button>
            </div>
            <p className="mt-2 text-xs text-steel">
              AI can make mistakes. For a checked recommendation, <Link href="/quote" className="font-medium text-ink underline underline-offset-2">request a quote</Link>.
            </p>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => {
          setOpen((current) => !current);
          window.setTimeout(() => inputRef.current?.focus(), 0);
        }}
        aria-expanded={open}
        aria-controls="assistant-title"
        className="ml-auto flex h-12 items-center gap-2 rounded-md bg-signal px-4 text-sm font-medium text-white shadow-overlay transition-colors duration-150 hover:bg-signal-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
      >
        <MessageCircle aria-hidden className="size-5" strokeWidth={1.5} />
        Ask HWSystem
      </button>
    </aside>
  );
}
