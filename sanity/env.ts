const PLACEHOLDER_PROJECT_IDS = new Set(["your-project-id", "your_project_id"]);

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

const assertValidValue = (
  key: string,
  value: string,
  rule: RegExp,
  hint: string,
) => {
  if (!value || !rule.test(value)) {
    throw new Error(
      `[Sanity Studio] Invalid or missing ${key}. ${hint}. Update /Users/admin/Documents/New project/hopestore/.env.local`,
    );
  }
};

export const resolveStudioSanityEnv = () => {
  const projectIdValue = readEnv(
    "SANITY_STUDIO_PROJECT_ID",
    "SANITY_PROJECT_ID",
    "VITE_SANITY_STUDIO_PROJECT_ID",
    "VITE_SANITY_PROJECT_ID",
  );
  const datasetValue = readEnv(
    "SANITY_STUDIO_DATASET",
    "SANITY_DATASET",
    "VITE_SANITY_STUDIO_DATASET",
    "VITE_SANITY_DATASET",
  );

  assertValidValue(
    "SANITY_PROJECT_ID",
    projectIdValue,
    /^[a-z0-9-]+$/,
    "Use lowercase letters, numbers, and dashes only (example: abc123de)",
  );

  if (PLACEHOLDER_PROJECT_IDS.has(projectIdValue)) {
    throw new Error(
      "[Sanity Studio] SANITY_PROJECT_ID is still a placeholder. Update /Users/admin/Documents/New project/hopestore/.env.local with your real project id.",
    );
  }

  assertValidValue(
    "SANITY_DATASET",
    datasetValue,
    /^[a-z0-9_-]+$/,
    "Use lowercase letters, numbers, dashes, or underscores (example: production)",
  );

  return {
    projectId: projectIdValue,
    dataset: datasetValue,
  };
};
