// src/dictionaries/validateCrossLocale.ts

import type { Dictionary } from "@/types/dictionary";

/**
 * Extrai todos os caminhos (dot notation) de um objeto.
 *
 * Exemplo:
 * common.errorBoundary.actions.retry
 *
 * ✔ Ignora arrays
 * ✔ Seguro para TypeScript strict
 * ✔ Evita loops em objetos circulares
 * ✔ Não usa any
 */
function getAllPaths(
  obj: unknown,
  prefix = "",
  visited = new WeakSet<object>()
): string[] {
  if (!obj || typeof obj !== "object") {
    return [];
  }

  if (visited.has(obj as object)) {
    return [];
  }

  visited.add(obj as object);

  const record = obj as Record<string, unknown>;

  const paths: string[] = [];

  for (const [key, value] of Object.entries(record)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      paths.push(...getAllPaths(value, path, visited));
    } else {
      paths.push(path);
    }
  }

  return paths;
}

/**
 * Compara dois dicionários e retorna inconsistências:
 *
 * - Chaves faltantes no target
 * - Chaves extras no target
 *
 * ✔ Seguro para uso em build
 * ✔ Não depende de runtime do Next.js
 * ✔ Compatível com JSON importado via App Router
 * ✔ Determinístico para CI/CD
 */
export function validateCrossLocale(
  base: Dictionary,
  target: Dictionary,
  baseName: string,
  targetName: string
): string[] {
  const basePaths = new Set(getAllPaths(base));
  const targetPaths = new Set(getAllPaths(target));

  const missingInTarget = [...basePaths]
    .filter((path) => !targetPaths.has(path))
    .sort();

  const extraInTarget = [...targetPaths]
    .filter((path) => !basePaths.has(path))
    .sort();

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
