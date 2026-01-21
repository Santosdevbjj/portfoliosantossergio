import type { MetadataRoute } from 'next';

/**
 * CONFIGURAÇÃO DE ROBOTS - NEXT.JS 15.5.9 (2026)
 * Governança de SEO: Controle de rastreamento para buscadores e modelos de LLM.
 */
export default function robots(): MetadataRoute.Robots {
  // CORREÇÃO CRÍTICA: Acesso via index signature para evitar o erro de build da Vercel
  const baseUrl = (
    process.env['NEXT_PUBLIC_SITE_URL'] || 'https://portfoliosantossergio.vercel.app'
  ).replace(/\/$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',              // Home e Redirecionamentos
          '/pt',            // Localidade PT
          '/en',            // Localidade EN
          '/es',            // Localidade ES
          '/images/',       // Assets visuais
        ],
        disallow: [
          '/api/',          // Endpoints de API
          '/_next/',        // Cache interno do Next.js
          '/private/',      // Conteúdo restrito
        ],
      },
      {
        /**
         * IA BOT GOVERNANCE (2026)
         * Permite que agentes de IA processem seu perfil para buscas semânticas.
         */
        userAgent: ['GPTBot', 'ChatGPT-User', 'Claude-bot', 'Google-Extended'],
        allow: ['/pt', '/en', '/es'],
        disallow: ['/api/', '/_next/'],
      }
    ],
    // Vinculação com o Sitemap para facilitar a descoberta de rotas
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
