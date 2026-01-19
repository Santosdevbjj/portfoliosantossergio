// src/app/sitemap.ts
import type { MetadataRoute } from 'next'

import { i18n } from '@/i18n-config'

/**
 * GERADOR DE SITEMAP DINÂMICO - NEXT.JS 15
 * Cria o mapeamento de URLs e as relações hreflang.
 * Essencial para que o Google entenda a estrutura multilingue e não penalize por conteúdo duplicado.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://portfoliosantossergio.vercel.app').replace(/\/$/, '')
  const lastModified = new Date()

  // Mapeamento das rotas por idioma
  const localeEntries = i18n.locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: locale === i18n.defaultLocale ? 1.0 : 0.8,
    languages: {
      'pt-BR': `${baseUrl}/pt`,
      'en-US': `${baseUrl}/en`,
      'es-ES': `${baseUrl}/es`,
      'x-default': `${baseUrl}/pt`,
    },
  }))

  // Adicionamos a URL raiz (/) para garantir indexação completa do domínio
  const rootEntry = {
    url: baseUrl,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 1.0,
    languages: {
      'pt-BR': `${baseUrl}/pt`,
      'en-US': `${baseUrl}/en`,
      'es-ES': `${baseUrl}/es',
      'x-default': `${baseUrl}/pt`,
    },
  }

  return [rootEntry, ...localeEntries]
}
