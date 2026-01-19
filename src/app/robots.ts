// src/app/robots.ts
import { MetadataRoute } from 'next'

/**
 * Configuração de Robots Dinâmico - Next.js 15
 * Este arquivo orienta os indexadores (Google, Bing, etc.) sobre quais 
 * áreas do portfólio devem ser rastreadas, garantindo SEO multilingue eficiente.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://portfoliosantossergio.vercel.app'

  return {
    rules: [
      {
        // Aplica-se a todos os robôs (Googlebot, Bingbot, etc.)
        userAgent: '*',
        allow: [
          '/',        // Home
          '/pt',      // Versão Português
          '/en',      // Versão Inglês
          '/es',      // Versão Espanhol
          '/api/og',  // Permite indexar imagens de compartilhamento social
        ],
        disallow: [
          '/private/', // Área reservada para testes
          '/admin/',   // Caso venha a ter um dashboard futuro
          '/*.json$',  // Evita indexar arquivos de configuração internos
        ],
      },
      {
        // Proteção contra robôs de IA que consomem banda sem gerar tráfego (opcional)
        userAgent: ['GPTBot', 'CCBot'],
        disallow: ['/'],
      }
    ],
    // Aponta para o Sitemap dinâmico que criamos anteriormente
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
