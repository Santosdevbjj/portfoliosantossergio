// src/app/[lang]/page.tsx
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

// Types
import type { Locale } from "@/types/dictionary";
import type { ProcessedProject } from "@/types/github";

// Services & Helpers
import { getGitHubProjects } from "@/services/githubService";
import { getServerDictionary } from "@/lib/getServerDictionary";
import { SUPPORTED_LOCALES, isValidLocale } from "@/dictionaries/locales";

// Components
import ProxyPage from "@/components/ProxyPage";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

export const dynamic = "force-static";
export const revalidate = 60; 

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const resolvedParams = await props.params;
  const lang = resolvedParams?.lang;
  
  if (!lang || !isValidLocale(lang)) return {};

  const dict = await getServerDictionary(lang as Locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfoliosantossergio.vercel.app";

  return {
    title: dict.seo.pages.home.title,
    description: dict.seo.pages.home.description,
    alternates: {
      canonical: `${siteUrl}/${lang}`,
      languages: {
        "pt-BR": `${siteUrl}/pt-BR`,
        "en-US": `${siteUrl}/en-US`,
        "es-ES": `${siteUrl}/es-ES`,
      },
    },
  };
}

export default async function HomePage(props: PageProps) {
  const resolvedParams = await props.params;
  const rawLang = resolvedParams?.lang;

  if (!rawLang || !isValidLocale(rawLang)) {
    notFound();
  }

  const lang = rawLang as Locale;
  let projects: ProcessedProject[] = [];
  let dict: any; // Tipagem dinâmica para o dicionário

  try {
    const [dictionaryData, projectsData] = await Promise.all([
      getServerDictionary(lang),
      getGitHubProjects("Santosdevbjj")
    ]);
    
    dict = dictionaryData;
    // Filtro robusto para remover o repositório de artigos da grade principal de projetos
    projects = projectsData.filter(p => !p.name.toLowerCase().includes("articles") && !p.name.toLowerCase().includes("artigos")); 
    
  } catch (error) {
    console.error("Erro ao carregar dados da Home:", error);
    if (!dict) notFound();
  }

  return (
    <ProxyPage lang={lang}>
      <main className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white">
        
        <HeroSection dictionary={dict} />
        <AboutSection dict={dict.about} />

        {/* --- SEÇÃO DE PROJETOS (Portfólio de Engenharia) --- */}
        <section className="container mx-auto px-4 md:px-8 lg:px-16 py-16 max-w-7xl" id="projects">
          <header className="mb-12">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
              {dict.projects.title}
            </h2>
            <div className="h-2 w-20 bg-blue-600 mt-4" />
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <article
                key={project.id}
                className="group flex flex-col justify-between p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-500 bg-slate-50/30 dark:bg-slate-900/30 backdrop-blur-sm"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.name}
                    </h3>
                    <span className="text-[10px] px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 font-black uppercase tracking-widest">
                      {project.category}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm font-bold leading-relaxed text-blue-600/80 dark:text-blue-400/80 uppercase tracking-tight">
                      {project.problem}
                    </p>
                    {project.solution && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {project.solution}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-10">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn inline-flex items-center text-xs font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white"
                  >
                    <span className="border-b-2 border-blue-600 pb-1 group-hover/btn:pr-4 transition-all duration-300">
                      {dict.projects.viewProject}
                    </span>
                    <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity ml-2">→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* --- SEÇÃO 17: KNOWLEDGE BASE (Artigos Técnicos) --- */}
        <section className="container mx-auto px-4 md:px-8 lg:px-16 py-24 max-w-7xl border-t border-slate-200 dark:border-slate-800" id="articles">
          <header className="mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
               Journal & Artigos
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium uppercase tracking-widest text-xs">Documentação técnica e Engenharia de Dados</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <article className="group flex flex-col justify-between p-10 rounded-[2.5rem] border-2 border-blue-600 bg-blue-50/5 dark:bg-blue-900/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M13 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V9l-7-7zm0 1.5L18.5 9H13V3.5zM6 20V4h6v6h6v10H6z"/></svg>
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-3xl font-black italic tracking-tighter text-blue-600 dark:text-blue-400">
                    myArticles
                  </h3>
                  <span className="text-[10px] px-4 py-1.5 rounded-full bg-blue-600 text-white font-black uppercase tracking-widest">
                    Knowledge Base
                  </span>
                </div>

                <div className="space-y-4 max-w-md">
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    Central de Conhecimento: Ciência de Dados, Python e Modern Data Stack.
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Artigos renderizados dinamicamente via MDX diretamente do GitHub.
                  </p>
                </div>
              </div> 

              <div className="mt-12 flex flex-col sm:flex-row gap-6 relative z-10">
                <a 
                   href={`/${lang}/artigos`} 
                   className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                    Explorar Biblioteca →
                </a>

                <a 
                  href={`/${lang}/artigos/README`} 
                  className="inline-flex items-center justify-center border-2 border-slate-200 dark:border-slate-800 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
                >
                  Documentação (README)
                </a>
              </div>
            </article>
          </div>

          {/* Banner de CTA Final */}
          <div className="mt-24 p-12 rounded-[3rem] bg-slate-900 dark:bg-blue-600 text-white relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-3xl md:text-4xl font-black tracking-tighter italic uppercase mb-2">Vamos construir algo juntos?</h3>
                <p className="opacity-70 font-medium uppercase tracking-widest text-[10px]">Especialista em Modernização de Dados e Governança</p>
              </div>
              <a 
                href="mailto:santossergiorealbjj@outlook.com" 
                className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform active:scale-95 shadow-2xl"
              >
                Entrar em Contato →
              </a>
            </div>
          </div>
        </section>
      </main>
    </ProxyPage>
  );
}
