import Link from "next/link";
import { CATEGORIES } from "@/lib/constants/catalog";
import { STORE_DOMAIN, STORE_EMAIL, STORE_NAME, STORE_PHONE_LOCAL } from "@/lib/constants/store";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[#e2e8f0] bg-[#f8fafc]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:grid-cols-3">
        <div>
          <h2 className="text-lg font-semibold text-[#0b2a4a]">{STORE_NAME}</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#475569]">
            Premium camera gear and electronics for creators, professionals, and businesses across Rwanda.
          </p>
          <p className="mt-4 text-sm text-[#1e3a8a]">{STORE_DOMAIN}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#64748b]">
            Quick links
          </h3>
          <ul className="mt-3 space-y-2">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-[#334155] transition hover:text-[#1e3a8a]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#64748b]">Contacts</h3>
          <ul className="mt-3 space-y-2 text-sm text-[#334155]">
            <li>
              <a href={`tel:${STORE_PHONE_LOCAL}`} className="transition hover:text-[#1e3a8a]">
                WhatsApp/Phone: {STORE_PHONE_LOCAL}
              </a>
            </li>
            <li>
              <a href={`mailto:${STORE_EMAIL}`} className="transition hover:text-[#1e3a8a]">
                Email: {STORE_EMAIL}
              </a>
            </li>
          </ul>
          <h4 className="mt-5 text-xs font-semibold uppercase tracking-wide text-[#64748b]">
            Popular categories
          </h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                href={`/shop?category=${encodeURIComponent(category)}`}
                className="rounded-md border border-[#cbd5e1] bg-white px-2.5 py-1 text-xs text-[#334155] transition hover:border-[#1e3a8a] hover:text-[#1e3a8a]"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-[#e2e8f0] py-4 text-center text-xs text-[#64748b]">
        © {new Date().getFullYear()} {STORE_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
