import type { MetadataRoute } from "next";

/**
 * ROBOTS.TXT — NEXT.JS 16 (SEO Internacional 2026)
 * -----------------------------------------------------------------------------
 * ✔ SEO multilíngue (pt-BR / en-US / es-*)
 * ✔ Compatível com App Router
 * ✔ Seguro para APIs
 * ✔ Edge-safe
 * ✔ Produção-ready
 */

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://portfoliosantossergio.vercel.app"
  ).replace(/\/$/, "");

  return {
    rules: [
      /**
       * 1️⃣ Todos os buscadores e crawlers
       */
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/private/",
          "/admin/",
        ],
      },
    ],

    /**
     * Sitemap internacional
     */
    sitemap: `${baseUrl}/sitemap.xml`,

    /**
     * Host canônico
     */
    host: baseUrl,
  };
}
