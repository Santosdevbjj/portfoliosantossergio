import type { MetadataRoute } from 'next';
import { i18n } from '@/i18n-config';

/**
 * GERADOR DE SITEMAP DINÂMICO - NEXT.JS 15
 * Responsável por indexar as rotas multilingues e os assets estratégicos (CVs).
 * Implementa a lógica de hreflang para garantir o SEO internacional correto.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://portfoliosantossergio.vercel.app'
  ).replace(/\/$/, '');
  
  const lastModified = new Date();

  // Mapeamento de idiomas para as tags 'alternates' (hreflang)
  const languagesMap = {
    pt: `${baseUrl}/pt`,
    en: `${baseUrl}/en`,
    es: `${baseUrl}/es`,
    'x-default': `${baseUrl}/pt`, // Português como idioma de fallback
  };

  // 1. Mapeamento das páginas principais por idioma
  const localeEntries: MetadataRoute.Sitemap = i18n.locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: locale === 'pt' ? 1.0 : 0.9, // Prioridade máxima para a home no idioma principal
    alternates: {
      languages: languagesMap,
    },
  }));

  // 2. Indexação dos Currículos (Estratégico para busca orgânica de recrutadores)
  const cvEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/cv-sergio-santos-pt.pdf`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/cv-sergio-santos-en.pdf`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/cv-sergio-santos-es.pdf`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    }
  ];

  // 3. Entrada da raiz (URL base que redireciona para o idioma padrão)
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
