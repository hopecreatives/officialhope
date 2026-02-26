const PLACEHOLDER_PROJECT_IDS = new Set(["your-project-id", "your_project_id"]);
const DEFAULT_PROJECT_ID = "o1tcx883";
const DEFAULT_DATASET = "production";
const PROJECT_ID_PATTERN = /^[a-z0-9-]+$/;
const DATASET_PATTERN = /^[a-z0-9_-]+$/;

type EnvSource = Record<string, string | undefined>;

const readEnv = (...keys: string[]) => {
  const sources: EnvSource[] = [];
  if (typeof process !== "undefined" && process.env) {
    sources.push(process.env as EnvSource);
  }

  const globalEnv =
    typeof globalThis !== "undefined"
      ? (
          globalThis as {
            __SANITY_STUDIO_ENV__?: EnvSource;
          }
        ).__SANITY_STUDIO_ENV__
      : undefined;

  if (globalEnv) {
    sources.push(globalEnv);
  }

  for (const key of keys) {
    for (const source of sources) {
      const value = source[key];
      if (typeof value === "string" && value.trim().length > 0) {
        return value.trim();
      }
    }
  }

  return "";
};

const isValidProjectId = (value: string) =>
  Boolean(
    value &&
      PROJECT_ID_PATTERN.test(value) &&
      !PLACEHOLDER_PROJECT_IDS.has(value),
  );

const isValidDataset = (value: string) =>
  Boolean(value && DATASET_PATTERN.test(value));

export const resolveStudioSanityEnv = () => {
  const projectIdFromEnv = readEnv(
    "SANITY_STUDIO_PROJECT_ID",
    "SANITY_PROJECT_ID",
    "VITE_SANITY_STUDIO_PROJECT_ID",
    "VITE_SANITY_PROJECT_ID",
  );
  const datasetFromEnv = readEnv(
    "SANITY_STUDIO_DATASET",
    "SANITY_DATASET",
    "VITE_SANITY_STUDIO_DATASET",
    "VITE_SANITY_DATASET",
  );

  const projectId = isValidProjectId(projectIdFromEnv)
    ? projectIdFromEnv
    : DEFAULT_PROJECT_ID;
  const dataset = isValidDataset(datasetFromEnv)
    ? datasetFromEnv
    : DEFAULT_DATASET;

  return {
    projectId,
    dataset,
  };
};
