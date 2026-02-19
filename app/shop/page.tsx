import type { Metadata } from "next";
import { ShopClient } from "@/components/shop/shop-client";
import { CATEGORIES } from "@/lib/constants/catalog";
import { STORE_NAME, STORE_URL } from "@/lib/constants/store";
import { getAllProducts } from "@/lib/sanityClient";
import type { ProductCategory } from "@/types/product";

export const metadata: Metadata = {
  title: "Shop",
  description:
    `Browse ${STORE_NAME} products by category, price, brand, and condition with fast filtering.`,
  alternates: {
    canonical: `${STORE_URL}/shop`,
  },
};

export const revalidate = 60;

interface ShopPageProps {
  searchParams: Promise<{
    q?: string | string[];
    category?: string | string[];
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const products = await getAllProducts();
  const searchQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const categoryParam = Array.isArray(params.category)
    ? params.category[0]
    : params.category;
  const initialCategory = CATEGORIES.includes(categoryParam as ProductCategory)
    ? (categoryParam as ProductCategory)
    : null;

  return (
    <ShopClient
      initialProducts={products}
      title="Shop Camera Gear & Electronics"
      description="Refine the catalog by brand, condition, availability, and price to find the right gear quickly."
      resultLabel="All Products"
      initialSearchQuery={searchQuery ?? ""}
      initialCategory={initialCategory}
    />
  );
}
