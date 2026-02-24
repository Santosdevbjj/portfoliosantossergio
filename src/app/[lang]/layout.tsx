import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

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
  variable: '--font-inter',
});

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { lang } = await params;
  const locale = normalizeLocale(lang);
  
  // Try/catch para evitar erro 500 se o dicionário falhar na Metadata
  try {
    const dict = await getServerDictionary(locale);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portfoliosantossergio.vercel.app";

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
        canonical: `/${locale}`,
        languages: Object.fromEntries(locales.map((lng) => [lng, `${siteUrl}/${lng}`])),
      },
    };
  } catch (error) {
    console.error("Metadata error:", error);
    return { title: "Portfolio - Sergio Santos" };
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

export default async function LangLayout({ children, params }: LayoutProps) {
  // No Next.js 15/16, params DEVE ser aguardado
  const { lang } = await params;
  const locale = normalizeLocale(lang);
  
  // Fallback para evitar que o site caia se o dicionário falhar
  let dict;
  try {
    dict = await getServerDictionary(locale);
  } catch (error) {
    console.error("Dictionary load error:", error);
    // Se o dicionário falhar, o Next.js pode renderizar uma página de erro ou fallback
    throw error; 
  }

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfoliosantossergio.vercel.app';

  return (
    <html lang={locale} className={`${inter.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased font-sans">
        <ScrollSpyProvider>
          {/* Acesso rápido para teclado */}
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[110] bg-blue-600 text-white px-4 py-2 rounded-md">
            {dict.common.skipToContent}
          </a>

          {/* Cabeçalho */}
          <Navbar lang={locale} common={dict.common} />

          <main id="main-content" className="flex-grow">
            {/* Integração dos Breadcrumbs (SEO e Visual) */}
            <BreadcrumbsJsonLd lang={locale} dict={dict} baseUrl={baseUrl} />
            <div className="container mx-auto px-4 pt-4">
              <Breadcrumbs lang={locale} dictionary={dict} baseUrl={baseUrl} />
            </div>

            {children}
          </main>

          {/* Rodapé */}
          <Footer 
            lang={locale}
            common={dict.common}
            contact={dict.contact}
            articles={dict.articles}
          />
        </ScrollSpyProvider> 

        {/* Google Analytics Script */}
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
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
      </body> 
    </html>
  );
}
