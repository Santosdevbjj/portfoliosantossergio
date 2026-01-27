import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import Script from 'next/script';
import '../globals.css';

import { ThemeProvider } from '@/components/ThemeProvider';
import { CookieBanner } from '@/components/CookieBanner';
import { i18n, type Locale } from '@/i18n-config';

// IMPORT CORRIGIDO: Nome exato da função exportada em src/dictionaries/index.ts
import { getDictionarySync, type SupportedLocale } from '@/dictionaries'; 

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter', 
  display: 'swap',
  preload: true 
});

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  variable: '--font-montserrat', 
  display: 'swap',
  preload: true 
});

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
};

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await props.params;
  const currentLang = i18n.locales.includes(lang as Locale) ? (lang as Locale) : i18n.defaultLocale;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfoliosantossergio.vercel.app';

  return {
    title: { default: 'Sérgio Santos | Especialista em Dados', template: '%s | Sérgio Santos' },
    description: 'Especialista em Dados e Engenharia de Software com mais de 20 anos de experiência.',
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
    verification: { google: '0eQpOZSmJw5rFx70_NBmJCSkcBbwTs-qAJzfts5s-R0' },
  };
}

export default async function RootLayout(props: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  const currentLang = (i18n.locales.includes(lang as Locale) ? lang : i18n.defaultLocale) as SupportedLocale;
  
  // Como a função é síncrona em src/dictionaries/index.ts, não precisa de await
  const dict = getDictionarySync(currentLang);

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
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 antialiased selection:bg-brand-500/30 selection:text-brand-900 overflow-x-clip">
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
          {/* Container responsivo 100% */}
          <div className="relative flex flex-col min-h-screen w-full">
            <main id="main-content" role="main" className="flex-grow w-full relative focus:outline-none">
              {props.children}
            </main>
          </div>
          
          {/* Multilingue: CookieBanner recebe o dicionário correto do idioma */}
          <CookieBanner lang={currentLang} dict={dict.cookieBanner} />
        </ThemeProvider>
      </body>
    </html>
  );
}
