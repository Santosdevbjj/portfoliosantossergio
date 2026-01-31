/**
 * ROOT LAYOUT - NEXT.JS 16 - SÉRGIO SANTOS ESTRATÉGICO (CORRIGIDO)
 * -----------------------------------------------------------------------------
 * Ajuste: params agora é uma Promise (Requisito obrigatório do Next.js 16)
 */

import type { Metadata, Viewport } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import Script from 'next/script'
import '../globals.css'

import { ThemeProvider } from '@/components/ThemeToggle'
import { CookieBanner } from '@/components/CookieBanner'
import { i18n, type Locale } from '@/i18n-config'
import { getDictionarySync, type SupportedLocale } from '@/dictionaries'

// Fonts
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

// Viewport
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
}

// SEO Metadata - Corrigido para Promise
export async function generateMetadata(
  props: { params: Promise<{ lang: string }> } // params é Promise no v16
): Promise<Metadata> {
  const { lang } = await props.params // Aguarda a resolução
  
  const currentLang = (
    i18n.locales.includes(lang as Locale)
      ? lang
      : i18n.defaultLocale
  ) as SupportedLocale

  const dict = getDictionarySync(currentLang)

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    'https://portfoliosantossergio.vercel.app'

  const ogLocale =
    currentLang === 'pt' ? 'pt_BR' : currentLang === 'es' ? 'es_ES' : 'en_US'

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: dict.seo.siteName,
      template: `%s | ${dict.seo.siteName}`,
    },
    description: dict.seo.description,
    keywords: dict.seo.keywords,
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
        'x-default': `${siteUrl}/pt`,
      },
    },
    openGraph: {
      title: dict.seo.siteName,
      description: dict.seo.description,
      url: `${siteUrl}/${currentLang}`,
      siteName: dict.seo.siteName,
      locale: ogLocale,
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.seo.siteName,
      description: dict.seo.description,
      images: ['/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

// Root Layout - Corrigido para Async e Promise
export default async function RootLayout(props: {
  children: React.ReactNode
  params: Promise<{ lang: string }> // params é Promise no v16
}) {
  const { lang } = await props.params // Aguarda a resolução antes de usar

  const currentLang = (
    i18n.locales.includes(lang as Locale)
      ? lang
      : i18n.defaultLocale
  ) as SupportedLocale

  const dict = getDictionarySync(currentLang)

  return (
    <html
      lang={currentLang}
      dir="ltr"
      suppressHydrationWarning
      className={`${inter.variable} ${montserrat.variable} scroll-smooth`}
    >
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3XF5BTP58V"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3XF5BTP58V', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>

      <body className="min-h-screen flex flex-col bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 antialiased font-inter overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main id="main-content" className="flex-grow w-full">
            {props.children}
          </main>

          <CookieBanner
            lang={currentLang}
            dict={{
              title: currentLang === 'pt'
                ? 'Privacidade'
                : currentLang === 'es'
                ? 'Privacidad'
                : 'Privacy',
              description: dict.seo.description,
              accept: currentLang === 'pt'
                ? 'Aceitar'
                : currentLang === 'es'
                ? 'Aceptar'
                : 'Accept',
              common: dict.common,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
