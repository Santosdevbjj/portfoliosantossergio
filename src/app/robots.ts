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
          "/og/*",          // Permite acesso total às imagens de Open Graph
          "/icons/*",       // Permite acesso aos ícones (favicon, apple-touch)
          "/images/*",      // Permite acesso às fotos de perfil e troféus
          "/cv-*.pdf",      // Permite que o Google indexe seus currículos
        ],
        disallow: [
          "/api/",          // Bloqueia rotas de API sensíveis
          "/_next/",        // Bloqueia arquivos internos do Next.js
          "/admin/",
          "/private/",
        ],
      },
      /**
       * Meta/Facebook Crawler
       * Requisito da documentação: Garantir que o FacebookExternalHit
       * consiga baixar as imagens para gerar o thumbnail.
       */
      {
        userAgent: ["FacebookExternalHit", "LinkedInBot"],
        allow: [
          "/og/",
          "/images/",
        ],
      },
      /**
       * AI Crawlers
       * Permite que leiam o conteúdo público, mas protege dados privados
       */
      {
        userAgent: [
          "GPTBot",
          "CCBot",
          "ClaudeBot",
          "PerplexityBot",
          "Meta-WebIndexer", // Adicionado conforme documentação da Meta
        ],
        disallow: ["/private/", "/api/", "/_next/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
