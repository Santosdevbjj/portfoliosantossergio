/**
 * ROOT LAYOUT - NEXT.JS 16 - SÉRGIO SANTOS ESTRATÉGICO
 * -----------------------------------------------------------------------------
 * - Responsividade: Estrutura flex-col com largura total.
 * - Multilingue: PT, EN, ES com SEO dinâmico por idioma.
 * - Alinhamento: Consome dicionários para metadados e componentes globais.
 */

import type { Metadata, Viewport } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import Script from 'next/script'
import '../globals.css'

import { ThemeProvider } from '@/components/ThemeProvider'
import { CookieBanner } from '@/components/CookieBanner'
import { i18n, type Locale } from '@/i18n-config'
import { getDictionarySync, type SupportedLocale } from '@/dictionaries' 

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter', 
  display: 'swap',
  preload: true 
})

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  variable: '--font-montserrat', 
  display: 'swap',
  preload: true 
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5, 
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
}

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const resolvedParams = await props.params
  const lang = resolvedParams.lang
  const currentLang = (i18n.locales.includes(lang as Locale) ? lang : i18n.defaultLocale) as SupportedLocale
  
  const dict = getDictionarySync(currentLang)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfoliosantossergio.vercel.app'

  return {
    title: { 
      default: dict.seo.siteName, 
      template: `%s | ${dict.seo.siteName}` 
    },
    description: dict.seo.description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `/${currentLang}`,
      languages: { 
        pt: '/pt', 
        en: '/en', 
        es: '/es', 
        'x-default': '/pt' 
      },
    },
    keywords: dict.seo.keywords,
    openGraph: {
      title: dict.seo.siteName,
      description: dict.seo.description,
      url: './',
      siteName: dict.seo.siteName,
      locale: currentLang,
      type: 'website',
    }
  }
}

export default async function RootLayout(props: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const resolvedParams = await props.params
  const lang = resolvedParams.lang
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
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3XF5BTP58V');
          `}
        </Script>
      </head>
      <body 
        className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 antialiased font-inter overflow-x-hidden"
        suppressHydrationWarning
      >
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <main id="main-content" className="flex-grow">
              {props.children}
            </main>
          </div>
          
          <CookieBanner 
            lang={currentLang} 
            dict={{
              title: currentLang === 'pt' ? "Privacidade" : (currentLang === 'es' ? "Privacidad" : "Privacy"),
              description: dict.seo.description,
              accept: dict.projects.viewAll // Reaproveitando a label de ação do dicionário
            }} 
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
