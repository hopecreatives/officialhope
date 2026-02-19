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
      <div className="border-b border-[#2c4f73] bg-[#082038] px-4 py-2 text-xs text-[#d8e6f5]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2">
          <span className="font-medium">{STORE_DOMAIN}</span>
          <a href={`mailto:${STORE_EMAIL}`} className="hover:text-white">
            {STORE_EMAIL}
          </a>
          <a href={`tel:${STORE_PHONE_LOCAL}`} className="hover:text-white">
            {STORE_PHONE_LOCAL}
          </a>
          <a
            href={`tel:+${STORE_PHONE_INTL}`}
            className="ml-auto rounded-md bg-[#1e3a8a] px-3 py-1 font-semibold text-white"
          >
            Call Us
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <Link
            href="/"
            className="inline-flex w-fit items-center rounded-xl border border-[#406488] bg-[#0f2f51] px-4 py-2 text-lg font-semibold text-white hover:border-[#89a8c9]"
          >
            {STORE_NAME}
          </Link>

          <form action="/shop" className="flex-1">
            <label htmlFor="site-search" className="sr-only">
              Search products
            </label>
            <div className="flex rounded-xl border border-[#406488] bg-[#0f2f51]">
              <input
                id="site-search"
                name="q"
                type="search"
                placeholder="Search cameras, lenses, iPhone..."
                className="w-full rounded-l-xl bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-[#b7c7d8] focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-r-xl border-l border-[#406488] bg-[#f97316] px-4 py-2 text-sm font-semibold text-white hover:bg-[#ea580c]"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex items-center gap-2">
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
          </div>
        </div>

        <CategoryNavigationBar />
      </div>
    </header>
  );
}
