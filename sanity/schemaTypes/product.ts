import { defineArrayMember, defineField, defineType } from "sanity";

export const SANITY_PRODUCT_CATEGORY_OPTIONS = [
  { title: "Camera", value: "camera" },
  { title: "Lens", value: "lens" },
  { title: "Lighting", value: "lighting" },
  { title: "Gimbal", value: "gimbal" },
  { title: "Tripod", value: "tripod" },
  { title: "Recorder", value: "recorder" },
  { title: "Laptop", value: "laptop" },
  { title: "MacBook", value: "macbook" },
  { title: "iPhone", value: "iphone" },
];

export const SANITY_PRODUCT_CONDITION_OPTIONS = [
  { title: "New", value: "new" },
  { title: "Used", value: "used" },
];

const slugifyInput = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 96);

export const productSchema = defineType({
  name: "product",
  title: "Product",
  type: "document",
  groups: [
    { name: "basics", title: "Basics", default: true },
    { name: "pricing", title: "Pricing" },
    { name: "details", title: "Details" },
    { name: "media", title: "Media" },
    { name: "flags", title: "Flags" },
  ],
  initialValue: (params: { category?: string } | undefined) => ({
    condition: "new",
    inStock: true,
    featured: false,
    specs: [],
    ...(params?.category ? { category: params.category } : {}),
  }),
  orderings: [
    {
      title: "Newest first",
      name: "createdAtDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
    {
      title: "Price (low to high)",
      name: "priceAsc",
      by: [{ field: "priceRWF", direction: "asc" }],
    },
    {
      title: "Price (high to low)",
      name: "priceDesc",
      by: [{ field: "priceRWF", direction: "desc" }],
    },
    {
      title: "Featured first",
      name: "featuredDesc",
      by: [
        { field: "featured", direction: "desc" },
        { field: "_createdAt", direction: "desc" },
      ],
    },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Public product name shown on the storefront.",
      group: "basics",
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Auto-generated from name. Used in product URL.",
      group: "basics",
      options: {
        source: "name",
        maxLength: 96,
        slugify: slugifyInput,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "Used for category pages and filters.",
      group: "basics",
      options: {
        list: SANITY_PRODUCT_CATEGORY_OPTIONS,
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "string",
      description: "Example: Sony, Canon, DJI, Apple.",
      group: "basics",
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "condition",
      title: "Condition",
      type: "string",
      description: "Storefront badge and filter value.",
      group: "pricing",
      options: {
        list: SANITY_PRODUCT_CONDITION_OPTIONS,
        layout: "radio",
        direction: "horizontal",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "priceRWF",
      title: "Price (RWF)",
      type: "number",
      description: "Numeric value only, without commas (e.g. 1250000).",
      group: "pricing",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      description: "Controls availability label and filter behavior.",
      group: "pricing",
      initialValue: true,
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Shows product in featured sections.",
      group: "flags",
      initialValue: false,
    }),
    defineField({
      name: "shortDesc",
      title: "Short Description",
      type: "string",
      description: "One-line summary for cards and SEO previews.",
      group: "details",
      validation: (rule) => rule.required().max(180),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 5,
      description: "Detailed product description on product page.",
      group: "details",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "specs",
      title: "Specs",
      type: "array",
      group: "details",
      of: [defineArrayMember({ type: "string" })],
      description: "Use format like `Sensor: 24.2MP Full-Frame` for cleaner storefront display.",
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      description: "First image is used as main product image on cards and details.",
      group: "media",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              description: "Describe the image for accessibility and SEO.",
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {
      title: "name",
      brand: "brand",
      price: "priceRWF",
      inStock: "inStock",
      featured: "featured",
      media: "images.0",
    },
    prepare({ title, brand, price, inStock, featured, media }) {
      const formattedPrice =
        typeof price === "number" ? `${price.toLocaleString()} RWF` : "No price";
      const stockText = inStock ? "In stock" : "Out of stock";
      const featuredText = featured ? " • Featured" : "";

      return {
        title: title || "Untitled product",
        subtitle: `${brand || "Unknown brand"} • ${formattedPrice} • ${stockText}${featuredText}`,
        media,
      };
    },
  },
});
