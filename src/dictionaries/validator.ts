// src/dictionaries/validator.ts

import { Dictionary } from "@/types/dictionary";

export function validateDictionary(
  dictionary: Dictionary
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // --- Função Auxiliar: Validação de SEO ---
  const validateSeo = (seo: any) => {
    if (!seo) {
      errors.push("Missing seo section");
      return;
    }
    if (!seo.siteName) errors.push("Missing seo.siteName");
    if (!Array.isArray(seo.keywords)) errors.push("seo.keywords must be an array");
    
    const requiredPages = ['home', 'projects', 'articles'];
    requiredPages.forEach(page => {
      if (!seo.pages?.[page]?.title) errors.push(`Missing seo.pages.${page}.title`);
      if (!seo.pages?.[page]?.description) errors.push(`Missing seo.pages.${page}.description`);
    });
  };

  // --- 1. Validação de Meta e Internacionalização ---
  if (!dictionary?.meta?.locale) {
    errors.push("Missing meta.locale");
  }
  if (!dictionary?.intl?.currency) {
    errors.push("Missing intl section or currency");
  }

  // --- 2. Validação de SEO ---
  validateSeo(dictionary.seo);

  // --- 3. Validação da Seção Hero ---
  if (!dictionary?.hero) {
    errors.push("Missing hero section");
  } else {
    if (!dictionary.hero.title) errors.push("Missing hero.title");
    if (!dictionary.hero.ctaPrimary) errors.push("Missing hero.ctaPrimary");
  }

  // --- 4. Validação de Experiência Profissional ---
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

  // --- 5. Validação de Artigos ---
  if (!dictionary?.articles) {
    errors.push("Missing articles section");
  } else {
    const { articles } = dictionary;
    if (!articles.title) errors.push("Missing articles.title");
    if (!Array.isArray(articles.items)) {
      errors.push("articles.items must be an array");
    } else {
      articles.items.forEach((article, index) => {
        if (!article.title) errors.push(`Missing articles.items[${index}].title`);
        if (!article.link) errors.push(`Missing articles.items[${index}].link`);
        if (typeof article.isAward !== 'boolean') {
          errors.push(`articles.items[${index}].isAward must be a boolean`);
        }
      });
    }
  }

  // --- 6. Validação de Projetos e Categorias ---
  if (!dictionary?.projects?.categories) {
    errors.push("Missing projects.categories section");
  }

  // --- 7. Validação de Contato e Erros ---
  if (!dictionary?.contact?.cta) errors.push("Missing contact.cta");
  
  if (!dictionary?.common?.errorBoundary?.actions?.retry) {
    errors.push("Missing common.errorBoundary.actions.retry");
  }

  // --- 8. Validação de Estados de UI (Empty States) ---
  if (!dictionary?.states?.emptyProjects?.title) {
    errors.push("Missing states.emptyProjects.title");
  }

  // --- 9. Validação de Métricas (Normalização) ---
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
