import { defineArrayMember, defineField, defineType } from "sanity";
import { SANITY_PRODUCT_CONDITION_OPTIONS } from "./product";

const TEMPLATE_PRODUCT_OPTIONS = [
  { title: "Sony A7 III", value: "sony-a7-iii" },
  { title: "Canon EOS R6", value: "canon-eos-r6" },
  { title: "Nikon Z6 II", value: "nikon-z6-ii" },
  { title: "Sony FE 24-70mm f/2.8 GM II", value: "sony-fe-24-70-gm-ii" },
  { title: "Canon RF 50mm f/1.8 STM", value: "canon-rf-50mm-f1-8" },
  {
    title: "Nikon NIKKOR Z 70-200mm f/2.8 VR S",
    value: "nikon-z-70-200-f2-8-vr-s",
  },
  { title: "DJI RS 4 Mini", value: "dji-rs-4-mini" },
  { title: "Zhiyun Weebill S", value: "zhiyun-weebill-s" },
  { title: "DJI Osmo Mobile 6", value: "dji-osmo-mobile-6" },
  { title: "Godox SL60W LED Video Light", value: "godox-sl60w-led-light" },
  { title: "Aputure Amaran 200x S", value: "aputure-amaran-200x-s" },
  { title: "Nanlite Forza 60B II", value: "nanlite-forza-60b-ii" },
  {
    title: "Manfrotto Befree Live Tripod",
    value: "manfrotto-befree-live-tripod",
  },
  { title: "Neewer C-Stand Kit", value: "neewer-c-stand-kit" },
  {
    title: "K&F Concept Heavy Duty Light Stand",
    value: "kf-concept-heavy-duty-light-stand",
  },
  { title: "Zoom H6 Essential Recorder", value: "zoom-h6-essential-recorder" },
  { title: "Rode Wireless GO II", value: "rode-wireless-go-ii" },
  { title: "Tascam DR-40X Recorder", value: "tascam-dr-40x" },
  { title: "MacBook Pro 14-inch M3 Pro", value: "macbook-pro-14-m3-pro" },
  { title: "MacBook Air M2", value: "macbook-air-m2" },
  { title: "MacBook Pro 16-inch M2 Max", value: "macbook-pro-16-m2-max" },
  { title: "iPhone 15 Pro", value: "iphone-15-pro" },
  { title: "iPhone 14 128GB", value: "iphone-14-128gb" },
  { title: "iPhone 13 Pro 256GB", value: "iphone-13-pro-256gb" },
];

export const templateProductSchema = defineType({
  name: "templateProduct",
  title: "Template Product Override",
  type: "document",
  groups: [
    { name: "basics", title: "Basics", default: true },
    { name: "details", title: "Details" },
    { name: "media", title: "Media" },
  ],
  initialValue: {
    enabled: true,
  },
  fields: [
    defineField({
      name: "templateSlug",
      title: "Template Product",
      type: "string",
      description:
        "Select which template product this override should control on the website.",
      group: "basics",
      options: {
        list: TEMPLATE_PRODUCT_OPTIONS,
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "enabled",
      title: "Enable Override",
      type: "boolean",
      description:
        "Disable to ignore this document and use the original template values.",
      initialValue: true,
      group: "basics",
    }),
    defineField({
      name: "name",
      title: "Override Name",
      type: "string",
      description: "Leave empty to keep the original template product name.",
      group: "basics",
    }),
    defineField({
      name: "brand",
      title: "Override Brand",
      type: "string",
      description: "Leave empty to keep the original brand.",
      group: "basics",
    }),
    defineField({
      name: "condition",
      title: "Override Condition",
      type: "string",
      description: "Leave empty to keep the original condition.",
      options: {
        list: SANITY_PRODUCT_CONDITION_OPTIONS,
        layout: "radio",
        direction: "horizontal",
      },
      group: "basics",
    }),
    defineField({
      name: "priceRWF",
      title: "Override Price (RWF)",
      type: "number",
      description: "Leave empty to keep original price.",
      group: "basics",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "inStock",
      title: "Override In Stock",
      type: "boolean",
      description: "Leave empty to keep original stock status.",
      group: "basics",
    }),
    defineField({
      name: "featured",
      title: "Override Featured",
      type: "boolean",
      description: "Leave empty to keep original featured status.",
      group: "basics",
    }),
    defineField({
      name: "shortDesc",
      title: "Override Short Description",
      type: "string",
      description: "Leave empty to keep original short description.",
      group: "details",
      validation: (rule) => rule.max(180),
    }),
    defineField({
      name: "description",
      title: "Override Description",
      type: "text",
      rows: 5,
      description: "Leave empty to keep original full description.",
      group: "details",
    }),
    defineField({
      name: "specs",
      title: "Override Specs",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description:
        "Leave empty to keep original specs. Format entries like `Sensor: 24.2MP`.",
      group: "details",
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "images",
      title: "Override Images",
      type: "array",
      description:
        "Upload new images here to replace template images on website cards and product pages.",
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
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      templateSlug: "templateSlug",
      enabled: "enabled",
      media: "images.0",
    },
    prepare({ title, templateSlug, enabled, media }) {
      const overrideLabel = title ? title : "Uses default template name";
      const status = enabled === false ? "Disabled" : "Enabled";

      return {
        title: templateSlug || "Missing template selection",
        subtitle: `${status} • ${overrideLabel}`,
        media,
      };
    },
  },
});
