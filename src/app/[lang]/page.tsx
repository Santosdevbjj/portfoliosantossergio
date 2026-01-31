/**
 * HOME PAGE — ESTRUTURA ESTRATÉGICA SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * Framework: Next.js 16
 * I18n: PT / EN / ES (SSG)
 * SEO: Metadata + OpenGraph dinâmico
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
/* VIEWPORT — RESPONSIVIDADE GLOBAL                                            */
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
/* SEO & OPEN GRAPH — HOME PAGE                                                */
/* -------------------------------------------------------------------------- */
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const currentLang: SupportedLocale =
    i18n.locales.includes(params.lang)
      ? params.lang
      : i18n.defaultLocale

  const dict = getDictionarySync(currentLang)

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    'https://portfoliosantossergio.vercel.app'

  const pageTitle =
    dict.seo.pages?.home?.title ?? dict.seo.siteName

  const pageDescription =
    dict.seo.pages?.home?.description ?? dict.seo.description

  const ogImageUrl =
    `${siteUrl}/api/post-og` +
    `?title=${encodeURIComponent(`${dict.hero.title} ${dict.hero.subtitle}`)}` +
    `&description=${encodeURIComponent(dict.hero.headline)}` +
    `&author=Sérgio Santos`

  const ogLocaleMap: Record<SupportedLocale, string> = {
    pt: 'pt_BR',
    en: 'en_US',
    es: 'es_ES',
  }

  return {
    title: {
      default: pageTitle,
      template: `%s | ${dict.seo.siteName}`,
    },
    description: pageDescription,
    keywords: dict.seo.keywords,

    alternates: {
      canonical: `${siteUrl}/${currentLang}`,
      languages: {
        'pt-BR': `${siteUrl}/pt`,
        'en-US': `${siteUrl}/en`,
        'es-ES': `${siteUrl}/es`,
        'x-default': `${siteUrl}/pt`,
      },
    },

    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `${siteUrl}/${currentLang}`,
      siteName: dict.seo.siteName,
      locale: ogLocaleMap[currentLang],
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
/* STATIC GENERATION — ROTAS DE IDIOMA                                         */
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
