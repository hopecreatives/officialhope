import { defineArrayMember, defineField, defineType } from "sanity";

export const productSchema = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Camera", value: "camera" },
          { title: "Lens", value: "lens" },
          { title: "Lighting", value: "lighting" },
          { title: "Gimbal", value: "gimbal" },
          { title: "Tripod", value: "tripod" },
          { title: "Recorder", value: "recorder" },
          { title: "Laptop", value: "laptop" },
          { title: "MacBook", value: "macbook" },
          { title: "iPhone", value: "iphone" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "condition",
      title: "Condition",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Used", value: "used" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "priceRWF",
      title: "Price (RWF)",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "shortDesc",
      title: "Short Description",
      type: "string",
      validation: (rule) => rule.required().max(180),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "specs",
      title: "Specs",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "Use format like `Sensor: 24.2MP Full-Frame` for cleaner storefront display.",
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
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
      subtitle: "brand",
      media: "images.0",
    },
  },
});
