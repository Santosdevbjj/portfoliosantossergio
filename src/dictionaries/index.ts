import type { Dictionary } from '@/types/dictionary'

import pt from './pt.json'
import en from './en.json'
import es from './es.json'

import { validateDictionaries } from './validator'

export const ptDictionary = pt satisfies Dictionary
export const enDictionary = en satisfies Dictionary
export const esDictionary = es satisfies Dictionary

export type SupportedLocale = 'pt' | 'en' | 'es'

export const dictionaries: Record<SupportedLocale, Dictionary> = {
  pt: ptDictionary,
  en: enDictionary,
  es: esDictionary,
}

/**
 * Validação automática em DEV e BUILD
 */
if (process.env.NODE_ENV !== 'test') {
  validateDictionaries()
}

export function getDictionarySync(
  locale: SupportedLocale,
): Dictionary {
  return dictionaries[locale] ?? ptDictionary
}

export default dictionaries
