import type { MetadataRoute } from "next";
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  type SupportedLocale,
} from "@/dictionaries/locales";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://portfoliosantossergio.vercel.app"
  ).replace(/\/$/, "");

  const lastModified = new Date();

  // Páginas estáticas do seu portfólio
  const pages = [
    "", 
    "about",
    "experience",
    "projects",
    "artigos", // Atualizado de 'articles' para 'artigos' conforme sua estrutura de pastas
    "contact",
  ] as const;

  /**
   * Gera objeto hreflang consistente para SEO Internacional
   */
  function buildAlternates(path: string) {
    const languages: Record<string, string> = {};

    for (const locale of SUPPORTED_LOCALES) {
      languages[locale] = `${baseUrl}/${locale}${path}`;
    }

    // Define o fallback para usuários de outras regiões
    languages["x-default"] = `${baseUrl}/${DEFAULT_LOCALE}${path}`;

    return { languages };
  }

  /**
   * 1️⃣ Mapeamento de páginas por idioma
   */
  const pageEntries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap(
    (locale: SupportedLocale) =>
      pages.map((page) => {
        const path = page ? `/${page}` : "";
        const isHome = page === "";

        return {
          url: `${baseUrl}/${locale}${path}`,
          lastModified,
          changeFrequency: isHome ? "weekly" : "monthly" as const,
          priority: isHome ? (locale === DEFAULT_LOCALE ? 1.0 : 0.9) : 0.8,
          alternates: buildAlternates(path),
        };
      })
  );

  /**
   * 2️⃣ Entrada da Raiz (/) redirecionando para o locale padrão
   */
  const rootEntry: MetadataRoute.Sitemap[number] = {
    url: baseUrl,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 1.0,
    alternates: buildAlternates(""),
  };

  /**
   * 3️⃣ Documentos Estáticos (CVs)
   */
  const documentEntries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.map(
    (locale) => ({
      url: `${baseUrl}/cv-sergio-santos-${locale}.pdf`,
      lastModified,
      priority: 0.5,
    })
  );

  return [rootEntry, ...pageEntries, ...documentEntries];
}
