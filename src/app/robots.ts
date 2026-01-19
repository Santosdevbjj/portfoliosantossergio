// src/app/robots.ts
import { MetadataRoute } from 'next'

/**
 * CONFIGURAÇÃO DINÂMICA DE ROBOTS - NEXT.JS 15
 * Gerencia a visibilidade do portfólio para motores de busca globais.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfoliosantossergio.vercel.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',              // Raiz
          '/pt',            // Versão Brasileira (Principal)
          '/en',            // Versão Internacional
          '/es',            // Versão LatAm/Espanha
          '/images/',       // Permite indexação de fotos de projetos e perfil
          '/assets/',       // Permite indexação de documentos (Ex: CV em PDF)
          '/manifest.json', // Vital para o PWA que configuramos
          '/favicon.ico'    // Ícone do site
        ],
        disallow: [
          '/api/',          // Bloqueia rotas de backend/servidor
          '/_next/',        // Bloqueia arquivos internos de build
          '/private/',      // Área de staging/testes
          '/*.json$',       // Bloqueia arquivos JSON genéricos (exceto manifest)
        ],
      },
      {
        /**
         * POLÍTICA PARA IA (GPTBot, Claude-bot, etc.)
         * Permite que leiam o portfólio (bom para recomendações de IA),
         * mas bloqueia áreas privadas.
         */
        userAgent: ['GPTBot', 'CCBot', 'Claude-bot'],
        allow: ['/pt', '/en', '/es'],
        disallow: ['/private/', '/api/'],
      }
    ],
    // Link direto para o Sitemap para acelerar a indexação das 3 línguas
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
