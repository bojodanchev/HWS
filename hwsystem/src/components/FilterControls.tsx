"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ListFilter, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type FacetOptions = {
  brands: string[];
  torques: number[];
  tubeDiameters: number[];
  voltages: string[];
  frequencies: string[];
};

type FilterGroup = {
  param: string;
  label: string;
  options: { value: string; label: string }[];
};

function buildGroups(facets: FacetOptions): FilterGroup[] {
  const groups: FilterGroup[] = [];
  if (facets.brands.length > 1) {
    groups.push({
      param: "brand",
      label: "Brand",
      options: facets.brands.map((b) => ({ value: b, label: b })),
    });
  }
  if (facets.torques.length > 1) {
    groups.push({
      param: "torque",
      label: "Torque",
      options: facets.torques.map((t) => ({ value: String(t), label: `${t} Nm` })),
    });
  }
  if (facets.tubeDiameters.length > 1) {
    groups.push({
      param: "tubeDiameter",
      label: "Tube diameter",
      options: facets.tubeDiameters.map((d) => ({ value: String(d), label: `Ø${d}` })),
    });
  }
  if (facets.voltages.length > 1) {
    groups.push({
      param: "voltage",
      label: "Voltage",
      options: facets.voltages.map((v) => ({ value: v, label: v })),
    });
  }
  if (facets.frequencies.length > 1) {
    groups.push({
      param: "frequency",
      label: "Frequency",
      options: facets.frequencies.map((f) => ({ value: f, label: f })),
    });
  }
  groups.push({
    param: "inStock",
    label: "Availability",
    options: [{ value: "true", label: "In stock" }],
  });
  groups.push({
    param: "nextDay",
    label: "Delivery",
    options: [{ value: "true", label: "Next-day eligible" }],
  });
  return groups;
}

function FilterList({ facets }: { facets: FacetOptions }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const groups = buildGroups(facets);

  function toggle(param: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(param) === value) {
      params.delete(param);
    } else {
      params.set(param, value);
    }
    router.replace(`${pathname}${params.size ? `?${params}` : ""}`, { scroll: false });
  }

  const hasActive = groups.some((g) => searchParams.get(g.param));

  return (
    <div className="space-y-6">
      {hasActive && (
        <button
          type="button"
          onClick={() => router.replace(pathname, { scroll: false })}
          className="text-sm font-medium text-steel underline-offset-4 hover:text-ink hover:underline"
        >
          Clear all filters
        </button>
      )}
      {groups.map((group) => (
        <fieldset key={group.param}>
          <legend className="text-xs font-medium uppercase tracking-[0.08em] text-mist">
            {group.label}
          </legend>
          <div className="mt-2.5 space-y-1">
            {group.options.map((opt) => {
              const active = searchParams.get(group.param) === opt.value;
              return (
                <label
                  key={opt.value}
                  className={cn(
                    "flex min-h-11 cursor-pointer items-center gap-2.5 rounded-sm px-2 text-sm transition-colors duration-150",
                    active ? "bg-concrete font-medium text-ink" : "text-steel hover:text-ink",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggle(group.param, opt.value)}
                    className="size-4 accent-signal"
                  />
                  {opt.label}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

export function FilterSidebar({ facets }: { facets: FacetOptions }) {
  return (
    <aside aria-label="Filters" className="hidden w-56 shrink-0 lg:block">
      <h2 className="mb-4 text-sm font-semibold text-ink">Filter</h2>
      <FilterList facets={facets} />
    </aside>
  );
}

export function FilterDrawer({ facets }: { facets: FacetOptions }) {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const activeCount = ["brand", "torque", "tubeDiameter", "voltage", "frequency", "inStock", "nextDay"].filter(
    (p) => searchParams.get(p),
  ).length;

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-11 items-center gap-2 rounded-md border border-line px-4 text-sm font-medium text-ink transition-colors duration-150 hover:bg-concrete"
      >
        <ListFilter className="size-5" strokeWidth={1.5} aria-hidden />
        Filter{activeCount > 0 && ` (${activeCount})`}
      </button>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/40"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-lg bg-white p-6 shadow-[0_8px_24px_rgba(16,20,24,0.10)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-h3 text-ink">Filter</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex size-11 items-center justify-center rounded-md text-steel hover:bg-concrete hover:text-ink"
              >
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </div>
            <FilterList facets={facets} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-6 h-11 w-full rounded-md bg-ink text-sm font-medium text-white transition-colors duration-150 hover:bg-ink/90"
            >
              Show results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "relevance";

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "relevance") params.delete("sort");
    else params.set("sort", value);
    router.replace(`${pathname}${params.size ? `?${params}` : ""}`, { scroll: false });
  }

  return (
    <label className="flex items-center gap-2 text-sm text-steel">
      <span className="hidden sm:inline">Sort</span>
      <select
        value={current}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-md border border-line bg-white px-3 text-sm text-ink outline-none transition-colors duration-150 focus:border-ink focus:ring-2 focus:ring-signal/20"
      >
        <option value="relevance">Relevance</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
        <option value="name">Name A–Z</option>
      </select>
    </label>
  );
}
