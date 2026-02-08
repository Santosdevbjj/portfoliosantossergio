/**
 * ROOT LAYOUT — NEXT.JS 16 — SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * ✔️ TOTALMENTE ALINHADO: src/types/dictionary.ts
 * ✔️ VERIFICAÇÃO PRESERVADA: Google Search Console
 * ✔️ SEM DUPLICATAS: Versão limpa e otimizada
 */

import type { Metadata, Viewport } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import Script from 'next/script'
import '../globals.css'

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
type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: rawLang } = await params
  const lang = rawLang as Locale
  const dict = await getServerDictionary(lang); // ADICIONADO AWAIT
  
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
    description: dict.seo.description, // Melhor usar a descrição do SEO
    alternates: {
      canonical: `${siteUrl}/${lang}`,
      languages: {
        'pt-BR': `${siteUrl}/pt-BR`,
        'en-US': `${siteUrl}/en-US`,
        'es-ES': `${siteUrl}/es-ES`,
        'es-AR': `${siteUrl}/es-AR`,
        'es-MX': `${siteUrl}/es-MX`,
      },
    },
    openGraph: {
      type: 'website',
      url: `${siteUrl}/${lang}`,
      title: "Sérgio Santos",
      description: dict.common.role,
      siteName: dict.seo.siteName,
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
  }
}

/* --- ROOT LAYOUT --- */
export default async function RootLayout(props: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang: rawLang } = await props.params
  const lang = rawLang as Locale
  const dict = await getServerDictionary(lang); // ADICIONADO AWAIT

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
          {/* Skip Link para Acessibilidade */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white"
          >
            {dict.common.menu.aria.open}
          </a>

          <main id="main-content" className="flex-grow">
            {props.children}
          </main>

          <CookieBanner lang={lang} dict={dict} />
        </ThemeProvider>
      </body>
    </html>
  )
}
