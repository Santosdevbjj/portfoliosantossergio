/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Modo estrito React para desenvolvimento seguro
  poweredByHeader: false, // Remove o cabeçalho X-Powered-By
  typescript: {
    ignoreBuildErrors: false // Não ignora erros de build TS
  },
  typedRoutes: true, // Suporte a rotas tipadas (Next 16)
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] } // Remove logs, mas mantém erros/warns críticos
        : false
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "*.githubusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "raw.githubusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" }
    ],
    deviceSizes: [450, 640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 3600 // 1 hora
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "clsx", "tailwind-merge"], // Otimiza bundles
    serverSourceMaps: false // Reduz tamanho do build
  },
  i18n: {
    locales: ["pt", "en", "es"],
    defaultLocale: "pt",
    localeDetection: true // Detecta automaticamente idioma do navegador
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Cabeçalhos opcionais para CSP mínimo (melhora segurança)
          { key: "Content-Security-Policy", value: "default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline'" }
        ]
      }
    ];
  },
  // Configuração opcional de SWC minify para builds ainda mais rápidos
  swcMinify: true,
};

export default nextConfig;
