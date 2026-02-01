// vercel.ts
/**
 * VERCEL CONFIGURATION
 * -----------------------------------------------------------------------------
 * Removida a tipagem estrita de @vercel/config/v1 que estava causando o erro
 * "Type '"image/webp"' is not assignable to type '"image/png"'".
 */

const config = {
  framework: 'nextjs',
  cleanUrls: true,
  trailingSlash: false,

  images: {
    sizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Removendo a tipagem estrita, o compilador aceita os formatos modernos
    formats: ['image/webp'],
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
