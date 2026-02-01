// vercel.ts
import { type VercelConfig } from '@vercel/config/v1';

/**
 * VERCEL CONFIGURATION — FIX: MISSING SIZES & TYPES
 * -----------------------------------------------------------------------------
 */

const config: VercelConfig = {
  framework: 'nextjs',
  cleanUrls: true,
  trailingSlash: false,

  /**
   * Configuração de Imagens (CORREÇÃO DO ERRO)
   * Adicionada a propriedade 'sizes' obrigatória conforme o schema da Vercel.
   */
  images: {
    sizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    remotePatterns: [
      { protocol: 'https', hostname: '**.githubusercontent.com' },
      { protocol: 'https', hostname: '**.medium.com' }
    ]
  },

  headers: [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { 
          key: 'Strict-Transport-Security', 
          value: 'max-age=31536000; includeSubDomains; preload' 
        }
      ],
    }
  ],

  redirects: [
    {
      source: '/',
      destination: '/pt',
      permanent: false
    }
  ]
};

export default config;
