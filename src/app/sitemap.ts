// src/app/sitemap.ts
import { MetadataRoute } from 'next'
import { i18n } from '@/i18n-config'

/**
 * GERADOR DE SITEMAP DINÂMICO - NEXT.JS 15
 * Cria o mapeamento de URLs e as relações hreflang para garantir que 
 * o Google entregue a versão correta do site dependendo do país do usuário.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfoliosantossergio.vercel.app'
  const lastModified = new Date()

  // Geramos as entradas para cada idioma suportado
  return i18n.locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified,
    changeFrequency: 'weekly', // Alterado para semanal para indexar novos projetos mais rápido
    priority: locale === i18n.defaultLocale ? 1.0 : 0.8,
    
    /**
     * RELAÇÕES DE IDIOMA (Hreflang)
     * Essencial para SEO Internacional: evita que o Google considere as versões 
     * traduzidas como "conteúdo duplicado".
     */
    languages: {
      'pt-BR': `${baseUrl}/pt`,
      'en-US': `${baseUrl}/en`,
      'es-ES': `${baseUrl}/es`,
      'x-default': `${baseUrl}/pt`, // Direciona usuários de outros idiomas para a versão principal
    },
  }))
}
