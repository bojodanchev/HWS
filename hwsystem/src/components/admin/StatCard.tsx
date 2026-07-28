import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
}

/** Headline number tile for the admin dashboards. */
export function StatCard({ label, value, hint, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-md border border-line bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-steel">{label}</p>
        {Icon ? (
          <Icon aria-hidden className="size-4 text-mist" strokeWidth={1.5} />
        ) : null}
      </div>
      <p className="mt-2 font-heading text-h2 text-ink tabular-nums">{value}</p>
      {hint ? <p className="mt-1 text-[13px] text-steel">{hint}</p> : null}
    </div>
  );
}
