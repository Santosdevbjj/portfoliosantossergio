/**
 * Dictionary — Contrato único e tipado de i18n do projeto
 * Unifica a versão original com as métricas de autoridade.
 */

export interface Dictionary {
  meta?: {
    version: string
    locale: string
    direction: string
    lastUpdated: string
    author: string
    source: string
  }

  common: {
    navigation: string
    role: string
    footer: string | { copyright: string; rights: string }
    builtWith: string
    loading?: string
    error?: string
    socialLinks?: string
    languageSwitcher?: string
    errorBoundary?: {
      title: string
      description?: string
      actions?: { retry: string; home: string }
    }
    notFound?: {
      title: string
      description: string
      button: string
    }
    externalLinks?: Record<string, { url?: string; label?: string; address?: string; mailto?: string }>
    menu?: {
      open: string
      close: string
      aria?: { open: string; close: string }
    }
  }

  states?: {
    loading?: string
    empty?: string
    error?: string
    emptyProjects?: { title: string; description: string; cta: string }
    emptyExperience?: string
    errorArticles?: string
  }

  intl?: {
    locale: string
    fallbackLocale?: string
    currency: string
    timezone?: string
    unitDisplay?: string
    numberFormat: string
  }
}
