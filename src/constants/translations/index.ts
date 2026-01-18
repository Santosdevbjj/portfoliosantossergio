// src/constants/translations/index.ts

import { pt } from './pt';
import { en } from './en';
import { es } from './es';

/**
 * Dicionário centralizado de traduções.
 * Agrupa as constantes pt, en e es em um único objeto para consumo via [lang].
 */
export const translations = { 
  pt, 
  en, 
  es 
} as const;

/**
 * Tipagem de Conteúdo:
 * Define que qualquer tradução deve seguir rigorosamente a estrutura do arquivo pt.ts.
 * Se você adicionar uma chave em PT, o TypeScript exigirá que ela exista em EN e ES.
 */
export type TranslationContent = typeof pt;

/**
 * Tipagem do Objeto de Traduções:
 * Mapeia as chaves permitidas (pt | en | es) para o conteúdo traduzido.
 */
export type ITranslations = typeof translations;

/**
 * Helper para garantir que o idioma solicitado existe no dicionário.
 * Caso contrário, retorna o idioma padrão (pt).
 */
export const getTranslations = (lang: string): TranslationContent => {
  return translations[lang as keyof ITranslations] || translations.pt;
};
