import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { getCategories } from "@/lib/catalog";

const COMPANY_LINKS = [
  { href: "/about", label: "About us" },
  { href: "/trade", label: "Trade account" },
  { href: "/compliance", label: "Compliance" },
  { href: "/delivery", label: "Delivery" },
  { href: "/contact", label: "Contact" },
];

const SUPPORT_LINKS = [
  { href: "/contact", label: "Technical support" },
  { href: "/delivery", label: "Returns policy" },
  { href: "/compliance", label: "Documentation" },
  { href: "/quote", label: "Request a quote" },
];

export function Footer() {
  const productLinks = getCategories().slice(0, 5);

  return (
    <footer className="mt-auto bg-ink text-white">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-6 py-20 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="flex items-center gap-2">
            <span className="font-heading text-lg font-semibold">HWSystem</span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist">
            Trade and retail supplier of garage door automation, motors, and
            components. Serving installers and homeowners across the UK.
          </p>
          <ul className="mt-6 space-y-2.5 text-sm text-mist">
            <li className="flex items-center gap-2.5">
              <Phone aria-hidden className="size-4 shrink-0" strokeWidth={1.5} />
              <a href="tel:+442045774094" className="hover:text-white">
                +44 (0)20 4577 4094
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail aria-hidden className="size-4 shrink-0" strokeWidth={1.5} />
              <a href="mailto:sales@hwsystem.co.uk" className="hover:text-white">
                sales@hwsystem.co.uk
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin aria-hidden className="size-4 shrink-0" strokeWidth={1.5} />
              <span>SBI Group International, Bristol BS16</span>
            </li>
          </ul>
          <p className="mt-4 text-sm text-steel">Mon–Fri: 8am–5pm</p>
        </div>
        <nav aria-label="Products">
          <h2 className="text-sm font-semibold">Products</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-mist">
            {productLinks.map((c) => (
              <li key={c.slug}>
                <Link href={`/products/${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/products" className="hover:text-white">
                All products
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Company">
          <h2 className="text-sm font-semibold">Company</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-mist">
            {COMPANY_LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Support">
          <h2 className="text-sm font-semibold">Support</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-mist">
            {SUPPORT_LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-2 px-6 py-5 text-[13px] text-steel">
          <p>© {new Date().getFullYear()} HWSystem · Part of SBI Group International Ltd</p>
          <p>Own factory in Europe · EN 13241 · UKCA</p>
        </div>
      </div>
    </footer>
  );
}
