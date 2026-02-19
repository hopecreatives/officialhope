import Link from "next/link";
import { ProductImage } from "@/components/ui/product-image";
import { FALLBACK_PRODUCT_IMAGE } from "@/lib/data/productImages";
import { formatPriceRWF } from "@/lib/utils/format";
import { createProductWhatsAppBuyLink } from "@/lib/utils/whatsapp";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const productImages =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [FALLBACK_PRODUCT_IMAGE];
  const condition = product.condition ?? "New";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-sm">
      <Link href={`/product/${product.slug}`} className="block">
        <ProductImage
          src={productImages[0]}
          alt={product.name}
          width={900}
          height={680}
          className="h-52 w-full bg-white object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="rounded-md border border-[#dbeafe] bg-[#eff6ff] px-2 py-1 text-xs font-medium text-[#1e3a8a]">
            {product.category}
          </span>
          <span
            className={`rounded-md border px-2 py-1 text-xs font-medium ${
              product.inStock
                ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
                : "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]"
            }`}
          >
            {product.inStock ? "In stock" : "Out of stock"}
          </span>
        </div>

        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 text-base font-semibold text-[#0f172a]">
            {product.name}
          </h3>
        </Link>

        <p className="mt-2 text-xl font-bold tracking-tight text-[#0f172a]">
          {formatPriceRWF(product.priceRWF)}
        </p>

        <p className="mt-1 text-xs text-[#475569]">
          {product.brand} • {condition}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href={`/product/${product.slug}`}
            className="inline-flex items-center justify-center rounded-md border border-[#cbd5e1] px-3 py-2 text-sm font-medium text-[#1f2937]"
          >
            View
          </Link>
          <a
            href={createProductWhatsAppBuyLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-[#1e3a8a] px-3 py-2 text-sm font-semibold text-white"
          >
            Buy via WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
