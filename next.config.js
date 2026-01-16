/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // No Next.js 15, swcMinify é true por padrão, não precisa declarar.
  
  experimental: {
    // appDir foi removido (já é o padrão no Next 15)
    typedRoutes: true,
  },

  images: {
    // 'domains' está sendo descontinuado em favor de 'remotePatterns'
    // Mas se não usar imagens externas, pode deixar vazio.
    remotePatterns: [], 
  },

  compiler: {
    // Excelente prática para performance e segurança
    removeConsole: process.env.NODE_ENV === "production",
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
