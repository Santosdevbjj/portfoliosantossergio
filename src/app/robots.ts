// src/app/robots.ts
import type { MetadataRoute } from 'next'

/**
 * CONFIGURAÇÃO DINÂMICA DE ROBOTS - NEXT.JS 15
 * Gerencia a visibilidade do portfólio para motores de busca (Google, Bing) e bots de IA.
 * Otimizado para indexação multilingue (PT, EN, ES).
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfoliosantossergio.vercel.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',              
          '/pt',            
          '/en',            
          '/es',            
          '/images/',       
          '/assets/',       
          '/favicon.ico'    
        ],
        disallow: [
          '/api/',          
          '/_next/',        
          '/private/',      
          '/admin/',        // Segurança: Bloqueia pastas administrativas
          '/*.json$',       // Evita indexação de arquivos de configuração JSON
        ],
      },
      {
        /**
         * POLÍTICA PARA IA (GPTBot, Claude-bot, etc.)
         * Permite a leitura do portfólio para que IA possa recomendar seu perfil,
         * mas restringe o acesso a dados de servidor.
         */
        userAgent: ['GPTBot', 'CCBot', 'Claude-bot'],
        allow: ['/pt', '/en', '/es'],
        disallow: ['/api/', '/_next/'],
      }
    ],
    // Caminho absoluto para o sitemap (Crucial para SEO multilingue)
    sitemap: `${baseUrl.replace(/\/$/, '')}/sitemap.xml`,
    host: baseUrl,
  }
}
