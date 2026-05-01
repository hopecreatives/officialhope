import Link from "next/link";
import { CATEGORY_NAV_ITEMS } from "@/lib/constants/catalog";
import {
  STORE_DOMAIN,
  STORE_EMAIL,
  STORE_NAME,
  STORE_PHONE_INTL,
  STORE_PHONE_LOCAL,
} from "@/lib/constants/store";
import { CategoryNavigationBar } from "@/components/layout/category-navigation-bar";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#17324c] bg-[#0b2a4a] shadow-lg">
      <div className="hidden border-b border-[#2c4f73] bg-[#082038] px-4 py-2 text-[11px] text-[#d8e6f5] md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="font-medium">{STORE_DOMAIN}</span>
            <a href={`tel:${STORE_PHONE_LOCAL}`} className="hover:text-white">
              {STORE_PHONE_LOCAL}
            </a>
          </div>
          <a href={`mailto:${STORE_EMAIL}`} className="truncate hover:text-white">
            {STORE_EMAIL}
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-3 md:py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-xl border border-[#406488] bg-[#0f2f51] px-4 py-2 text-base font-semibold text-white hover:border-[#89a8c9] md:text-lg"
            >
              {STORE_NAME}
            </Link>

            <div className="flex items-center gap-2 lg:hidden">
              <a
                href={`tel:+${STORE_PHONE_INTL}`}
                className="rounded-xl border border-[#406488] bg-[#0f2f51] px-3 py-2 text-sm font-semibold text-white hover:border-[#89a8c9]"
              >
                Call
              </a>
              <button
                type="button"
                aria-label="Open cart"
                className="inline-flex items-center gap-2 rounded-xl border border-[#406488] bg-[#0f2f51] px-3 py-2 text-sm text-white hover:border-[#89a8c9]"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H7" />
                  <circle cx="10" cy="20" r="1.4" />
                  <circle cx="18" cy="20" r="1.4" />
                </svg>
              </button>
            </div>
          </div>

          <form action="/shop" className="flex-1">
            <label htmlFor="site-search" className="sr-only">
              Search products
            </label>
            <div className="flex overflow-hidden rounded-xl border border-[#406488] bg-white shadow-[0_6px_20px_rgba(8,32,56,0.16)]">
              <input
                id="site-search"
                name="q"
                type="search"
                placeholder="Search gear"
                className="min-w-0 w-full bg-white px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#64748b] focus:outline-none"
              />
              <button
                type="submit"
                className="min-w-[96px] shrink-0 border-l border-[#e2e8f0] bg-[#f97316] px-4 py-3 text-sm font-semibold text-white hover:bg-[#ea580c]"
              >
                Search
              </button>
            </div>
          </form>

          <div className="hidden items-center gap-2 lg:flex">
            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-xl border border-[#406488] bg-[#0f2f51] px-3 py-2 text-sm text-white hover:border-[#89a8c9]">
                Categories
                <span className="text-xs text-[#9fb9d4]">▼</span>
              </summary>
              <div className="absolute right-0 top-12 w-[20rem] rounded-xl border border-[#406488] bg-[#0f2f51] p-4 shadow-2xl">
                <p className="mb-3 text-xs uppercase tracking-wide text-[#8fa7bf]">Shop by category</p>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORY_NAV_ITEMS.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      className="rounded-lg border border-[#406488] bg-[#0c2947] px-3 py-2 text-sm text-[#dfe9f4] hover:border-[#89a8c9]"
                    >
                      {category.label}
                    </Link>
                  ))}
                </div>
              </div>
            </details>

            <button
              type="button"
              aria-label="Open cart"
              className="inline-flex items-center gap-2 rounded-xl border border-[#406488] bg-[#0f2f51] px-3 py-2 text-sm text-white hover:border-[#89a8c9]"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H7" />
                <circle cx="10" cy="20" r="1.4" />
                <circle cx="18" cy="20" r="1.4" />
              </svg>
              Cart
            </button>

            <a
              href={`tel:+${STORE_PHONE_INTL}`}
              className="rounded-xl bg-[#f97316] px-4 py-2 text-sm font-semibold text-white hover:bg-[#ea580c]"
            >
              Call
            </a>
          </div>
        </div>

        <CategoryNavigationBar />
      </div>
    </header>
  );
}
