import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://portfoliosantossergio.vercel.app"
  ).replace(/\/$/, "")

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/api/og/*",      // Permite explicitamente o acesso às imagens dinâmicas
          "/api/post-og/*"  // Garante acesso à sua rota específica de posts
        ],
        disallow: [
          "/api/",          // Bloqueia outras rotas de API (proteção de dados)
          "/_next/",
          "/admin/",
          "/private/",
        ],
      },

      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/api/og/*",
          "/api/post-og/*"
        ],
      },

      {
        userAgent: "Bingbot",
        allow: "/",
      },

      {
        userAgent: "Applebot",
        allow: "/",
      },

      {
        userAgent: "DuckDuckBot",
        allow: "/",
      },

      /**
       * AI Crawlers
       * Configuração para robôs de IA
       */
      {
        userAgent: [
          "GPTBot",
          "CCBot",
          "ClaudeBot",
          "PerplexityBot",
        ],
        disallow: ["/private/", "/api/"],
      },
    ],

    sitemap: `${baseUrl}/sitemap.xml`,

    host: baseUrl,
  }
}
