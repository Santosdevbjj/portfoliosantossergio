// src/constants/translations/index.ts

import { pt } from './pt';
import { en } from './en';
import { es } from './es';
import { Locale } from '@/i18n-config';

/**
 * DICIONÁRIO ESTRUTURADO DE TRADUÇÕES
 * Centraliza os arquivos de idiomas. 
 * O 'as const' é vital para manter a imutabilidade e inferência de tipos.
 */
export const translations = { 
  pt, 
  en, 
  es 
} as const;

/**
 * ENGENHARIA DE TIPOS (Type Safety)
 * Utilizamos o 'pt' como contrato mestre. 
 * Se uma chave for deletada ou renomeada em 'pt.ts', o VS Code marcará erro nos outros arquivos.
 */
export type TranslationContent = typeof pt;
export type ITranslations = typeof translations;

/**
 * HELPER DE ACESSO SEGURO (Type Guard)
 * Verifica se uma string de idioma é suportada pelo sistema.
 */
export function isSupportedLang(lang: string): lang is keyof ITranslations {
  return lang in translations;
}

/**
 * GET TRANSLATIONS
 * Recupera o dicionário de tradução com fallback automático.
 * * @param lang - Código do idioma vindo da URL ou configuração
 * @returns O dicionário de termos traduzidos
 */
export const getTranslations = (lang: string | Locale): TranslationContent => {
  // Se o idioma for suportado, retorna o dicionário correspondente
  if (isSupportedLang(lang)) {
    return translations[lang];
  }

  // Fallback estratégico: Se o idioma solicitado não existir, 
  // retornamos Português para garantir que o usuário veja conteúdo.
  return translations.pt;
};
