// src/app/sitemap.ts
import type { MetadataRoute } from 'next';

import { i18n } from '@/i18n-config';

/**
 * GERADOR DE SITEMAP DINÂMICO - NEXT.JS 15
 * Resolve o erro de sintaxe e garante indexação multilingue correta.
 * Essencial para que o Google entenda a estrutura multilingue e não penalize por conteúdo duplicado.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://portfoliosantossergio.vercel.app'
  ).replace(/\/$/, '');
  const lastModified = new Date();

  // Mapeamento das rotas por idioma (PT, EN, ES)
  const localeEntries: MetadataRoute.Sitemap = i18n.locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: locale === i18n.defaultLocale ? 1.0 : 0.8,
    languages: {
      'pt-BR': `${baseUrl}/pt`,
      'en-US': `${baseUrl}/en`,
      'es-ES': `${baseUrl}/es`,
      'x-default': `${baseUrl}/pt`,
    },
  }));

  // Adicionamos a URL raiz (/) para garantir indexação completa do domínio
  const rootEntry: MetadataRoute.Sitemap[0] = {
    url: baseUrl,
    lastModified,
    changeFrequency: 'weekly',
    priority: 1.0,
    languages: {
      'pt-BR': `${baseUrl}/pt`,
      'en-US': `${baseUrl}/en`,
      'es-ES': `${baseUrl}/es`,
      'x-default': `${baseUrl}/pt`,
    },
  };

  return [rootEntry, ...localeEntries];
}
