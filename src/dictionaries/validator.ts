import type { Dictionary } from '../types/dictionary'
import type { SupportedLocale } from './index'
import { dictionaries } from './index'

interface ValidationResult {
  locale: SupportedLocale
  missingKeys: string[]
  extraKeys: string[]
  emptyArrays: string[]
}

/**
 * Arrays que não podem estar vazios
 */
const REQUIRED_NON_EMPTY_ARRAYS = ['about.highlights']

function extractKeys(obj: Record<string, any>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key

    if (Array.isArray(value)) {
      if (REQUIRED_NON_EMPTY_ARRAYS.includes(fullKey) && value.length === 0) {
        return [`${fullKey}[] (empty array)`]
      }
      return [fullKey]
    }

    if (value !== null && typeof value === 'object') {
      return extractKeys(value, fullKey)
    }

    return [fullKey]
  })
}

function validateLocale(base: Dictionary, target: Dictionary, locale: SupportedLocale): ValidationResult {
  const baseKeys = extractKeys(base)
  const targetKeys = extractKeys(target)

  const missingKeys = baseKeys.filter(key => !targetKeys.includes(key))
  const extraKeys = targetKeys.filter(key => !baseKeys.includes(key))
  const emptyArrays = targetKeys.filter(key => key.includes('(empty array)'))

  return { locale, missingKeys, extraKeys, emptyArrays }
}

/**
 * Validador principal de dicionários
 */
export function validateDictionaries(): void {
  const baseLocale: SupportedLocale = 'pt'
  const baseDictionary = dictionaries[baseLocale]

  const results: ValidationResult[] = (Object.keys(dictionaries) as SupportedLocale[])
    .filter(locale => locale !== baseLocale)
    .map(locale => validateLocale(baseDictionary, dictionaries[locale], locale))

  const hasErrors = results.some(r => r.missingKeys.length || r.extraKeys.length || r.emptyArrays.length)

  if (!hasErrors) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('✅ Dictionaries validation passed (pt / en / es)')
    }
    return
  }

  console.error('❌ Dictionary validation failed:\n')

  results.forEach(result => {
    const { locale, missingKeys, extraKeys, emptyArrays } = result

    if (missingKeys.length) {
      console.error(`🔴 [${locale}] Missing keys:\n` + missingKeys.map(k => `  - ${k}`).join('\n'))
    }

    if (extraKeys.length) {
      console.error(`🟠 [${locale}] Extra keys:\n` + extraKeys.map(k => `  - ${k}`).join('\n'))
    }

    if (emptyArrays.length) {
      console.error(`⚠️ [${locale}] Empty arrays:\n` + emptyArrays.map(k => `  - ${k}`).join('\n'))
    }
  })

  throw new Error('Dictionary validation failed. Fix missing/extra keys or empty arrays.')
}
