import { type VercelConfig, routes } from '@vercel/config/v1';

/**
 * Configuração Programática Vercel - Padrão Jan/2026
 * Focada em performance nativa e mitigação de erros de RSC.
 */
export const config: VercelConfig = {
  framework: 'nextjs',
  
  // Otimização para o motor Turbopack (Native Speed)
  buildCommand: 'next build --turbopack',
  
  // Proteção contra loops de roteamento (Erro 500 detectado nos logs)
  rewrites: [
    // Garante que arquivos estáticos bypassam o middleware
    {
      source: '/favicon.ico',
      destination: '/static/favicon.ico',
    },
    {
      source: '/robots.txt',
      destination: '/static/robots.txt',
    },
    {
      source: '/sitemap.xml',
      destination: '/static/sitemap.xml',
    }
  ],

  // Configuração de Headers de Segurança para evitar Source Exposure (CVE-2026-23864)
  headers: [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        }
      ],
    },
  ],
};
