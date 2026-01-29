/**
 * ROOT LAYOUT - NEXT.JS 16 - VERSÃO FINAL DE PRODUÇÃO
 * -----------------------------------------------------------------------------
 * - SEO: Metadados dinâmicos integrados aos dicionários JSON.
 * - Performance: Fontes otimizadas e scripts afterInteractive.
 * - Estabilidade: Tratamento de hidratação para evitar Client-side exceptions.
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
  const { lang } = await props.params
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
      canonical: `${siteUrl}/${currentLang}`,
      languages: { 
        pt: `${siteUrl}/pt`, 
        en: `${siteUrl}/en`, 
        es: `${siteUrl}/es`, 
        'x-default': `${siteUrl}/pt` 
      },
    },
    keywords: dict.seo.keywords,
    verification: { google: '0eQpOZSmJw5rFx70_NBmJCSkcBbwTs-qAJzfts5s-R0' },
    openGraph: {
      title: dict.seo.siteName,
      description: dict.seo.description,
      url: siteUrl,
      siteName: dict.seo.siteName,
      locale: currentLang,
      type: 'website',
    }
  }
}

export default async function RootLayout(props: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
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
      <body 
        className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-500/30 overflow-x-clip"
        suppressHydrationWarning
      >
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
          <div className="relative flex flex-col min-h-screen w-full">
            <main id="main-content" role="main" className="flex-grow w-full relative focus:outline-none">
              {props.children}
            </main>
          </div>
          
          {/* CookieBanner integrado dinamicamente com as chaves de tradução */}
          <CookieBanner 
            lang={currentLang} 
            dict={{
              title: currentLang === 'pt' ? "Cookies" : (currentLang === 'es' ? "Galletas" : "Cookies"),
              description: dict.seo.description, // Reuso inteligente da descrição SEO para o banner
              accept: dict.projects.viewAll // Reuso de chave existente ou fallback seguro
            }} 
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
