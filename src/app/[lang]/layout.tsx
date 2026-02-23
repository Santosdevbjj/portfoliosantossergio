// src/app/[lang]/layout.tsx

import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import Script from "next/script";

import { normalizeLocale, locales } from "@/dictionaries/locales";
import { getServerDictionary } from "@/lib/getServerDictionary";
import { ThemeToggle } from "@/components/ThemeToggle",

import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { BreadcrumbsJsonLd } from "@/components/seo/BreadcrumbsJsonLd";

/* -------------------------------------------------------------------------- */
/* FONT                                     */
/* -------------------------------------------------------------------------- */

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

/* -------------------------------------------------------------------------- */
/* STATIC PARAMS (Next 16)                             */
/* -------------------------------------------------------------------------- */

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/* -------------------------------------------------------------------------- */
/* METADATA                                  */
/* -------------------------------------------------------------------------- */

// Tipagem correta para Props assíncronos no Next 16
type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(
  { params }: LayoutProps
): Promise<Metadata> {
  // AWAIT OBRIGATÓRIO: Resolve o erro de undefined (reading 'lang')
  const resolvedParams = await params;
  const lang = resolvedParams.lang;

  const locale = normalizeLocale(lang);
  if (!locale) return {};

  const dict = await getServerDictionary(locale);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://portfoliosantossergio.vercel.app";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: dict.seo.siteName,
      template: `%s | ${dict.seo.siteName}`,
    },
    description: dict.seo.description,
    keywords: dict.seo.keywords,
    verification: {
      google: "0eQpOZSmJw5rFx70_NBmJCSkcBbwTs-qAJzfts5s-R0", // TAG MANTIDA
    },
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        locales.map((lng) => [lng, `${siteUrl}/${lng}`])
      ),
    },
    openGraph: {
      title: dict.seo.siteName,
      description: dict.seo.description,
      url: `${siteUrl}/${locale}`,
      siteName: dict.seo.siteName,
      locale: dict.meta.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.seo.siteName,
      description: dict.seo.description,
    },
  };
}

/* -------------------------------------------------------------------------- */
/* VIEWPORT                                 */
/* -------------------------------------------------------------------------- */

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

/* -------------------------------------------------------------------------- */
/* LAYOUT                                   */
/* -------------------------------------------------------------------------- */

export default async function LangLayout({ children, params }: LayoutProps) {
  // AWAIT OBRIGATÓRIO para evitar TypeError no Prerender da Vercel
  const resolvedParams = await params;
  const lang = resolvedParams.lang;

  const locale = normalizeLocale(lang);
  
  // Segurança adicional para o compilador TS 6.0
  if (!locale) {
    notFound();
  }

  const dict = await getServerDictionary(locale);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfoliosantossergio.vercel.app";

  return (
    <html lang={dict.meta.locale} dir={dict.meta.direction} className="scroll-smooth">
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground antialiased`}
      >
        {/* Skip to content para Acessibilidade */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 bg-slate-900 text-white px-4 py-2 rounded-md"
        >
          {dict.common.skipToContent}
        </a>

        {/* SEO Estruturado */}
        <BreadcrumbsJsonLd
          lang={locale}
          baseUrl={siteUrl}
          dict={dict}
        />

        <header>
           <Breadcrumbs
            lang={locale}
            baseUrl={siteUrl}
            dictionary={dict}
          />
        </header>

        {/* Google Analytics (MANTIDO CONFORME SOLICITADO) */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        <main id="main-content" className="flex-grow w-full">
          {children}
        </main>

        <footer className="w-full border-t border-border py-6 text-center text-sm text-muted-foreground">
          <div className="container mx-auto px-4">
            {dict.common.footer}
          </div>
        </footer>
      </body>
    </html>
  );
}
