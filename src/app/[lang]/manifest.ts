import type { MetadataRoute } from 'next'
import { localeMetadata, type Locale } from '@/i18n-config'

const SITE_NAME = 'Sérgio Santos'
const SHORT_NAME = 'SergioData'

export default function manifest(
  { params }: { params: { lang: Locale } }
): MetadataRoute.Manifest {
  const meta = localeMetadata[params.lang] ?? localeMetadata.pt

  return {
    id: `/${params.lang}/`,
    lang: meta.hrefLang,

    name: `${SITE_NAME} | ${meta.name}`,
    short_name: SHORT_NAME,
    description: meta.description,

    start_url: `/${params.lang}/?source=pwa`,
    scope: `/${params.lang}/`,

    display: 'standalone',
    orientation: 'portrait',
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
  }
}
