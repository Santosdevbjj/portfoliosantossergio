import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,

  /* Removida a chave 'turbo' manual para evitar erro de tipagem no build.
     O Next.js 16 já utiliza o motor Oxide/Turbo por padrão 
     quando detectado no ambiente Vercel.
  */

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "clsx",
      "tailwind-merge",
    ],
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.medium.com',
      }
    ],
  },
};

export default nextConfig;
