import { FileText } from "lucide-react";
import type { ProductDocument } from "@/types/catalog";

const TYPE_LABELS: Record<ProductDocument["type"], string> = {
  DoP: "Declaration of Performance",
  UKCA: "UKCA certificate",
  CE: "CE declaration",
  manual: "Manual",
  wiring: "Wiring diagram",
  datasheet: "Datasheet",
  warranty: "Warranty terms",
};

export function DocumentList({ documents }: { documents: ProductDocument[] }) {
  if (documents.length === 0) return null;
  return (
    <ul className="divide-y divide-line rounded-md border border-line bg-white">
      {documents.map((doc) => (
        <li key={`${doc.type}-${doc.title}`}>
          <a
            href={doc.url}
            className="flex min-h-11 items-center gap-3 px-4 py-3 text-sm text-ink transition-colors duration-150 hover:bg-concrete"
          >
            <FileText aria-hidden className="size-5 shrink-0 text-steel" strokeWidth={1.5} />
            <span className="flex-1">
              <span className="font-medium">{doc.title}</span>
              <span className="ml-2 text-mist">{TYPE_LABELS[doc.type]} · PDF</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
