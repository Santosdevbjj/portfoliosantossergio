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

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/* =========================================
   STATIC PARAMS (SSG)
========================================= */
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/* =========================================
   METADATA DINÂMICA (SEO, OG, X, WHATSAPP)
========================================= */
type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale = normalizeLocale(lang);

  if (!locales.includes(locale)) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfoliosantossergio.vercel.app";
  const dict = await getServerDictionary(locale);
  
  // Caminho ABSOLUTO da imagem específica por idioma
  const ogImageUrl = `${siteUrl}/og-image-${locale}.png`; 

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: dict.seo.title || "Sérgio Santos",
      template: `%s | ${dict.seo.siteName || "Sérgio Santos"}`,
    },
    description: dict.seo.description,
    keywords: dict.seo.keywords,
    
    // TAG DO GOOGLE PRESERVADA
    verification: {
      google: "0eQpOZSmJw5rFx70_NBmJCSkcBbwTs-qAJzfts5s-R0",
    },

    openGraph: {
      title: dict.seo.title,
      description: dict.seo.description,
      url: `${siteUrl}/${locale}`,
      siteName: dict.seo.siteName,
      locale: locale.replace("-", "_"), // Formato padrão OG (ex: pt_BR)
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: dict.seo.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: dict.seo.title,
      description: dict.seo.description,
      images: [ogImageUrl],
    },

    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        "pt-BR": `${siteUrl}/pt-BR`,
        "en-US": `${siteUrl}/en-US`,
        "es-ES": `${siteUrl}/es-ES`,
        "es-MX": `${siteUrl}/es-MX`,
        "es-AR": `${siteUrl}/es-AR`,
        "x-default": `${siteUrl}/en-US`,
      },
    },
  };
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
   LAYOUT PRINCIPAL
========================================= */
export default async function LangLayout(props: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const children = props.children;
  const locale = normalizeLocale(lang);

  if (!locales.includes(locale)) {
    notFound();
  }

  const dict = await getServerDictionary(locale);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfoliosantossergio.vercel.app";
  const baseLanguage = locale.split("-")[0];

  return (
    <html
      lang={baseLanguage}
      className={`${inter.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased transition-colors duration-500">
        <ScrollSpyProvider>
          {/* Acessibilidade: Skip Link */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[110] bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            {dict.common.skipToContent}
          </a>

          <Navbar lang={locale} common={dict.common} />

          <main id="main-content" className="flex-grow">
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

          <Footer
            lang={locale}
            common={dict.common}
            contact={dict.contact}
            articles={dict.articles}
          />
        </ScrollSpyProvider>

        {/* Google Analytics - Mantido conforme solicitado */}
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
