import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import '../globals.css';

import { ThemeProvider } from '@/components/ThemeProvider';
import { CookieBanner } from '@/components/CookieBanner';
import { i18n, type Locale } from '@/i18n-config';

/**
 * FONTES OTIMIZADAS
 */
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

/**
 * VIEWPORT & PWA
 */
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

/**
 * METADATA DINÂMICO MULTILÍNGUE + MANIFEST POR IDIOMA
 */
export async function generateMetadata(
  { params }: { params: { lang: Locale } }
): Promise<Metadata> {
  const currentLang: Locale =
    ['pt', 'en', 'es'].includes(params.lang)
      ? params.lang
      : i18n.defaultLocale;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    'https://portfoliosantossergio.vercel.app';

  const content: Record<Locale, { title: string; desc: string }> = {
    pt: {
      title: 'Sérgio Santos | Especialista em Dados e Sistemas Críticos',
      desc: 'Especialista em Dados com 20+ anos de experiência. Foco em Azure, Python, Governança Operacional e Eficiência Financeira.',
    },
    en: {
      title: 'Sérgio Santos | Data & Critical Systems Specialist',
      desc: 'Data Specialist with 20+ years of experience. Focus on Azure, Python, Operational Governance, and Financial Efficiency.',
    },
    es: {
      title: 'Sérgio Santos | Especialista en Datos y Sistemas Críticos',
      desc: 'Especialista en Datos con 20+ años de experiencia. Enfoque en Azure, Python, Gobernanza Operativa y Eficiencia Financiera.',
    },
  };

  const currentContent = content[currentLang];

  return {
    title: {
      default: currentContent.title,
      template: '%s | Sérgio Santos',
    },
    description: currentContent.desc,

    metadataBase: new URL(siteUrl),

    /**
     * ⚠️ TAG DO GOOGLE — MANTIDA INTACTA
     */
    verification: {
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

    /**
     * PWA — MANIFEST DINÂMICO POR IDIOMA
     */
    manifest: `/${currentLang}/manifest.webmanifest`,

    openGraph: {
      title: currentContent.title,
      description: currentContent.desc,
      url: `${siteUrl}/${currentLang}`,
      siteName: 'Sérgio Santos Portfolio',
      locale:
        currentLang === 'pt'
          ? 'pt_BR'
          : currentLang === 'es'
          ? 'es_ES'
          : 'en_US',
      type: 'website',
      images: [
        {
          url: `/og-image-${currentLang}.png`,
          width: 1200,
          height: 630,
          alt: currentContent.title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: currentContent.title,
      description: currentContent.desc,
      images: [`/og-image-${currentLang}.png`],
    },

    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: 'Sérgio.Data',
    },

    formatDetection: {
      telephone: false,
    },
  };
}

/**
 * ROOT LAYOUT POR IDIOMA
 */
export default function RootLayout(
  { children, params }: { children: React.ReactNode; params: { lang: Locale } }
) {
  const currentLang: Locale =
    ['pt', 'en', 'es'].includes(params.lang)
      ? params.lang
      : i18n.defaultLocale;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    'https://portfoliosantossergio.vercel.app';

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
          {/* Schema.org — ProfilePage + Person */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'ProfilePage',
                mainEntity: {
                  '@type': 'Person',
                  name: 'Sérgio Santos',
                  url: siteUrl,
                  jobTitle: 'Data & Systems Architect',
                  sameAs: [
                    'https://www.linkedin.com/in/sergiosantos',
                    'https://github.com/sergiosantos',
                  ],
                  knowsAbout: [
                    'Data Architecture',
                    'Cloud Computing',
                    'Azure',
                    'Python',
                    'Governance',
                    'System Design',
                  ],
                  contactPoint: {
                    '@type': 'ContactPoint',
                    contactType: 'Professional inquiries',
                    availableLanguage: [
                      'Portuguese',
                      'English',
                      'Spanish',
                    ],
                  },
                },
              }),
            }}
          />

          <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden">
            <main className="flex-grow w-full relative">
              {children}
            </main>
          </div>

          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
