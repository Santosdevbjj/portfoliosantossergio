import type { MetadataRoute } from 'next'
import { i18n, type Locale } from '@/i18n-config'
import { getDictionary } from '@/i18n-config'

const SITE_URL = 'https://portfoliosantossergio.vercel.app'
const SHORT_NAME = 'SergioData'

export default async function manifest(
  { params }: { params: { lang: Locale } }
): Promise<MetadataRoute.Manifest> {
  const lang: Locale = i18n.locales.includes(params.lang)
    ? params.lang
    : i18n.defaultLocale

  const dict = await getDictionary(lang)

  const ogImageMap: Record<Locale, string> = {
    pt: '/og-image-pt.png',
    en: '/og-image-en.png',
    es: '/og-image-es.png',
  }

  return {
    id: `${SITE_URL}/${lang}/`,
    lang,

    name: dict.seo.siteName,
    short_name: SHORT_NAME,
    description: dict.seo.description,

    start_url: `/${lang}/?source=pwa`,
    scope: `/${lang}/`,

    display: 'standalone',
    orientation: 'any',
    background_color: '#020617',
    theme_color: '#020617',

    categories: [
      'technology',
      'education',
      'portfolio',
      'data-science',
      'software'
    ],

    icons: [
      {
        src: '/icons/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icons/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],

    screenshots: [
      {
        src: ogImageMap[lang],
        sizes: '1200x630',
        type: 'image/png',
        label: dict.seo.siteName,
      },
    ],
  }
}
