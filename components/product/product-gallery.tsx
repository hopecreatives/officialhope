"use client";

import { useState } from "react";
import { ProductImage } from "@/components/ui/product-image";
import { FALLBACK_PRODUCT_IMAGE } from "@/lib/data/productImages";

interface ProductGalleryProps {
  name: string;
  images: string[];
}

export function ProductGallery({ name, images }: ProductGalleryProps) {
  const galleryImages =
    Array.isArray(images) && images.length > 0 ? images : [FALLBACK_PRODUCT_IMAGE];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = galleryImages[Math.min(activeIndex, galleryImages.length - 1)];

  return (
    <section aria-label="Product image gallery">
      <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
        <ProductImage
          src={activeImage}
          alt={`${name} image ${activeIndex + 1}`}
          width={1200}
          height={900}
          className="h-[320px] w-full bg-white object-cover md:h-[520px]"
          priority
        />
      </div>

      <div className="mt-3 grid grid-cols-4 gap-3">
        {galleryImages.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`overflow-hidden rounded-lg border ${
              index === activeIndex
                ? "border-[#67a5df] ring-1 ring-[#67a5df]"
                : "border-[#cbd5e1] hover:border-[#1e3a8a]"
            }`}
            aria-label={`Select image ${index + 1}`}
          >
            <ProductImage
              src={image}
              alt={`${name} thumbnail ${index + 1}`}
              width={320}
              height={220}
              className="h-20 w-full bg-white object-cover"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
