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
    pt: `${SITE_URL}/og-image-pt.png`,
    en: `${SITE_URL}/og-image-en.png`,
    es: `${SITE_URL}/og-image-es.png`,
  }

  const pageTitle =
    dict.seo.pages?.home?.title ?? dict.seo.siteName

  const pageDescription =
    dict.seo.pages?.home?.description ?? dict.seo.description

  return {
    metadataBase: new URL(SITE_URL),

    title: {
      default: pageTitle,
      template: `%s | ${dict.seo.siteName}`,
    },

    description: pageDescription,
    keywords: dict.seo.keywords,

    alternates: {
      canonical: `${SITE_URL}/${lang}`,
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
      title: pageTitle,
      description: pageDescription,
      siteName: dict.seo.siteName,
      images: [
        {
          url: ogImageMap[lang],
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [ogImageMap[lang]],
    },

    icons: {
      icon: '/icons/icon-192.png',
      shortcut: '/icons/icon-192.png',
      apple: '/icons/icon-192.png',
    },

    themeColor: [
      { media: '(prefers-color-scheme: dark)', color: '#020617' },
      { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    ],
  }
}
