"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ProductImage } from "@/components/ui/product-image";
import { FALLBACK_PRODUCT_IMAGE } from "@/lib/data/productImages";
import { HOME_HERO_SLIDES } from "@/lib/data/homeShowcase";
import { formatPriceRWF } from "@/lib/utils/format";
import { createProductWhatsAppBuyLink } from "@/lib/utils/whatsapp";
import type { Product } from "@/types/product";

const PARTICLES = [
  { left: "7%", top: "24%", size: 140, delay: "0s", duration: "14s" },
  { left: "20%", top: "72%", size: 90, delay: "1.5s", duration: "11s" },
  { left: "35%", top: "16%", size: 120, delay: "0.8s", duration: "16s" },
  { left: "48%", top: "58%", size: 70, delay: "2.2s", duration: "10s" },
  { left: "63%", top: "22%", size: 110, delay: "1.2s", duration: "13s" },
  { left: "76%", top: "74%", size: 100, delay: "0.4s", duration: "15s" },
  { left: "88%", top: "28%", size: 130, delay: "2.6s", duration: "12s" },
] as const;

const TRUST_BADGES = [
  "12-Month Warranty",
  "Trusted Local Seller",
  "Fast Kigali Delivery",
] as const;

interface HomeHeroSliderProps {
  products: Product[];
}

interface HeroSlideResolved {
  id: string;
  badge: string;
  title: string;
  tagline: string;
  shopHref: string;
  image?: string;
  imageAlt?: string;
  product: Product;
}

export function HomeHeroSlider({ products }: HomeHeroSliderProps) {
  const slides = useMemo<HeroSlideResolved[]>(
    () =>
      HOME_HERO_SLIDES.reduce<HeroSlideResolved[]>((accumulator, slide) => {
        const product = products.find(
          (candidate) => candidate.slug === slide.productSlug,
        );

        if (!product) {
          return accumulator;
        }

        accumulator.push({
          id: slide.id,
          badge: slide.badge,
          title: slide.title,
          tagline: slide.tagline,
          image: slide.image,
          imageAlt: slide.imageAlt,
          shopHref: slide.shopHref,
          product,
        });

        return accumulator;
      }, []),
    [products],
  );

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-[#283240]">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f1115] via-[#101727] to-[#0b2a4a]" />
      <div className="absolute inset-0 opacity-70">
        <div className="hero-glow hero-glow-left" />
        <div className="hero-glow hero-glow-right" />
        {PARTICLES.map((particle, index) => (
          <span
            key={`${particle.left}-${index}`}
            className="hero-particle"
            style={{
              left: particle.left,
              top: particle.top,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
            aria-hidden="true"
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-7 md:py-10">
        <div className="relative min-h-[510px] md:min-h-[560px]">
          {slides.map((slide, index) => {
            const isActive = index === activeSlide;
            const productImages =
              Array.isArray(slide.product.images) && slide.product.images.length > 0
                ? slide.product.images
                : [FALLBACK_PRODUCT_IMAGE];
            const heroImage = slide.image ?? productImages[0] ?? FALLBACK_PRODUCT_IMAGE;
            const heroImageAlt = slide.imageAlt ?? slide.product.name;

            return (
              <article
                key={slide.id}
                className={`absolute inset-0 grid items-center gap-8 md:grid-cols-[1fr_1.12fr] ${
                  isActive ? "opacity-100" : "pointer-events-none opacity-0"
                } transition-opacity duration-700`}
                aria-hidden={!isActive}
              >
                <div className="z-10 max-w-xl rounded-2xl border border-[#344258] bg-[#0f1722]/70 p-6 shadow-xl backdrop-blur md:p-8">
                  <span className="inline-flex rounded-full border border-[#6a81a1] bg-[#0f2134] px-3 py-1 text-xs font-semibold tracking-[0.18em] text-[#d6e7f8]">
                    {slide.badge}
                  </span>

                  <h2 className="mt-4 text-3xl font-bold leading-tight text-white md:text-5xl">
                    {slide.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[#c4d4e5] md:text-base">
                    {slide.tagline}
                  </p>
                  <p className="mt-4 text-lg font-semibold text-[#e4edf8]">
                    {formatPriceRWF(slide.product.priceRWF)}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={slide.shopHref}
                      className="btn-primary-glow rounded-xl px-6 py-3 text-sm font-semibold text-white"
                    >
                      Shop Now
                    </Link>
                    <a
                      href={createProductWhatsAppBuyLink(slide.product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-[#637996] bg-[#121d2a] px-6 py-3 text-sm font-semibold text-[#e1ecf7] transition hover:border-[#88a2c4] hover:text-white"
                    >
                      Buy via WhatsApp
                    </a>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {TRUST_BADGES.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full border border-[#3b4d64] bg-[#111b29] px-3 py-1 text-xs font-medium text-[#d2e2f3]"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-[#324056] bg-[#111c2a] shadow-[0_0_75px_rgba(26,68,115,0.28)]">
                  <ProductImage
                    src={heroImage}
                    alt={heroImageAlt}
                    width={1600}
                    height={1200}
                    priority={index === 0}
                    className="h-[260px] w-full bg-white object-cover md:h-[520px]"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0f1115] to-transparent" />
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-3 flex justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveSlide(index)}
              className={`h-2.5 w-8 rounded-full transition ${
                index === activeSlide
                  ? "bg-[#8eb6de]"
                  : "bg-[#5c6f84] hover:bg-[#7490ad]"
              }`}
              aria-label={`Show featured slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
