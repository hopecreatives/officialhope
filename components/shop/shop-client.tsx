"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CATEGORIES, SHOP_SORT_OPTIONS } from "@/lib/constants/catalog";
import { formatPriceRWF } from "@/lib/utils/format";
import type { Product, ProductCategory } from "@/types/product";
import { ProductCard } from "@/components/ui/product-card";

type SortValue = (typeof SHOP_SORT_OPTIONS)[number]["value"];
type ConditionFilter = "New" | "Used";

const ITEMS_PER_BATCH = 12;
const PRICE_STEP = 10000;

const toggleOption = <T extends string>(current: T[], value: T) =>
  current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];

const clampPrice = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const parsePriceInput = (value: string, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getProductTimestamp = (product: Product) => {
  const parsedDate = product.createdAt ? Date.parse(product.createdAt) : Number.NaN;
  if (Number.isFinite(parsedDate)) {
    return parsedDate;
  }

  return product.id;
};

const normalizeProducts = (products: Product[] | null | undefined): Product[] => {
  if (!Array.isArray(products)) {
    return [];
  }

  return products.map((product, index) => ({
    ...product,
    id: Number.isFinite(product.id) ? product.id : index + 1,
    name: typeof product.name === "string" ? product.name : `Product ${index + 1}`,
    slug: typeof product.slug === "string" ? product.slug : `product-${index + 1}`,
    brand:
      typeof product.brand === "string" && product.brand.trim().length > 0
        ? product.brand.trim()
        : "Unknown",
    condition: product.condition === "Used" ? "Used" : "New",
    priceRWF: Number.isFinite(product.priceRWF) ? product.priceRWF : 0,
    inStock: Boolean(product.inStock),
    featured: Boolean(product.featured),
    shortDesc: typeof product.shortDesc === "string" ? product.shortDesc : "",
    description: typeof product.description === "string" ? product.description : "",
    specs: Array.isArray(product.specs) ? product.specs : [],
    images: Array.isArray(product.images) ? product.images : [],
  }));
};

interface ShopClientProps {
  initialProducts: Product[] | null | undefined;
  title: string;
  description: string;
  resultLabel: string;
  initialSearchQuery?: string;
  initialCategory?: ProductCategory | null;
  forcedCategories?: readonly ProductCategory[];
}

export function ShopClient({
  initialProducts,
  title,
  description,
  resultLabel,
  initialSearchQuery = "",
  initialCategory = null,
  forcedCategories = [],
}: ShopClientProps) {
  const urlSearchParams = useSearchParams();
  const catalogProducts = useMemo(
    () => normalizeProducts(initialProducts),
    [initialProducts],
  );

  const resolvedInitialCategory = useMemo(() => {
    if (!initialCategory) {
      return null;
    }

    return CATEGORIES.includes(initialCategory) ? initialCategory : null;
  }, [initialCategory]);

  const initialMinPrice = useMemo(() => {
    if (catalogProducts.length === 0) {
      return 0;
    }

    return Math.min(...catalogProducts.map((product) => product.priceRWF));
  }, [catalogProducts]);

  const initialMaxPrice = useMemo(() => {
    if (catalogProducts.length === 0) {
      return 0;
    }

    return Math.max(...catalogProducts.map((product) => product.priceRWF));
  }, [catalogProducts]);

  const [searchText, setSearchText] = useState(initialSearchQuery);
  const [activeCategory, setActiveCategory] =
    useState<ProductCategory | null>(resolvedInitialCategory);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<ConditionFilter[]>([]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<SortValue>("featured");
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const hasForcedCategoryScope = forcedCategories.length > 0;

  useEffect(() => {
    setSearchText(initialSearchQuery);
  }, [initialSearchQuery]);

  useEffect(() => {
    setActiveCategory(resolvedInitialCategory);
  }, [resolvedInitialCategory]);

  useEffect(() => {
    const queryFromUrl = urlSearchParams.get("q") ?? "";
    const categoryFromUrlRaw = urlSearchParams.get("category");
    const categoryFromUrl = CATEGORIES.includes(categoryFromUrlRaw as ProductCategory)
      ? (categoryFromUrlRaw as ProductCategory)
      : null;

    if (queryFromUrl !== searchText) {
      setSearchText(queryFromUrl);
    }

    if (!hasForcedCategoryScope && categoryFromUrl !== activeCategory) {
      setActiveCategory(categoryFromUrl);
    }
  }, [
    activeCategory,
    hasForcedCategoryScope,
    searchText,
    urlSearchParams,
  ]);

  useEffect(() => {
    if (!isFiltersDrawerOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFiltersDrawerOpen]);

  const scopedProducts = useMemo(() => {
    if (hasForcedCategoryScope) {
      return catalogProducts.filter((product) =>
        forcedCategories.includes(product.category),
      );
    }

    if (!activeCategory) {
      return catalogProducts;
    }

    return catalogProducts.filter((product) => product.category === activeCategory);
  }, [activeCategory, catalogProducts, forcedCategories, hasForcedCategoryScope]);

  const minCatalogPrice = useMemo(() => {
    if (scopedProducts.length === 0) {
      return 0;
    }

    return Math.min(...scopedProducts.map((product) => product.priceRWF));
  }, [scopedProducts]);

  const maxCatalogPrice = useMemo(() => {
    if (scopedProducts.length === 0) {
      return 0;
    }

    return Math.max(...scopedProducts.map((product) => product.priceRWF));
  }, [scopedProducts]);

  useEffect(() => {
    setMinPrice(minCatalogPrice);
    setMaxPrice(maxCatalogPrice);
  }, [maxCatalogPrice, minCatalogPrice]);

  const searchedProducts = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return scopedProducts;
    }

    return scopedProducts.filter((product) => {
      const searchTarget =
        `${product.name} ${product.shortDesc} ${product.category} ${product.brand}`.toLowerCase();
      return searchTarget.includes(query);
    });
  }, [scopedProducts, searchText]);

  const brands = useMemo(() => {
    const pool = searchedProducts.filter((product) => {
      const matchesCondition =
        selectedConditions.length === 0 ||
        selectedConditions.includes(product.condition);
      const matchesAvailability = !onlyInStock || product.inStock;
      const matchesPrice =
        product.priceRWF >= minPrice && product.priceRWF <= maxPrice;

      return matchesCondition && matchesAvailability && matchesPrice;
    });

    const uniqueBrands = new Set(pool.map((product) => product.brand));
    selectedBrands.forEach((brand) => uniqueBrands.add(brand));
    return Array.from(uniqueBrands).sort((a, b) => a.localeCompare(b));
  }, [
    maxPrice,
    minPrice,
    onlyInStock,
    searchedProducts,
    selectedBrands,
    selectedConditions,
  ]);

  const filteredProducts = useMemo(() => {
    const visible = searchedProducts.filter((product) => {
      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesCondition =
        selectedConditions.length === 0 ||
        selectedConditions.includes(product.condition);
      const matchesAvailability = !onlyInStock || product.inStock;
      const matchesPrice =
        product.priceRWF >= minPrice && product.priceRWF <= maxPrice;

      return (
        matchesBrand && matchesCondition && matchesAvailability && matchesPrice
      );
    });

    return visible.sort((left, right) => {
      if (sortBy === "newest") {
        return getProductTimestamp(right) - getProductTimestamp(left);
      }

      if (sortBy === "price-asc") {
        return left.priceRWF - right.priceRWF;
      }

      if (sortBy === "price-desc") {
        return right.priceRWF - left.priceRWF;
      }

      if (left.featured === right.featured) {
        return getProductTimestamp(right) - getProductTimestamp(left);
      }

      return left.featured ? -1 : 1;
    });
  }, [
    maxPrice,
    minPrice,
    onlyInStock,
    searchedProducts,
    selectedBrands,
    selectedConditions,
    sortBy,
  ]);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_BATCH);
    setIsLoadingMore(false);
  }, [
    activeCategory,
    maxPrice,
    minPrice,
    onlyInStock,
    searchText,
    selectedBrands,
    selectedConditions,
    sortBy,
    filteredProducts.length,
  ]);

  const hasMore = visibleCount < filteredProducts.length;

  useEffect(() => {
    const target = sentinelRef.current;

    if (!target || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || isLoadingMore) {
          return;
        }

        setIsLoadingMore(true);
        window.setTimeout(() => {
          setVisibleCount((current) =>
            Math.min(current + ITEMS_PER_BATCH, filteredProducts.length),
          );
          setIsLoadingMore(false);
        }, 220);
      },
      { rootMargin: "280px 0px" },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [filteredProducts.length, hasMore, isLoadingMore]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasPriceFilterApplied =
    minPrice !== minCatalogPrice || maxPrice !== maxCatalogPrice;
  const resultsHeading =
    hasForcedCategoryScope || !activeCategory ? resultLabel : activeCategory;

  const resetFilters = () => {
    setSearchText(initialSearchQuery);
    setActiveCategory(resolvedInitialCategory);
    setSelectedBrands([]);
    setSelectedConditions([]);
    setOnlyInStock(false);
    setSortBy("featured");
    setMinPrice(minCatalogPrice);
    setMaxPrice(maxCatalogPrice);
  };

  const activeChips = [
    searchText.trim()
      ? {
          id: "search",
          label: `Search: ${searchText.trim()}`,
          onRemove: () => setSearchText(""),
        }
      : null,
    !hasForcedCategoryScope && activeCategory
      ? {
          id: "category",
          label: `Category: ${activeCategory}`,
          onRemove: () => setActiveCategory(null),
        }
      : null,
    ...selectedBrands.map((brand) => ({
      id: `brand-${brand}`,
      label: `Brand: ${brand}`,
      onRemove: () =>
        setSelectedBrands((current) => current.filter((item) => item !== brand)),
    })),
    ...selectedConditions.map((condition) => ({
      id: `condition-${condition}`,
      label: `Condition: ${condition}`,
      onRemove: () =>
        setSelectedConditions((current) =>
          current.filter((item) => item !== condition),
        ),
    })),
    onlyInStock
      ? {
          id: "stock",
          label: "In stock only",
          onRemove: () => setOnlyInStock(false),
        }
      : null,
    hasPriceFilterApplied
      ? {
          id: "price",
          label: `${formatPriceRWF(minPrice)} - ${formatPriceRWF(maxPrice)}`,
          onRemove: () => {
            setMinPrice(minCatalogPrice);
            setMaxPrice(maxCatalogPrice);
          },
        }
      : null,
  ].filter((chip): chip is { id: string; label: string; onRemove: () => void } =>
    Boolean(chip),
  );

  const filterControls = (
    <div className="space-y-5">
      <label className="block text-sm text-[#0f172a]">
        Search
        <input
          type="search"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search products"
          className="mt-1.5 w-full rounded-lg border border-[#cbd5e1] bg-white px-3 py-2 text-[#0f172a] placeholder:text-[#64748b]"
        />
      </label>

      {!hasForcedCategoryScope ? (
        <label className="block text-sm text-[#0f172a]">
          Category
          <select
            value={activeCategory ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              setActiveCategory(value ? (value as ProductCategory) : null);
            }}
            className="mt-1.5 w-full rounded-lg border border-[#cbd5e1] bg-white px-3 py-2 text-[#0f172a]"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <fieldset>
        <legend className="text-sm font-medium text-[#0f172a]">Brand</legend>
        <div className="mt-2 max-h-52 space-y-2 overflow-y-auto pr-1">
          {brands.length === 0 ? (
            <p className="text-sm text-[#64748b]">No brands in this result set.</p>
          ) : (
            brands.map((brand) => (
              <label
                key={brand}
                className="flex cursor-pointer items-center gap-2 text-sm text-[#334155]"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() =>
                    setSelectedBrands((current) => toggleOption(current, brand))
                  }
                  className="h-4 w-4 rounded border-[#94a3b8] accent-[#1e3a8a]"
                />
                {brand}
              </label>
            ))
          )}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-[#0f172a]">Condition</legend>
        <div className="mt-2 space-y-2">
          {(["New", "Used"] as const).map((condition) => (
            <label
              key={condition}
              className="flex cursor-pointer items-center gap-2 text-sm text-[#334155]"
            >
              <input
                type="checkbox"
                checked={selectedConditions.includes(condition)}
                onChange={() =>
                  setSelectedConditions((current) =>
                    toggleOption(current, condition),
                  )
                }
                className="h-4 w-4 rounded border-[#94a3b8] accent-[#1e3a8a]"
              />
              {condition}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-[#0f172a]">
        <input
          type="checkbox"
          checked={onlyInStock}
          onChange={(event) => setOnlyInStock(event.target.checked)}
          className="h-4 w-4 rounded border-[#94a3b8] accent-[#1e3a8a]"
        />
        In Stock only
      </label>

      <div className="space-y-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
        <div className="flex items-center justify-between text-sm text-[#334155]">
          <span>{formatPriceRWF(minPrice)}</span>
          <span>{formatPriceRWF(maxPrice)}</span>
        </div>

        <label className="block text-sm text-[#0f172a]">
          Min Price
          <input
            type="range"
            min={minCatalogPrice}
            max={maxCatalogPrice}
            step={PRICE_STEP}
            value={minPrice}
            onChange={(event) => {
              const next = clampPrice(
                Number(event.target.value),
                minCatalogPrice,
                maxCatalogPrice,
              );
              setMinPrice(Math.min(next, maxPrice));
            }}
            className="mt-2 w-full accent-[#1e3a8a]"
          />
        </label>

        <label className="block text-sm text-[#0f172a]">
          Max Price
          <input
            type="range"
            min={minCatalogPrice}
            max={maxCatalogPrice}
            step={PRICE_STEP}
            value={maxPrice}
            onChange={(event) => {
              const next = clampPrice(
                Number(event.target.value),
                minCatalogPrice,
                maxCatalogPrice,
              );
              setMaxPrice(Math.max(next, minPrice));
            }}
            className="mt-2 w-full accent-[#1e3a8a]"
          />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs text-[#475569]">
            Min
            <input
              type="number"
              inputMode="numeric"
              min={minCatalogPrice}
              max={maxCatalogPrice}
              step={PRICE_STEP}
              value={minPrice}
              onChange={(event) => {
                const next = clampPrice(
                  parsePriceInput(event.target.value, minCatalogPrice),
                  minCatalogPrice,
                  maxCatalogPrice,
                );
                setMinPrice(Math.min(next, maxPrice));
              }}
              className="mt-1 w-full rounded-lg border border-[#cbd5e1] bg-white px-2.5 py-2 text-sm text-[#0f172a]"
            />
          </label>

          <label className="text-xs text-[#475569]">
            Max
            <input
              type="number"
              inputMode="numeric"
              min={minCatalogPrice}
              max={maxCatalogPrice}
              step={PRICE_STEP}
              value={maxPrice}
              onChange={(event) => {
                const next = clampPrice(
                  parsePriceInput(event.target.value, maxCatalogPrice),
                  minCatalogPrice,
                  maxCatalogPrice,
                );
                setMaxPrice(Math.max(next, minPrice));
              }}
              className="mt-1 w-full rounded-lg border border-[#cbd5e1] bg-white px-2.5 py-2 text-sm text-[#0f172a]"
            />
          </label>
        </div>
      </div>

      <button
        type="button"
        onClick={resetFilters}
        className="w-full rounded-lg border border-[#cbd5e1] bg-white px-4 py-2 text-sm font-semibold text-[#0f172a]"
      >
        Clear Filters
      </button>
    </div>
  );

  return (
    <>
      <div className="space-y-8">
        <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight text-[#0f172a] md:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#475569]">
            {description}
          </p>
        </section>

        <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
          <aside className="hidden xl:block">
            <div className="sticky top-28 h-fit rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
              {filterControls}
            </div>
          </aside>

          <section>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#334155]">
                {resultsHeading} ({filteredProducts.length})
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFiltersDrawerOpen(true)}
                  className="rounded-lg border border-[#cbd5e1] bg-white px-3 py-2 text-sm text-[#0f172a] xl:hidden"
                >
                  Filters
                </button>
                <label className="text-sm text-[#334155]">
                  Sort
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as SortValue)}
                    className="ml-2 rounded-lg border border-[#cbd5e1] bg-white px-3 py-2 text-sm text-[#0f172a]"
                  >
                    {SHOP_SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {activeChips.length > 0 ? (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {activeChips.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={chip.onRemove}
                    className="rounded-full border border-[#cbd5e1] bg-white px-3 py-1 text-xs font-medium text-[#334155]"
                  >
                    {chip.label} ×
                  </button>
                ))}
                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-full border border-[#1e3a8a] bg-[#eff6ff] px-3 py-1 text-xs font-semibold text-[#1e3a8a]"
                >
                  Clear all
                </button>
              </div>
            ) : null}

            {visibleProducts.length === 0 ? (
              <div className="rounded-xl border border-[#e2e8f0] bg-white p-8 text-center">
                <p className="text-[#0f172a]">No products match your filters.</p>
                <p className="mt-2 text-sm text-[#64748b]">
                  Adjust the filters and try again.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {isLoadingMore ? (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white"
                  >
                    <div className="h-52 bg-[#f1f5f9]" />
                    <div className="space-y-2 p-5">
                      <div className="h-4 rounded bg-[#e2e8f0]" />
                      <div className="h-4 w-2/3 rounded bg-[#cbd5e1]" />
                      <div className="h-10 rounded bg-[#e2e8f0]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <p className="mt-5 text-sm text-[#475569]">
              Showing {visibleProducts.length} of {filteredProducts.length} products
            </p>
            <div ref={sentinelRef} aria-hidden="true" className="h-1" />
          </section>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[70] xl:hidden ${
          isFiltersDrawerOpen ? "" : "pointer-events-none"
        }`}
        aria-hidden={!isFiltersDrawerOpen}
      >
        <button
          type="button"
          aria-label="Close filters"
          onClick={() => setIsFiltersDrawerOpen(false)}
          className={`absolute inset-0 bg-[#05070c]/75 transition-opacity duration-300 ${
            isFiltersDrawerOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute top-0 left-0 h-full w-[86%] max-w-sm overflow-y-auto border-r border-[#e2e8f0] bg-white p-5 shadow-2xl transition-transform duration-300 ${
            isFiltersDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0f172a]">Filters</h2>
            <button
              type="button"
              onClick={() => setIsFiltersDrawerOpen(false)}
              className="rounded-md border border-[#cbd5e1] px-2.5 py-1 text-sm text-[#334155]"
            >
              Close
            </button>
          </div>

          {filterControls}

          <button
            type="button"
            onClick={() => setIsFiltersDrawerOpen(false)}
            className="btn-primary-glow mt-5 w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
          >
            Apply Filters
          </button>
        </aside>
      </div>
    </>
  );
}
