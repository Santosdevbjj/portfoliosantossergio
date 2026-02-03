import type { Dictionary } from '@/types/dictionary'
import type { SupportedLocale } from './index'

import { dictionaries } from './index'

/**
 * Resultado da validação
 */
interface ValidationResult {
  locale: SupportedLocale
  missingKeys: string[]
  extraKeys: string[]
}

/**
 * Percorre um objeto recursivamente e retorna todas as chaves
 * no formato dot-notation (ex: hero.title, seo.pages.home.title)
 */
function extractKeys(
  obj: Record<string, any>,
  prefix = '',
): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key

    if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      return extractKeys(value, fullKey)
    }

    return [fullKey]
  })
}

/**
 * Valida um dicionário específico contra o dicionário base (pt)
 */
function validateLocale(
  base: Dictionary,
  target: Dictionary,
  locale: SupportedLocale,
): ValidationResult {
  const baseKeys = extractKeys(base)
  const targetKeys = extractKeys(target)

  const missingKeys = baseKeys.filter(
    key => !targetKeys.includes(key),
  )

  const extraKeys = targetKeys.filter(
    key => !baseKeys.includes(key),
  )

  return {
    locale,
    missingKeys,
    extraKeys,
  }
}

/**
 * Validador principal de dicionários
 * Deve ser executado em DEV e BUILD
 */
export function validateDictionaries(): void {
  const baseLocale: SupportedLocale = 'pt'
  const baseDictionary = dictionaries[baseLocale]

  const results: ValidationResult[] = (
    Object.keys(dictionaries) as SupportedLocale[]
  )
    .filter(locale => locale !== baseLocale)
    .map(locale =>
      validateLocale(
        baseDictionary,
        dictionaries[locale],
        locale,
      ),
    )

  const hasErrors = results.some(
    r => r.missingKeys.length || r.extraKeys.length,
  )

  if (!hasErrors) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(
        '✅ Dictionaries validation passed (pt / en / es)',
      )
    }
    return
  }

  console.error('❌ Dictionary validation failed:\n')

  results.forEach(result => {
    const { locale, missingKeys, extraKeys } = result

    if (missingKeys.length) {
      console.error(
        `🔴 [${locale}] Missing keys:\n` +
          missingKeys.map(k => `  - ${k}`).join('\n'),
      )
    }

    if (extraKeys.length) {
      console.error(
        `🟠 [${locale}] Extra keys:\n` +
          extraKeys.map(k => `  - ${k}`).join('\n'),
      )
    }
  })

  throw new Error(
    'Dictionary validation failed. Fix missing/extra keys.',
  )
}
