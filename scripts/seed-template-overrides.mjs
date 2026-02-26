import { createClient } from "@sanity/client";
import { getCliClient } from "sanity/cli";

const TEMPLATE_SLUGS = [
  "sony-a7-iii",
  "canon-eos-r6",
  "nikon-z6-ii",
  "sony-fe-24-70-gm-ii",
  "canon-rf-50mm-f1-8",
  "nikon-z-70-200-f2-8-vr-s",
  "dji-rs-4-mini",
  "zhiyun-weebill-s",
  "dji-osmo-mobile-6",
  "godox-sl60w-led-light",
  "aputure-amaran-200x-s",
  "nanlite-forza-60b-ii",
  "manfrotto-befree-live-tripod",
  "neewer-c-stand-kit",
  "kf-concept-heavy-duty-light-stand",
  "zoom-h6-essential-recorder",
  "rode-wireless-go-ii",
  "tascam-dr-40x",
  "macbook-pro-14-m3-pro",
  "macbook-air-m2",
  "macbook-pro-16-m2-max",
  "iphone-15-pro",
  "iphone-14-128gb",
  "iphone-13-pro-256gb",
];

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  "o1tcx883";
const dataset =
  process.env.SANITY_STUDIO_DATASET || process.env.SANITY_DATASET || "production";
const apiVersion =
  process.env.SANITY_API_VERSION ||
  process.env.SANITY_STUDIO_API_VERSION ||
  "2025-01-01";
if (!/^[a-z0-9-]+$/.test(projectId)) {
  throw new Error(
    `Invalid SANITY_PROJECT_ID "${projectId}". Use lowercase letters, numbers, and dashes only.`,
  );
}

const fallbackToken =
  process.env.SANITY_AUTH_TOKEN ||
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_STUDIO_TOKEN ||
  "";

const client =
  fallbackToken.length > 0
    ? createClient({
        projectId,
        dataset,
        apiVersion,
        token: fallbackToken,
        useCdn: false,
      })
    : getCliClient({
        apiVersion,
        projectId,
        dataset,
      }).withConfig({ useCdn: false });

const run = async () => {
  const documents = TEMPLATE_SLUGS.map((slug) => ({
    _id: `templateProduct.${slug}`,
    _type: "templateProduct",
    templateSlug: slug,
    enabled: true,
  }));

  for (const document of documents) {
    await client.createIfNotExists(document);
  }

  console.log(
    `Template overrides seeded: ${documents.length}. Edit them in Sanity Studio under "Template Product Overrides".`,
  );
};

run().catch((error) => {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string" &&
    (error.message.includes("Unauthorized") ||
      error.message.includes("Insufficient permissions"))
  ) {
    console.error(
      "Unauthorized. Run `npx sanity@latest login` then `npm run studio:seed-templates`.",
    );
  }

  console.error(error);
  process.exitCode = 1;
});
