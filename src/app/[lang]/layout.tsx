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
   METADATA DINÂMICA (SEO, OG, LINKEDIN)
========================================= */
export async function generateMetadata(
  { params }: { params: { lang: string } }
): Promise<Metadata> {
  const locale = normalizeLocale(params.lang);

  if (!locales.includes(locale)) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfoliosantossergio.vercel.app";
  const dict = await getServerDictionary(locale);
  
  // Define a imagem correta baseada no idioma detectado
  const ogImage = `/og-image-${locale}.png`; 

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Sérgio Santos | Analista de Dados e Resiliência",
      template: `%s | Sérgio Santos`,
    },
    description: "Especialista em Ciência de Dados e Resiliência. Projetos de agentes inteligentes com Azure OpenAI e segurança STRIDE.",
    keywords: dict.seo.keywords,
    
    // Verificação do Google (Sua TAG mantida)
    verification: {
      google: "0eQpOZSmJw5rFx70_NBmJCSkcBbwTs-qAJzfts5s-R0",
    },

    // Open Graph (LinkedIn, Facebook, WhatsApp)
    openGraph: {
      title: "Sérgio Santos | Analista de Dados e Resiliência",
      description: "Especialista em Ciência de Dados e Resiliência com foco em soluções de IA Generativa (Azure OpenAI) e segurança arquitetural STRIDE. Explore meus projetos e expertise técnica.",
      url: `${siteUrl}/${locale}`,
      siteName: "Portfólio Sérgio Santos",
      locale: locale,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `Portfólio Sérgio Santos - ${locale}`,
        },
      ],
    },

    // Twitter / X
    twitter: {
      card: "summary_large_image",
      title: "Sérgio Santos | Analista de Dados e Resiliência",
      description: "Ciência de Dados e Agentes Inteligentes de Segurança.",
      images: [ogImage],
    },

    // Alternates (Multilíngue)
    alternates: {
      canonical: `/${locale}`,
      languages: {
        "pt-BR": "/pt-BR",
        "en-US": "/en-US",
        "es-ES": "/es-ES",
        "es-MX": "/es-MX",
        "es-AR": "/es-AR",
        "x-default": "/en-US",
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

        {/* Google Analytics (Sua TAG mantida e protegida) */}
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
