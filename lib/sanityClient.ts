import "server-only";

import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import {
  getCategoryNavCategories,
  getSanityCategoryValuesForSlug,
  SANITY_CATEGORY_LABELS,
  SANITY_CONDITION_LABELS,
  type SanityProductCategory,
  type SanityProductCondition,
} from "@/lib/constants/catalog";
import {
  HOME_CATEGORY_STRIP,
  type HomeCategoryStripItem,
} from "@/lib/data/homeShowcase";
import { products as fallbackProducts } from "@/lib/data/products";
import { FALLBACK_PRODUCT_IMAGE } from "@/lib/data/productImages";
import type { Product } from "@/types/product";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const apiVersion = process.env.SANITY_API_VERSION;

const isPlaceholderProjectId =
  projectId === "your-project-id" || projectId === "your_project_id";
const projectIdIsValid = Boolean(
  projectId && /^[a-z0-9-]+$/.test(projectId) && !isPlaceholderProjectId,
);
const datasetIsValid = Boolean(dataset && /^[a-z0-9_-]+$/.test(dataset));
const apiVersionIsValid = Boolean(
  apiVersion && /^\d{4}-\d{2}-\d{2}$/.test(apiVersion),
);

const hasSanityConfig = projectIdIsValid && datasetIsValid && apiVersionIsValid;

const client = hasSanityConfig
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
    })
  : null;

const imageBuilder = client ? createImageUrlBuilder(client) : null;

const PRODUCT_PROJECTION = `{
  _id,
  _createdAt,
  name,
  "slug": slug.current,
  category,
  brand,
  condition,
  priceRWF,
  inStock,
  featured,
  shortDesc,
  description,
  specs,
  images[]{
    ...,
    alt
  }
}`;

const ALL_PRODUCTS_QUERY = `*[_type == "product" && defined(slug.current)] | order(_createdAt desc) ${PRODUCT_PROJECTION}`;
const PRODUCTS_BY_CATEGORY_QUERY = `*[_type == "product" && defined(slug.current) && category in $categories] | order(_createdAt desc) ${PRODUCT_PROJECTION}`;
const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0] ${PRODUCT_PROJECTION}`;
const CATEGORY_PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  order,
  image{
    ...,
    alt
  }
}`;
const ALL_CATEGORIES_QUERY = `*[_type == "category" && defined(slug.current)] | order(order asc, _createdAt asc) ${CATEGORY_PROJECTION}`;

export const SANITY_REVALIDATE_SECONDS = 60;

interface SanityProductImage {
  _type: "image";
  alt?: string;
  asset?: {
    _type: "reference";
    _ref: string;
  };
}

interface SanityProductDocument {
  _id: string;
  _createdAt: string;
  name: string;
  slug: string;
  category: SanityProductCategory;
  brand: string;
  condition: SanityProductCondition;
  priceRWF: number;
  inStock: boolean;
  featured: boolean;
  shortDesc: string;
  description: string;
  specs?: string[] | null;
  images?: SanityProductImage[] | null;
}

interface SanityCategoryDocument {
  _id: string;
  title?: string | null;
  slug?: string | null;
  order?: number | null;
  image?: SanityProductImage | null;
}

const CATEGORY_ROUTE_ALIAS: Record<string, string> = {
  camera: "camera",
  cameras: "camera",
  lens: "lens",
  lenses: "lens",
  lighting: "lighting",
  light: "lighting",
  lights: "lighting",
  gimbal: "gimbal",
  gimbals: "gimbal",
  tripod: "tripods",
  tripods: "tripods",
  stand: "tripods",
  stands: "tripods",
  recorder: "recorder",
  recorders: "recorder",
  laptop: "laptop",
  macbook: "macbook",
  iphone: "iphone",
};

const CATEGORY_LABEL_BY_ROUTE: Record<string, string> = {
  camera: "Cameras",
  lens: "Lenses",
  lighting: "Lighting",
  gimbal: "Gimbals",
  tripods: "Tripods",
  recorder: "Recorders",
  laptop: "Laptop",
  macbook: "MacBook",
  iphone: "iPhone",
};

const FALLBACK_CATEGORY_BY_SLUG = new Map(
  HOME_CATEGORY_STRIP.map((item) => [item.slug, item]),
);

const mapSpecs = (specs?: string[] | null) => {
  const safeSpecs = Array.isArray(specs) ? specs : [];

  return safeSpecs
    .filter(
      (spec): spec is string =>
        typeof spec === "string" && spec.trim().length > 0,
    )
    .map((spec, index) => {
      const [label, ...rest] = spec.split(":");
      if (rest.length > 0) {
        return {
          label: label.trim(),
          value: rest.join(":").trim(),
        };
      }

      return {
        label: `Spec ${index + 1}`,
        value: spec.trim(),
      };
    });
};

const resolveSanityImageUrl = (
  image: SanityProductImage | null | undefined,
  width: number,
) => {
  if (!imageBuilder || !image?.asset?._ref) {
    return null;
  }

  return imageBuilder
    .image(image)
    .auto("format")
    .quality(86)
    .width(width)
    .fit("max")
    .url();
};

