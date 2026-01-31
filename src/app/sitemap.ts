import type { MetadataRoute } from "next";

/**
 * SITEMAP DINÂMICO — NEXT.JS 15 / 16 (APP ROUTER)
 * -----------------------------------------------------------------------------
 * Objetivo: SEO internacional correto, indexação limpa e sem warnings no GSC.
 * Status: Produção-ready.
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://portfoliosantossergio.vercel.app"
  ).replace(/\/$/, "");

  const lastModified = new Date().toISOString();
  const locales = ["pt", "en", "es"] as const;

  /**
   * 1️⃣ Home Pages (Internacionalizadas)
   * Cada página aponta corretamente para suas versões equivalentes.
   */
  const localeEntries: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified,
    changeFrequency: "monthly",
    priority: locale === "pt" ? 1.0 : 0.9,
    alternates: {
      languages: {
        pt: `${baseUrl}/pt`,
        en: `${baseUrl}/en`,
        es: `${baseUrl}/es`,
        "x-default": `${baseUrl}/pt`,
      },
    },
  }));

  /**
   * 2️⃣ Entrada Raiz (Redirect Target)
   * Serve como fallback canônico.
   */
  const rootEntry: MetadataRoute.Sitemap[0] = {
    url: baseUrl,
    lastModified,
    changeFrequency: "monthly",
    priority: 1.0,
    alternates: {
      languages: {
        pt: `${baseUrl}/pt`,
        en: `${baseUrl}/en`,
        es: `${baseUrl}/es`,
        "x-default": `${baseUrl}/pt`,
      },
    },
  };

  /**
   * 3️⃣ Documentos Estratégicos (PDFs)
   * PDFs não devem usar priority ou changeFrequency.
   */
  const documentEntries: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${baseUrl}/cv-sergio-santos-${locale}.pdf`,
    lastModified,
  }));

  return [rootEntry, ...localeEntries, ...documentEntries];
}
