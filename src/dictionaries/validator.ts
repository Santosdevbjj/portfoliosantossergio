// src/dictionaries/validator.ts

import type { Dictionary } from "@/types/dictionary";

type ValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateDictionary(dictionary: Dictionary): ValidationResult {
  const errors: string[] = [];

  /* =========================================================
     Helper: Validação de SEO
  ========================================================== */
  const validateSeo = (seo: Dictionary["seo"] | undefined): void => {
    if (!seo) {
      errors.push("Missing seo section");
      return;
    }

    if (!seo.siteName) {
      errors.push("Missing seo.siteName");
    }

    if (!Array.isArray(seo.keywords)) {
      errors.push("seo.keywords must be an array");
    }

    const requiredPages: Array<keyof Dictionary["seo"]["pages"]> = [
      "home",
      "projects",
      "articles",
    ];

    requiredPages.forEach((page) => {
      const pageData = seo.pages?.[page];

      if (!pageData?.title) {
        errors.push(`Missing seo.pages.${page}.title`);
      }

      if (!pageData?.description) {
        errors.push(`Missing seo.pages.${page}.description`);
      }
    });
  };

  /* =========================================================
     1. Meta & Internacionalização
  ========================================================== */

  if (!dictionary.meta?.locale) {
    errors.push("Missing meta.locale");
  }

  if (!dictionary.intl?.currency) {
    errors.push("Missing intl.currency");
  }

  /* =========================================================
     2. SEO
  ========================================================== */

  validateSeo(dictionary.seo);

  /* =========================================================
     3. Hero
  ========================================================== */

  if (!dictionary.hero) {
    errors.push("Missing hero section");
  } else {
    if (!dictionary.hero.title) {
      errors.push("Missing hero.title");
    }

    if (!dictionary.hero.ctaPrimary) {
      errors.push("Missing hero.ctaPrimary");
    }
  }

  /* =========================================================
     4. Experience
  ========================================================== */

  if (!dictionary.experience) {
    errors.push("Missing experience section");
  } else {
    if (!dictionary.experience.title) {
      errors.push("Missing experience.title");
    }

    if (
      !Array.isArray(dictionary.experience.items) ||
      dictionary.experience.items.length === 0
    ) {
      errors.push("experience.items must be a non-empty array");
    } else {
      dictionary.experience.items.forEach((item, index) => {
        if (!item.company) {
          errors.push(`Missing experience.items[${index}].company`);
        }

        if (!item.role) {
          errors.push(`Missing experience.items[${index}].role`);
        }
      });
    }
  }

  /* =========================================================
     5. Articles
  ========================================================== */

  if (!dictionary.articles) {
    errors.push("Missing articles section");
  } else {
    if (!dictionary.articles.title) {
      errors.push("Missing articles.title");
    }

    if (!Array.isArray(dictionary.articles.items)) {
      errors.push("articles.items must be an array");
    } else {
      dictionary.articles.items.forEach((article, index) => {
        if (!article.title) {
          errors.push(`Missing articles.items[${index}].title`);
        }

        if (!article.link) {
          errors.push(`Missing articles.items[${index}].link`);
        }

        if (typeof article.isAward !== "boolean") {
          errors.push(
            `articles.items[${index}].isAward must be a boolean`
          );
        }
      });
    }
  }

  /* =========================================================
     6. Projects
  ========================================================== */

  if (!dictionary.projects?.categories) {
    errors.push("Missing projects.categories section");
  }

  /* =========================================================
     7. Contact & Error Boundary
  ========================================================== */

  if (!dictionary.contact?.cta) {
    errors.push("Missing contact.cta");
  }

  if (!dictionary.common?.errorBoundary?.actions?.retry) {
    errors.push("Missing common.errorBoundary.actions.retry");
  }

  /* =========================================================
     8. UI States
  ========================================================== */

  if (!dictionary.states?.emptyProjects?.title) {
    errors.push("Missing states.emptyProjects.title");
  }

  /* =========================================================
     9. Metrics (Normalização)
  ========================================================== */

  const normalized = dictionary.metrics?.availabilityNormalized;

  if (normalized) {
    if (typeof normalized.value !== "number") {
      errors.push(
        "metrics.availabilityNormalized.value must be a number"
      );
    }

    if (normalized.unit !== "%") {
      errors.push(
        "metrics.availabilityNormalized.unit must be '%'"
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
