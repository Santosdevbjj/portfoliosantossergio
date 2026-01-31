import type { MetadataRoute } from "next";

/**
 * ROBOTS.TXT — NEXT.JS 15/16 (ESTRATÉGIA 2026)
 * -----------------------------------------------------------------------------
 * Governança de indexação para buscadores e modelos de IA (LLMs).
 * Foco: SEO Internacional, Renderização Correta e Proteção de Dados Sensíveis.
 */

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://portfoliosantossergio.vercel.app"
  ).replace(/\/$/, "");

  return {
    rules: [
      /**
       * 1️⃣ BUSCADORES (Google, Bing, DuckDuckGo, etc.)
       * Estratégia:
       * - Permitir rastreamento completo de conteúdo público
       * - Bloquear apenas áreas técnicas e sensíveis
       * - NÃO bloquear /_next/ para não prejudicar renderização e SEO
       */
      {
        userAgent: "*",
        disallow: [
          "/api/",
          "/private/",
          "/admin/",
          "/*?_rsc=", // Bloqueia rotas internas de streaming/fetch do App Router
        ],
      },

      /**
       * 2️⃣ AGENTES DE IA / LLMs (Treinamento e Leitura Semântica)
       * Estratégia:
       * - Permitir leitura de conteúdo público (perfil profissional)
       * - Bloquear APIs e áreas internas
       */
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "Claude-bot",
          "Google-Extended",
          "PerplexityBot",
          "CCBot", // Common Crawl
        ],
        allow: [
          "/pt",
          "/en",
          "/es",
        ],
        disallow: [
          "/api/",
          "/private/",
          "/admin/",
        ],
      },
    ],

    /**
     * Referência ao Sitemap (crawl budget + SEO técnico)
     */
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
