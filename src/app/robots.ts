import type { MetadataRoute } from "next";

/**
 * CONFIGURAÇÃO ROBOTS.TS - NEXT.JS 16.2.0 + TS 6.0
 * -----------------------------------------------------------------------------
 * Alinhado com Node 24 e as novas regras de acesso a process.env.
 * Resolve Erros 404 de indexação permitindo rotas de idioma explicitamente.
 */
export default function robots(): MetadataRoute.Robots {
  // Correção TS 6.0: Acesso via colchetes conforme erro do log
  const baseUrl = (
    process.env['NEXT_PUBLIC_SITE_URL'] ??
    "https://portfoliosantossergio.vercel.app"
  ).replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/*/projects/*",    // Permite projetos em qualquer idioma
          "/*/articles/*",    // Permite artigos em qualquer idioma
          "/*/about",         // Permite sobre em qualquer idioma
          "/og/*.png",        // Permite todas as OG Images por idioma
          "/icons/*",         // Permite favicons e apple icons
          "/images/*.png",    // Foto de perfil e troféus DIO
          "/images/*.svg",
          "/pdf/cv-*.pdf",    // Indexação direta dos currículos corrigidos
        ],
        disallow: [
          "/api/",
          "/_next/",
          "/private/",
          "/admin/",
          "/*?*",             // Evita indexação de URLs com parâmetros de busca
        ],
      },
      {
        /**
         * Crawlers Sociais: Essencial para LinkedIn e Facebook 
         * validarem as imagens publicadas.
         */
        userAgent: ["FacebookExternalHit", "LinkedInBot"],
        allow: ["/og/", "/images/", "/pdf/"],
      },
      {
        /**
         * Agentes de IA: Permite que seu portfólio alimente LLMs
         * para aparecer em recomendações de busca por IA.
         */
        userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "CCBot"],
        allow: ["/", "/*/articles/*", "/*/projects/*"],
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
