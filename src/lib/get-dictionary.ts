import 'server-only';
import type { Locale } from '@/i18n-config';

/**
 * MOTOR DE DICIONÁRIOS — NEXT.JS 16 (SERVER-SIDE)
 * ------------------------------------------------
 * - Garante carregamento lazy dos JSONs
 * - Evita envio de dicionários ao client
 * - Normaliza a estrutura para prevenir erros de SSR
 */

/**
 * Estrutura mínima garantida do dicionário.
 * Isso evita erros como:
 * "Cannot destructure property 'featured' of 'articles' as it is undefined"
 */
type DictionaryShape = {
  articles: {
    featured: unknown[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

/**
 * Dicionário base de segurança (fallback estrutural)
 * ⚠️ NUNCA deve ser vazio
 */
const BASE_DICTIONARY: DictionaryShape = {
  articles: {
    featured: [],
  },
};

/**
 * Loaders de dicionário por idioma
 * Caminhos relativos para compatibilidade total com Vercel
 */
const dictionaries: Record<Locale, () => Promise<any>> = {
  pt: () => import('../dictionaries/pt.json').then((m) => m.default),
  en: () => import('../dictionaries/en.json').then((m) => m.default),
  es: () => import('../dictionaries/es.json').then((m) => m.default),
};

/**
 * Normaliza o dicionário para garantir shape estável
 */
function normalizeDictionary(raw: any): DictionaryShape {
  return {
    ...BASE_DICTIONARY,
    ...raw,
    articles: {
      ...BASE_DICTIONARY.articles,
      ...(raw?.articles ?? {}),
      featured: Array.isArray(raw?.articles?.featured)
        ? raw.articles.featured
        : [],
    },
  };
}

/**
 * getDictionary
 * ------------------------------------------------
 * - Nunca retorna undefined
 * - Nunca retorna objeto sem articles.featured
 * - Sempre retorna um dicionário seguro para SSR
 */
export const getDictionary = async (locale: Locale) => {
  try {
    const loader = dictionaries[locale] ?? dictionaries.pt;
    const rawDict = await loader();

    return normalizeDictionary(rawDict);
  } catch (error) {
    console.error(
      `[Dictionary Error] Falha ao carregar idioma: ${locale}`,
      error
    );

    try {
      const fallback = await dictionaries.pt();
      return normalizeDictionary(fallback);
    } catch (criticalError) {
      console.error(
        '[Dictionary Critical] Falha total ao carregar fallback PT',
        criticalError
      );

      // Última linha de defesa — site NUNCA quebra
      return BASE_DICTIONARY;
    }
  }
};

/**
 * Tipo utilitário para uso nos componentes
 * Exemplo:
 * const dict = await getDictionary(lang);
 * dict.articles.featured // sempre seguro
 */
export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
