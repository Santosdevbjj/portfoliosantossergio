// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { i18n } from '@/i18n-config';

/**
 * GERADOR DE SITEMAP DINÂMICO
 * Essencial para SEO: informa ao Google a existência das versões PT, EN e ES.
 * Previne penalização por conteúdo duplicado através da relação hreflang.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://portfoliosantossergio.vercel.app'
  ).replace(/\/$/, '');
  
  const lastModified = new Date();

  // Definição centralizada dos links alternativos (hreflang)
  // Isso diz ao Google: "Se o usuário fala espanhol, mostre a rota /es"
  const languagesMap = {
    'pt': `${baseUrl}/pt`,
    'en': `${baseUrl}/en`,
    'es': `${baseUrl}/es`,
    'x-default': `${baseUrl}/pt`, // O português é seu idioma base
  };

  // 1. Mapeamento das rotas específicas de cada idioma
  const localeEntries: MetadataRoute.Sitemap = i18n.locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: locale === i18n.defaultLocale ? 1.0 : 0.8,
    // No Next.js 15, usamos alternates.languages para gerar as tags hreflang automáticas no XML
    alternates: {
      languages: languagesMap,
    },
  }));

  // 2. Entrada para a URL raiz (https://portfoliosantossergio.vercel.app/)
  const rootEntry: MetadataRoute.Sitemap[0] = {
    url: baseUrl,
    lastModified,
    changeFrequency: 'weekly',
    priority: 1.0,
    alternates: {
      languages: languagesMap,
    },
  };

  return [rootEntry, ...localeEntries];
}
