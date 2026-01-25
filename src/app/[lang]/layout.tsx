// src/app/[lang]/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import '../globals.css';

import { ThemeProvider } from '@/components/ThemeProvider';
import { CookieBanner } from '@/components/CookieBanner';
import { i18n, type Locale } from '@/i18n-config';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
};

/** METADATA DINÂMICO - Next.js 16 Async */
export async function generateMetadata(props: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await props.params;
  const currentLang: Locale = ['pt', 'en', 'es'].includes(lang) ? lang : i18n.defaultLocale;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfoliosantossergio.vercel.app';

  const content: Record<Locale, { title: string; desc: string }> = {
    pt: { title: 'Sérgio Santos | Especialista em Dados', desc: 'Foco em Azure, Python e Governança.' },
    en: { title: 'Sérgio Santos | Data Specialist', desc: 'Focus on Azure, Python and Governance.' },
    es: { title: 'Sérgio Santos | Especialista en Datos', desc: 'Enfoque en Azure, Python y Gobernanza.' },
  };

  return {
    title: { default: content[currentLang].title, template: '%s | Sérgio Santos' },
    description: content[currentLang].desc,
    metadataBase: new URL(siteUrl),
    verification: { google: '0eQpOZSmJw5rFx70_NBmJCSkcBbwTs-qAJzfts5s-R0' },
    alternates: {
      canonical: `${siteUrl}/${currentLang}`,
      languages: { pt: `${siteUrl}/pt`, en: `${siteUrl}/en`, es: `${siteUrl}/es`, 'x-default': `${siteUrl}/pt` },
    },
    manifest: `/${currentLang}/manifest.webmanifest`,
  };
}

/** ROOT LAYOUT - Corrigido para Next.js 16 */
export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lang: 'pt' | 'en' | 'es' }>;
}) {
  const { lang } = await props.params;
  const currentLang = ['pt', 'en', 'es'].includes(lang) ? lang : 'pt';

  return (
    <html
      lang={currentLang}
      suppressHydrationWarning
      className={`scroll-smooth ${montserrat.variable} ${inter.variable}`}
    >
      <body className={`${inter.className} bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-600 selection:text-white`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden">
            <main className="flex-grow w-full relative">{props.children}</main>
          </div>
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
