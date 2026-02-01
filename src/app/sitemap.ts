import type { MetadataRoute } from 'next'

/**
 * SITEMAP DINÂMICO — NEXT.JS 16 (APP ROUTER)
 * -----------------------------------------------------------------------------
 * ✔ SEO internacional correto (pt / en / es)
 * ✔ Alinhado com estrutura de navegação do dicionário
 * ✔ Google Search Console friendly
 * ✔ Produção-ready
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    'https://portfoliosantossergio.vercel.app'
  ).replace(/\/$/, '')

  const lastModified = new Date()

  const locales = ['pt', 'en', 'es'] as const

  /**
   * Rotas principais do site
   * Devem refletir o dicionário (nav)
   */
  const pages = [
    '', // home
    'about',
    'experience',
    'projects',
    'articles',
    'contact',
  ]

  /**
   * 1️⃣ Páginas Internacionalizadas
   */
  const pageEntries: MetadataRoute.Sitemap = locales.flatMap(locale =>
    pages.map(page => {
      const path = page ? `/${page}` : ''

      return {
        url: `${baseUrl}/${locale}${path}`,
        lastModified,
        changeFrequency: 'monthly',
        priority:
          page === '' && locale === 'pt'
            ? 1.0
            : page === ''
            ? 0.9
            : 0.8,
        alternates: {
          languages: {
            pt: `${baseUrl}/pt${path}`,
            en: `${baseUrl}/en${path}`,
            es: `${baseUrl}/es${path}`,
            'x-default': `${baseUrl}/pt${path}`,
          },
        },
      }
    }),
  )

  /**
   * 2️⃣ Entrada raiz (fallback canônico)
   */
  const rootEntry: MetadataRoute.Sitemap[0] = {
    url: baseUrl,
    lastModified,
    changeFrequency: 'monthly',
    priority: 1.0,
    alternates: {
      languages: {
        pt: `${baseUrl}/pt`,
        en: `${baseUrl}/en`,
        es: `${baseUrl}/es`,
        'x-default': `${baseUrl}/pt`,
      },
    },
  }

  /**
   * 3️⃣ Documentos estratégicos (CVs por idioma)
   * PDFs não usam priority nem changeFrequency
   */
  const documentEntries: MetadataRoute.Sitemap = locales.map(locale => ({
    url: `${baseUrl}/cv-sergio-santos-${locale}.pdf`,
    lastModified,
  }))

  return [rootEntry, ...pageEntries, ...documentEntries]
}
