// src/app/robots.ts
import { MetadataRoute } from 'next'

/**
 * Configuração de Robots Dinâmico - Next.js 15
 * Este arquivo orienta os indexadores (Google, Bing, etc.) sobre quais 
 * áreas do portfólio devem ser rastreadas, garantindo SEO multilingue eficiente.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfoliosantossergio.vercel.app'

  return {
    rules: [
      {
        // Aplica-se a todos os robôs (Googlebot, Bingbot, etc.)
        userAgent: '*',
        allow: [
          '/',           // Home
          '/pt',         // Versão Português (Prioridade 1)
          '/en',         // Versão Inglês
          '/es',         // Versão Espanhol
          '/api/og',     // Imagens de compartilhamento social
          '/manifest.json' // IMPORTANTE: Permitir leitura para habilitar PWA
        ],
        disallow: [
          '/private/',   // Área reservada para testes
          '/admin/',     // Dashboard futuro
          '/_next/',     // Arquivos internos do Next.js
        ],
      },
      {
        // Otimização para IA: Evita consumo excessivo de banda por crawlers de treino
        userAgent: ['GPTBot', 'CCBot'],
        disallow: ['/private/'],
      }
    ],
    // Vinculação direta com o Sitemap já verificado no Search Console
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
