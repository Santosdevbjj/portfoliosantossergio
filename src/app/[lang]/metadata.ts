import type { Metadata } from 'next'
import { i18n, localeMetadata, type Locale } from '@/i18n-config'
import { getDictionary } from '@/i18n-config'

const SITE_URL = 'https://portfoliosantossergio.vercel.app'

export async function generateMetadata(
  { params }: { params: { lang: Locale } }
): Promise<Metadata> {
  const lang: Locale = i18n.locales.includes(params.lang)
    ? params.lang
    : i18n.defaultLocale

  const dict = await getDictionary(lang)
  const meta = localeMetadata[lang]

  const ogImageMap: Record<Locale, string> = {
    pt: '/og-image-pt.png',
    en: '/og-image-en.png',
    es: '/og-image-es.png',
  }

  return {
    metadataBase: new URL(SITE_URL),

    title: dict.seo.siteName,
    description: dict.seo.description,
    keywords: dict.seo.keywords,

    alternates: {
      canonical: `/${lang}`,
      languages: {
        pt: `${SITE_URL}/pt`,
        en: `${SITE_URL}/en`,
        es: `${SITE_URL}/es`,
      },
    },

    openGraph: {
      type: 'website',
      locale: meta.hrefLang,
      url: `${SITE_URL}/${lang}`,
      title: dict.seo.siteName,
      description: dict.seo.description,
      siteName: dict.seo.siteName,
      images: [
        {
          url: ogImageMap[lang],
          width: 1200,
          height: 630,
          alt: dict.seo.siteName,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: dict.seo.siteName,
      description: dict.seo.description,
      images: [ogImageMap[lang]],
    },

    icons: {
      icon: '/icons/icon-192.png',
      apple: '/icons/icon-192.png',
    },

    themeColor: '#020617',
  }
}
