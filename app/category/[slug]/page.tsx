import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  CATEGORY_NAV_ITEMS,
  getCategoryNavItem,
} from "@/lib/constants/catalog";
import { STORE_NAME, STORE_URL } from "@/lib/constants/store";
import { getProductsByCategory } from "@/lib/sanityClient";
import { ShopClient } from "@/components/shop/shop-client";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  return CATEGORY_NAV_ITEMS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getCategoryNavItem(slug);

  if (!item) {
    return {
      title: "Category Not Found",
      description: "The requested category does not exist.",
    };
  }

  return {
    title: `${item.label} Collection`,
    description: `Browse ${item.label.toLowerCase()} products available on ${STORE_NAME}.`,
    alternates: {
      canonical: `${STORE_URL}/category/${item.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const item = getCategoryNavItem(slug);

  if (!item) {
    notFound();
  }

  const categoryProducts = await getProductsByCategory(slug);

  return (
    <Suspense fallback={<div className="h-24" />}>
      <ShopClient
        initialProducts={categoryProducts}
        title={`${item.label} Collection`}
        description={`Filter ${item.label.toLowerCase()} products by brand, condition, stock status, and price.`}
        resultLabel={item.label}
        forcedCategories={item.categories}
      />
    </Suspense>
  );
}
