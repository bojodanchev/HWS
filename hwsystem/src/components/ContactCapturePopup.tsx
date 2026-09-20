"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import { contactCaptureSchema } from "@/lib/contactCaptureSchema";

const STORAGE_KEY = "hws-contact-popup-last-seen";
const SHOW_AFTER_MS = 9_000;
const HIDE_FOR_MS = 24 * 60 * 60 * 1000;
const inputClass = "h-11 w-full rounded-md border border-line bg-white px-3 text-sm text-ink outline-none placeholder:text-mist focus:border-ink focus:ring-2 focus:ring-signal/20";
const offers = {
  "trade-pricing": { title: "Pricing for your next job", text: "Tell us the parts and quantities you need. Request a checked trade quotation.", action: "Request trade pricing" },
  "door-enquiry": { title: "Planning a new door?", text: "Send your opening size and postcode. Ask the team to review the options for your project.", action: "Discuss my project" },
  "product-selection": { title: "Find the right part", text: "Share the model or SKU and what you need it to do. Ask for product-selection help.", action: "Ask the team" },
};

export function ContactCapturePopup() {
  const pathname = usePathname();
  const purpose = pathname.startsWith("/products") || pathname.startsWith("/trade") ? "trade-pricing" : pathname === "/" || pathname.startsWith("/doors") || pathname.startsWith("/installation") ? "door-enquiry" : "product-selection";
  const offer = offers[purpose];
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const shown = useRef(false);
  const mounted = useSyncExternalStore(() => () => undefined, () => true, () => false);

  useEffect(() => {
    let lastSeen = 0;
    try { lastSeen = Number(window.localStorage.getItem(STORAGE_KEY) ?? 0); } catch { /* Storage may be unavailable. */ }
    if (Number.isFinite(lastSeen) && Date.now() - lastSeen < HIDE_FOR_MS) return;
    let elapsed = false;
    function showWhenReady() {
      const availableScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = availableScroll > 0 ? window.scrollY / availableScroll : 0;
      const threshold = window.innerWidth < 768 ? 0.6 : 0.3;
      if (!elapsed || shown.current || progress < threshold || document.visibilityState !== "visible") return;
      if (document.activeElement?.matches("input, textarea, select") || document.querySelector("header button[aria-expanded='true']")) return;
      shown.current = true;
      setOpen(true);
    }
    const timer = window.setTimeout(() => { elapsed = true; showWhenReady(); }, SHOW_AFTER_MS);
    window.addEventListener("scroll", showWhenReady, { passive: true });
    return () => { window.clearTimeout(timer); window.removeEventListener("scroll", showWhenReady); };
  }, []);

  function dismiss() {
    try { window.localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch { /* Dismiss still works. */ }
    shown.current = true;
    setOpen(false);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    const contact = String(form.get("contact") ?? "").trim();
    const parsed = contactCaptureSchema.safeParse({ name: String(form.get("name") ?? ""), email: contact.includes("@") ? contact : "", phone: contact.includes("@") ? "" : contact, message: String(form.get("message") ?? ""), purpose, company_website: String(form.get("company_website") ?? "") });
    if (!parsed.success) { setError("Enter a valid email address or callback phone number."); return; }
    setBusy(true); setError(null);
    try {
      const response = await fetch("/api/contact-capture", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
      if (!response.ok) throw new Error("Unable to save");
      try { window.localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch { /* Submission was saved. */ }
      setSubmitted(true);
    } catch { setError("We could not save your request. Please try again."); }
    finally { setBusy(false); }
  }

  if (!mounted) return null;
  return <div className="fixed bottom-24 right-6 z-40 w-[min(100%-2rem,380px)]" onKeyDown={event => { if (event.key === "Escape") dismiss(); }}>
    {!open ? <button type="button" onClick={() => { shown.current = true; setOpen(true); }} className="ml-auto flex min-h-11 items-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-steel">
      Need help choosing? <ArrowRight aria-hidden className="size-4" strokeWidth={1.5} />
    </button> : <section role="dialog" aria-modal="false" aria-labelledby="contact-capture-heading" className="max-h-[70svh] overflow-y-auto rounded-md border border-line bg-white p-5 shadow-overlay">
      <div className="flex items-start justify-between gap-3"><h2 id="contact-capture-heading" className="text-h3 text-ink">{offer.title}</h2><button type="button" onClick={dismiss} aria-label="Close contact form" className="flex size-11 shrink-0 items-center justify-center rounded-md text-steel hover:bg-concrete"><X aria-hidden className="size-5" /></button></div>
      {submitted ? <p className="mt-4 text-sm text-steel">Your enquiry is saved in the team’s inbox. We’ll use your contact details to respond.</p> : <>
        <p className="mt-2 text-sm text-steel">{offer.text}</p>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <label className="block text-sm font-medium text-ink">Name <span className="font-normal text-steel">(optional)</span><input name="name" autoComplete="name" maxLength={200} className={`mt-1 ${inputClass}`} /></label>
          <label className="block text-sm font-medium text-ink">Email or phone<input name="contact" required maxLength={254} className={`mt-1 ${inputClass}`} /></label>
          <label className="block text-sm font-medium text-ink">What do you need? <span className="font-normal text-steel">(optional)</span><textarea name="message" maxLength={1000} rows={2} className="mt-1 w-full rounded-md border border-line p-3 text-sm text-ink focus:border-ink" /></label>
          <div aria-hidden className="absolute left-[-9999px]"><label>Company website<input name="company_website" tabIndex={-1} autoComplete="off" /></label></div>
          <p className="text-xs text-steel">We’ll use these details to respond to this enquiry.</p>
          {error && <p role="alert" className="text-sm text-danger">{error}</p>}
          <button type="submit" disabled={busy} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-signal px-4 py-3 text-sm font-medium text-white hover:bg-signal-hover disabled:opacity-50">{busy ? "Saving…" : offer.action}<ArrowRight aria-hidden className="size-4" /></button>
        </form>
      </>}
    </section>}
  </div>;
}
