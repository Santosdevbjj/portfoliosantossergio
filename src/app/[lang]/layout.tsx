/**
 * ROOT LAYOUT — NEXT.JS 16 — SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * ✔ Responsivo (Mobile / Desktop)
 * ✔ Multilingue (PT / EN / ES)
 * ✔ SEO Global centralizado e seguro
 * ✔ Alinhado ao sistema de dicionários tipado
 * ✔ Blindado contra falhas de runtime / middleware
 */

import type { Metadata, Viewport } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import Script from 'next/script'
import '../globals.css'

import { ThemeProvider } from '@/components/ThemeToggle'
import { CookieBanner } from '@/components/CookieBanner'
import { i18n } from '@/i18n-config'
import {
  getDictionarySync,
  type SupportedLocale,
} from '@/dictionaries'

/* -------------------------------------------------------------------------- */
/* FONTS                                                                      */
/* -------------------------------------------------------------------------- */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  preload: true,
})

/* -------------------------------------------------------------------------- */
/* VIEWPORT                                                                   */
/* -------------------------------------------------------------------------- */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
}

/* -------------------------------------------------------------------------- */
/* SEO GLOBAL                                                                 */
/* -------------------------------------------------------------------------- */
export async function generateMetadata({
  params,
}: {
  params?: { lang?: string }
}): Promise<Metadata> {
  const lang = i18n.locales.includes(params?.lang as SupportedLocale)
    ? (params?.lang as SupportedLocale)
    : i18n.defaultLocale

  const dict = getDictionarySync(lang)

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    'https://portfoliosantossergio.vercel.app'

  const ogLocaleMap: Record<SupportedLocale, string> = {
    pt: 'pt_BR',
    en: 'en_US',
    es: 'es_ES',
  }

  const localizedUrl =
    lang === i18n.defaultLocale
      ? siteUrl
      : `${siteUrl}/${lang}`

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: dict.seo.siteName,
      template: `%s | ${dict.seo.siteName}`,
    },
    description: dict.seo.description,
    keywords: dict.seo.keywords,
    authors: [{ name: 'Sérgio Santos' }],
    creator: 'Sérgio Santos',
    robots: {
      index: true,
      follow: true,
    },
    verification: {
      google: '0eQpOZSmJw5rFx70_NBmJCSkcBbwTs-qAJzfts5s-R0',
    },
    alternates: {
      canonical: localizedUrl,
      languages: {
        'pt-BR': `${siteUrl}/pt`,
        'en-US': `${siteUrl}/en`,
        'es-ES': `${siteUrl}/es`,
      },
    },
    openGraph: {
      type: 'website',
      locale: ogLocaleMap[lang],
      url: localizedUrl,
      title: dict.seo.siteName,
      description: dict.seo.description,
      siteName: dict.seo.siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.seo.siteName,
      description: dict.seo.description,
    },
  }
}

/* -------------------------------------------------------------------------- */
/* ROOT LAYOUT                                                               */
/* -------------------------------------------------------------------------- */
export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params?: { lang?: string }
}) {
  const lang = i18n.locales.includes(params?.lang as SupportedLocale)
    ? (params?.lang as SupportedLocale)
    : i18n.defaultLocale

  const dict = getDictionarySync(lang)

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${inter.variable} ${montserrat.variable} scroll-smooth`}
    >
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3XF5BTP58V"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3XF5BTP58V');
          `}
        </Script>
      </head>

      <body className="min-h-screen flex flex-col bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden font-inter">
        <ThemeProvider>
          {/* Acessibilidade */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white"
          >
            Skip to content
          </a>

          <main
            id="main-content"
            className="flex-grow w-full relative"
          >
            {children}
          </main>

          <CookieBanner lang={lang} dict={dict} />
        </ThemeProvider>
      </body>
    </html>
  )
}
