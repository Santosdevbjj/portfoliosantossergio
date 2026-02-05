// src/dictionaries/validator.ts

import { Dictionary } from "@/types/dictionary";

export function validateDictionary(
  dictionary: Dictionary
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!dictionary?.contact?.cta) {
  errors.push("Missing contact.cta");
} 

// Validação da Seção Experience
if (!dictionary?.experience) {
  errors.push("Missing experience section");
} else {
  if (!dictionary.experience.title) errors.push("Missing experience.title");
  if (!Array.isArray(dictionary.experience.items) || dictionary.experience.items.length === 0) {
    errors.push("experience.items must be a non-empty array");
  } else {
    dictionary.experience.items.forEach((item, index) => {
      if (!item.company) errors.push(`Missing experience.items[${index}].company`);
      if (!item.role) errors.push(`Missing experience.items[${index}].role`);
    });
  }
} 

  if (!dictionary?.hero) {
  errors.push("Missing hero section");
} else {
  if (!dictionary.hero.title) errors.push("Missing hero.title");
  if (!dictionary.hero.ctaPrimary) errors.push("Missing hero.ctaPrimary");
}

if (!dictionary?.projects?.categories) {
  errors.push("Missing projects.categories section");
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
