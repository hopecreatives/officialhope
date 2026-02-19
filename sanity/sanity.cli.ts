import { defineCliConfig } from "sanity/cli";
import { resolveStudioSanityEnv } from "./env";

const { projectId, dataset } = resolveStudioSanityEnv();

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
});
