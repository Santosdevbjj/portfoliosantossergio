import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";

import { normalizeLocale, locales } from "@/dictionaries/locales";
import { getServerDictionary } from "@/lib/getServerDictionary";
import { ScrollSpyProvider } from "@/contexts/scroll-spy.client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { BreadcrumbsJsonLd } from "@/components/seo/BreadcrumbsJsonLd";

import "@/app/globals.css";
import "@/styles/animations.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/* =========================================
   STATIC PARAMS (SSG)
========================================= */
export async function generateStaticParams(): Promise<
  { lang: string }[]
> {
  return locales.map((lang) => ({ lang }));
}

/* =========================================
   METADATA
========================================= */
export async function generateMetadata(
  { params }: { readonly params: { readonly lang: string } }
): Promise<Metadata> {
  const locale = normalizeLocale(params.lang);

  if (!locales.includes(locale)) {
    notFound();
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://portfoliosantossergio.vercel.app";

  const metadataBase = new URL(siteUrl);

  try {
    const dict = await getServerDictionary(locale);

    return {
      metadataBase,

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
        canonical: `/${locale}`,
        languages: {
          ...Object.fromEntries(
            locales.map((lng) => [lng, `/${lng}`])
          ),
          "x-default": `/en-US`,
        },
      },
    };
  } catch {
    return {
      metadataBase,
      title: "Sergio Santos Portfolio",
      description: "Full Stack Developer Portfolio",
    };
  }
}

/* =========================================
   VIEWPORT
========================================= */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

/* =========================================
   LAYOUT
========================================= */
export default async function LangLayout({
  children,
  params,
}: {
  readonly children: ReactNode;
  readonly params: { readonly lang: string };
}) {
  const locale = normalizeLocale(params.lang);

  if (!locales.includes(locale)) {
    notFound();
  }

  const dict = await getServerDictionary(locale);

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://portfoliosantossergio.vercel.app";

  const baseLanguage = locale.split("-")[0]; // en-US -> en

  return (
    <html
      lang={baseLanguage}
      className={`${inter.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased font-sans">
        <ScrollSpyProvider>
          {/* Skip Link */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[110] bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            {dict.common.skipToContent}
          </a>

          {/* Navbar */}
          <Navbar lang={locale} common={dict.common} />

          <main id="main-content" className="flex-grow">
            {/* SEO Breadcrumb JSON-LD */}
            <BreadcrumbsJsonLd
              lang={locale}
              dict={dict}
              baseUrl={baseUrl}
            />

            <div className="container mx-auto px-4 pt-4">
              <Breadcrumbs
                lang={locale}
                dictionary={dict}
                baseUrl={baseUrl}
              />
            </div>

            {children}
          </main>

          {/* Footer */}
          <Footer
            lang={locale}
            common={dict.common}
            contact={dict.contact}
            articles={dict.articles}
          />
        </ScrollSpyProvider>

        {/* Google Analytics */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
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
      </body>
    </html>
  );
}
