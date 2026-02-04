// src/dictionaries/validator.ts

import { Dictionary } from "@/types/dictionary";

export function validateDictionary(
  dictionary: Dictionary
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!dictionary.meta) {
    errors.push("Missing meta section");
  }

  if (!dictionary.meta.locale) {
    errors.push("Missing meta.locale");
  }

  if (!dictionary.common) {
    errors.push("Missing common section");
  }

  if (!dictionary.common.errorBoundary?.actions?.retry) {
    errors.push("Missing errorBoundary retry action");
  }

  if (!dictionary.intl) {
    errors.push("Missing intl section");
  }

  if (!dictionary.states?.emptyProjects?.title) {
    errors.push("Missing emptyProjects.title");
  }

  if (dictionary.metrics?.availabilityNormalized) {
    const { value, unit } = dictionary.metrics.availabilityNormalized;
    if (typeof value !== "number" || unit !== "%") {
      errors.push("Invalid availabilityNormalized format");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
