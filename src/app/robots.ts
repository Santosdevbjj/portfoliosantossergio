import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {

  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://portfoliosantossergio.vercel.app"
  ).replace(/\/$/, "")

  return {
    rules: [

      /**
       * Regras globais
       */
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/api/",
          "/_next/",
          "/private/",
          "/admin/",
        ],
      },

      /**
       * Google
       */
      {
        userAgent: "Googlebot",
        allow: "/",
      },

      /**
       * Bing
       */
      {
        userAgent: "Bingbot",
        allow: "/",
      },

      /**
       * Apple
       */
      {
        userAgent: "Applebot",
        allow: "/",
      },

      /**
       * DuckDuckGo
       */
      {
        userAgent: "DuckDuckBot",
        allow: "/",
      },

      /**
       * Proteção básica contra scraping IA
       */
      {
        userAgent: ["GPTBot", "CCBot"],
        disallow: ["/private/"],
      },
    ],

    sitemap: `${baseUrl}/sitemap.xml`,

    host: baseUrl,
  }
}
