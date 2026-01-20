// src/constants/translations/index.ts

import { pt } from './pt';
import { en } from './en';
import { es } from './es';

// Correção do Warning do Log: Importando explicitamente como tipo
import type { Locale } from '@/i18n-config';

/**
 * DICIONÁRIO ESTRUTURADO DE TRADUÇÕES
 * Centraliza os arquivos de idiomas. 
 * O 'as const' garante imutabilidade e inferência de tipos literal.
 */
export const translations = { 
  pt, 
  en, 
  es 
} as const;

/**
 * ENGENHARIA DE TIPOS (Type Safety)
 * Utilizamos o 'pt' como contrato mestre (Source of Truth). 
 * Isso garante que EN e ES sigam exatamente a mesma estrutura.
 */
export type TranslationContent = typeof pt;
export type ITranslations = typeof translations;

/**
 * HELPER DE ACESSO SEGURO (Type Guard)
 * Verifica se uma string de idioma é suportada pelo dicionário.
 */
export function isSupportedLang(lang: string): lang is keyof ITranslations {
  return Object.keys(translations).includes(lang);
}

/**
 * GET TRANSLATIONS (Otimizado para Next.js 15)
 * Recupera o dicionário de tradução com fallback para o idioma padrão.
 * * @param lang - Código do idioma (pt, en ou es)
 * @returns O dicionário de termos traduzidos com tipagem forte
 */
export const getTranslations = (lang: string | Locale): TranslationContent => {
  // Verificação rigorosa para garantir que o acesso ao objeto seja seguro
  if (isSupportedLang(lang)) {
    return translations[lang as keyof ITranslations];
  }

  // Fallback estratégico: Se o idioma solicitado for inválido (ex: /fr), 
  // retornamos Português para manter o portfólio funcional.
  return translations.pt;
};
