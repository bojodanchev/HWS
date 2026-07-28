type BadgeTone = "neutral" | "success" | "warning" | "danger";

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: "text-steel",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

const DOT_CLASSES: Record<BadgeTone, string> = {
  neutral: "bg-steel",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

/** Status label with a tone dot — never colour alone. */
export function Badge({ tone, label }: { tone: BadgeTone; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[13px] font-medium ${TONE_CLASSES[tone]}`}
    >
      <span aria-hidden className={`size-1.5 rounded-full ${DOT_CLASSES[tone]}`} />
      {label}
    </span>
  );
}
