"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface StatusSelectProps {
  /** PATCH endpoint, e.g. /api/admin/tickets/T-1041 */
  endpoint: string;
  /** JSON field to send, e.g. "status" or "priority" */
  field: string;
  value: string;
  options: { value: string; label: string }[];
  /** Accessible name, e.g. "Status for ticket T-1041" */
  label: string;
}

/** Inline status editor for admin tables — persists via the admin API. */
export function StatusSelect({
  endpoint,
  field,
  value,
  options,
  label,
}: StatusSelectProps) {
  const router = useRouter();
  const [current, setCurrent] = useState(value);
  const [failed, setFailed] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value;
    const previous = current;
    setCurrent(next);
    setFailed(false);
    const res = await fetch(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: next }),
    }).catch(() => null);
    if (!res || !res.ok) {
      setCurrent(previous);
      setFailed(true);
      return;
    }
    startTransition(() => router.refresh());
  }

  return (
    <span className="inline-flex flex-col gap-1">
      <select
        aria-label={label}
        value={current}
        onChange={onChange}
        disabled={isPending}
        className="h-9 min-w-[8.5rem] rounded-md border border-line bg-white px-2 text-[13px] font-medium text-ink outline-none transition-colors duration-150 focus:border-ink focus:ring-2 focus:ring-signal/20 disabled:opacity-60"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {failed ? (
        <span role="alert" className="text-[12px] text-danger">
          Save failed
        </span>
      ) : null}
    </span>
  );
}
