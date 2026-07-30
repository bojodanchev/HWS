"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import {
  Bot,
  CheckCircle2,
  MessageCircle,
  Send,
  UserRound,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { chatContactSchema, chatRequestSchema } from "@/lib/chatSchema";
import type { ChatLocale, ChatRole } from "@/types/chat";

type ProductLink = { name: string; sku: string; url: string };
type UiMessage = {
  role: ChatRole;
  content: string;
  products?: ProductLink[];
};

const copy = {
  en: {
    assistant: "Product assistant",
    online: "Online · standalone catalogue",
    welcome:
      "Hello! I can help with products, compatibility, stock and public prices.",
    placeholder: "Ask about a product…",
    send: "Send message",
    close: "Close customer assistant",
    launcher: "Ask HWSystem",
    checking: "Checking the catalogue…",
    unavailable:
      "The assistant is unavailable. Please try again or send a quote request.",
    disclaimer: "AI can make mistakes. For a checked recommendation,",
    quote: "request a quote",
    humanAnswer: "Need a checked answer?",
    humanHint: "Leave your details and the team can follow up on this conversation.",
    name: "Name",
    email: "Email",
    phone: "Phone",
    consent: "I agree that HWSystem may contact me about this request.",
    submitContact: "Send to the team",
    contactSaved: "Thanks — the conversation is now in the support queue.",
    contactError: "Please check your contact details and try again.",
    quickCompatibility: "Check compatibility",
    quickPrice: "Find a public price",
  },
  bg: {
    assistant: "Продуктов асистент",
    online: "Онлайн · самостоятелен каталог",
    welcome:
      "Здравейте! Мога да помогна с продукти, съвместимост, наличности и публични цени.",
    placeholder: "Попитайте за продукт…",
    send: "Изпрати съобщение",
    close: "Затвори продуктовия асистент",
    launcher: "Попитайте HWSystem",
    checking: "Проверявам каталога…",
    unavailable:
      "Асистентът временно не е достъпен. Опитайте отново или изпратете запитване.",
    disclaimer: "AI може да допуска грешки. За проверена препоръка",
    quote: "поискайте оферта",
    humanAnswer: "Нужен е проверен отговор?",
    humanHint:
      "Оставете данни и екипът ще продължи директно от този разговор.",
    name: "Име",
    email: "Имейл",
    phone: "Телефон",
    consent: "Съгласен/на съм HWSystem да се свърже с мен за това запитване.",
    submitContact: "Изпрати към екипа",
    contactSaved: "Благодарим — разговорът вече е в опашката за обслужване.",
    contactError: "Проверете данните за контакт и опитайте отново.",
    quickCompatibility: "Проверка на съвместимост",
    quickPrice: "Публична цена",
  },
} as const;

function initialMessages(locale: ChatLocale): UiMessage[] {
  return [{ role: "assistant", content: copy[locale].welcome }];
}

