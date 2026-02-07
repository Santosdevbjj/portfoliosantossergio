/**
 * HOME PAGE — ESTRUTURA ESTRATÉGICA SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * ✔️ SSG: generateStaticParams para pt-BR, en-US, es-ES, es-AR, es-MX
 * ✔️ Next.js 16 Ready: params tratado como Promise
 * ✔️ Data Fetching: Integração com GitHub Service + Cache
 * ✔️ Multilíngue: Alinhado com a estrutura de dicionários e fallbacks
 */

import type { Metadata, Viewport } from 'next';
import { getServerDictionary } from "@/lib/getServerDictionary";
import type { Locale } from "@/types/dictionary";
import { getGitHubProjects } from "@/services/githubService";
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

  const pageTitle = dict.seo?.pages?.projects?.title || "Sérgio Santos | Portfolio";
  const pageDescription = dict.seo?.pages?.projects?.description || dict.common.role;

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
      locale: lang.replace('-', '_'),
      type: 'website',
    },
  };
}

/* -------------------------------------------------------------------------- */
/* PAGE COMPONENT — PONTO DE ENTRADA                                           */
/* -------------------------------------------------------------------------- */
export default async function HomePage({ params }: PageProps) {
  // 1. Resolve os parâmetros da URL
  const { lang } = await params;

  // 2. Dispara as buscas em paralelo para máxima performance
  const dictPromise = getServerDictionary(lang);
  const projectsPromise = getGitHubProjects();

  // 3. Aguarda ambos os resultados
  const [dict, projects] = await Promise.all([dictPromise, projectsPromise]);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100">
      
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12 md:py-20 max-w-7xl">
        
        {/* HEADER DA PÁGINA */}
        <header className="mb-16 space-y-4 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
             {/* Título vindo do dicionário mapeado */}
            {dict.projects.title}
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-slate-600 dark:text-slate-400">
            {dict.seo?.pages?.projects?.description}
          </p>
        </header>

        {/* SEÇÃO PRINCIPAL DE PROJETOS 
            Enviamos os dados do GitHub (projects) e o Dicionário para o ProxyPage.
            Isso permite que o ProxyPage gerencie filtros/animações instantaneamente.
        */}
        <section className="w-full">
          {projects.length > 0 ? (
            <ProxyPage 
              lang={lang} 
              initialProjects={projects} 
              dictionary={dict} 
            />
          ) : (
            /* ESTADO VAZIO: Consistência com o Dicionário JSON */
            <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
              <h2 className="text-2xl font-semibold text-slate-400">
                {dict.states.emptyProjects.title}
              </h2>
              <p className="text-slate-500 mt-2">
                {dict.states.emptyProjects.description}
              </p>
            </div>
          )}
        </section>

      </div>
      
      {/* RODAPÉ ESTRUTURADO */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-12 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          <p>{dict.common.footer}</p>
          <div className="mt-4 flex justify-center gap-4 text-xs font-medium uppercase tracking-widest">
             <span>{dict.common.builtWith}</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
