// src/dictionaries/validator.ts

import { Dictionary } from "@/types/dictionary";

export function validateDictionary(
  dictionary: Dictionary
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  validateSeo(dictionary.seo, errors)
  

  if (!dictionary?.contact?.cta) {
  errors.push("Missing contact.cta")
  
} 


function validateSeo(seo: any, errors: string[]) {
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
}

// Chame validateSeo(dictionary.seo, errors) dentro da função principal validateDictionary





  
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

  
// Validação da Seção de Artigos (Articles)
if (!dictionary?.articles) {
  errors.push("Missing articles section");
} else {
  const { articles } = dictionary;
  
  // Validação de labels obrigatórias da seção
  if (!articles.title) errors.push("Missing articles.title");
  if (!articles.mediumProfile) errors.push("Missing articles.mediumProfile");
  if (!articles.readMore) errors.push("Missing articles.readMore");
  if (!articles.publishedAt) errors.push("Missing articles.publishedAt");
  if (!articles.awardWinner) errors.push("Missing articles.awardWinner");

  // Validação dos itens (Array de Artigos)
  if (!Array.isArray(articles.items)) {
    errors.push("articles.items must be an array");
  } else if (articles.items.length === 0) {
    errors.push("articles.items should not be empty for a complete showcase");
  } else {
    articles.items.forEach((article, index) => {
      if (!article.title) errors.push(`Missing articles.items[${index}].title`);
      if (!article.description) errors.push(`Missing articles.items[${index}].description`);
      if (!article.date) errors.push(`Missing articles.items[${index}].date`);
      if (!article.category) errors.push(`Missing articles.items[${index}].category`);
      if (!article.link) errors.push(`Missing articles.items[${index}].link`);
      
      // Validação de tipo para o booleano de premiação
      if (typeof article.isAward !== 'boolean') {
        errors.push(`articles.items[${index}].isAward must be a boolean`);
      }
    });
  }
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
