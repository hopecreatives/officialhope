"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { FALLBACK_PRODUCT_IMAGE } from "@/lib/data/productImages";

type ProductImageProps = Omit<ImageProps, "src"> & {
  src: string;
  fallbackSrc?: string;
};

export function ProductImage({
  src,
  alt,
  fallbackSrc = FALLBACK_PRODUCT_IMAGE,
  ...props
}: ProductImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}
