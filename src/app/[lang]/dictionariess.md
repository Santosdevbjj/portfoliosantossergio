import 'server-only'

import type { Dictionary } from '@/types/dictionary'
import { ptDictionary, enDictionary, esDictionary } from '@/dictionaries'

/**
 * Idiomas suportados
 * Single source of truth para rotas, middleware e i18n
 */
export const locales = ['pt', 'en', 'es'] as const
export type Locale = (typeof locales)[number]

/**
 * Mapa de dicionários
 * ✔ Validado em build
 * ✔ Exhaustivo (nenhum idioma pode faltar)
 * ✔ Tipado sem Record<string, any>
 */
const dictionaries = {
  pt: ptDictionary,
  en: enDictionary,
  es: esDictionary,
} satisfies Record<Locale, Dictionary>

/**
 * Type guard seguro para Locale
 */
export const isLocale = (value: unknown): value is Locale => {
  return typeof value === 'string' && locales.includes(value as Locale)
}

/**
 * Normaliza locale vindo da rota, cookies ou headers
 * Sempre retorna um Locale válido
 */
export const getSafeLocale = (value?: string | null): Locale => {
  return isLocale(value) ? value : 'pt'
}

/**
 * Retorna o dicionário tipado e seguro
 * - Nunca retorna undefined
 * - Nunca lança erro
 * - 100% compatível com Dictionary.ts
 */
export const getDictionary = (locale?: string | null): Dictionary => {
  const safeLocale = getSafeLocale(locale)
  return dictionaries[safeLocale]
}
