import 'server-only';
import type { Locale } from '@/i18n-config';

/**
 * MOTOR DE DICIONÁRIOS - NEXT.JS 15
 * Este arquivo utiliza a diretiva 'server-only' para garantir que as traduções
 * sejam processadas no servidor, economizando banda do lado do cliente.
 */

const dictionaries = {
  // Carregamento sob demanda (Lazy Loading) para performance máxima
  pt: () => import('@/dictionaries/pt.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  es: () => import('@/dictionaries/es.json').then((module) => module.default),
};

/**
 * Função assíncrona para buscar o dicionário de tradução.
 * Implementa um sistema de fallback seguro caso o idioma seja indefinido.
 * * @param locale - O idioma identificado pelo Middleware (pt, en ou es)
 * @returns O objeto JSON contendo todas as strings do site
 */
export const getDictionary = async (locale: Locale) => {
  // Verificação de segurança: se o dicionário não existir, retorna o padrão (PT)
  // Isso evita erros de "Runtime" caso ocorra uma falha na detecção do idioma.
  return (
    dictionaries[locale]?.() ?? 
    dictionaries.pt()
  );
};

// Exportamos o tipo do dicionário para ser usado em outros componentes
export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
