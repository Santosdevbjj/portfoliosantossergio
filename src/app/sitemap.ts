// src/app/sitemap.ts
import { MetadataRoute } from 'next'

/**
 * Gerador de Sitemap Dinâmico - Next.js 15
 * Este arquivo gera automaticamente as entradas para os buscadores,
 * garantindo a correlação entre as versões PT, EN e ES (Hreflang).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://portfoliosantossergio.vercel.app'
  const locales = ['pt', 'en', 'es']
  const lastModified = new Date()

  // Mapeamento das rotas base (neste caso, a Home para cada idioma)
  return locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: locale === 'pt' ? 1 : 0.8,
    // Configuração Multilingue (Hreflang)
    // Isso diz ao Google que cada página tem suas versões irmãs em outros idiomas
    languages: {
      pt: `${baseUrl}/pt`,
      en: `${baseUrl}/en`,
      es: `${baseUrl}/es`,
      'x-default': `${baseUrl}/pt`, // Define PT como padrão global
    },
  }))
}
