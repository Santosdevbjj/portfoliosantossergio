// src/dictionaries/validator.ts

import { Dictionary } from "@/types/dictionary";

export function validateDictionary(
  dictionary: Dictionary
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!dictionary?.contact?.cta) {
  errors.push("Missing contact.cta");
} 

  // 1. Validação da Seção Meta
  if (!dictionary?.meta) {
    errors.push("Missing meta section");
  } else if (!dictionary.meta.locale) {
    errors.push("Missing meta.locale");
  }

  // 2. Validação da Seção Common e ErrorBoundary
  // Adicionado Optional Chaining (?.) para evitar crash se 'common' ou 'errorBoundary' estiverem ausentes
  if (!dictionary?.common) {
    errors.push("Missing common section");
  } else if (!dictionary.common.errorBoundary?.actions?.retry) {
    errors.push("Missing common.errorBoundary.actions.retry");
  }

  // 3. Validação da Seção Intl
  if (!dictionary?.intl) {
    errors.push("Missing intl section");
  }

  // 4. Validação da Seção States (Crucial para a renderização de listas)
  if (!dictionary?.states?.emptyProjects?.title) {
    errors.push("Missing states.emptyProjects.title");
  }

  // 5. Validação de Métricas (Lógica de Negócio)
  // Verifica se o objeto existe antes de validar os tipos internos
  if (dictionary?.metrics?.availabilityNormalized) {
    const { value, unit } = dictionary.metrics.availabilityNormalized;
    if (typeof value !== "number") {
      errors.push("metrics.availabilityNormalized.value must be a number");
    }
    if (unit !== "%") {
      errors.push("metrics.availabilityNormalized.unit must be '%'");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
