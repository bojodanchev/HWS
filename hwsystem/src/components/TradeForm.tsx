"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

export const tradeSchema = z.object({
  companyName: z.string().min(2, "Please enter your company name"),
  contactName: z.string().min(2, "Please enter a contact name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(7, "Please enter a phone number"),
  monthlyVolume: z.enum(["under-500", "500-2000", "2000-plus"], {
    message: "Please pick your rough monthly spend",
  }),
  company_website: z.string().max(0).optional(),
});

export type TradeInput = z.infer<typeof tradeSchema>;

const inputClass =
  "h-11 w-full rounded-md border border-line bg-white px-3 text-sm text-ink outline-none transition-colors duration-150 placeholder:text-mist focus:border-ink focus:ring-2 focus:ring-signal/20";

export function TradeForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TradeInput>({ resolver: zodResolver(tradeSchema) });

  async function onSubmit(data: TradeInput) {
    setSubmitError(null);
    const res = await fetch("/api/trade-application", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push("/trade/thank-you");
    } else {
      setSubmitError("Something went wrong. Please email sales@hwsystem.co.uk instead.");
    }
  }

  function fieldError(msg?: string) {
    if (!msg) return null;
    return (
      <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-[13px] text-danger">
        <AlertCircle aria-hidden className="size-4" strokeWidth={1.5} />
        {msg}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-ink">
          Company name
          <input {...register("companyName")} autoComplete="organization" className={`mt-1.5 ${inputClass}`} />
        </label>
        {fieldError(errors.companyName?.message)}
      </div>
      <div>
        <label className="block text-sm font-medium text-ink">
          Contact name
          <input {...register("contactName")} autoComplete="name" className={`mt-1.5 ${inputClass}`} />
        </label>
        {fieldError(errors.contactName?.message)}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-ink">
            Email
            <input {...register("email")} type="email" autoComplete="email" className={`mt-1.5 ${inputClass}`} />
          </label>
          {fieldError(errors.email?.message)}
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">
            Phone
            <input {...register("phone")} type="tel" autoComplete="tel" className={`mt-1.5 ${inputClass}`} />
          </label>
          {fieldError(errors.phone?.message)}
        </div>
      </div>
      <fieldset>
        <legend className="text-sm font-medium text-ink">Rough monthly parts spend</legend>
        <div className="mt-2 space-y-1">
          {[
            { value: "under-500", label: "Under £500" },
            { value: "500-2000", label: "£500 – £2,000" },
            { value: "2000-plus", label: "£2,000+" },
          ].map((opt) => (
            <label key={opt.value} className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm text-ink">
              <input
                type="radio"
                value={opt.value}
                {...register("monthlyVolume")}
                className="size-4 accent-signal"
              />
              {opt.label}
            </label>
          ))}
        </div>
        {fieldError(errors.monthlyVolume?.message)}
      </fieldset>
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
        {isSubmitting ? "Sending…" : "Apply for trade account"}
      </button>
      <p className="text-[13px] text-mist">
        Applications are reviewed manually — we&apos;ll come back to you within one
        working day.
      </p>
    </form>
  );
}
