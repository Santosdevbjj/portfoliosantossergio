/**
 * HOME PAGE — ESTRUTURA ESTRATÉGICA SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * ✔️ SSG: generateStaticParams para pt-BR, en-US, es-ES, es-AR, es-MX
 * ✔️ Next.js 16 Ready: params tratado como Promise
 * ✔️ Responsividade: Mobile-first com Tailwind CSS
 * ✔️ Multilíngue: Alinhado com a estrutura de dicionários e fallbacks
 */

import type { Metadata, Viewport } from 'next';
import { getServerDictionary } from "@/lib/getServerDictionary";
import type { Locale } from "@/types/dictionary";
import ProxyPage from '@/ProxyClient'; 

// Interface para as propriedades da página conforme Next.js 15/16
interface PageProps {
  params: Promise<{
    lang: Locale;
  }>;
}

/* -------------------------------------------------------------------------- */
/* STATIC GENERATION — PRÉ-RENDERIZAÇÃO                                        */
/* -------------------------------------------------------------------------- */
/**
 * Garante que todas as rotas de idioma sejam geradas no momento do build.
 * Isso torna o carregamento instantâneo.
 */
export async function generateStaticParams() {
  return [
    { lang: 'pt-BR' },
    { lang: 'en-US' },
    { lang: 'es-ES' },
    { lang: 'es-AR' },
    { lang: 'es-MX' }
  ];
}

/* -------------------------------------------------------------------------- */
/* VIEWPORT — RESPONSIVIDADE GLOBAL                                            */
/* -------------------------------------------------------------------------- */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
};

/* -------------------------------------------------------------------------- */
/* SEO & OPEN GRAPH — CONFIGURAÇÃO DINÂMICA                                    */
/* -------------------------------------------------------------------------- */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = getServerDictionary(lang);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfoliosantossergio.vercel.app';

  // Fallback seguro usando a estrutura SEO do seu dicionário
  const pageTitle = dict.seo?.projects?.title || "Sérgio Santos | Portfolio";
  const pageDescription = dict.seo?.projects?.description || dict.common.role;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: `${siteUrl}/${lang}`,
      languages: {
        'pt-BR': `${siteUrl}/pt-BR`,
        'en-US': `${siteUrl}/en-US`,
        'es-ES': `${siteUrl}/es-ES`,
        'es-AR': `${siteUrl}/es-AR`,
        'es-MX': `${siteUrl}/es-MX`,
        'x-default': `${siteUrl}/pt-BR`,
      },
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `${siteUrl}/${lang}`,
      siteName: "Sérgio Santos Portfolio",
      locale: lang.replace('-', '_'), // Converte pt-BR para pt_BR
      type: 'website',
    },
  };
}

/* -------------------------------------------------------------------------- */
/* PAGE COMPONENT — PONTO DE ENTRADA                                           */
/* -------------------------------------------------------------------------- */
export default async function HomePage({ params }: PageProps) {
  // Resolve os parâmetros e carrega o dicionário no servidor
  const { lang } = await params;
  const dict = getServerDictionary(lang);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100">
      
      {/* CONTAINER RESPONSIVO:
          - px-4: Padding lateral em mobile
          - md:px-8: Padding em tablets
          - lg:px-16: Padding em desktops
          - max-w-7xl: Limita a largura em telas ultra-wide
      */}
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12 md:py-20 max-w-7xl">
        
        {/* HEADER DA PÁGINA */}
        <header className="mb-16 space-y-4 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            {dict.seo?.projects?.title}
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-slate-600 dark:text-slate-400">
            {dict.seo?.projects?.description}
          </p>
        </header>

        {/* COMPONENTE CLIENTE (ProxyPage) 
            Centraliza interações do lado do cliente (filtros, animações) 
            enquanto o SEO permanece robusto no servidor.
        */}
        <section className="w-full">
          <ProxyPage lang={lang} />
        </section>

        {/* FALLBACK EM CASO DE LISTA VAZIA (Exemplo de consistência com o dicionário) */}
        {/* Aqui você integraria sua lista de projetos. Caso vazio: */}
        {/* <div className="text-center py-20">
              <h2 className="text-2xl font-semibold">{dict.states.emptyProjects.title}</h2>
              <p>{dict.states.emptyProjects.description}</p>
            </div> 
        */}
      </div>
      
      {/* RODAPÉ SIMPLES PARA EXEMPLO */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 text-center text-sm text-slate-500">
        <p>{dict.common.footer}</p>
        <p className="mt-2">{dict.common.builtWith}</p>
      </footer>
    </main>
  );
}
