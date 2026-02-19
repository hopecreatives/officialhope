import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { resolveStudioSanityEnv } from "./env";
import { schemaTypes } from "./schemaTypes";

const { projectId, dataset } = resolveStudioSanityEnv();
const basePath = process.env.SANITY_STUDIO_BASE_PATH || "/";

export default defineConfig({
  name: "hopestore-studio",
  title: "HopeStore Studio",
  projectId,
  dataset,
  basePath,
  plugins: [deskTool()],
  schema: {
    types: schemaTypes,
  },
});
