import type { MetadataRoute } from "next";
import { i18n } from "@/i18n-config";

/**
 * SITEMAP DINÂMICO — NEXT.JS 15
 * SEO-first, multilíngue (PT / EN / ES) e compatível com Google Search Console
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://portfoliosantossergio.vercel.app"
  ).replace(/\/$/, "");

  const lastModified = new Date();

  /**
   * Idiomas suportados — fonte única da verdade
   */
  const locales = i18n.locales as Array<"pt" | "en" | "es">;

  /**
   * hreflang map (SEO internacional)
   */
  const languagesMap: Record<string, string> = {
    ...Object.fromEntries(
      locales.map((locale) => [locale, `${baseUrl}/${locale}`])
    ),
    "x-default": `${baseUrl}/pt`,
  };

  /**
   * 1️⃣ Entrada raiz (canonical + redirecionamento)
   */
  const rootEntry: MetadataRoute.Sitemap[0] = {
    url: baseUrl,
    lastModified,
    changeFrequency: "monthly",
    priority: 1.0,
    alternates: {
      languages: languagesMap,
    },
  };

  /**
   * 2️⃣ Home por idioma
   */
  const localeEntries: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified,
    changeFrequency: "monthly",
    priority: locale === "pt" ? 1.0 : 0.8,
    alternates: {
      languages: languagesMap,
    },
  }));

  /**
   * 3️⃣ Assets indexáveis (CVs em PDF)
   */
  const cvEntries: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${baseUrl}/cv-sergio-santos-${locale}.pdf`,
    lastModified,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [rootEntry, ...localeEntries, ...cvEntries];
}
