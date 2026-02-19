export const FALLBACK_PRODUCT_IMAGE = "/products/fallback-product.jpg";

const PRODUCT_SLUG_ALIASES: Record<string, string> = {
  "sony-a7iii": "sony-a7-iii",
  "canon-r6": "canon-eos-r6",
  "nikon-z6ii": "nikon-z6-ii",
  "dji-rs4-mini": "dji-rs-4-mini",
  "dji-rs-4mini": "dji-rs-4-mini",
  "macbook-air-m-2": "macbook-air-m2",
  "iphone15-pro": "iphone-15-pro",
};

export const PRODUCT_IMAGE_MAP: Record<string, string[]> = {
  "sony-a7-iii": [
    "/products/sony-a7iii.jpg", // Replace this with official product image
    "/products/sony-a7iii-back.jpg", // Replace this with official product image
    "/products/sony-a7iii-side.jpg", // Replace this with official product image
  ],
  "canon-eos-r6": [
    "/products/canon-r6.jpg", // Replace this with official product image
    "/products/canon-r6-back.jpg", // Replace this with official product image
    "/products/canon-r6-side.jpg", // Replace this with official product image
  ],
  "nikon-z6-ii": [
    "/products/nikon-z6ii.jpg", // Replace this with official product image
    "/products/nikon-z6ii-back.jpg", // Replace this with official product image
    "/products/nikon-z6ii-side.jpg", // Replace this with official product image
  ],
  "dji-rs-4-mini": [
    "/products/dji-rs4-mini.jpg", // Replace this with official product image
    "/products/dji-rs4-mini-folded.jpg", // Replace this with official product image
    "/products/dji-rs4-mini-side.jpg", // Replace this with official product image
  ],
  "macbook-air-m2": [
    "/products/macbook-air-m2.jpg", // Replace this with official product image
    "/products/macbook-air-m2-open.jpg", // Replace this with official product image
    "/products/macbook-air-m2-side.jpg", // Replace this with official product image
  ],
  "iphone-15-pro": [
    "/products/iphone-15-pro.jpg", // Replace this with official product image
    "/products/iphone-15-pro-back.jpg", // Replace this with official product image
    "/products/iphone-15-pro-side.jpg", // Replace this with official product image
  ],
  "sony-fe-24-70-gm-ii": [
    "/products/sony-fe-24-70-gm-ii.jpg",
    "/products/sony-fe-24-70-gm-ii-angle.jpg",
    "/products/sony-fe-24-70-gm-ii-detail.jpg",
  ],
  "canon-rf-50mm-f1-8": [
    "/products/canon-rf-50mm-f1-8.jpg",
    "/products/canon-rf-50mm-f1-8-angle.jpg",
    "/products/canon-rf-50mm-f1-8-detail.jpg",
  ],
  "nikon-z-70-200-f2-8-vr-s": [
    "/products/nikon-z-70-200-f2-8-vr-s.jpg",
    "/products/nikon-z-70-200-f2-8-vr-s-angle.jpg",
    "/products/nikon-z-70-200-f2-8-vr-s-detail.jpg",
  ],
  "zhiyun-weebill-s": [
    "/products/zhiyun-weebill-s.jpg",
    "/products/zhiyun-weebill-s-angle.jpg",
    "/products/zhiyun-weebill-s-detail.jpg",
  ],
  "dji-osmo-mobile-6": [
    "/products/dji-osmo-mobile-6.jpg",
    "/products/dji-osmo-mobile-6-angle.jpg",
    "/products/dji-osmo-mobile-6-detail.jpg",
  ],
  "godox-sl60w-led-light": [
    "/products/godox-sl60w-led-light.jpg",
    "/products/godox-sl60w-led-light-angle.jpg",
    "/products/godox-sl60w-led-light-detail.jpg",
  ],
  "aputure-amaran-200x-s": [
    "/products/aputure-amaran-200x-s.jpg",
    "/products/aputure-amaran-200x-s-angle.jpg",
    "/products/aputure-amaran-200x-s-detail.jpg",
  ],
  "nanlite-forza-60b-ii": [
    "/products/nanlite-forza-60b-ii.jpg",
    "/products/nanlite-forza-60b-ii-angle.jpg",
    "/products/nanlite-forza-60b-ii-detail.jpg",
  ],
  "manfrotto-befree-live-tripod": [
    "/products/manfrotto-befree-live-tripod.jpg",
    "/products/manfrotto-befree-live-tripod-angle.jpg",
    "/products/manfrotto-befree-live-tripod-detail.jpg",
  ],
  "neewer-c-stand-kit": [
    "/products/neewer-c-stand-kit.jpg",
    "/products/neewer-c-stand-kit-angle.jpg",
    "/products/neewer-c-stand-kit-detail.jpg",
  ],
  "kf-concept-heavy-duty-light-stand": [
    "/products/kf-concept-heavy-duty-light-stand.jpg",
    "/products/kf-concept-heavy-duty-light-stand-angle.jpg",
    "/products/kf-concept-heavy-duty-light-stand-detail.jpg",
  ],
  "zoom-h6-essential-recorder": [
    "/products/zoom-h6-essential-recorder.jpg",
    "/products/zoom-h6-essential-recorder-angle.jpg",
    "/products/zoom-h6-essential-recorder-detail.jpg",
  ],
  "rode-wireless-go-ii": [
    "/products/rode-wireless-go-ii.jpg",
    "/products/rode-wireless-go-ii-angle.jpg",
    "/products/rode-wireless-go-ii-detail.jpg",
  ],
  "tascam-dr-40x": [
    "/products/tascam-dr-40x.jpg",
    "/products/tascam-dr-40x-angle.jpg",
    "/products/tascam-dr-40x-detail.jpg",
  ],
  "macbook-pro-14-m3-pro": [
    "/products/macbook-pro-14-m3-pro.jpg",
    "/products/macbook-pro-14-m3-pro-open.jpg",
    "/products/macbook-pro-14-m3-pro-side.jpg",
  ],
  "macbook-pro-16-m2-max": [
    "/products/macbook-pro-16-m2-max.jpg",
    "/products/macbook-pro-16-m2-max-open.jpg",
    "/products/macbook-pro-16-m2-max-side.jpg",
  ],
  "iphone-14-128gb": [
    "/products/iphone-14-128gb.jpg",
    "/products/iphone-14-128gb-back.jpg",
    "/products/iphone-14-128gb-side.jpg",
  ],
  "iphone-13-pro-256gb": [
    "/products/iphone-13-pro-256gb.jpg",
    "/products/iphone-13-pro-256gb-back.jpg",
    "/products/iphone-13-pro-256gb-side.jpg",
  ],
};

const normalizeSlug = (slug: string) =>
  slug
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

export const getCanonicalProductSlug = (slug: string) => {
  const normalizedSlug = normalizeSlug(slug);
  return PRODUCT_SLUG_ALIASES[normalizedSlug] ?? normalizedSlug;
};

export const getKnownProductImages = (slug: string): string[] | null => {
  const canonicalSlug = getCanonicalProductSlug(slug);
  const images = PRODUCT_IMAGE_MAP[canonicalSlug];
  if (!images || images.length === 0) {
    return null;
  }

  return images;
};

export const getProductImages = (slug: string) => {
  const images = getKnownProductImages(slug);
  if (!images) {
    return [FALLBACK_PRODUCT_IMAGE, FALLBACK_PRODUCT_IMAGE, FALLBACK_PRODUCT_IMAGE];
  }

  return images;
};
