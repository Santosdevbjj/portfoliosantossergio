import 'server-only'

import type { Dictionary } from '@/types/dictionary'
import { ptDictionary, enDictionary, esDictionary } from '@/dictionaries'

/**
 * Idiomas suportados (single source of truth)
 */
export const locales = ['pt', 'en', 'es'] as const
export type Locale = (typeof locales)[number]

/**
 * Dicionários já validados em build
 */
const dictionaries: Record<Locale, Dictionary> = {
  pt: ptDictionary,
  en: enDictionary,
  es: esDictionary,
}

/**
 * Type guard seguro
 */
export const isLocale = (value: unknown): value is Locale => {
  return typeof value === 'string' && locales.includes(value as Locale)
}

/**
 * Normaliza locale vindo da rota
 */
export const getSafeLocale = (value?: string | null): Locale => {
  return isLocale(value) ? value : 'pt'
}

/**
 * Retorna dicionário tipado e seguro
 * Nunca retorna undefined
 */
export const getDictionary = (locale?: string | null): Dictionary => {
  const safeLocale = getSafeLocale(locale)
  return dictionaries[safeLocale]
}
