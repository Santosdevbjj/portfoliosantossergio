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
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/private/",
          "/admin/",
          "/*?*", // Bloqueia URLs com query strings para evitar conteúdo duplicado
        ],
      },
      {
        // Regra específica para proteger seus artigos de scrapers de IA agressivos
        userAgent: "GPTBot",
        disallow: "/private/",
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
