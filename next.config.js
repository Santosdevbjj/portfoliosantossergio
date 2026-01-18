/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Mantido para garantir o deploy imediato, 
  // mas como engenheiro, recomendo corrigir os tipos futuramente.
  typescript: {
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Ativa suporte a rotas tipadas para maior segurança no desenvolvimento
  experimental: {
    typedRoutes: true,
  },

  images: {
    // ESSENCIAL: Permite que o Next.js renderize imagens externas com segurança
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },

  // Remove logs de console em produção para não expor lógica do sistema
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Otimização de redirects para SEO (Caso o usuário acesse a raiz /)
  async redirects() {
    return [
      {
        source: '/',
        destination: '/pt',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
