import 'server-only';
import type { Locale } from '@/i18n-config';

// Importamos os tipos dos dicionários para garantir o IntelliSense (Autocompletar)
// Isso ajuda a evitar erros de digitação durante o desenvolvimento.
const dictionaries = {
  pt: () => import('@/dictionaries/pt.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  es: () => import('@/dictionaries/es.json').then((module) => module.default),
};

/**
 * Função responsável por carregar o dicionário de tradução.
 * Utiliza "Dynamic Imports" para otimizar a performance.
 * * @param locale - O idioma solicitado (pt, en ou es)
 * @returns O conteúdo do arquivo JSON de tradução correspondente
 */
export const getDictionary = async (locale: Locale) => {
  // Caso o idioma solicitado não exista, retornamos o português como fallback (padrão)
  return dictionaries[locale]?.() ?? dictionaries.pt();
};
