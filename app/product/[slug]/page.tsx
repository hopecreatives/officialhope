import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyLinkButton } from "@/components/product/copy-link-button";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductCard } from "@/components/ui/product-card";
import { FALLBACK_PRODUCT_IMAGE } from "@/lib/data/productImages";
import { getAllProducts, getProductBySlug } from "@/lib/sanityClient";
import { formatPriceRWF } from "@/lib/utils/format";
import {
  createProductQuestionLink,
  createProductWhatsAppBuyLink,
  getProductPageUrl,
} from "@/lib/utils/whatsapp";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "Requested product was not found.",
    };
  }

  const productUrl = getProductPageUrl(product.slug);
  const productImages =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [FALLBACK_PRODUCT_IMAGE];

  return {
    title: product.name,
    description: product.shortDesc,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: product.name,
      description: product.shortDesc,
      url: productUrl,
      type: "website",
      images: [
        {
          url: productImages[0],
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getAllProducts();
  const productSpecs = Array.isArray(product.specs) ? product.specs : [];
  const productImages =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [FALLBACK_PRODUCT_IMAGE];
  const relatedProducts = allProducts
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4);

  const productUrl = getProductPageUrl(product.slug);
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: productImages,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "RWF",
      price: product.priceRWF,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: productUrl,
    },
  };
  const trustBadges = [
    "Verified product source",
    "Fast Kigali delivery",
    "After-sales support",
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="space-y-10">
        <nav className="text-sm text-[#64748b]">
          <Link href="/shop" className="transition hover:text-[#1e3a8a]">
            Shop
          </Link>
          <span className="px-2">/</span>
          <span className="text-[#0f172a]">{product.name}</span>
        </nav>

        <section className="grid gap-8 lg:grid-cols-2">
          <ProductGallery name={product.name} images={productImages} />

          <div>
            <p className="text-sm text-[#64748b]">
              {product.category} • {product.brand} • {product.condition}
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-[#0f172a] md:text-4xl">{product.name}</h1>
            <p className="mt-3 text-2xl font-semibold text-[#0f172a]">
              {formatPriceRWF(product.priceRWF)}
            </p>

            <p
              className={`mt-3 inline-flex rounded-full border px-3 py-1 text-sm ${
                product.inStock
                  ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
                  : "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]"
              }`}
            >
              {product.inStock ? "Available now" : "Currently out of stock"}
            </p>

            <p className="mt-5 text-sm leading-7 text-[#475569]">{product.description}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={createProductWhatsAppBuyLink(product)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-glow rounded-xl px-5 py-3 text-sm font-semibold text-white"
              >
                Buy on WhatsApp
              </a>
              <a
                href={createProductQuestionLink(product)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-[#cbd5e1] bg-white px-5 py-3 text-sm font-semibold text-[#334155] transition hover:border-[#1e3a8a] hover:text-[#1e3a8a]"
              >
                Ask a Question
              </a>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {trustBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-[#dbeafe] bg-[#eff6ff] px-3 py-1 text-xs font-medium text-[#1e3a8a]"
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-4">
              <CopyLinkButton link={productUrl} />
            </div>

            <section className="mt-8 rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-[#0f172a]">Specifications</h2>
              <table className="mt-3 w-full text-sm">
                <tbody>
                  {productSpecs.map((spec) => (
                    <tr key={spec.label} className="border-t border-[#e2e8f0]">
                      <th className="w-1/3 py-3 text-left font-medium text-[#334155]">{spec.label}</th>
                      <td className="py-3 text-[#0f172a]">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#0f172a]">Related Products</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
