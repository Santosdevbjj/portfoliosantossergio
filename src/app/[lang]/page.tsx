/**
 * HOME PAGE — ESTRUTURA ESTRATÉGICA SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * Framework: Next.js 16.1.5
 * I18n: PT / EN / ES (SSG)
 * SEO: Metadata + OG dinâmico
 * Responsividade: Viewport API (padrão moderno)
 */

import type { Metadata, Viewport } from 'next'
import { getDictionarySync, type SupportedLocale } from '@/dictionaries'
import { i18n } from '@/i18n-config'
import ProxyPage from '@/proxy'

interface PageProps {
  params: {
    lang: SupportedLocale
  }
}

/* -------------------------------------------------------------------------- */
/* VIEWPORT — RESPONSIVIDADE TOTAL                                             */
/* -------------------------------------------------------------------------- */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
}

/* -------------------------------------------------------------------------- */
/* SEO & OPEN GRAPH DINÂMICO                                                   */
/* -------------------------------------------------------------------------- */
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const currentLang: SupportedLocale =
    i18n.locales.includes(params.lang)
      ? params.lang
      : i18n.defaultLocale

  const dict = getDictionarySync(currentLang)
  const siteUrl = 'https://portfoliosantossergio.vercel.app'

  const ogImageUrl =
    `${siteUrl}/api/post-og` +
    `?title=${encodeURIComponent(`${dict.hero.title} ${dict.hero.subtitle}`)}` +
    `&description=${encodeURIComponent(dict.hero.headline)}` +
    `&author=Sérgio Santos`

  return {
    title: {
      default: dict.seo.siteName,
      template: `%s | ${dict.seo.siteName}`,
    },
    description: dict.seo.description,
    keywords: dict.seo.keywords,

    alternates: {
      canonical: `${siteUrl}/${currentLang}`,
      languages: {
        pt: '/pt',
        en: '/en',
        es: '/es',
      },
    },

    openGraph: {
      title: dict.seo.siteName,
      description: dict.seo.description,
      url: `${siteUrl}/${currentLang}`,
      siteName: dict.seo.siteName,
      locale: currentLang,
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: dict.seo.siteName,
        },
      ],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

/* -------------------------------------------------------------------------- */
/* STATIC GENERATION — ROTAS DE IDIOMA                                          */
/* -------------------------------------------------------------------------- */
export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }))
}

/* -------------------------------------------------------------------------- */
/* PAGE — SERVER COMPONENT                                                     */
/* -------------------------------------------------------------------------- */
export default function HomePage({ params }: PageProps) {
  const currentLang: SupportedLocale =
    i18n.locales.includes(params.lang)
      ? params.lang
      : i18n.defaultLocale

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-white dark:bg-[#020617]">
      <ProxyPage lang={currentLang} />
    </main>
  )
}
