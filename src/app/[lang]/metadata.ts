import type { Metadata } from 'next'
import { i18n, localeMetadata, type Locale } from '@/i18n-config'
import { getDictionary } from '@/i18n-config'

export async function generateMetadata(
  { params }: { params: { lang: Locale } }
): Promise<Metadata> {
  const lang = i18n.locales.includes(params.lang)
    ? params.lang
    : i18n.defaultLocale

  const dict = await getDictionary(lang)
  const meta = localeMetadata[lang]

  return {
    title: dict.seo.siteName,
    description: dict.seo.description,
    keywords: dict.seo.keywords,

    metadataBase: new URL('https://seusite.com'),

    alternates: {
      canonical: `/${lang}`,
      languages: {
        pt: '/pt',
        en: '/en',
        es: '/es',
      },
    },

    openGraph: {
      type: 'website',
      locale: meta.hrefLang,
      title: dict.seo.siteName,
      description: dict.seo.description,
      siteName: dict.seo.siteName,
    },

    twitter: {
      card: 'summary_large_image',
      title: dict.seo.siteName,
      description: dict.seo.description,
    },

    icons: {
      icon: '/icons/icon-192.png',
      apple: '/icons/icon-192.png',
    },

    manifest: `/${lang}/manifest.webmanifest`,
    themeColor: '#020617',
  }
}
