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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portfoliosantossergio.vercel.app";

  try {
    const dict = await getServerDictionary(locale);
    // Validação extra para evitar erro fatal de URL
    const safeBaseUrl = siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`;
    
    return {
      metadataBase: new URL(safeBaseUrl),
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
  } catch (e) {
    console.error("Metadata error:", e);
    return { title: "Portfolio - Sergio Santos" };
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

export default async function LangLayout({ children, params }: LayoutProps) {
  // 1. Resolve os parâmetros
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams?.lang);
  
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const rawBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfoliosantossergio.vercel.app';
  // Garante que a URL não termine com / para evitar erros de concatenação
  const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

  // 2. Tenta carregar o dicionário
  let dict;
  try {
    dict = await getServerDictionary(locale);
  } catch (error) {
    console.error("Layout dictionary error:", error);
    // Se falhar o dicionário, não podemos renderizar os componentes que dependem dele
  }

  return (
    <html lang={locale} className={`${inter.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased font-sans">
        <ScrollSpyProvider>
          {/* Só renderiza se o dicionário existir */}
          {dict && (
            <>
              <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[110] bg-blue-600 text-white px-4 py-2 rounded-md">
                {dict.common.skipToContent}
              </a>

              <Navbar lang={locale} common={dict.common} />

              <main id="main-content" className="flex-grow">
                {/* Proteção para os Breadcrumbs */}
                {dict.common && (
                   <>
                    <BreadcrumbsJsonLd lang={locale} dict={dict} baseUrl={baseUrl} />
                    <div className="container mx-auto px-4 pt-4">
                      <Breadcrumbs lang={locale} dictionary={dict} baseUrl={baseUrl} />
                    </div>
                   </>
                )}
                
                {children}
              </main>

              <Footer 
                lang={locale}
                common={dict.common}
                contact={dict.contact}
                articles={dict.articles}
              />
            </>
          )}
          
          {/* Fallback caso o dicionário falhe totalmente para não dar tela branca/erro 500 */}
          {!dict && <main className="flex-grow">{children}</main>}
        </ScrollSpyProvider> 

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
