import type { ProductCategory } from "@/types/product";

export const CATEGORIES: ProductCategory[] = [
  "Cameras",
  "Lenses",
  "Gimbals",
  "Lights",
  "Tripods",
  "Recorders",
  "Laptop",
  "MacBook",
  "iPhone",
];

export type SanityProductCategory =
  | "camera"
  | "lens"
  | "lighting"
  | "gimbal"
  | "tripod"
  | "stand"
  | "recorder"
  | "laptop"
  | "macbook"
  | "iphone";

export type SanityProductCondition = "new" | "used";

export const SANITY_CATEGORY_LABELS: Record<SanityProductCategory, ProductCategory> = {
  camera: "Cameras",
  lens: "Lenses",
  lighting: "Lights",
  gimbal: "Gimbals",
  tripod: "Tripods",
  stand: "Tripods",
  recorder: "Recorders",
  laptop: "Laptop",
  macbook: "MacBook",
  iphone: "iPhone",
};

export const SANITY_CONDITION_LABELS: Record<SanityProductCondition, "New" | "Used"> = {
  new: "New",
  used: "Used",
};

export const CATEGORY_NAV_ITEMS = [
  {
    label: "Camera",
    slug: "camera",
    categories: ["Cameras"],
    sanityCategories: ["camera"],
  },
  {
    label: "Lens",
    slug: "lens",
    categories: ["Lenses"],
    sanityCategories: ["lens"],
  },
  {
    label: "Lighting",
    slug: "lighting",
    categories: ["Lights"],
    sanityCategories: ["lighting"],
  },
  {
    label: "Gimbal",
    slug: "gimbal",
    categories: ["Gimbals"],
    sanityCategories: ["gimbal"],
  },
  {
    label: "Tripods",
    slug: "tripods",
    categories: ["Tripods"],
    sanityCategories: ["tripod", "stand"],
  },
  {
    label: "Recorder",
    slug: "recorder",
    categories: ["Recorders"],
    sanityCategories: ["recorder"],
  },
  {
    label: "Laptop",
    slug: "laptop",
    categories: ["Laptop"],
    sanityCategories: ["laptop"],
  },
  {
    label: "MacBook",
    slug: "macbook",
    categories: ["MacBook"],
    sanityCategories: ["macbook"],
  },
  {
    label: "iPhone",
    slug: "iphone",
    categories: ["iPhone"],
    sanityCategories: ["iphone"],
  },
] as const satisfies ReadonlyArray<{
  label: string;
  slug: string;
  categories: ProductCategory[];
  sanityCategories: SanityProductCategory[];
}>;

export const SHOP_SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
] as const;

export const getCategoryNavItem = (slug: string) =>
  CATEGORY_NAV_ITEMS.find((item) => item.slug === slug) ?? null;

export const getCategoryNavCategories = (slug: string): ProductCategory[] => {
  const item = getCategoryNavItem(slug);
  return item ? [...item.categories] : [];
};

export const getSanityCategoryValuesForSlug = (
  slug: string,
): SanityProductCategory[] => {
  const item = getCategoryNavItem(slug);
  return item ? [...item.sanityCategories] : [];
};
