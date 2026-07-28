interface BreakdownItem {
  label: string;
  value: number;
  /** Formatted value shown at the row end; defaults to the raw number. */
  display?: string;
}

interface BreakdownBarsProps {
  items: BreakdownItem[];
  /** Accessible description of what the bars measure. */
  unit: string;
}

/**
 * Single-hue horizontal bar list. Identity comes from the row label and the
 * exact value is printed on every row, so the bar itself only carries
 * magnitude — no legend or tooltip needed.
 */
export function BreakdownBars({ items, unit }: BreakdownBarsProps) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label} className="grid grid-cols-[8rem_1fr_auto] items-center gap-3">
          <span className="truncate text-sm text-steel" title={item.label}>
            {item.label}
          </span>
          <span
            role="img"
            aria-label={`${item.label}: ${item.display ?? item.value} ${unit}`}
            className="block h-2 rounded-[4px] bg-concrete"
          >
            <span
              aria-hidden
              className="block h-2 rounded-[4px] bg-steel"
              style={{ width: `${Math.max((item.value / max) * 100, item.value > 0 ? 3 : 0)}%` }}
            />
          </span>
          <span className="text-sm font-medium text-ink tabular-nums">
            {item.display ?? item.value}
          </span>
        </li>
      ))}
    </ul>
  );
}
