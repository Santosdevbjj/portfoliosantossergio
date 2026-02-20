// src/dictionaries/validateCrossLocale.ts

import type { Dictionary } from "@/types/dictionary";

/**
 * Extrai todos os caminhos (dot notation) de um objeto.
 * Exemplo:
 * common.errorBoundary.actions.retry
 *
 * ✔ Ignora arrays
 * ✔ Seguro para TS 6 strict
 * ✔ Não usa any
 */
function getAllPaths(
  obj: unknown,
  prefix = ""
): string[] {
  if (!obj || typeof obj !== "object") {
    return [];
  }

  const entries = Object.entries(
    obj as Record<string, unknown>
  );

  return entries.flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      return getAllPaths(value, path);
    }

    return [path];
  });
}

/**
 * Compara dois dicionários e retorna inconsistências:
 * - Chaves faltantes no target
 * - Chaves extras no target
 *
 * ✔ Seguro para uso em build
 * ✔ Não depende de runtime Next
 * ✔ Compatível com JSON importado via App Router
 */
export function validateCrossLocale(
  base: Dictionary,
  target: Dictionary,
  baseName: string,
  targetName: string
): string[] {
  const basePaths = new Set(getAllPaths(base));
  const targetPaths = new Set(getAllPaths(target));

  const missingInTarget = [...basePaths].filter(
    (path) => !targetPaths.has(path)
  );

  const extraInTarget = [...targetPaths].filter(
    (path) => !basePaths.has(path)
  );

  const errors: string[] = [];

  if (missingInTarget.length > 0) {
    errors.push(
      `[${targetName}] Missing keys present in ${baseName}:\n    ${missingInTarget.join(
        "\n    "
      )}`
    );
  }

  if (extraInTarget.length > 0) {
    errors.push(
      `[${targetName}] Extra keys not present in ${baseName}:\n    ${extraInTarget.join(
        "\n    "
      )}`
    );
  }

  return errors;
}
