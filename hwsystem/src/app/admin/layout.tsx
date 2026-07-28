import Link from "next/link";
import { ExternalLink } from "lucide-react";

/**
 * Admin shell — deliberately separate from the public site chrome.
 * A slim utility bar instead of the marketing header/footer.
 */
export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center justify-between px-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-sm bg-ink font-heading text-[11px] font-semibold text-white">
              HW
            </span>
            <span className="font-heading text-sm font-semibold text-ink">
              HWSystem admin
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center gap-1.5 text-sm font-medium text-steel transition-colors duration-150 hover:text-ink"
          >
            View site
            <ExternalLink aria-hidden className="size-3.5" strokeWidth={1.5} />
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
