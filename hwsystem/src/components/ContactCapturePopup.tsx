"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { ArrowRight, X } from "lucide-react";

const inputClass =
  "h-10 w-full rounded-md border border-line bg-white px-3 text-sm text-ink outline-none transition-colors placeholder:text-mist focus:border-ink focus:ring-2 focus:ring-signal/20";
const STORAGE_KEY = "hws-contact-popup-last-seen";
const SHOW_AFTER_MS = 18_000;
const HIDE_FOR_MS = 7 * 24 * 60 * 60 * 1000;

export function ContactCapturePopup() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  useEffect(() => {
    const lastSeen = Number(window.localStorage.getItem(STORAGE_KEY) ?? 0);
    if (Number.isFinite(lastSeen) && Date.now() - lastSeen < HIDE_FOR_MS) return;

    // Keep the small-screen journey clear; the explicit help button still opens it.
    const timer = window.setTimeout(() => {
      const editing = document.activeElement?.matches("input, textarea, select");
      const browsingMenu = document.querySelector("header button[aria-expanded='true']");
      if (window.innerWidth >= 768 && !editing && !browsingMenu) setOpen(true);
    }, SHOW_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, []);

  function dismiss() {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setOpen(false);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/contact-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(form.get("name") ?? ""),
          phone: String(form.get("phone") ?? ""),
          email: String(form.get("email") ?? ""),
          company_website: String(form.get("company_website") ?? ""),
        }),
      });

      if (!response.ok) throw new Error("Request failed");
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
      setSubmitted(true);
    } catch {
      setError("We could not save your details. Please try again or call the team.");
    } finally {
      setBusy(false);
    }
  }

  if (!mounted) return null;

  return (
    <div className="fixed bottom-24 right-6 z-40 w-[min(100%-2rem,380px)]">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="ml-auto flex items-center gap-2 rounded-full bg-ink px-4 py-3 text-sm font-medium text-white shadow-overlay transition-colors hover:bg-steel"
        >
          Need help choosing?
          <ArrowRight aria-hidden className="size-4" strokeWidth={1.5} />
        </button>
      ) : (
        <section
          role="dialog"
          aria-modal="false"
          aria-labelledby="contact-capture-heading"
          className="rounded-md border border-line bg-white p-5 shadow-overlay"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-steel">HWSystem</p>
              <h2 id="contact-capture-heading" className="mt-1 text-h3 text-ink">
                Need help choosing a part?
              </h2>
            </div>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Close contact form"
              className="rounded-md p-1 text-mist transition-colors hover:bg-concrete hover:text-ink"
            >
              <X aria-hidden className="size-5" strokeWidth={1.5} />
            </button>
          </div>

          {submitted ? (
            <p className="mt-4 rounded-md bg-concrete p-4 text-sm leading-relaxed text-steel">
              Thanks — your details are with the team. We&apos;ll follow up using the contact details you provided.
            </p>
          ) : (
            <>
              <p className="mt-2 text-sm leading-relaxed text-steel">
                Leave your details and we&apos;ll help you find the right product or route to a trade quote.
              </p>
              <form onSubmit={submit} className="mt-4 space-y-3">
                <label className="block text-sm font-medium text-ink">
                  Name
                  <input name="name" required minLength={2} autoComplete="name" className={`mt-1 ${inputClass}`} />
                </label>
                <label className="block text-sm font-medium text-ink">
                  Phone
                  <input name="phone" required minLength={7} type="tel" autoComplete="tel" className={`mt-1 ${inputClass}`} />
                </label>
                <label className="block text-sm font-medium text-ink">
                  Email
                  <input name="email" required type="email" autoComplete="email" className={`mt-1 ${inputClass}`} />
                </label>
                <div aria-hidden className="absolute left-[-9999px]">
                  <label>
                    Company website
                    <input name="company_website" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>
                {error && <p role="alert" className="text-sm text-danger">{error}</p>}
                <button
                  type="submit"
                  disabled={busy}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-signal px-4 text-sm font-medium text-white transition-colors hover:bg-signal-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy ? "Saving…" : "Send my details"}
                  {!busy && <ArrowRight aria-hidden className="size-4" strokeWidth={1.5} />}
                </button>
              </form>
            </>
          )}
        </section>
      )}
    </div>
  );
}
