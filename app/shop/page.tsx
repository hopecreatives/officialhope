import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopClient } from "@/components/shop/shop-client";
import { STORE_NAME, STORE_URL } from "@/lib/constants/store";
import { getAllProducts } from "@/lib/sanityClient";

export const metadata: Metadata = {
  title: "Shop",
  description:
    `Browse ${STORE_NAME} products by category, price, brand, and condition with fast filtering.`,
  alternates: {
    canonical: `${STORE_URL}/shop`,
  },
};

export const revalidate = 60;

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <Suspense fallback={<div className="h-24" />}>
      <ShopClient
        initialProducts={products}
        title="Shop Camera Gear & Electronics"
        description="Refine the catalog by brand, condition, availability, and price to find the right gear quickly."
        resultLabel="All Products"
      />
    </Suspense>
  );
}
