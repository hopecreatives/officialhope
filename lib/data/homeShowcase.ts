// Centralized homepage showcase media. Replace these URLs with your final assets/CDN links.
export const HOME_HERO_SLIDES = [
  {
    id: "hero-camera",
    badge: "NEW",
    title: "Sony A7 III",
    tagline:
      "Capture cinematic detail and low-light confidence with full-frame performance.",
    image:
      "https://images.unsplash.com/photo-1516724562728-afc824a36e84?auto=format&fit=crop&w=2000&q=80",
    imageAlt: "Mirrorless camera on a dark studio setup",
    productSlug: "sony-a7-iii",
    shopHref: "/shop?category=Cameras",
  },
  {
    id: "hero-macbook",
    badge: "PRO",
    title: "MacBook Pro 14-inch M3 Pro",
    tagline:
      "Edit faster, render smoothly, and deliver polished work from anywhere.",
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=2000&q=80",
    imageAlt: "MacBook Pro laptop angled on a desk",
    productSlug: "macbook-pro-14-m3-pro",
    shopHref: "/shop?category=MacBook",
  },
  {
    id: "hero-iphone",
    badge: "HOT",
    title: "iPhone 15 Pro",
    tagline:
      "Flagship speed and pro camera tools in a compact premium build.",
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=2000&q=80",
    imageAlt: "Modern smartphone product shot on a clean background",
    productSlug: "iphone-15-pro",
    shopHref: "/shop?category=iPhone",
  },
] as const;

export interface HomeCategoryStripItem {
  label: string;
  slug: string;
  href: string;
  image: string;
}

// Default category tiles. These are used when Sanity category content is unavailable.
export const HOME_CATEGORY_STRIP: HomeCategoryStripItem[] = [
  {
    label: "Cameras",
    slug: "camera",
    href: "/category/camera",
    image:
      "https://d1ncau8tqf99kp.cloudfront.net/converted/123620_original_local_1200x1050_v3_converted.webp",
  },
  {
    label: "Lenses",
    slug: "lens",
    href: "/category/lens",
    image:
      "https://d1ncau8tqf99kp.cloudfront.net/converted/102462_original_local_1200x1050_v3_converted.webp",
  },
  {
    label: "Gimbals",
    slug: "gimbal",
    href: "/category/gimbal",
    image:
      "https://www-cdn.djiits.com/dps/5a29049b90bd230d576cd68a505fabf6.jpg",
  },
  {
    label: "Lighting",
    slug: "lighting",
    href: "/category/lighting",
    image:
      "https://cdn.sanity.io/images/sv8q1vrl/production/2e75f8ca5e6e5f8972da0db29476631efe5487d4-3420x1902.png?w=1200",
  },
  {
    label: "Tripods",
    slug: "tripods",
    href: "/category/tripods",
    image:
      "https://www.ulanzi.com/cdn/shop/files/266_d7298778-9d75-4556-a50c-f3959b54bbec.png?height=628&pad_color=fff&v=1700036633&width=1200",
  },
  {
    label: "Recorders",
    slug: "recorder",
    href: "/category/recorder",
    image:
      "https://zoomcorp.com/media/original_images/H6e_listImg_1.png.1200x630_q80_crop-smart_focal_area-752%2C768%2C1505%2C1536_size_canvas_upscale.png",
  },
  {
    label: "MacBook",
    slug: "macbook",
    href: "/category/macbook",
    image:
      "https://www.apple.com/v/macbook-air/x/images/meta/macbook_air_mx__ez5y0k5yy7au_og.png?202602101114",
  },
  {
    label: "iPhone",
    slug: "iphone",
    href: "/category/iphone",
    image:
      "https://www.apple.com/v/iphone/home/ci/images/meta/iphone__cud4q04omsuq_og.png?202602092056",
  },
];
