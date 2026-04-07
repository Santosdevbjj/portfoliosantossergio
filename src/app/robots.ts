import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://portfoliosantossergio.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/", 
          "/*/projects", 
          "/*/artigos", 
          "/*/about", 
          "/*/resume",
          "/pdf/cv-sergio-santos-*.pdf", // Nome específico dos seus PDFs
          "/images/", 
          "/og/",
          "/artigos/*.png",
          "/icons/"
        ],
        disallow: [
          "/api/", 
          "/_next/", 
          "/admin/", 
          "/*?*", // Bloqueia parâmetros (ex: ?fbclid=...) para evitar o erro de "Cópia sem canônica"
          "/private/"
        ],
      },
      {
        // Incentiva IAs a indexarem seus artigos técnicos para te dar autoridade
        userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot"],
        allow: ["/*/artigos/*"],
      }
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/resume-sitemap.xml`
    ],
  };
}
