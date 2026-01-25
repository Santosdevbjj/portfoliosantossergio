// src/app/[lang]/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import '../globals.css';

import { ThemeProvider } from '@/components/ThemeProvider';
import { CookieBanner } from '@/components/CookieBanner';
import { i18n, type Locale } from '@/i18n-config';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const montserrat = Montserrat({ subsets: ['latin'], display: 'swap', variable: '--font-montserrat' });

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

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>; // Mudança para string resolve o erro de Type Constraint
}): Promise<Metadata> {
  const { lang: rawLang } = await props.params;
  const currentLang = (['pt', 'en', 'es'].includes(rawLang) ? rawLang : i18n.defaultLocale) as Locale;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfoliosantossergio.vercel.app';

  return {
    title: { default: 'Sérgio Santos | Especialista em Dados', template: '%s | Sérgio Santos' },
    description: 'Especialista em Dados com 20+ anos de experiência.',
    metadataBase: new URL(siteUrl),
    verification: {
      // SUA TAG ORIGINAL MANTIDA
      google: '0eQpOZSmJw5rFx70_NBmJCSkcBbwTs-qAJzfts5s-R0',
    },
    alternates: {
      canonical: `${siteUrl}/${currentLang}`,
      languages: { pt: `${siteUrl}/pt`, en: `${siteUrl}/en`, es: `${siteUrl}/es`, 'x-default': `${siteUrl}/pt` },
    },
    manifest: `/${currentLang}/manifest.webmanifest`,
  };
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>; // Alinhado com o motor de tipos do Next.js 16
}) {
  const { lang: rawLang } = await props.params;
  const currentLang = (['pt', 'en', 'es'].includes(rawLang) ? rawLang : 'pt') as Locale;

  return (
    <html lang={currentLang} suppressHydrationWarning className={`scroll-smooth ${montserrat.variable} ${inter.variable}`}>
      <body className={`${inter.className} bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col selection:bg-blue-600 selection:text-white`}>
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