const mapImages = (images?: SanityProductImage[] | null) => {
  const safeImages = Array.isArray(images) ? images : [];

  const resolved = safeImages
    .map((image) => resolveSanityImageUrl(image, 1600))
    .filter((image): image is string => Boolean(image));

  return resolved.length > 0 ? resolved : [FALLBACK_PRODUCT_IMAGE];
};

const normalizeProduct = (
  product: SanityProductDocument,
  index: number,
): Product | null => {
  const category = SANITY_CATEGORY_LABELS[product.category];
  const condition = SANITY_CONDITION_LABELS[product.condition];

  if (!product.name || !product.slug || !category || !condition) {
    return null;
  }

  const createdAtTime = Date.parse(product._createdAt);
  const generatedId = Number.isFinite(createdAtTime)
    ? createdAtTime + index
    : index + 1;

  return {
    id: generatedId,
    name: product.name.trim(),
    slug: product.slug.trim(),
    createdAt: product._createdAt,
    category,
    brand: product.brand?.trim() || "Unknown",
    condition,
    priceRWF: Number(product.priceRWF) || 0,
    inStock: Boolean(product.inStock),
    shortDesc: product.shortDesc?.trim() || "",
    description: product.description?.trim() || "",
    specs: mapSpecs(product.specs),
    images: mapImages(product.images),
    featured: Boolean(product.featured),
  };
};

const normalizeProducts = (documents: SanityProductDocument[]) =>
  documents
    .map((product, index) => normalizeProduct(product, index))
    .filter((product): product is Product => Boolean(product));

const normalizeCategoryTile = (
  category: SanityCategoryDocument,
): HomeCategoryStripItem | null => {
  const rawSlug =
    typeof category.slug === "string" ? category.slug.trim().toLowerCase() : "";
  const rawTitle =
    typeof category.title === "string"
      ? category.title.trim().toLowerCase()
      : "";
  const routeSlug =
    CATEGORY_ROUTE_ALIAS[rawSlug] ??
    CATEGORY_ROUTE_ALIAS[rawTitle] ??
    rawSlug;

  if (!routeSlug) {
    return null;
  }

  const fallbackCategory = FALLBACK_CATEGORY_BY_SLUG.get(routeSlug);
  const label =
    (typeof category.title === "string" && category.title.trim()) ||
    CATEGORY_LABEL_BY_ROUTE[routeSlug] ||
    fallbackCategory?.label;
  const image =
    resolveSanityImageUrl(category.image, 1600) || fallbackCategory?.image;

  if (!label || !image) {
    return null;
  }

  return {
    label,
    slug: routeSlug,
    href: `/category/${routeSlug}`,
    image,
  };
};

const runQuery = async <T>(query: string, params: Record<string, unknown> = {}) => {
  if (!client) {
    return null as T | null;
  }

  try {
    return await client.fetch<T>(query, params);
  } catch (error) {
    console.error("Failed to fetch Sanity content:", error);
    return null as T | null;
  }
};

export async function getAllProducts(): Promise<Product[]> {
  const sanityProducts = await runQuery<SanityProductDocument[]>(ALL_PRODUCTS_QUERY);

  if (!sanityProducts) {
    return fallbackProducts;
  }

  const normalized = normalizeProducts(sanityProducts);
  return normalized.length > 0 ? normalized : fallbackProducts;
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const sanityCategories = getSanityCategoryValuesForSlug(slug);

  if (sanityCategories.length === 0) {
    const categories = getCategoryNavCategories(slug);
    return fallbackProducts.filter((product) =>
      categories.includes(product.category),
    );
  }

  const sanityProducts = await runQuery<SanityProductDocument[]>(
    PRODUCTS_BY_CATEGORY_QUERY,
    { categories: sanityCategories },
  );

  if (!sanityProducts) {
    const categories = getCategoryNavCategories(slug);
    return fallbackProducts.filter((product) =>
      categories.includes(product.category),
    );
  }

  return normalizeProducts(sanityProducts);
}

export async function getHomeCategories(): Promise<HomeCategoryStripItem[]> {
  const sanityCategories = await runQuery<SanityCategoryDocument[]>(
    ALL_CATEGORIES_QUERY,
  );

  if (!Array.isArray(sanityCategories)) {
    return HOME_CATEGORY_STRIP;
  }

  const seenSlugs = new Set<string>();
  const normalized: HomeCategoryStripItem[] = [];

  for (const category of sanityCategories) {
    const next = normalizeCategoryTile(category);
    if (!next || seenSlugs.has(next.slug)) {
      continue;
    }

    seenSlugs.add(next.slug);
    normalized.push(next);
  }

  return normalized.length > 0 ? normalized : HOME_CATEGORY_STRIP;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const sanityProduct = await runQuery<SanityProductDocument | null>(
    PRODUCT_BY_SLUG_QUERY,
    { slug },
  );

  if (!sanityProduct) {
    return fallbackProducts.find((product) => product.slug === slug) ?? null;
  }

  return normalizeProduct(sanityProduct, 0);
}
