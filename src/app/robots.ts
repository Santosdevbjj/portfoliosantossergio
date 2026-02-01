import type { MetadataRoute } from 'next'

/**
 * ROBOTS.TXT — NEXT.JS 16 (ESTRATÉGIA 2026)
 * -----------------------------------------------------------------------------
 * ✔ SEO internacional (pt / en / es)
 * ✔ Compatível com App Router e RSC
 * ✔ Seguro para buscadores e LLMs
 * ✔ Produção-ready
 */

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    'https://portfoliosantossergio.vercel.app'
  ).replace(/\/$/, '')

  return {
    rules: [
      /**
       * 1️⃣ BUSCADORES GERAIS
       * Permite indexação total do conteúdo público
       * Bloqueia apenas áreas sensíveis
       */
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/private/',
          '/admin/',
        ],
      },

      /**
       * 2️⃣ AGENTES DE IA / LLMs
       * Permite leitura semântica do conteúdo público
       * Protege APIs e áreas internas
       */
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'Claude-bot',
          'Google-Extended',
          'PerplexityBot',
          'CCBot', // Common Crawl
        ],
        allow: [
          '/pt',
          '/en',
          '/es',
        ],
        disallow: [
          '/api/',
          '/private/',
          '/admin/',
        ],
      },
    ],

    /**
     * Sitemap internacional
     */
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
