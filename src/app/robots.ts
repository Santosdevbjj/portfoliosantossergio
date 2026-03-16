import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://portfoliosantossergio.vercel.app"
  ).replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/og/*.png",       // Permite todas as OG Images por idioma
          "/icons/*",        // Permite favicons e apple icons
          "/images/*.png",   // Permite sua foto de perfil e troféus DIO
          "/images/*.svg",
          "/pdf/cv-*.pdf",   // Permite indexação direta dos currículos
        ],
        disallow: [
          "/api/",
          "/_next/",
          "/private/",
          "/admin/",
        ],
      },
      {
        /**
         * LinkedIn e Facebook precisam acessar /og/ para gerar o card
         * quando você compartilha seu portfólio.
         */
        userAgent: ["FacebookExternalHit", "LinkedInBot"],
        allow: ["/og/", "/images/"],
      },
      {
        /**
         * Permite que modelos de IA indexem seu conteúdo público
         * (Artigos e Projetos) para que você apareça em buscas de IA.
         */
        userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "CCBot"],
        allow: ["/", "/[lang]/artigos/*", "/[lang]/projects/*"],
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
