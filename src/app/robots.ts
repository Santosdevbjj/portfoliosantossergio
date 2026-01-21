import type { MetadataRoute } from 'next'

/**
 * CONFIGURAÇÃO DE ROBOTS - NEXT.JS 15 (2026)
 * Controla o comportamento de rastreamento para Google, Bing e Bots de IA.
 * Estruturado para suportar o SEO multilingue (i18n) e proteção de assets.
 */
export default function robots(): MetadataRoute.Robots {
  // Fallback seguro para a URL de produção
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://portfoliosantossergio.vercel.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',              // Home (Redirect)
          '/pt',            // Versão Português
          '/en',            // Versão Inglês
          '/es',            // Versão Espanhol
          '/images/',       // Imagens dos projetos e perfil
          '/icons/',        // Favicons e Apple Icons
          '/cv-*.pdf',      // Permite indexação direta dos seus currículos
        ],
        disallow: [
          '/api/',          // Rotas de servidor (Segurança)
          '/_next/',        // Arquivos internos do Next.js
          '/static/',       // Evita redundância de arquivos estáticos compilados
          '/admin/',        // Segurança de rotas administrativas
          '/private/',      // Pastas privadas
          '/*.json$',       // Bloqueia indexação de manifestos e configs JSON
        ],
      },
      {
        /**
         * POLÍTICA ESPECÍFICA PARA BOTS DE INTELIGÊNCIA ARTIFICIAL
         * Permite que modelos como GPT-4 e Claude indexem seu portfólio.
         * Isso ajuda o seu perfil a aparecer em recomendações de IA para vagas.
         */
        userAgent: ['GPTBot', 'ChatGPT-User', 'Claude-bot', 'Google-Extended'],
        allow: ['/pt', '/en', '/es'],
        disallow: ['/api/'],
      }
    ],
    // Vinculação com o Sitemap (Essencial para SEO multilingue)
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
