// src/app/[lang]/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import '../globals.css';

import { ThemeProvider } from '@/components/ThemeProvider';
import { CookieBanner } from '@/components/CookieBanner';
import { i18n, type Locale } from '@/i18n-config';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
};

/** METADATA DINÂMICO - Corrigido para Next.js 16 preservando sua Tag Google */
export async function generateMetadata(props: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const resolvedParams = await props.params;
  const currentLang: Locale = ['pt', 'en', 'es'].includes(resolvedParams.lang) 
    ? resolvedParams.lang 
    : i18n.defaultLocale;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfoliosantossergio.vercel.app';

  return {
    title: {
      default: 'Sérgio Santos | Especialista em Dados',
      template: '%s | Sérgio Santos',
    },
    description: 'Especialista em Dados com 20+ anos de experiência.',
    metadataBase: new URL(siteUrl),
    verification: {
      // SUA TAG ORIGINAL RESTAURADA
      google: '0eQpOZSmJw5rFx70_NBmJCSkcBbwTs-qAJzfts5s-R0',
    },
    alternates: {
      canonical: `${siteUrl}/${currentLang}`,
      languages: {
        pt: `${siteUrl}/pt`,
        en: `${siteUrl}/en`,
        es: `${siteUrl}/es`,
        'x-default': `${siteUrl}/pt`,
      },
    },
    manifest: `/${currentLang}/manifest.webmanifest`,
  };
}

/** ROOT LAYOUT - Assíncrono para Next.js 16 */
export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lang: 'pt' | 'en' | 'es' }>;
}) {
  const resolvedParams = await props.params;
  const currentLang = ['pt', 'en', 'es'].includes(resolvedParams.lang)
    ? resolvedParams.lang
    : 'pt';

  return (
    <html
      lang={currentLang}
      suppressHydrationWarning
      className={`scroll-smooth ${montserrat.variable} ${inter.variable}`}
    >
      <body
        className={`
          ${inter.className}
          bg-slate-50 dark:bg-[#020617]
          text-slate-900 dark:text-slate-100
          antialiased min-h-screen flex flex-col
          selection:bg-blue-600 selection:text-white
        `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden">
            <main className="flex-grow w-full relative">{props.children}</main>
          </div>
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
