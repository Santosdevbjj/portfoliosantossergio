/**
 * HOME PAGE — ESTRUTURA ESTRATÉGICA SÉRGIO SANTOS (v16.2.0)
 */

import type { Metadata, Viewport } from 'next';
import { getDictionary } from "@/dictionaries";
import type { Locale } from "@/types/dictionary";
import { getGitHubProjects } from "@/services/githubService";
import ProxyPage from "@/components/ProxyPage";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";

interface PageProps {
  params: Promise<{
    lang: Locale;
  }>;
}

/* -------------------------------------------------------------------------- */
/* STATIC GENERATION                                                           */
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
/* VIEWPORT                                                                    */
/* -------------------------------------------------------------------------- */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
};

/* -------------------------------------------------------------------------- */
/* SEO DINÂMICO                                                                */
/* -------------------------------------------------------------------------- */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfoliosantossergio.vercel.app';
  
  const pageTitle = `${dict.seo.pages.home.title} | ${dict.meta.author}`;
  const pageDescription = dict.seo.pages.home.description;

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
      siteName: dict.seo.siteName,
      locale: lang.replace('-', '_'),
      type: 'website',
    },
  };
}

/* -------------------------------------------------------------------------- */
/* PAGE COMPONENT                                                              */
/* -------------------------------------------------------------------------- */
export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;

  // Buscamos os projetos aqui para passar para a listagem
  const projects = await getGitHubProjects();

  return (
    <ProxyPage lang={lang}>
      {(dictionary) => (
        <main className="relative min-h-screen w-full overflow-x-hidden bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-300">
          
          <Hero content={dictionary.hero} common={dictionary.common} />

          <About 
            content={dictionary.about} 
            metrics={dictionary.metrics} 
          />

          <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12 md:py-24 max-w-7xl">
            <header className="mb-12 md:mb-20 space-y-6 text-center md:text-left">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
                {dictionary.projects.title}
              </h2>
            </header>

            <section className="w-full">
              {projects && projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* Mapeamento de projetos aqui */}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] bg-slate-50/50 dark:bg-slate-900/20">
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-400 dark:text-slate-600">
                    {dictionary.states.emptyProjects.title}
                  </h3>
                  <p className="text-slate-500 mt-3 max-w-xs text-center">
                    {dictionary.states.emptyProjects.description}
                  </p>
                </div>
              )}
            </section>
          </div>
          
          <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 py-12 bg-slate-50/80 dark:bg-[#010409]/80 backdrop-blur-md">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm md:text-base text-slate-500 font-medium">
                {dictionary.common.footer}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
                 <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                 </span>
                 {dictionary.common.builtWith}
              </div>
            </div>
          </footer>
        </main>
      )}
    </ProxyPage>
  );
}
