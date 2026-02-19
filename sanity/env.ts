const PLACEHOLDER_PROJECT_IDS = new Set(["your-project-id", "your_project_id"]);

const readEnv = (...keys: string[]) => {
  if (typeof process === "undefined") {
    return "";
  }

  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
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
  );
  const datasetValue = readEnv("SANITY_STUDIO_DATASET", "SANITY_DATASET");

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
