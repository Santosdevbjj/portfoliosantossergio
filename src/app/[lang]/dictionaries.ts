import 'server-only'

const dictionaries = {
  pt: () => import('@/dictionaries/pt.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  es: () => import('@/dictionaries/es.json').then((module) => module.default),
}

export type Locale = keyof typeof dictionaries
export const locales = Object.keys(dictionaries) as Locale[]

export const hasLocale = (locale: string): locale is Locale => {
  return locale in dictionaries
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]()
