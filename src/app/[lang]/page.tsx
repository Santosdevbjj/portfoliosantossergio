/**
 * HOME PAGE — ESTRUTURA ESTRATÉGICA SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * Framework: Next.js 16 (Turbopack)
 * I18n: PT / EN / ES (SSG)
 * SEO: Metadata Dinâmico + OpenGraph
 */

import type { Metadata, Viewport } from 'next'
import { getDictionarySync, type SupportedLocale } from '@/dictionaries'
import { i18n } from '@/i18n-config'
import ProxyPage from '@/ProxyClient' // Verifique se o import aponta para o ProxyClient revisado

interface PageProps {
  params: Promise<{
    lang: SupportedLocale
  }>
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
/* SEO & OPEN GRAPH — CONFIGURAÇÃO DINÂMICA                                    */
/* -------------------------------------------------------------------------- */
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const resolvedParams = await params
  const currentLang: SupportedLocale =
    i18n.locales.includes(resolvedParams.lang)
      ? resolvedParams.lang
      : i18n.defaultLocale

  const dict = getDictionarySync(currentLang)

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    'https://portfoliosantossergio.vercel.app'

  const pageTitle =
    dict.seo.pages?.home?.title ?? dict.seo.siteName

  const pageDescription =
    dict.seo.pages?.home?.description ?? dict.seo.description

  // URL para geração dinâmica de imagem de compartilhamento (OG)
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
  }
}

/* -------------------------------------------------------------------------- */
/* STATIC GENERATION — PRÉ-RENDERIZAÇÃO                                        */
/* -------------------------------------------------------------------------- */
export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }))
}

/* -------------------------------------------------------------------------- */
/* PAGE COMPONENT — PONTO DE ENTRADA                                           */
/* -------------------------------------------------------------------------- */
export default async function HomePage({ params }: PageProps) {
  const resolvedParams = await params
  const currentLang: SupportedLocale =
    i18n.locales.includes(resolvedParams.lang)
      ? resolvedParams.lang
      : i18n.defaultLocale

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-white dark:bg-[#020617]">
      {/* Passamos o lang resolvido para o ProxyClient. 
          O ProxyClient cuidará da renderização das seções (About, Projects, etc).
      */}
      <ProxyPage lang={currentLang} />
    </main>
  )
}
