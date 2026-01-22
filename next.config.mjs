/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Segurança: remove header que expõe tecnologia
  poweredByHeader: false,

  // Rigor técnico: build falha se houver erro de tipos
  typescript: {
    ignoreBuildErrors: false,
  },

  // Next.js 15+/16: navegação tipada
  typedRoutes: true,

  // Otimizações do compilador
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    deviceSizes: [450, 640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 3600,
  },

  experimental: {
    // Otimização segura para tree-shaking
    optimizePackageImports: [
      "lucide-react",
      "clsx",
      "tailwind-merge",
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://vercel.live;",
              "style-src 'self' 'unsafe-inline';",
              "img-src 'self' blob: data: https://*.githubusercontent.com https://images.unsplash.com;",
              "font-src 'self' data:;",
              "connect-src 'self' https://api.github.com https://*.vercel-analytics.com https://*.vitals.vercel-insights.com https://vercel.live;",
              "frame-ancestors 'none';",
              "upgrade-insecure-requests;",
            ].join(" "),
          },
        ],
      },
      {
        // Cache imutável apenas para assets estáticos reais
        source: "/:path*\\.(png|ico|jpg|jpeg|webp|avif|svg)$",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
