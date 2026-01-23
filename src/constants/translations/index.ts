// src/constants/translations/index.ts

import { pt } from './pt';
import { en } from './en';
import { es } from './es';
import type { Locale } from '@/i18n-config';

/**
 * AGREGADOR DE TRADUÇÕES (Central de Idiomas)
 * Gerencia a disponibilidade dos dicionários no sistema.
 * O 'as const' é fundamental para inferência de tipos em tempo de design.
 */
export const translations = { 
  pt, 
  en, 
  es 
} as const;

/**
 * ENGENHARIA DE TIPOS (Type Safety)
 * Definimos 'pt' como o contrato mestre (Source of Truth). 
 * Qualquer mudança em pt.ts exigirá atualização em en.ts e es.ts.
 */
export type TranslationContent = typeof pt;
export type ITranslations = typeof translations;

/**
 * TYPE GUARD DE SEGURANÇA
 * Garante que o código só acesse chaves existentes no objeto de traduções.
 */
export function isSupportedLang(lang: string): lang is keyof ITranslations {
  return lang in translations;
}

/**
 * GET TRANSLATIONS (Arquitetura Next.js 15+)
 * Função síncrona para recuperar o conteúdo traduzido.
 * Projetada para ser utilizada tanto em Client quanto Server Components.
 * * @param lang - Código do idioma extraído da URL ou Config
 * @returns Objeto de tradução tipado e validado
 */
export const getTranslations = (lang: string | Locale): TranslationContent => {
  // Verificação de suporte para evitar erros de 'undefined' no acesso à chave
  if (typeof lang === 'string' && isSupportedLang(lang)) {
    return translations[lang];
  }

  /**
   * FALLBACK ESTRATÉGICO
   * Se o idioma não for suportado (ex: /fr), retorna Português.
   * Isso garante que a interface sempre terá conteúdo renderizável.
   */
  return translations.pt;
};
