// src/dictionaries/validateCrossLocale.ts

import { Dictionary } from "@/types/dictionary";

/**
 * Função recursiva para extrair todos os caminhos (dots) de um dicionário.
 * Ex: "common.errorBoundary.actions.retry"
 */
function getAllPaths(obj: any, prefix = ""): string[] {
  if (!obj || typeof obj !== "object") return [];

  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    // Continua a recursão se for um objeto, mas ignora arrays (como intl.contract.requiredFields)
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return getAllPaths(value, path);
    }

    return [path];
  });
}

/**
 * Compara o dicionário base (pt-BR) com um dicionário alvo para encontrar 
 * chaves faltantes ou chaves extras não traduzidas.
 */
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

  if (missingInTarget.length > 0) {
    errors.push(
      `[${targetName}] Faltando chaves presentes em ${baseName}:\n    ${missingInTarget.join("\n    ")}`
    );
  }

  if (extraInTarget.length > 0) {
    errors.push(
      `[${targetName}] Chaves extras que não existem em ${baseName}:\n    ${extraInTarget.join("\n    ")}`
    );
  }

  return errors;
}
