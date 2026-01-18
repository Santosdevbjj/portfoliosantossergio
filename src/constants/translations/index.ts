// src/constants/translations/index.ts

import { pt } from './pt';
import { en } from './en';
import { es } from './es';
import { Locale } from '@/i18n-config';

/**
 * DICIONÁRIO ESTRUTURADO DE TRADUÇÕES
 * Centraliza os arquivos pt.ts, en.ts e es.ts.
 * O uso de 'as const' garante que as chaves sejam tratadas como valores literais e imutáveis.
 */
export const translations = { 
  pt, 
  en, 
  es 
} as const;

/**
 * ENGENHARIA DE TIPOS (Type Safety)
 * Define que a estrutura de referência para todo o site é o arquivo pt.ts.
 * Isso força a consistência: se uma chave de projeto existe em PT, 
 * o TypeScript exigirá sua existência em EN e ES.
 */
export type TranslationContent = typeof pt;

/**
 * TIPO DE ACESSO AOS IDIOMAS
 * Define que as chaves válidas são estritamente as definidas no dicionário.
 */
export type ITranslations = typeof translations;

/**
 * HELPER DE ACESSO SEGURO
 * @param lang - Código do idioma (pt, en, es)
 * @returns O objeto de tradução correspondente ou o padrão (pt)
 * * Este helper é usado tanto em Client Components quanto em Server Components
 * para garantir que o layout nunca renderize sem texto (fallback).
 */
export const getTranslations = (lang: string): TranslationContent => {
  // Verifica se o idioma passado é uma das chaves válidas do nosso dicionário
  const isSupportedLocale = Object.keys(translations).includes(lang);
  
  if (isSupportedLocale) {
    return translations[lang as keyof ITranslations];
  }

  // Fallback de segurança para o idioma padrão
  return translations.pt;
};
