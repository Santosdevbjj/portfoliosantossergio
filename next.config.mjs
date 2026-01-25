/** @type {import('next').NextConfig} */
const nextConfig = {
  /* -------------------------------------------------------------------------- */
  /* CORE                                                                        */
  /* -------------------------------------------------------------------------- */
  reactStrictMode: true,
  poweredByHeader: false,

  typescript: {
    ignoreBuildErrors: false,
  },

  typedRoutes: true, // Next.js 16+

  /* -------------------------------------------------------------------------- */
  /* COMPILER                                                                    */
  /* -------------------------------------------------------------------------- */
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] }
        : false,
  },

  /* -------------------------------------------------------------------------- */
  /* IMAGES                                                                      */
  /* -------------------------------------------------------------------------- */
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [450, 640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 86400, // 24h — ideal para portfólio estático
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* PERFORMANCE                                                                 */
  /* -------------------------------------------------------------------------- */
  experimental: {
    /**
     * Otimização de imports — reduz bundle size
     * Totalmente seguro no Next 16
     */
    optimizePackageImports: ['lucide-react', 'clsx', 'tailwind-merge'],
  },

  /* -------------------------------------------------------------------------- */
  /* SECURITY HEADERS                                                            */
  /* -------------------------------------------------------------------------- */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            /**
             * CSP ajustada para:
             * - JSON-LD (Schema.org)
             * - Next.js inline runtime
             * - Segurança sem quebrar SEO
             */
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';",
              "img-src 'self' data: https:;",
              "script-src 'self' 'unsafe-inline';",
              "style-src 'self' 'unsafe-inline';",
              "font-src 'self' data: https:;",
              "connect-src 'self' https:;",
            ].join(' '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
