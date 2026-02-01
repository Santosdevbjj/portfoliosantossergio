// vercel.ts
import { type VercelConfig } from '@vercel/config/v1';

/**
 * Vercel Programmatic Configuration
 * Padrão Profissional – Jan/2026
 *
 * ✔ Compatível com Next.js App Router
 * ✔ Seguro contra loops de roteamento
 * ✔ Type-safe (TS 6 / preparado para TS 7)
 * ✔ Alinhado com Vercel Platform Defaults
 */
export const config: VercelConfig = {
  framework: 'nextjs',

  /**
   * Build
   * --------------------------------------------------
   * NÃO forçamos Turbopack aqui para evitar falhas
   * em ambientes onde o beta ainda não é estável.
   *
   * Use Turbopack localmente:
   *   next dev --turbo
   */
  buildCommand: 'next build',

  /**
   * Headers de Segurança Globais
   * --------------------------------------------------
   * Protege contra sniffing, clickjacking
   * e exposição indevida de conteúdo.
   */
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
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
      ],
    },
  ],
};
