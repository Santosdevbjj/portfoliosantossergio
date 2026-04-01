import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env['NEXT_PUBLIC_SITE_URL'] ?? "https://portfoliosantossergio.vercel.app").replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/", 
          "/*/projects", 
          "/*/artigos", // Corrigido de articles para artigos (seguindo suas URLs)
          "/*/about", 
          "/*/resume",
          "/pdf/cv-*.pdf", 
          "/images/", 
          "/og/",
          "/artigos/*.png"
        ],
        disallow: [
          "/api/", 
          "/_next/", 
          "/admin/", 
          "/*?*",      // Bloqueia parâmetros de busca que geram conteúdo duplicado
          "/private/"
        ],
      },
      {
        userAgent: ["GPTBot", "ClaudeBot"], // Permite que IAs leiam seus artigos para te citarem
        allow: ["/", "/*/artigos/*"],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
