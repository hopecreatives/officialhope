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
import {
  FALLBACK_PRODUCT_IMAGE,
  getCanonicalProductSlug,
  getKnownProductImages,
} from "@/lib/data/productImages";
import type { Product } from "@/types/product";

const sanitizeEnvValue = (value?: string) =>
  typeof value === "string"
    ? value.trim().replace(/^['"]|['"]$/g, "").replace(/\\n/g, "").trim()
    : "";

const projectId = sanitizeEnvValue(process.env.SANITY_PROJECT_ID);
const dataset = sanitizeEnvValue(process.env.SANITY_DATASET);
const apiVersion = sanitizeEnvValue(process.env.SANITY_API_VERSION);

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
  title,
  "slug": slug.current,
  category,
  "categorySlug": category->slug.current,
  "categoryTitle": category->title,
  brand,
  condition,
  price,
  priceRWF,
  inStock,
  featured,
  shortDesc,
  description,
  specs,
  mainImage{
    ...,
    alt
  },
  gallery[]{
    ...,
    alt
  },
  images[]{
    ...,
    alt
  }
}`;

const ALL_PRODUCTS_QUERY = `*[_type == "product" && defined(slug.current)] | order(_createdAt desc) ${PRODUCT_PROJECTION}`;
const PRODUCTS_BY_CATEGORY_QUERY = `*[
  _type == "product" &&
  defined(slug.current) &&
  (
    category in $categories ||
    category._ref in $categoryRefs ||
    category->slug.current in $categories ||
    lower(category->title) in $categoryTitles
  )
] | order(_createdAt desc) ${PRODUCT_PROJECTION}`;
const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0] ${PRODUCT_PROJECTION}`;
const TEMPLATE_PRODUCT_OVERRIDE_PROJECTION = `{
  _id,
  _updatedAt,
  templateSlug,
  enabled,
  name,
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
const TEMPLATE_PRODUCT_OVERRIDES_QUERY = `*[_type == "templateProduct" && defined(templateSlug)] | order(_updatedAt desc) ${TEMPLATE_PRODUCT_OVERRIDE_PROJECTION}`;
const PRODUCT_ASSET_IMAGES_QUERY = `*[_type == "sanity.imageAsset" && defined(originalFilename) && defined(url)] | order(_createdAt asc) {
  _id,
  _createdAt,
  originalFilename,
  url
}`;
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

interface SanityCategoryReference {
  _type: "reference";
  _ref: string;
}

interface SanityProductDocument {
  _id: string;
  _createdAt: string;
  name?: string | null;
  title?: string | null;
  slug: string;
  category?: SanityProductCategory | string | SanityCategoryReference | null;
  categorySlug?: string | null;
  categoryTitle?: string | null;
  brand?: string | null;
  condition?: SanityProductCondition | null;
  price?: number | null;
  priceRWF?: number | null;
  inStock?: boolean | null;
  featured?: boolean | null;
  shortDesc?: string | null;
  description?: string | null;
  specs?: string[] | null;
  mainImage?: SanityProductImage | null;
  gallery?: SanityProductImage[] | null;
  images?: SanityProductImage[] | null;
}

interface SanityCategoryDocument {
  _id: string;
  title?: string | null;
  slug?: string | null;
  order?: number | null;
  image?: SanityProductImage | null;
}

interface SanityTemplateProductDocument {
  _id: string;
  _updatedAt: string;
  templateSlug?: string | null;
  enabled?: boolean | null;
  name?: string | null;
  brand?: string | null;
  condition?: SanityProductCondition | null;
  priceRWF?: number | null;
  inStock?: boolean | null;
  featured?: boolean | null;
  shortDesc?: string | null;
  description?: string | null;
  specs?: string[] | null;
  images?: SanityProductImage[] | null;
}

interface SanityImageAssetDocument {
  _id: string;
  _createdAt: string;
  originalFilename?: string | null;
  url?: string | null;
}

interface TemplateProductOverride {
  templateSlug: string;
  name?: string;
  brand?: string;
  condition?: "New" | "Used";
  priceRWF?: number;
  inStock?: boolean;
  featured?: boolean;
  shortDesc?: string;
  description?: string;
  specs?: Product["specs"];
  images?: string[];
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

const CATEGORY_TITLE_ALIAS: Record<SanityProductCategory, string[]> = {
  camera: ["camera", "cameras"],
  lens: ["lens", "lenses"],
  lighting: ["lighting", "light", "lights"],
  gimbal: ["gimbal", "gimbals"],
  tripod: ["tripod", "tripods", "stand", "stands"],
  stand: ["stand", "stands", "tripod", "tripods"],
  recorder: ["recorder", "recorders"],
  laptop: ["laptop"],
  macbook: ["macbook", "mac book"],
  iphone: ["iphone", "i phone"],
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

const PRODUCT_ASSET_FILENAME_MATCHERS: Array<{
  slug: string;
  matcher: RegExp;
}> = [
  { slug: "sony-a7-iii", matcher: /\bsony[\s-]*a7\s*iii\b|\ba7iii\b/i },
  { slug: "canon-eos-r6", matcher: /\bcanon\b.*\br6\b|\br6\b/i },
  { slug: "nikon-z6-ii", matcher: /\bnikon\b.*\bz6[\s-]*ii\b|\bz6ii\b/i },
  { slug: "sony-fe-24-70-gm-ii", matcher: /\bsel2470gm2\b|\b24[\s-]*70\b.*\bgm\b/i },
  { slug: "canon-rf-50mm-f1-8", matcher: /\bcanon\b.*\brf\b.*\b50mm\b|\brf[_\s-]*50mm/i },
  { slug: "nikon-z-70-200-f2-8-vr-s", matcher: /\bnikon\b.*\b70[\s-]*200\b|\b70[\s-]*200\b.*\bvr\b/i },
  { slug: "dji-rs-4-mini", matcher: /\brs[\s-]*4\b|\brender\s*7\b/i },
  { slug: "zhiyun-weebill-s", matcher: /\bweebill\b|\bzhiyun\b/i },
  { slug: "dji-osmo-mobile-6", matcher: /\bosmo\b|\bmobile[\s-]*6\b/i },
  { slug: "godox-sl60w-led-light", matcher: /\bgodox\b|\bsl60\b/i },
  { slug: "aputure-amaran-200x-s", matcher: /\bamaran\b|\b200x\b/i },
  { slug: "nanlite-forza-60b-ii", matcher: /\bnanlite\b|\bforza[\s-]*60b\b/i },
  { slug: "manfrotto-befree-live-tripod", matcher: /\bmanfrotto\b|\bbefree\b/i },
  { slug: "neewer-c-stand-kit", matcher: /\bneewer\b|\bc-stand\b|\bcstand\b/i },
  { slug: "kf-concept-heavy-duty-light-stand", matcher: /\bk&f\b|\bkf[\s-]*concept\b|51sxyqy3sgl|1b27a3c/i },
  { slug: "zoom-h6-essential-recorder", matcher: /\bzoom\b|\bh6essential\b|\bh6[\s-]*essential\b/i },
  { slug: "rode-wireless-go-ii", matcher: /\brode\b|\bwireless[\s-]*go\b/i },
  { slug: "tascam-dr-40x", matcher: /\btascam\b|\bdr[\s-]*40x\b/i },
  { slug: "macbook-pro-14-m3-pro", matcher: /\bm3\b.*\b14\b|\b14[\s-]*inch\b.*\bm3\b/i },
  { slug: "macbook-air-m2", matcher: /\bm2\b.*\b13\b|\b13inch\b|\bm2 13/i },
  { slug: "macbook-pro-16-m2-max", matcher: /\bm2\b.*\b16\b|\b16inch\b|\bm2 16/i },
  { slug: "iphone-15-pro", matcher: /\biphone[\s-]*15\b/i },
  { slug: "iphone-14-128gb", matcher: /\biphone[\s-]*14\b/i },
  { slug: "iphone-13-pro-256gb", matcher: /\biphone[\s-]*13\b/i },
];

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

const resolveConditionValue = (
  condition?: SanityProductCondition | string | null,
) => {
  if (typeof condition !== "string") {
    return "New";
  }

  const normalized = condition.trim().toLowerCase();
  if (normalized === "used") {
    return "Used";
  }

  return "New";
};

const resolveCategoryValue = (product: SanityProductDocument) => {
  const candidates = [
    typeof product.category === "string" ? product.category : null,
    product.categorySlug,
    product.categoryTitle,
    typeof product.category === "object" && product.category?._ref
      ? product.category._ref
      : null,
  ];

  for (const candidate of candidates) {
    if (typeof candidate !== "string" || candidate.trim().length === 0) {
      continue;
    }

    const normalized = candidate.trim().toLowerCase();
    const refValue = normalized.startsWith("category.")
      ? normalized.split(".").pop() ?? normalized
      : normalized;
    const compactValue = refValue.replace(/\s+/g, "-");
    const alias =
      CATEGORY_ROUTE_ALIAS[refValue] ??
      CATEGORY_ROUTE_ALIAS[compactValue] ??
      CATEGORY_ROUTE_ALIAS[compactValue.replace(/-/g, "")];

    if (!alias) {
      continue;
    }

    const sanityCategory = alias === "tripods" ? "tripod" : alias;
    if (sanityCategory in SANITY_CATEGORY_LABELS) {
      return sanityCategory as SanityProductCategory;
    }
  }

  return null;
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

const mapImages = (
  slug: string,
  mainImage?: SanityProductImage | null,
  gallery?: SanityProductImage[] | null,
  images?: SanityProductImage[] | null,
) => {
  const safeGallery = Array.isArray(gallery) ? gallery : [];
  const safeImages = Array.isArray(images) ? images : [];

  const resolved = [
    resolveSanityImageUrl(mainImage, 1600),
    ...safeGallery.map((image) => resolveSanityImageUrl(image, 1600)),
    ...safeImages.map((image) => resolveSanityImageUrl(image, 1600)),
  ].filter((image): image is string => Boolean(image));

  if (resolved.length > 0) {
    return Array.from(new Set(resolved));
  }

  const mappedLocalImages = getKnownProductImages(slug);
  if (mappedLocalImages) {
    return mappedLocalImages;
  }

  return [FALLBACK_PRODUCT_IMAGE];
};

const normalizeProduct = (
  product: SanityProductDocument,
  index: number,
): Product | null => {
  const productName =
    typeof product.name === "string" && product.name.trim().length > 0
      ? product.name.trim()
      : typeof product.title === "string"
        ? product.title.trim()
        : "";
  const productSlug =
    typeof product.slug === "string" ? product.slug.trim() : "";
  const resolvedCategory = resolveCategoryValue(product);
  const category = resolvedCategory
    ? SANITY_CATEGORY_LABELS[resolvedCategory]
    : null;
  const condition = resolveConditionValue(product.condition);

  if (!productName || !productSlug || !category) {
    return null;
  }

  const createdAtTime = Date.parse(product._createdAt);
  const generatedId = Number.isFinite(createdAtTime)
    ? createdAtTime + index
    : index + 1;

  return {
    id: generatedId,
    name: productName,
    slug: productSlug,
    createdAt: product._createdAt,
    category,
    brand: product.brand?.trim() || "Unknown",
    condition,
    priceRWF: Number(product.priceRWF ?? product.price) || 0,
    inStock: Boolean(product.inStock),
    shortDesc: product.shortDesc?.trim() || "",
    description: product.description?.trim() || "",
    specs: mapSpecs(product.specs),
    images: mapImages(
      productSlug,
      product.mainImage,
      product.gallery,
      product.images,
    ),
    featured: Boolean(product.featured),
  };
};

const normalizeProducts = (documents: SanityProductDocument[]) =>
  documents
    .map((product, index) => normalizeProduct(product, index))
    .filter((product): product is Product => Boolean(product));

const getProductTimestamp = (product: Product) => {
  const parsedDate = product.createdAt ? Date.parse(product.createdAt) : Number.NaN;
  if (Number.isFinite(parsedDate)) {
    return parsedDate;
  }

  return product.id;
};

const mergeProductsBySlug = (
  primaryProducts: Product[],
  fallbackScope: Product[],
) => {
  const bySlug = new Map<string, Product>();

  for (const product of fallbackScope) {
    bySlug.set(product.slug, product);
  }

  for (const product of primaryProducts) {
    bySlug.set(product.slug, product);
  }

  return Array.from(bySlug.values()).sort(
    (left, right) => getProductTimestamp(right) - getProductTimestamp(left),
  );
};

const mapTemplateOverrideImages = (images?: SanityProductImage[] | null) => {
  const safeImages = Array.isArray(images) ? images : [];

  const resolved = safeImages
    .map((image) => resolveSanityImageUrl(image, 1600))
    .filter((image): image is string => Boolean(image));

  return resolved.length > 0 ? resolved : undefined;
};

const formatSanityAssetUrl = (url: string) => {
  const trimmedUrl = url.trim();
  if (!trimmedUrl) {
    return "";
  }

  const separator = trimmedUrl.includes("?") ? "&" : "?";
  return `${trimmedUrl}${separator}w=1600&q=86&fit=max&auto=format`;
};

const normalizeAssetFilename = (filename?: string | null) =>
  typeof filename === "string"
    ? filename
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    : "";

const mapAssetImagesBySlug = (assets: SanityImageAssetDocument[]) => {
  const bySlug = new Map<string, string[]>();

  for (const asset of assets) {
    const filename = normalizeAssetFilename(asset.originalFilename);
    const url =
      typeof asset.url === "string" ? formatSanityAssetUrl(asset.url) : "";

    if (!filename || !url) {
      continue;
    }

    const match = PRODUCT_ASSET_FILENAME_MATCHERS.find(({ matcher }) =>
      matcher.test(filename),
    );

    if (!match) {
      continue;
    }

    const images = bySlug.get(match.slug) ?? [];
    if (!images.includes(url)) {
      images.push(url);
    }

    bySlug.set(match.slug, images);
  }

  return bySlug;
};

const applySanityAssetImages = (
  products: Product[],
  assetImagesMap: Map<string, string[]>,
) => {
  if (assetImagesMap.size === 0) {
    return products;
  }

  return products.map((product) => {
    const canonicalSlug = getCanonicalProductSlug(product.slug);
    const images = assetImagesMap.get(canonicalSlug);

    if (!images || images.length === 0) {
      return product;
    }

    return {
      ...product,
      images,
    };
  });
};

const normalizeTemplateProductOverride = (
  document: SanityTemplateProductDocument,
): TemplateProductOverride | null => {
  if (document.enabled === false) {
    return null;
  }

  const rawSlug =
    typeof document.templateSlug === "string" ? document.templateSlug.trim() : "";
  if (!rawSlug) {
    return null;
  }

  const templateSlug = getCanonicalProductSlug(rawSlug);
  const condition =
    document.condition && SANITY_CONDITION_LABELS[document.condition]
      ? SANITY_CONDITION_LABELS[document.condition]
      : undefined;

  const normalizedName =
    typeof document.name === "string" && document.name.trim().length > 0
      ? document.name.trim()
      : undefined;
  const normalizedBrand =
    typeof document.brand === "string" && document.brand.trim().length > 0
      ? document.brand.trim()
      : undefined;
  const normalizedShortDesc =
    typeof document.shortDesc === "string" && document.shortDesc.trim().length > 0
      ? document.shortDesc.trim()
      : undefined;
  const normalizedDescription =
    typeof document.description === "string" &&
    document.description.trim().length > 0
      ? document.description.trim()
      : undefined;
  const normalizedPrice =
    typeof document.priceRWF === "number" && Number.isFinite(document.priceRWF)
      ? document.priceRWF
      : undefined;
  const normalizedInStock =
    typeof document.inStock === "boolean" ? document.inStock : undefined;
  const normalizedFeatured =
    typeof document.featured === "boolean" ? document.featured : undefined;
  const normalizedSpecs = mapSpecs(document.specs);
  const normalizedImages = mapTemplateOverrideImages(document.images);

  return {
    templateSlug,
    name: normalizedName,
    brand: normalizedBrand,
    condition,
    priceRWF: normalizedPrice,
    inStock: normalizedInStock,
    featured: normalizedFeatured,
    shortDesc: normalizedShortDesc,
    description: normalizedDescription,
    specs: normalizedSpecs.length > 0 ? normalizedSpecs : undefined,
    images: normalizedImages,
  };
};

const applyTemplateOverride = (
  product: Product,
  override: TemplateProductOverride,
): Product => {
  const nextName = override.name ?? product.name;
  const nextBrand = override.brand ?? product.brand;
  const nextCondition = override.condition ?? product.condition;
  const nextPriceRWF =
    typeof override.priceRWF === "number" ? override.priceRWF : product.priceRWF;
  const nextInStock =
    typeof override.inStock === "boolean" ? override.inStock : product.inStock;
  const nextFeatured =
    typeof override.featured === "boolean" ? override.featured : product.featured;
  const nextShortDesc = override.shortDesc ?? product.shortDesc;
  const nextDescription = override.description ?? product.description;
  const nextSpecs = override.specs ?? product.specs;
  const nextImages = override.images ?? product.images;

  return {
    ...product,
    name: nextName,
    brand: nextBrand,
    condition: nextCondition,
    priceRWF: nextPriceRWF,
    inStock: nextInStock,
    featured: nextFeatured,
    shortDesc: nextShortDesc,
    description: nextDescription,
    specs: nextSpecs,
    images: nextImages,
  };
};

const applyTemplateOverrides = (
  products: Product[],
  overrideMap: Map<string, TemplateProductOverride>,
) => {
  if (overrideMap.size === 0) {
    return products;
  }

  return products.map((product) => {
    const canonicalSlug = getCanonicalProductSlug(product.slug);
    const override = overrideMap.get(canonicalSlug);
    if (!override) {
      return product;
    }

    return applyTemplateOverride(product, override);
  });
};

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

const getTemplateProductOverridesMap = async () => {
  const documents = await runQuery<SanityTemplateProductDocument[]>(
    TEMPLATE_PRODUCT_OVERRIDES_QUERY,
  );

  if (!Array.isArray(documents) || documents.length === 0) {
    return new Map<string, TemplateProductOverride>();
  }

  const bySlug = new Map<string, TemplateProductOverride>();

  for (const document of documents) {
    const normalized = normalizeTemplateProductOverride(document);
    if (!normalized || bySlug.has(normalized.templateSlug)) {
      continue;
    }

    bySlug.set(normalized.templateSlug, normalized);
  }

  return bySlug;
};

const getSanityAssetImagesMap = async () => {
  const documents = await runQuery<SanityImageAssetDocument[]>(
    PRODUCT_ASSET_IMAGES_QUERY,
  );

  if (!Array.isArray(documents) || documents.length === 0) {
    return new Map<string, string[]>();
  }

  return mapAssetImagesBySlug(documents);
};

export async function getAllProducts(): Promise<Product[]> {
  const templateOverrideMap = await getTemplateProductOverridesMap();
  const assetImagesMap = await getSanityAssetImagesMap();
  const assetBackedFallbackProducts = applySanityAssetImages(
    fallbackProducts,
    assetImagesMap,
  );
  const sanityProducts = await runQuery<SanityProductDocument[]>(ALL_PRODUCTS_QUERY);

  if (!sanityProducts) {
    return applyTemplateOverrides(assetBackedFallbackProducts, templateOverrideMap);
  }

  const normalized = normalizeProducts(sanityProducts);
  if (normalized.length === 0) {
    return applyTemplateOverrides(assetBackedFallbackProducts, templateOverrideMap);
  }

  return applyTemplateOverrides(
    mergeProductsBySlug(normalized, assetBackedFallbackProducts),
    templateOverrideMap,
  );
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const templateOverrideMap = await getTemplateProductOverridesMap();
  const assetImagesMap = await getSanityAssetImagesMap();
  const sanityCategories = getSanityCategoryValuesForSlug(slug);
  const fallbackCategoryProducts = (() => {
    const categories = getCategoryNavCategories(slug);
    return applySanityAssetImages(
      fallbackProducts.filter((product) => categories.includes(product.category)),
      assetImagesMap,
    );
  })();

  if (sanityCategories.length === 0) {
    return applyTemplateOverrides(fallbackCategoryProducts, templateOverrideMap);
  }

  const sanityProducts = await runQuery<SanityProductDocument[]>(
    PRODUCTS_BY_CATEGORY_QUERY,
    {
      categories: sanityCategories,
      categoryRefs: sanityCategories.map((category) => `category.${category}`),
      categoryTitles: sanityCategories.flatMap(
        (category) => CATEGORY_TITLE_ALIAS[category] ?? [category],
      ),
    },
  );

  if (!sanityProducts) {
    return applyTemplateOverrides(fallbackCategoryProducts, templateOverrideMap);
  }

  const normalized = normalizeProducts(sanityProducts);
  if (normalized.length === 0) {
    return applyTemplateOverrides(fallbackCategoryProducts, templateOverrideMap);
  }

  return applyTemplateOverrides(
    mergeProductsBySlug(normalized, fallbackCategoryProducts),
    templateOverrideMap,
  );
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
  const templateOverrideMap = await getTemplateProductOverridesMap();
  const assetImagesMap = await getSanityAssetImagesMap();
  const sanityProduct = await runQuery<SanityProductDocument | null>(
    PRODUCT_BY_SLUG_QUERY,
    { slug },
  );

  if (!sanityProduct) {
    const fallbackProduct =
      fallbackProducts.find((product) => product.slug === slug) ?? null;
    if (!fallbackProduct) {
      return null;
    }

    return (
      applyTemplateOverrides(
        applySanityAssetImages([fallbackProduct], assetImagesMap),
        templateOverrideMap,
      )[0] ?? null
    );
  }

  const normalized = normalizeProduct(sanityProduct, 0);
  if (!normalized) {
    return null;
  }

  return applyTemplateOverrides([normalized], templateOverrideMap)[0] ?? null;
}
