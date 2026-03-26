import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env['NEXT_PUBLIC_SITE_URL'] ?? "https://portfoliosantossergio.vercel.app").replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/", "/*/projects/*", "/*/articles/*", "/*/about", 
          "/og/*.png", "/pdf/cv-*.pdf", "/images/", "/artigos/og-*.png"
        ],
        disallow: ["/api/", "/_next/", "/admin/", "/*?*"],
      },
      {
        userAgent: ["GPTBot", "ClaudeBot"], // Agentes de IA
        allow: ["/", "/*/articles/*"],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`, // O Next.js resolve isso automaticamente para o sitemap.ts
  };
}
