import 'server-only'

/**
 * DICIONÁRIOS DINÂMICOS MULTILÍNGUE
 *
 * Este módulo roda exclusivamente no servidor:
 * - reduz o bundle do cliente
 * - evita exposição de lógica de i18n
 * - permite code splitting por idioma
 */

/**
 * Lista canônica de idiomas suportados
 * (single source of truth)
 */
export const locales = ['pt', 'en', 'es'] as const

export type Locale = (typeof locales)[number]

/**
 * Loaders de dicionário por idioma
 */
const dictionaries: Record<Locale, () => Promise<Record<string, any>>> = {
  pt: async () => (await import('@/dictionaries/pt.json')).default,
  en: async () => (await import('@/dictionaries/en.json')).default,
  es: async () => (await import('@/dictionaries/es.json')).default,
}

/**
 * Type guard seguro para Locale
 */
export const isLocale = (value: unknown): value is Locale => {
  return typeof value === 'string' && locales.includes(value as Locale)
}

/**
 * Normaliza o locale recebido (rota, middleware, params)
 */
export const getSafeLocale = (value?: string | null): Locale => {
  return isLocale(value) ? value : 'pt'
}

/**
 * Carrega o dicionário de forma segura.
 * Sempre retorna um dicionário válido para evitar crash em build.
 */
export const getDictionary = async (
  locale?: string | null
): Promise<Record<string, any>> => {
  const safeLocale = getSafeLocale(locale)

  try {
    return await dictionaries[safeLocale]()
  } catch (error) {
    console.error(
      `[i18n] Falha ao carregar dicionário (${safeLocale}). Fallback para PT.`,
      error
    )

    return dictionaries.pt()
  }
}
