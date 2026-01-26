import type { MetadataRoute } from "next";

/**
 * ROBOTS.TXT — NEXT.JS 15 (ESTRATÉGIA 2026)
 * -----------------------------------------------------------------------------
 * Governança de indexação para buscadores e modelos de IA (LLMs).
 * Foco: SEO Internacional e Proteção de Dados Sensíveis.
 */

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://portfoliosantossergio.vercel.app"
  ).replace(/\/$/, "");

  return {
    rules: [
      /**
       * 1️⃣ BUSCADORES TÉCNICOS (Google, Bing, DuckDuckGo)
       * Foco em indexar conteúdo útil e ignorar arquivos de sistema.
       */
      {
        userAgent: "*",
        allow: [
          "/pt",
          "/en",
          "/es",
          "/assets/",
          "/images/",
          "/cv-sergio-santos-pt.pdf",
          "/cv-sergio-santos-en.pdf",
          "/cv-sergio-santos-es.pdf",
        ],
        disallow: [
          "/api/",
          "/_next/",
          "/private/",
          "/admin/",
          "/*?_rsc=", // Bloqueia indexação de rotas de fetch internas do Next.js
        ],
      },

      /**
       * 2️⃣ AGENTES DE IA E LLMs (GPT, Claude, Gemini, Perplexity)
       * Estratégia: Permitir leitura para que seu perfil seja citado por IAs,
       * mas bloquear o acesso a dados brutos de API.
       */
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "Claude-bot",
          "Google-Extended", // Impede/Permite o uso para treinar o Gemini
          "PerplexityBot",
          "CCBot",           // Common Crawl (Base para muitas IAs)
        ],
        allow: [
          "/pt",
          "/en",
          "/es",
        ],
        disallow: [
          "/api/",
          "/_next/",
          "/private/",
        ],
      },
    ],

    /**
     * Referência ao Sitemap (ajuda no crawl budget)
     */
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
