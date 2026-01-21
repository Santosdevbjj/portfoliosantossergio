import type { MetadataRoute } from 'next';
import { i18n } from '@/i18n-config';

/**
 * GERADOR DE SITEMAP DINÂMICO - NEXT.JS 15.5.9
 * Governança de SEO: Implementa hreflang (alternates) para PT, EN e ES.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // CORREÇÃO CRÍTICA: Acesso via index signature para evitar erro no build
  const baseUrl = (
    process.env['NEXT_PUBLIC_SITE_URL'] || 'https://portfoliosantossergio.vercel.app'
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
    changeFrequency: 'monthly' as const, // Cast necessário para satisfazer o tipo literal
    priority: locale === 'pt' ? 1.0 : 0.8,
    alternates: {
      languages: languagesMap,
    },
  }));

  // 2. Indexação dos Currículos (Assets Técnicos em PDF)
  const cvEntries: MetadataRoute.Sitemap = ['pt', 'en', 'es'].map((lang) => ({
    url: `${baseUrl}/cv-sergio-santos-${lang}.pdf`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // 3. Entrada da raiz (Redirecionamento/Canonical)
  const rootEntry: MetadataRoute.Sitemap[0] = {
    url: baseUrl,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 1.0,
    alternates: {
      languages: languagesMap,
    },
  };

  return [rootEntry, ...localeEntries, ...cvEntries];
}
