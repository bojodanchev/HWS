import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-[1280px] flex-1 items-center px-6 py-20">
      <div className="mx-auto max-w-md text-center">
        <p className="font-mono text-sm text-mist">404</p>
        <h1 className="mt-3 text-h1 text-ink">That page isn&apos;t here</h1>
        <p className="mt-4 text-steel">
          The part might be, though. Try the search, or browse the catalogue.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/search"
            className="flex h-11 items-center rounded-md bg-signal px-6 text-sm font-medium text-white transition-colors duration-150 hover:bg-signal-hover"
          >
            Search by SKU
          </Link>
          <Link
            href="/products"
            className="flex h-11 items-center rounded-md border border-line px-6 text-sm font-medium text-ink transition-colors duration-150 hover:bg-concrete"
          >
            Browse catalogue
          </Link>
        </div>
      </div>
    </main>
  );
}
