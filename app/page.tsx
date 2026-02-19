import { CategoryImageStrip } from "@/components/home/category-image-strip";
import { HomeHeroSlider } from "@/components/home/home-hero-slider";
import { ProductCard } from "@/components/ui/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAllProducts, getHomeCategories } from "@/lib/sanityClient";
import {
  STORE_EMAIL,
  STORE_NAME,
  STORE_PHONE_LOCAL,
  STORE_URL,
} from "@/lib/constants/store";
import type { Product } from "@/types/product";

const getProductTimestamp = (product: Product) => {
  const parsedDate = product.createdAt ? Date.parse(product.createdAt) : Number.NaN;
  if (Number.isFinite(parsedDate)) {
    return parsedDate;
  }

  return product.id;
};

export const revalidate = 60;

export default async function HomePage() {
  const products = await getAllProducts();
  const categoryStripItems = await getHomeCategories();
  const featuredProducts = products.filter((product) => product.featured).slice(0, 8);
  const newListings = [...products]
    .sort((left, right) => getProductTimestamp(right) - getProductTimestamp(left))
    .slice(0, 12);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: STORE_NAME,
    url: STORE_URL,
    telephone: STORE_PHONE_LOCAL,
    email: STORE_EMAIL,
    sameAs: [STORE_URL],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="space-y-14">
        <h1 className="sr-only">{STORE_NAME} camera gear and electronics storefront</h1>
        <HomeHeroSlider products={products} />

        <section>
          <CategoryImageStrip items={categoryStripItems} />
        </section>

        <section>
          <SectionHeading
            title="New Listings"
            subtitle="Latest arrivals across cameras, accessories, and Apple devices."
          />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {newListings.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            title="Featured Products"
            subtitle="Top picks from cameras, audio, stabilization, and Apple devices."
          />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
