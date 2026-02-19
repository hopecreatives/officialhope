import { defineCliConfig } from "sanity/cli";
import { resolveStudioSanityEnv } from "./env";

const { projectId, dataset } = resolveStudioSanityEnv();

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  deployment: {
    appId: "a2n4s0pi38wfq8vr03e0omjb",
  },
});
