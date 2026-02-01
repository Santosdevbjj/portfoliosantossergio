// vercel.ts
import { type VercelConfig } from '@vercel/config/v1';

/**
 * VERCEL CONFIGURATION — RIGOR BANCÁRIO & SEGURANÇA
 * -----------------------------------------------------------------------------
 * Revisão: Removido 'image/avif' para compatibilidade de tipos.
 * Revisão: Mantido headers de segurança estritos para ambiente de missão crítica.
 */

const config: VercelConfig = {
  framework: 'nextjs',
  cleanUrls: true,
  trailingSlash: false,

  /**
   * Configuração de Otimização de Imagens
   * Corrigido para evitar erro de atribuição de tipo no build.
   */
  images: {
    sizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Removido avif para resolver o Type error: '"image/avif"' is not assignable to type '"image/png"'
    formats: ['image/webp'], 
    minimumCacheTTL: 60,
    remotePatterns: [
      { protocol: 'https', hostname: '**.githubusercontent.com' },
      { protocol: 'https', hostname: '**.medium.com' }
    ]
  },

  /**
   * Headers de Segurança (Compliance Bradesco/ISO 27001)
   */
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

  /**
   * Redirect Root: Garante que o tráfego caia sempre no idioma padrão (PT)
   */
  redirects: [
    {
      source: '/',
      destination: '/pt',
      permanent: false
    }
  ]
};

export default config;
