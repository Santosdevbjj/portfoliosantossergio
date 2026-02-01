/**
 * ROOT LAYOUT — NEXT.JS 16 — SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * ✔ Responsivo (Mobile / Desktop)
 * ✔ Multilingue (PT / EN / ES)
 * ✔ SEO Global centralizado
 * ✔ Fonts otimizadas
 */

import type { Metadata, Viewport } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import Script from 'next/script'
import '../globals.css'

import { ThemeProvider } from '@/components/ThemeToggle'
import { CookieBanner } from '@/components/CookieBanner'
import { i18n } from '@/i18n-config'
import { getDictionarySync, type SupportedLocale } from '@/dictionaries'

/* -------------------------------------------------------------------------- */
/* FONTS                                                                       */
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
/* VIEWPORT                                                                    */
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
/* SEO GLOBAL                                                                  */
/* -------------------------------------------------------------------------- */
export function generateMetadata({
  params,
}: {
  params: { lang: SupportedLocale }
}): Metadata {
  const currentLang: SupportedLocale =
    i18n.locales.includes(params.lang)
      ? params.lang
      : i18n.defaultLocale

  const dict = getDictionarySync(currentLang)

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    'https://portfoliosantossergio.vercel.app'

  const ogLocaleMap: Record<SupportedLocale, string> = {
    pt: 'pt_BR',
    en: 'en_US',
    es: 'es_ES',
  }

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
    verification: {
      google: '0eQpOZSmJw5rFx70_NBmJCSkcBbwTs-qAJzfts5s-R0',
    },
    alternates: {
      canonical:
        currentLang === i18n.defaultLocale
          ? siteUrl
          : `${siteUrl}/${currentLang}`,
      languages: {
        'pt-BR': `${siteUrl}/pt`,
        'en-US': `${siteUrl}/en`,
        'es-ES': `${siteUrl}/es`,
      },
    },
    openGraph: {
      type: 'website',
      locale: ogLocaleMap[currentLang],
      url: siteUrl,
      title: dict.seo.siteName,
      description: dict.seo.description,
      siteName: dict.seo.siteName,
    },
  }
}

/* -------------------------------------------------------------------------- */
/* ROOT LAYOUT                                                                */
/* -------------------------------------------------------------------------- */
export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: SupportedLocale }
}) {
  const currentLang: SupportedLocale =
    i18n.locales.includes(params.lang)
      ? params.lang
      : i18n.defaultLocale

  const dict = getDictionarySync(currentLang)

  return (
    <html
      lang={currentLang}
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

          <CookieBanner lang={currentLang} dict={dict} />
        </ThemeProvider>
      </body>
    </html>
  )
}
