/**
 * ROOT LAYOUT — NEXT.JS 16 — SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * ✔️ Fix: Params transformados em Promise (Next.js 16 Compliance)
 * ✔️ Fix: Acesso aos dicionários corrigido para dict.seo.siteName
 * ✔️ Responsivo (Mobile / Desktop)
 * ✔️ Multilingue (PT / EN / ES)
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


import { getServerDictionary } from "@/lib/getServerDictionary";
import type { Locale } from "@/types/dictionary";

// No Next.js 15/16, params deve ser tratado como Promise
export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  // Aguarda a resolução dos parâmetros da URL
  const { lang } = await params;
  
  // Obtém o dicionário baseado no idioma resolvido
  const dict = getServerDictionary(lang);

  return (
    <html lang={lang} dir={dict.meta.direction || "ltr"}>
      <body className="antialiased">
        {/* Exemplo de uso: <Navbar dict={dict.common} /> */}
        {children}
        {/* Exemplo de uso: <Footer dict={dict.common} /> */}
      </body>
    </html>
  );
}




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
type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  // No Next.js 16, devemos aguardar o params
  const { lang: rawLang } = await params
  
  const lang = i18n.locales.includes(rawLang as SupportedLocale)
    ? (rawLang as SupportedLocale)
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

  // Nota: Acesso ajustado para dict.seo.siteName conforme o seu JSON
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
      images: [
        {
          url: `/og-image-${lang}.png`,
          width: 1200,
          height: 630,
          alt: dict.seo.siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.seo.siteName,
      description: dict.seo.description,
      images: [`/og-image-${lang}.png`],
    },
  }
}

/* -------------------------------------------------------------------------- */
/* ROOT LAYOUT                                                               */
/* -------------------------------------------------------------------------- */
export default async function RootLayout(props: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  // Unwrapping params no Next.js 16
  const { lang: rawLang } = await props.params
  const { children } = props

  const lang = i18n.locales.includes(rawLang as SupportedLocale)
    ? (rawLang as SupportedLocale)
    : i18n.defaultLocale

  const dict = getDictionarySync(lang)

  return (
    <html
      lang={lang}
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

      <body className="min-h-screen flex flex-col bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden font-inter">
        <ThemeProvider>
          {/* Skip Link para Acessibilidade */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white"
          >
            {lang === 'pt' ? 'Pular para o conteúdo' : lang === 'es' ? 'Saltar al contenido' : 'Skip to content'}
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
