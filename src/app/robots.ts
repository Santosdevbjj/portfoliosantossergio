import type { MetadataRoute } from 'next';

/**
 * CONFIGURAÇÃO DE ROBOTS - NEXT.JS 15.5.9 (2026)
 * Governança de SEO: Controle de rastreamento para buscadores e modelos de LLM.
 * Estrutura: Otimizada para i18n e proteção de rotas de servidor.
 */
export default function robots(): MetadataRoute.Robots {
  // Garantia de URL base absoluta e limpa
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://portfoliosantossergio.vercel.app'
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
          '/cv-*.pdf',      // Currículos estratégicos
        ],
        disallow: [
          '/api/',          // Endpoints de API
          '/_next/',        // Cache interno do Next.js
          '/_next/static/', // Arquivos de build estáticos
          '/private/',      // Conteúdo restrito
          '/*.json$',       // Bloqueio de arquivos de configuração
        ],
      },
      {
        /**
         * IA BOT GOVERNANCE
         * Permite que agentes de IA (OpenAI, Anthropic, Google) processem seu perfil.
         * Aumenta a visibilidade em buscas semânticas e assistentes de recrutamento.
         */
        userAgent: ['GPTBot', 'ChatGPT-User', 'Claude-bot', 'Google-Extended'],
        allow: ['/pt', '/en', '/es'],
        disallow: ['/api/', '/_next/'],
      }
    ],
    // Vinculação com o Sitemap para facilitar a descoberta de rotas alternates (hreflang)
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
