import type { Dictionary } from './dictionary'

/**
 * ProjectCategory
 * 🔒 Union derivada DIRETAMENTE do dicionário
 * Totalmente alinhada com i18n (pt / en / es)
 */
export type ProjectCategory =
  keyof Dictionary['projects']['categories']
