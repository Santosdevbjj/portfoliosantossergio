import type { MetadataRoute } from 'next';

import { i18n } from '@/i18n-config';

/**
 * GERADOR DE SITEMAP DINÂMICO - NEXT.JS 15.5.9
 * Governança de SEO: Implementa hreflang (alternates) para PT, EN e ES.
 * Estratégia: Indexa as rotas localizadas e os documentos PDF estratégicos.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Garantia de URL absoluta para SEO impecável
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://portfoliosantossergio.vercel.app'
  ).replace(/\/$/, '');
  
  const lastModified = new Date();

  // Mapeamento de hreflang para sinalizar ao Google a relação entre os idiomas
  const languagesMap = {
    pt: `${baseUrl}/pt`,
    en: `${baseUrl}/en`,
    es: `${baseUrl}/es`,
    'x-default': `${baseUrl}/pt`, 
  };

  // 1. Mapeamento das páginas principais (Home de cada idioma)
  const localeEntries: MetadataRoute.Sitemap = i18n.locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: locale === 'pt' ? 1.0 : 0.8,
    alternates: {
      languages: languagesMap,
    },
  }));

  // 2. Indexação dos Currículos (Assets Técnicos)
  // Indexar PDFs aumenta a relevância para buscas específicas de "Sérgio Santos Curriculum"
  const cvEntries: MetadataRoute.Sitemap = ['pt', 'en', 'es'].map((lang) => ({
    url: `${baseUrl}/cv-sergio-santos-${lang}.pdf`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // 3. Entrada da raiz (Canonical)
  const rootEntry: MetadataRoute.Sitemap[0] = {
    url: baseUrl,
    lastModified,
    changeFrequency: 'monthly',
    priority: 1.0,
    alternates: {
      languages: languagesMap,
    },
  };

  return [rootEntry, ...localeEntries, ...cvEntries];
}
