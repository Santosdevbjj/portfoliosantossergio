import type { MetadataRoute } from 'next'
import { localeMetadata, type Locale } from '@/i18n-config'

export default function manifest(
  { params }: { params: { lang: Locale } }
): MetadataRoute.Manifest {
  const meta = localeMetadata[params.lang]

  return {
    id: `/${params.lang}/`,
    name: `Sérgio Santos | ${meta.name}`,
    short_name: 'SergioData',
    start_url: `/${params.lang}/?source=pwa`,
    scope: `/${params.lang}/`,
    display: 'standalone',
    orientation: 'any',
    lang: meta.hrefLang,
    background_color: '#020617',
    theme_color: '#020617',

    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-192-maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
