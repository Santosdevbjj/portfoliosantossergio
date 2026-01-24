import pt from './pt.json'
import en from './en.json'
import es from './es.json'

import type { Dictionary } from '@/types/dictionary'

/**
 * VALIDAÇÃO EM TEMPO DE BUILD
 * 
 * Se qualquer JSON:
 * - faltar chave
 * - tiver tipo errado
 * - estrutura divergente
 * 
 * 👉 o build quebra aqui
 */

export const ptDictionary = pt satisfies Dictionary
export const enDictionary = en satisfies Dictionary
export const esDictionary = es satisfies Dictionary
