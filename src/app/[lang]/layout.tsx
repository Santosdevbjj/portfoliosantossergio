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
export async function generateStaticParams(): Promise<{ lang: string }[]> {
  return locales.map((lang) => ({ lang }));
}

/* =========================================
   METADATA DINÂMICA (SEO, OG, X, WHATSAPP)
========================================= */
export async function generateMetadata(
  { params }: { params: { lang: string } }
): Promise<Metadata> {
  const locale = normalizeLocale(params.lang);

  if (!locales.includes(locale)) {
    notFound();
  }

  // URL Base obrigatória para imagens funcionarem em redes sociais
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfoliosantossergio.vercel.app";
  const dict = await getServerDictionary(locale);
  
  // Caminho ABSOLUTO da imagem (Crucial para WhatsApp e X)
  const ogImageUrl = `${siteUrl}/og-image-${locale}.png`; 

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: dict.seo.title || "Sérgio Santos",
      template: `%s | ${dict.seo.siteName || "Sérgio Santos"}`,
    },
    description: dict.seo.description,
    keywords: dict.seo.keywords,
    
    verification: {
      google: "0eQpOZSmJw5rFx70_NBmJCSkcBbwTs-qAJzfts5s-R0",
    },

    openGraph: {
      title: dict.seo.title || "Sérgio Santos",
      description: dict.seo.description, // Puxa a tradução correta do arquivo de idioma
      url: `${siteUrl}/${locale}`,
      siteName: dict.seo.siteName,
      locale: locale,
      type: "website",
      images: [
        {
          url: ogImageUrl, // URL Completa https://...
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
      images: [ogImageUrl], // URL Completa para evitar corte
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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfoliosantossergio.vercel.app";
  const baseLanguage = locale.split("-")[0];

  return (
    <html
      lang={baseLanguage}
      className={inter.variable}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased transition-colors duration-500">
        <ScrollSpyProvider>
          {/* Acessibilidade: Skip Link */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[110] bg-brand-500 text-white px-4 py-2 rounded-md"
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

            <div className="main-container pt-4">
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
