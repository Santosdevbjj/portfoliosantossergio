import type { MetadataRoute } from "next";

/**
 * ROBOTS.TXT — NEXT.JS 15 (2026-ready)
 * SEO Governance + AI Bot Policy (LLMs)
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://portfoliosantossergio.vercel.app"
  ).replace(/\/$/, "");

  return {
    rules: [
      /**
       * ============================
       * Buscadores tradicionais
       * ============================
       */
      {
        userAgent: "*",
        allow: [
          "/pt/",
          "/en/",
          "/es/",
          "/images/",
          "/cv-sergio-santos-pt.pdf",
          "/cv-sergio-santos-en.pdf",
          "/cv-sergio-santos-es.pdf",
        ],
        disallow: [
          "/api/",
          "/_next/",
          "/private/",
        ],
      },

      /**
       * ============================
       * Governança de IA / LLMs (2026)
       * Permite indexação semântica do perfil
       * ============================
       */
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "Claude-bot",
          "Google-Extended",
          "PerplexityBot",
        ],
        allow: [
          "/pt/",
          "/en/",
          "/es/",
        ],
        disallow: [
          "/api/",
          "/_next/",
          "/private/",
        ],
      },
    ],

    /**
     * Sitemap oficial
     */
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
