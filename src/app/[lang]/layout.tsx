/**
 * ROOT LAYOUT - NEXT.JS 16 - SÉRGIO SANTOS (REVISÃO FINAL - SEM ERROS DE TIPO)
 * -----------------------------------------------------------------------------
 */

import type { Metadata, Viewport } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import Script from 'next/script'
import '../globals.css'

import { ThemeProvider } from '@/components/ThemeToggle'
import { CookieBanner } from '@/components/CookieBanner'
import { i18n, type Locale } from '@/i18n-config'
import { getDictionarySync, type SupportedLocale } from '@/dictionaries'

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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
}

export async function generateMetadata(
  props: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const { lang } = await props.params
  const currentLang = (i18n.locales.includes(lang as Locale) ? lang : i18n.defaultLocale) as SupportedLocale
  const dict = getDictionarySync(currentLang)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfoliosantossergio.vercel.app'

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: dict.seo.siteName,
      template: `%s | ${dict.seo.siteName}`,
    },
    description: dict.seo.description,
    verification: { google: '0eQpOZSmJw5rFx70_NBmJCSkcBbwTs-qAJzfts5s-R0' },
    alternates: {
      canonical: currentLang === i18n.defaultLocale ? siteUrl : `${siteUrl}/${currentLang}`,
      languages: { 'pt-BR': `${siteUrl}/pt`, 'en-US': `${siteUrl}/en`, 'es-ES': `${siteUrl}/es` },
    },
  }
}

export default async function RootLayout(props: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await props.params
  const currentLang = (i18n.locales.includes(lang as Locale) ? lang : i18n.defaultLocale) as SupportedLocale
  const dict = getDictionarySync(currentLang)

  return (
    <html
      lang={currentLang}
      suppressHydrationWarning
      className={`${inter.variable} ${montserrat.variable} scroll-smooth`}
    >
      <head>
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=G-3XF5BTP58V" 
          strategy="afterInteractive" 
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden">
        <ThemeProvider>
          <main id="main-content" className="flex-grow w-full">
            {props.children}
          </main>
          
          {/* CORREÇÃO: Passando o dicionário completo para o CookieBanner. 
              A lógica de tradução de 'Aceitar/Privacidade' deve ser tratada 
              DENTRO do componente CookieBanner usando dict.common.
          */}
          <CookieBanner
            lang={currentLang}
            dict={dict} 
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
