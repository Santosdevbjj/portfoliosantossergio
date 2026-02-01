// vercel.ts
import { type VercelConfig } from '@vercel/config/v1';

/**
 * VERCEL PROGRAMMATIC CONFIGURATION — REVISÃO FEVEREIRO 2026
 * -----------------------------------------------------------------------------
 * ✔ Suporte total a Next.js 16 e i18n dinâmico.
 * ✔ Segurança Bancária (HSTS + Security Headers).
 * ✔ Gestão de Cache para Ativos de Dados.
 */

const config: VercelConfig = {
  framework: 'nextjs',
  cleanUrls: true,
  trailingSlash: false,

  /**
   * Headers de Segurança e Performance
   * --------------------------------------------------
   */
  headers: [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { 
          key: 'Strict-Transport-Security', 
          value: 'max-age=31536000; includeSubDomains; preload' 
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
        }
      ],
    },
    {
      source: '/fonts/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        }
      ]
    }
  ],

  /**
   * Redirecionamentos Estratégicos (i18n)
   * --------------------------------------------------
   * Garante que a entrada no domínio raiz leve ao idioma padrão.
   */
  redirects: [
    {
      source: '/',
      destination: '/pt',
      permanent: false
    }
  ],

  /**
   * Otimização de Imagens Oxide v4
   * --------------------------------------------------
   */
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.githubusercontent.com' },
      { protocol: 'https', hostname: '**.medium.com' }
    ]
  }
};

export default config;
