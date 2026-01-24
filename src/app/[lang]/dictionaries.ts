import 'server-only'

/**
 * DICIONÁRIOS DINÂMICOS MULTILÍNGUE
 * 
 * Este módulo só roda no servidor para reduzir o bundle do cliente
 * e proteger a lógica de i18n.
 */

const dictionaries = {
  pt: () => import('@/dictionaries/pt.json').then((mod) => mod.default),
  en: () => import('@/dictionaries/en.json').then((mod) => mod.default),
  es: () => import('@/dictionaries/es.json').then((mod) => mod.default),
} as const

export type Locale = keyof typeof dictionaries

/**
 * Lista de idiomas suportados, usada em middlewares e geração de rotas.
 */
export const locales: Locale[] = ['pt', 'en', 'es']

/**
 * Type Guard para validar se uma string é um locale suportado.
 */
export const hasLocale = (locale: string): locale is Locale => {
  return Object.keys(dictionaries).includes(locale)
}

/**
 * Busca o dicionário de forma assíncrona.
 * Retorna o dicionário padrão ('pt') caso ocorra algum erro.
 */
export const getDictionary = async (locale: Locale) => {
  try {
    const loadDictionary = dictionaries[locale] ?? dictionaries.pt
    return await loadDictionary()
  } catch (error) {
    console.error(`[i18n] Falha ao carregar o dicionário para: ${locale}`, error)
    return dictionaries.pt()
  }
}
