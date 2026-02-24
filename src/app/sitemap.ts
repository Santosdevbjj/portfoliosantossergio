import type { MetadataRoute } from "next";
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  type SupportedLocale,
} from "@/dictionaries/locales";

/**
 * SITEMAP DINÂMICO — NEXT 16 + TS 6 STRICT
 * -----------------------------------------------------------------------------
 * ✔ Totalmente alinhado com SUPPORTED_LOCALES
 * ✔ SEO internacional correto (hreflang real)
 * ✔ x-default consistente
 * ✔ Google Search Console ready
 * ✔ Escalável para blog futuro
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://portfoliosantossergio.vercel.app"
  ).replace(/\/$/, "");

  const lastModified = new Date();

  const pages = [
    "", // home
    "about",
    "experience",
    "projects",
    "articles",
    "contact",
  ] as const;

  /**
   * Gera objeto hreflang consistente
   */
  function buildAlternates(path: string) {
    const languages: Record<string, string> = {};

    for (const locale of SUPPORTED_LOCALES) {
      languages[locale] = `${baseUrl}/${locale}${path}`;
    }

    languages["x-default"] = `${baseUrl}/${DEFAULT_LOCALE}${path}`;

    return { languages };
  }

  /**
   * 1️⃣ Páginas internacionalizadas
   */
  const pageEntries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap(
    (locale: SupportedLocale) =>
      pages.map((page) => {
        const path = page ? `/${page}` : "";

        return {
          url: `${baseUrl}/${locale}${path}`,
          lastModified,
          changeFrequency: page === "" ? "weekly" : "monthly",
          priority: page === "" && locale === DEFAULT_LOCALE
            ? 1.0
            : page === ""
            ? 0.9
            : 0.8,
          alternates: buildAlternates(path),
        };
      })
  );

  /**
   * 2️⃣ Entrada raiz canônica
   */
  const rootEntry: MetadataRoute.Sitemap[number] = {
    url: baseUrl,
    lastModified,
    changeFrequency: "weekly",
    priority: 1.0,
    alternates: buildAlternates(""),
  };

  /**
   * 3️⃣ PDFs estratégicos por locale
   */
  const documentEntries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.map(
    (locale) => ({
      url: `${baseUrl}/cv-sergio-santos-${locale}.pdf`,
      lastModified,
    })
  );

  return [rootEntry, ...pageEntries, ...documentEntries];
}
