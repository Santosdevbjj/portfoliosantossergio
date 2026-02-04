type Dictionary = Record<string, any>;

function getAllPaths(obj: Dictionary, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      return getAllPaths(value, path);
    }

    return [path];
  });
}

export function validateCrossLocale(
  base: Dictionary,
  target: Dictionary,
  baseName: string,
  targetName: string
): string[] {
  const basePaths = new Set(getAllPaths(base));
  const targetPaths = new Set(getAllPaths(target));

  const missingInTarget = [...basePaths].filter(p => !targetPaths.has(p));
  const extraInTarget = [...targetPaths].filter(p => !basePaths.has(p));

  const errors: string[] = [];

  if (missingInTarget.length) {
    errors.push(
      `[${targetName}] Missing keys:\n${missingInTarget.join("\n")}`
    );
  }

  if (extraInTarget.length) {
    errors.push(
      `[${targetName}] Extra keys not in ${baseName}:\n${extraInTarget.join("\n")}`
    );
  }

  return errors;
}
