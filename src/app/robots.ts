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
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/private/",
          "/admin/",
        ],
      },

      /**
       * Proteção básica contra scraping agressivo
       */
      {
        userAgent: "GPTBot",
        disallow: ["/private/"],
      },

      {
        userAgent: "CCBot",
        disallow: ["/private/"],
      },
    ],

    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
