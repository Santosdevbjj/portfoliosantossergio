import 'server-only';
import type { Locale } from '@/i18n-config';

/**
 * MOTOR DE DICIONÁRIOS — INFRAESTRUTURA DE DADOS
 * Gerencia o carregamento assíncrono e a segurança estrutural das traduções.
 */

/**
 * Define a forma mínima que o dicionário deve ter.
 * Essencial para evitar erros de renderização em componentes complexos como FeaturedArticle.
 */
interface DictionaryShape {
  common: {
    viewProject: string;
    liveDemo: string;
    [key: string]: string;
  };
  articles: {
    featured: any;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Estrutura Base de Segurança (Last Line of Defense)
 * Garante que chaves críticas existam mesmo se o JSON estiver corrompido.
 */
const BASE_DICTIONARY: DictionaryShape = {
  common: {
    viewProject: "View GitHub",
    liveDemo: "Live Demo"
  },
  articles: {
    featured: null
  }
};

/**
 * Loader de Dicionários com Lazy Loading
 * Otimizado para Next.js 15/16 e Vercel Edge Functions.
 */
const dictionaries: Record<Locale, () => Promise<any>> = {
  pt: () => import('../dictionaries/pt.json').then((m) => m.default),
  en: () => import('../dictionaries/en.json').then((m) => m.default),
  es: () => import('../dictionaries/es.json').then((m) => m.default),
};

/**
 * Função de Normalização
 * Mescla o conteúdo carregado com a estrutura base para evitar erros de 'undefined'.
 */
function normalize(raw: any): DictionaryShape {
  return {
    ...BASE_DICTIONARY,
    ...raw,
    common: { ...BASE_DICTIONARY.common, ...(raw?.common || {}) },
    articles: { ...BASE_DICTIONARY.articles, ...(raw?.articles || {}) }
  };
}

/**
 * getDictionary
 * Ponto de entrada único para buscar traduções no servidor.
 */
export const getDictionary = async (locale: Locale): Promise<DictionaryShape> => {
  try {
    // Tenta carregar o idioma solicitado ou cai para o português
    const loadLanguage = dictionaries[locale] || dictionaries.pt;
    const content = await loadLanguage();
    
    return normalize(content);
  } catch (error) {
    console.error(`[i18n] Erro ao carregar dicionário (${locale}):`, error);

    // Tentativa de recuperação automática (Fallback para PT)
    try {
      const fallback = await dictionaries.pt();
      return normalize(fallback);
    } catch {
      // Falha total: Retorna estrutura mínima de emergência
      return BASE_DICTIONARY;
    }
  }
};

/**
 * Tipo exportado para tipagem de Props em componentes
 * Ex: interface Props { dict: Dictionary }
 */
export type Dictionary = DictionaryShape;
