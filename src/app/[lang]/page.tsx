/**
 * HOME PAGE — ESTRUTURA ESTRATÉGICA SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * ✔️ Fix: Params as Promise (Next.js 16 Compliance)
 * ✔️ Fix: SEO dinâmico alinhado à estrutura real do JSON
 * ✔️ Responsividade: Mobile-first com viewport segura
 */

import type { Metadata, Viewport } from 'next'
import { getDictionarySync, type SupportedLocale } from '@/dictionaries'
import { i18n } from '@/i18n-config'
import ProxyPage from '@/ProxyClient' 




// Definição de Props para Next.js 16
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
  props: PageProps,
): Promise<Metadata> {
  const params = await props.params;
  
  const currentLang: SupportedLocale =
    i18n.locales.includes(params.lang)
      ? params.lang
      : i18n.defaultLocale

  const dict = getDictionarySync(currentLang)

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    'https://portfoliosantossergio.vercel.app'

  // Ajuste de fallback: Usa dict.seo.siteName pois 'pages' está ausente nos JSONs
  const pageTitle = dict.seo.siteName
  const pageDescription = dict.seo.description

  /**
   * Open Graph dinâmico via Image Generation API
   */
  const ogImageUrl =
    `${siteUrl}/api/post-og` +
    `?title=${encodeURIComponent(
      `${dict.hero.title} ${dict.hero.subtitle}`,
    )}` +
    `&description=${encodeURIComponent(dict.hero.headline)}` +
    `&author=Sérgio Santos`

  const ogLocaleMap: Record<SupportedLocale, string> = {
    pt: 'pt_BR',
    en: 'en_US',
    es: 'es_ES',
  }

  return {
    title: pageTitle,
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
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [ogImageUrl],
    },
  }
}

/* -------------------------------------------------------------------------- */
/* STATIC GENERATION — PRÉ-RENDERIZAÇÃO                                        */
/* -------------------------------------------------------------------------- */
export function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }))
}

/* -------------------------------------------------------------------------- */
/* PAGE COMPONENT — PONTO DE ENTRADA                                           */
/* -------------------------------------------------------------------------- */
export default async function HomePage(props: PageProps) {
  const params = await props.params;
  
  const currentLang: SupportedLocale =
    i18n.locales.includes(params.lang)
      ? params.lang
      : i18n.defaultLocale

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-white dark:bg-[#020617]">
      {/* ProxyPage centraliza a lógica do lado do cliente para manter 
        esta página como Server Component para SEO máximo.
      */}
      <ProxyPage lang={currentLang} />
    </main>
  )
}
