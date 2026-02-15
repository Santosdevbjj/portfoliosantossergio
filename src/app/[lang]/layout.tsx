import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";

import {
  isValidLocale,
  normalizeLocale,
} from "@/dictionaries/locales";
import type { Locale } from "@/types/dictionary";
import { getServerDictionary } from "@/lib/getServerDictionary";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

interface LayoutProps {
  readonly children: ReactNode;
  readonly params: Promise<{ lang: Locale }>;
}

/**
 * Metadata dinâmica por idioma
 */
export async function generateMetadata(
  { params }: { params: Promise<{ lang: Locale }> }
): Promise<Metadata> {
  const { lang } = await params;

  let locale: Locale;
  try {
    locale = normalizeLocale(lang);
  } catch {
    notFound();
  }

  const dict = await getServerDictionary(locale);
  const siteUrl = "https://portfoliosantossergio.vercel.app";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: dict.seo.siteName,
      template: `%s | ${dict.seo.siteName}`,
    },
    description: dict.seo.description,
    keywords: dict.seo.keywords,
     verification: {
      google: "0eQpOZSmJw5rFx70_NBmJCSkcBbwTs-qAJzfts5s-R0",

    },
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        "pt-BR": `${siteUrl}/pt-BR`,
        "en-US": `${siteUrl}/en-US`,
        "es-ES": `${siteUrl}/es-ES`,
        "es-AR": `${siteUrl}/es-AR`,
        "es-MX": `${siteUrl}/es-MX`,
        "x-default": `${siteUrl}/pt-BR`,
      },
    },
    openGraph: {
      title: dict.seo.siteName,
      description: dict.seo.description,
      url: `${siteUrl}/${locale}`,
      siteName: dict.seo.siteName,
      locale,
      type: "website",
    },
  };
}

/**
 * Viewport
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

/**
 * Root Layout
 */
export default async function LangLayout({
  children,
  params,
}: LayoutProps): Promise<JSX.Element> {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const dict = await getServerDictionary(lang);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang={lang} dir={dict.meta.direction}>
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground antialiased`}
      >
        {/* Skip to content — acessibilidade */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 bg-slate-900 text-white px-4 py-2 rounded-md"
        >
          {dict.common.skipToContent}
        </a>

        {/* Google Analytics */}
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
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}

        <main id="main-content" className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
