import 'server-only';
import type { Locale } from '@/i18n-config';

/**
 * MOTOR DE DICIONÁRIOS - NEXT.JS 16 (SERVER-SIDE)
 * A diretiva 'server-only' garante que os JSONs de tradução não sejam 
 * enviados ao cliente desnecessariamente, melhorando a segurança e performance.
 */

const dictionaries = {
  /**
   * Lazy loading com Caminhos Relativos:
   * AJUSTE: Alterado de '@/' para '../' para garantir que a Vercel localize os arquivos 
   * no ambiente de produção, corrigindo o erro de "Cannot find module".
   */
  pt: () => import('../dictionaries/pt.json').then((module) => module.default),
  en: () => import('../dictionaries/en.json').then((module) => module.default),
  es: () => import('../dictionaries/es.json').then((module) => module.default),
};

/**
 * getDictionary: Busca o conteúdo traduzido.
 * @param locale - Idioma detectado (pt | en | es)
 * @returns Objeto de tradução completo para o idioma solicitado.
 */
export const getDictionary = async (locale: Locale) => {
  try {
    // Tenta carregar o dicionário solicitado ou cai no fallback (pt)
    const loader = dictionaries[locale] || dictionaries.pt;
    return await loader();
  } catch (error) {
    console.error(`[Dictionary Error] Falha ao carregar idioma: ${locale}`, error);
    
    // Fallback crítico: se o arquivo JSON estiver corrompido ou faltando,
    // retorna o padrão para evitar que o site quebre.
    try {
      return await dictionaries.pt();
    } catch (criticalError) {
      console.error("[Dictionary Critical] Falha total ao carregar fallback PT", criticalError);
      return {}; // Retorna objeto vazio como última instância
    }
  }
};

/**
 * Utilitário de Tipo para TypeScript
 * Permite usar: interface Props { dict: Dictionary } nos seus componentes.
 */
export type Dictionary = Awaited<ReturnType<typeof dictionaries.pt>>;