export function CustomerAssistant() {
  const [open, setOpen] = useState(false);
  const [locale, setLocale] = useState<ChatLocale>("en");
  const [messages, setMessages] = useState<UiMessage[]>(initialMessages("en"));
  const [conversationId, setConversationId] = useState<string>();
  const [input, setInput] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showContact, setShowContact] = useState(false);
  const [contactSending, setContactSending] = useState(false);
  const [contactSaved, setContactSaved] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactConsent, setContactConsent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const t = copy[locale];

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "end",
    });
  }, [messages, sending, showContact, reduceMotion]);

  function changeLocale(nextLocale: ChatLocale) {
    setLocale(nextLocale);
    if (messages.length === 1) setMessages(initialMessages(nextLocale));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      conversationId,
      message: input,
      locale,
      company_website: honeypot,
    };
    const parsed = chatRequestSchema.safeParse(payload);
    if (!parsed.success || sending) return;

    const customerMessage: UiMessage = {
      role: "user",
      content: parsed.data.message,
    };
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
      const data = (await response.json()) as {
        conversationId?: string;
        answer?: string;
        needsFollowUp?: boolean;
        products?: ProductLink[];
      };
      if (!response.ok || !data.answer || !data.conversationId) {
        throw new Error("No assistant response");
      }
      setConversationId(data.conversationId);
      window.sessionStorage.setItem(
        "hws-chat-conversation",
        data.conversationId,
      );
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.answer ?? "",
          products: data.products,
        },
      ]);
      if (data.needsFollowUp) setShowContact(true);
    } catch {
      setError(t.unavailable);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!conversationId || contactSending) return;
    const form = new FormData(event.currentTarget);
    const payload = {
      conversationId,
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      consent: contactConsent,
      company_website: form.get("company_website"),
    };
    const parsed = chatContactSchema.safeParse(payload);
    if (!parsed.success) {
      setContactError(t.contactError);
      return;
    }

    setContactSending(true);
    setContactError(null);
    try {
      const response = await fetch("/api/chat/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!response.ok) throw new Error("Contact save failed");
      setContactSaved(true);
    } catch {
      setContactError(t.contactError);
    } finally {
      setContactSending(false);
    }
  }

  return (
    <aside className="fixed bottom-6 right-6 z-50" aria-label={t.assistant}>
      <AnimatePresence>
        {open && (
          <motion.section
            id="customer-assistant-dialog"
            role="dialog"
            aria-modal="false"
            aria-labelledby="assistant-title"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
            className="mb-3 flex h-[560px] max-h-[72vh] w-[calc(100vw-48px)] max-w-sm flex-col overflow-hidden rounded-lg border border-line bg-white shadow-overlay"
          >
            <header className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-ink text-white">
                  <Bot aria-hidden className="size-5" strokeWidth={1.5} />
                </span>
                <div className="min-w-0">
                  <h2
                    id="assistant-title"
                    className="truncate font-heading font-semibold text-ink"
                  >
                    {t.assistant}
                  </h2>
                  <p className="truncate text-xs text-success">{t.online}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center">
                <div
                  className="mr-1 flex rounded-md border border-line p-0.5 text-xs"
                  aria-label="Language"
                >
                  {(["en", "bg"] as const).map((language) => (
                    <button
                      key={language}
                      type="button"
                      onClick={() => changeLocale(language)}
                      aria-pressed={locale === language}
                      className={`h-8 rounded-sm px-2 font-medium transition-colors duration-150 ${
                        locale === language
                          ? "bg-ink text-white"
                          : "text-steel hover:text-ink"
                      }`}
                    >
                      {language.toUpperCase()}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    launcherRef.current?.focus();
                  }}
                  aria-label={t.close}
                  className="grid size-11 place-items-center rounded-md text-steel transition-colors duration-150 hover:bg-concrete hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
                >
                  <X aria-hidden className="size-5" strokeWidth={1.5} />
                </button>
              </div>
            </header>

            <div
              aria-live="polite"
              className="flex-1 space-y-3 overflow-y-auto bg-concrete p-4"
            >
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`max-w-[90%] ${
                    message.role === "user" ? "ml-auto" : ""
                  }`}
                >
                  <p
                    className={`whitespace-pre-line rounded-md border px-3 py-2 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "border-ink bg-ink text-white"
                        : "border-line bg-white text-ink"
                    }`}
                  >
                    {message.content}
                  </p>
                  {message.products && message.products.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.products.map((product) => (
                        <Link
                          key={product.sku}
                          href={product.url}
                          className="block rounded-md border border-line bg-white px-3 py-2 text-xs text-ink transition-colors duration-150 hover:border-ink"
                        >
                          <span className="font-medium">{product.name}</span>
                          <span className="ml-2 font-mono text-mist">
                            {product.sku}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2">
                  {[t.quickCompatibility, t.quickPrice].map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        setInput(
                          label === t.quickCompatibility
                            ? locale === "bg"
                              ? "Кой продукт е съвместим с "
                              : "Which product is compatible with "
                            : locale === "bg"
                              ? "Каква е публичната цена на "
                              : "What is the public price of ",
                        );
                        inputRef.current?.focus();
                      }}
                      className="h-9 rounded-md border border-line bg-white px-3 text-xs font-medium text-ink transition-colors duration-150 hover:border-ink"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
              {sending && (
                <p className="w-fit rounded-md border border-line bg-white px-3 py-2 text-sm text-steel">
                  {t.checking}
                </p>
              )}
              {error && (
                <p role="alert" className="text-sm text-danger">
                  {error}
                </p>
              )}

              {showContact && !contactSaved && (
                <form
                  onSubmit={submitContact}
                  className="rounded-md border border-line bg-white p-3"
                >
                  <div className="flex items-start gap-2">
                    <UserRound
                      aria-hidden
                      className="mt-0.5 size-4 shrink-0 text-steel"
                      strokeWidth={1.5}
                    />
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {t.humanAnswer}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-steel">
                        {t.humanHint}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2">
                    <label className="text-xs font-medium text-ink">
                      {t.name}
                      <input
                        name="name"
                        required
                        minLength={2}
                        maxLength={80}
                        className="mt-1 h-10 w-full rounded-md border border-line px-3 text-sm outline-none focus:border-ink focus:ring-2 focus:ring-signal/20"
                      />
                    </label>
                    <label className="text-xs font-medium text-ink">
                      {t.email}
                      <input
                        name="email"
                        type="email"
                        required
                        maxLength={254}
                        className="mt-1 h-10 w-full rounded-md border border-line px-3 text-sm outline-none focus:border-ink focus:ring-2 focus:ring-signal/20"
                      />
                    </label>
                    <label className="text-xs font-medium text-ink">
                      {t.phone}
                      <input
                        name="phone"
                        type="tel"
                        required
                        minLength={7}
                        maxLength={32}
                        className="mt-1 h-10 w-full rounded-md border border-line px-3 text-sm outline-none focus:border-ink focus:ring-2 focus:ring-signal/20"
                      />
                    </label>
                    <input
                      name="company_website"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="sr-only"
                    />
                    <label className="flex items-start gap-2 text-xs leading-relaxed text-steel">
                      <input
                        type="checkbox"
                        checked={contactConsent}
                        onChange={(event) =>
                          setContactConsent(event.target.checked)
                        }
                        className="mt-0.5 size-4 accent-signal"
                      />
                      {t.consent}
                    </label>
                    <button
                      type="submit"
                      disabled={contactSending || !contactConsent}
                      className="h-10 rounded-md bg-ink px-4 text-sm font-medium text-white transition-colors duration-150 hover:bg-steel disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {t.submitContact}
                    </button>
                    {contactError && (
                      <p role="alert" className="text-xs text-danger">
                        {contactError}
                      </p>
                    )}
                  </div>
                </form>
              )}
              {contactSaved && (
                <p className="flex items-start gap-2 rounded-md border border-success/30 bg-white px-3 py-2 text-sm text-ink">
                  <CheckCircle2
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-success"
                    strokeWidth={1.5}
                  />
                  {t.contactSaved}
                </p>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={submit} className="border-t border-line bg-white p-3">
              <input
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
                name="company_website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="sr-only"
              />
              <div className="flex gap-2">
                <label htmlFor="assistant-message" className="sr-only">
                  {t.placeholder}
                </label>
                <input
                  ref={inputRef}
                  id="assistant-message"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  minLength={2}
                  maxLength={1200}
                  placeholder={t.placeholder}
                  className="h-11 min-w-0 flex-1 rounded-md border border-line bg-white px-3 text-sm text-ink outline-none placeholder:text-mist focus:border-ink focus:ring-2 focus:ring-signal/20"
                />
                <button
                  type="submit"
                  disabled={sending || input.trim().length < 2}
                  aria-label={t.send}
                  className="grid size-11 place-items-center rounded-md bg-signal text-white transition-colors duration-150 hover:bg-signal-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send aria-hidden className="size-5" strokeWidth={1.5} />
                </button>
              </div>
              <div className="mt-2 flex items-start justify-between gap-3">
                <p className="text-xs text-steel">
                  {t.disclaimer}{" "}
                  <Link
                    href="/quote"
                    className="font-medium text-ink underline underline-offset-2"
                  >
                    {t.quote}
                  </Link>
                  .
                </p>
                {conversationId && !showContact && !contactSaved && (
                  <button
                    type="button"
                    onClick={() => setShowContact(true)}
                    className="shrink-0 text-xs font-medium text-ink underline underline-offset-2"
                  >
                    {t.humanAnswer}
                  </button>
                )}
              </div>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <button
        ref={launcherRef}
        type="button"
        onClick={() => {
          setOpen((current) => !current);
          window.setTimeout(() => inputRef.current?.focus(), 0);
        }}
        aria-expanded={open}
        aria-controls="customer-assistant-dialog"
        className="ml-auto flex h-12 items-center gap-2 rounded-md bg-signal px-4 text-sm font-medium text-white shadow-overlay transition-colors duration-150 hover:bg-signal-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
      >
        <MessageCircle aria-hidden className="size-5" strokeWidth={1.5} />
        {t.launcher}
      </button>
    </aside>
  );
}
