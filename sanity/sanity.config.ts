import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { deskStructure } from "./deskStructure";
import { resolveStudioSanityEnv } from "./env";
import { schemaTypes } from "./schemaTypes";

const { projectId, dataset } = resolveStudioSanityEnv();
const configuredBasePath = process.env.SANITY_STUDIO_BASE_PATH || "/";
const basePath = configuredBasePath.startsWith("/")
  ? configuredBasePath.replace(/\/+$/, "") || "/"
  : `/${configuredBasePath.replace(/\/+$/, "")}`;
const viteBase = basePath === "/" ? "/" : `${basePath}/`;

export default defineConfig({
  name: "hopestore-studio",
  title: "HopeStore Studio",
  projectId,
  dataset,
  basePath,
  plugins: [deskTool({ structure: deskStructure })],
  vite: {
    base: viteBase,
  },
  schema: {
    types: schemaTypes,
  },
});
