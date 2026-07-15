"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

export const quoteSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  phone: z.string().min(7, "Please enter a phone number we can reach you on"),
  email: z.string().email("Please enter a valid email"),
  postcode: z.string().min(3, "Please enter the site postcode"),
  message: z.string().min(10, "Tell us briefly what you need"),
  // Honeypot — humans never see or fill this
  company_website: z.string().max(0).optional(),
});

export type QuoteInput = z.infer<typeof quoteSchema>;

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink">
        {label}
        <div className="mt-1.5">{children}</div>
      </label>
      {error && (
        <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-[13px] text-danger">
          <AlertCircle aria-hidden className="size-4" strokeWidth={1.5} />
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "h-11 w-full rounded-md border border-line bg-white px-3 text-sm text-ink outline-none transition-colors duration-150 placeholder:text-mist focus:border-ink focus:ring-2 focus:ring-signal/20";

export function QuoteForm({ subject }: { subject?: string }) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      message: subject ? `Quote request: ${subject}\n\n` : "",
    },
  });

  async function onSubmit(data: QuoteInput) {
    setSubmitError(null);
    const res = await fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push("/quote/thank-you");
    } else {
      setSubmitError("Something went wrong sending your request. Please call us on +44 (0)330 123 4567.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Field label="Your name" error={errors.name?.message}>
        <input {...register("name")} autoComplete="name" className={inputClass} />
      </Field>
      <Field label="Phone" error={errors.phone?.message}>
        <input {...register("phone")} type="tel" autoComplete="tel" className={inputClass} />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <input {...register("email")} type="email" autoComplete="email" className={inputClass} />
      </Field>
      <Field label="Site postcode" error={errors.postcode?.message}>
        <input {...register("postcode")} autoComplete="postal-code" className={inputClass} />
      </Field>
      <Field label="What do you need?" error={errors.message?.message}>
        <textarea
          {...register("message")}
          rows={4}
          className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition-colors duration-150 placeholder:text-mist focus:border-ink focus:ring-2 focus:ring-signal/20"
        />
      </Field>
      <div aria-hidden className="absolute left-[-9999px]">
        <label>
          Company website
          <input {...register("company_website")} tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {submitError && (
        <p role="alert" className="flex items-center gap-1.5 text-sm text-danger">
          <AlertCircle aria-hidden className="size-4" strokeWidth={1.5} />
          {submitError}
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-11 rounded-md bg-signal px-6 text-sm font-medium text-white transition-colors duration-150 hover:bg-signal-hover disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isSubmitting ? "Sending…" : "Request quote"}
      </button>
    </form>
  );
}
