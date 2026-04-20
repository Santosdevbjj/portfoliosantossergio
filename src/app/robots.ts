import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://portfoliosantossergio.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/pdf/",           // Libera a pasta de currículos inteira
          "/images/",        // Libera fotos e troféus
          "/og/",            // Libera imagens de compartilhamento social
          "/artigos/",       // Libera imagens dos artigos e as rotas dos artigos
          "/icons/",         // Libera favicons
          "/*/projects", 
          "/*/artigos", 
          "/*/about", 
          "/*/resume"
        ],
        disallow: [
          "/api/", 
          "/_next/", 
          "/admin/", 
          "/private/",
          "/*?*",            // Bloqueia parâmetros de URL (limpeza de SEO)
        ],
      },
      {
        // Regra específica para IAs de busca semântica (ChatGPT, Claude, Perplexity)
        // Isso ajuda a IA a ler seus artigos e te citar como referência
        userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot"],
        allow: ["/*/artigos/*", "/pdf/"],
      }
    ],
    // Mantenha apenas o sitemap principal que agora contém tudo
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
