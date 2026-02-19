import { defineField, defineType } from "sanity";

const slugifyInput = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 96);

export const categorySchema = defineType({
  name: "category",
  title: "Category",
  type: "document",
  groups: [
    { name: "basics", title: "Basics", default: true },
    { name: "media", title: "Media" },
    { name: "settings", title: "Settings" },
  ],
  initialValue: {
    order: 100,
  },
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Title (A-Z)",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Category label shown on the homepage strip.",
      group: "basics",
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Must match route slug (example: `camera`, `tripods`, `iphone`).",
      group: "basics",
      options: {
        source: "title",
        maxLength: 96,
        slugify: slugifyInput,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description: "Landscape image recommended for best card display.",
      group: "media",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Short description for accessibility.",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower numbers appear first in the homepage category strip.",
      group: "settings",
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
      order: "order",
      media: "image",
    },
    prepare({ title, slug, order, media }) {
      const orderValue = typeof order === "number" ? order : 100;
      return {
        title: title || "Untitled category",
        subtitle: `${slug ? `/${slug}` : "/missing-slug"} • order ${orderValue}`,
        media,
      };
    },
  },
});
