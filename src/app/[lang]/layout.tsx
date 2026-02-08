/**
 * ROOT LAYOUT — NEXT.JS 16 — SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * ✔️ TOTALMENTE ALINHADO: src/types/dictionary.ts e src/dictionaries/index.ts
 * ✔️ SEO: Suporte a multilingue (PT, EN, ES) com x-default
 * ✔️ ACESSIBILIDADE: Skip links e ARIA labels dinâmicos
 */

import type { Metadata, Viewport } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import Script from 'next/script'
import '@/app/globals.css'

import { ThemeProvider } from '@/components/ThemeToggle'
import { CookieBanner } from '@/components/CookieBanner'
import { getServerDictionary } from "@/lib/getServerDictionary"
import type { Locale } from "@/types/dictionary"

/* --- FONTS --- */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

/* --- VIEWPORT --- */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
}

/* --- SEO & METADATA --- */
interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: Locale }>
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getServerDictionary(lang)
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfoliosantossergio.vercel.app'

  return {
    metadataBase: new URL(siteUrl),
    verification: {
      google: '0eQpOZSmJw5rFx70_NBmJCSkcBbwTs-qAJzfts5s-R0',
    },
    title: {
      default: `Sérgio Santos | ${dict.common.role}`,
      template: `%s | Sérgio Santos`,
    },
    description: dict.seo.description,
    alternates: {
      canonical: `${siteUrl}/${lang}`,
      languages: {
        'pt-BR': `${siteUrl}/pt-BR`,
        'en-US': `${siteUrl}/en-US`,
        'es-ES': `${siteUrl}/es-ES`,
        'es-AR': `${siteUrl}/es-AR`,
        'es-MX': `${siteUrl}/es-MX`,
        'x-default': `${siteUrl}/pt-BR`,
      },
    },
    openGraph: {
      type: 'website',
      url: `${siteUrl}/${lang}`,
      title: "Sérgio Santos",
      description: dict.seo.description,
      siteName: dict.seo.siteName,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Sérgio Santos Portfolio' }],
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

/* --- ROOT LAYOUT --- */
export default async function RootLayout({ children, params }: LayoutProps) {
  const { lang } = await params
  const dict = await getServerDictionary(lang)

  return (
    <html
      lang={lang}
      dir={dict.meta.direction}
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
            gtag('config', 'G-3XF5BTP58V');
          `}
        </Script>
      </head>

      <body className="min-h-screen flex flex-col bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 antialiased font-inter">
        <ThemeProvider>
          {/* Skip Link para Acessibilidade — Texto corrigido para fluxo de navegação */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-blue-600 focus:text-white focus:rounded-b-lg shadow-lg"
          >
            {dict.common.navigation}
          </a>

          <main id="main-content" className="flex-grow">
            {children}
          </main>

          <CookieBanner lang={lang} dict={dict} />
        </ThemeProvider>
      </body>
    </html>
  )
}
