import 'server-only'

/**
 * CONFIGURAÇÃO DE DICIONÁRIOS DINÂMICOS
 * Este arquivo reside exclusivamente no servidor para proteger a lógica de i18n
 * e reduzir o bundle size do cliente.
 */

const dictionaries = {
  pt: () => import('@/dictionaries/pt.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  es: () => import('@/dictionaries/es.json').then((module) => module.default),
}

export type Locale = keyof typeof dictionaries

/**
 * Lista estática de locales suportados para uso em 
 * middlewares e funções de geração de parâmetros estáticos.
 */
export const locales: Locale[] = ['pt', 'en', 'es']

/**
 * Type Guard para validar se uma string é um locale suportado.
 * Útil para evitar erros de runtime ao acessar o objeto dictionaries.
 */
export const hasLocale = (locale: string): locale is Locale => {
  return Object.keys(dictionaries).includes(locale)
}

/**
 * Busca o dicionário de forma assíncrona.
 * Implementa fallback para 'pt' em caso de falha no carregamento do módulo.
 */
export const getDictionary = async (locale: Locale) => {
  try {
    const loadDictionary = dictionaries[locale] ?? dictionaries.pt
    return await loadDictionary()
  } catch (error) {
    console.error(`[i18n] Falha ao carregar o dicionário para: ${locale}`, error)
    // Retorna o dicionário padrão como última linha de defesa
    return dictionaries.pt()
  }
}
