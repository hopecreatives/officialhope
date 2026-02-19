"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORY_NAV_ITEMS } from "@/lib/constants/catalog";

export function CategoryNavigationBar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Category navigation" className="mt-4 border-t border-[#25303d] pt-3">
      <div className="no-scrollbar -mx-1 overflow-x-auto px-1">
        <div className="flex min-w-max items-center gap-2 whitespace-nowrap">
          {CATEGORY_NAV_ITEMS.map((item, index) => {
            const isCategoryRouteActive =
              pathname === `/category/${item.slug}` ||
              pathname.startsWith(`/category/${item.slug}/`);
            const isActive = isCategoryRouteActive;

            return (
              <div key={item.slug} className="flex items-center gap-2">
                <Link
                  href={`/category/${item.slug}`}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#1e3a8a] text-white"
                      : "text-[#d6e2ef] hover:bg-[#131b26] hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
                {index < CATEGORY_NAV_ITEMS.length - 1 ? (
                  <span className="text-[#56667a]" aria-hidden="true">
                    |
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
