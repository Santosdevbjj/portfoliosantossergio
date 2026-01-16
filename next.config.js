/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // ativa checagens extras do React
  swcMinify: true,       // usa o compilador SWC para builds mais rápidos
  experimental: {
    appDir: true,        // garante que o App Router esteja habilitado
    typedRoutes: true,   // ajuda a evitar erros em rotas dinâmicas
    optimizeCss: true,   // melhora performance com TailwindCSS
  },
  images: {
    domains: [],         // adicione domínios externos se usar imagens remotas
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // remove console.* em produção
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400"
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
