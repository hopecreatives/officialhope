import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { resolveStudioSanityEnv } from "./env";
import { schemaTypes } from "./schemaTypes";

const { projectId, dataset } = resolveStudioSanityEnv();

export default defineConfig({
  name: "hopestore-studio",
  title: "HopeStore Studio",
  projectId,
  dataset,
  plugins: [deskTool()],
  schema: {
    types: schemaTypes,
  },
});
