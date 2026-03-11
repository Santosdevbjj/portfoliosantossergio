import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://portfoliosantossergio.vercel.app"
  ).replace(/\/$/, "")

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/api/",
          "/_next/",
          "/admin/",
          "/private/",
        ],
      },

      {
        userAgent: "Googlebot",
        allow: "/",
      },

      {
        userAgent: "Bingbot",
        allow: "/",
      },

      {
        userAgent: "Applebot",
        allow: "/",
      },

      {
        userAgent: "DuckDuckBot",
        allow: "/",
      },

      /**
       * AI Crawlers
       */
      {
        userAgent: [
          "GPTBot",
          "CCBot",
          "ClaudeBot",
          "PerplexityBot",
        ],
        disallow: ["/private/"],
      },
    ],

    sitemap: `${baseUrl}/sitemap.xml`,

    host: baseUrl,
  }
}
