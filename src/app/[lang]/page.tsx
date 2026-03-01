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

// Configurações de Cache do Next.js 16
export const dynamic = "force-static";
export const revalidate = 60; 

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const lang = params?.lang;
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
  let allProjects: ProcessedProject[] = [];
  let dict;

  try {
    const [dictionaryData, projectsData] = await Promise.all([
      getServerDictionary(lang),
      getGitHubProjects("Santosdevbjj")
    ]);
    
    dict = dictionaryData;
    allProjects = projectsData; 
    
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    if (!dict) notFound();
  }

  // Filtragem: Separamos o repositório myArticles dos outros
  const regularProjects = allProjects.filter(p => !p.name.toLowerCase().includes("articles"));
  const articleProject = allProjects.find(p => p.name.toLowerCase().includes("articles"));

  return (
    <ProxyPage lang={lang}>
      <main className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100">
        
        <HeroSection dictionary={dict} />
        <AboutSection dict={dict.about} />

        {/* --- SEÇÃO 1 A 16: PROJETOS DE SOFTWARE --- */}
        <section className="container mx-auto px-4 md:px-8 lg:px-16 py-16 max-w-7xl" id="projects">
          <header className="mb-12">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
              {dict.projects.title}
            </h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {regularProjects.map((project) => (
              <article
                key={project.id}
                className="group flex flex-col justify-between p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 bg-slate-50/50 dark:bg-slate-900/50"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {project.name}
                    </h3>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-800 font-mono font-medium">
                      {project.category}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {project.problem}
                    </p>
                    {project.solution && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {project.solution}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-8">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold uppercase tracking-wider underline decoration-2 underline-offset-4 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {dict.projects.viewProject}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* --- SEÇÃO 17: ARTIGOS TÉCNICOS (MDX & GITHUB) --- */}
        <section className="container mx-auto px-4 md:px-8 lg:px-16 py-16 max-w-7xl border-t border-slate-200 dark:border-slate-800" id="articles">
          <header className="mb-12">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
              17) Repositório de Artigos Técnicos
            </h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articleProject ? (
              <article className="group flex flex-col justify-between p-8 rounded-3xl border-2 border-blue-500/50 dark:border-blue-400/30 bg-blue-50/30 dark:bg-blue-900/10 transition-all duration-300">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                      {articleProject.name}
                    </h3>
                    <span className="text-[10px] px-3 py-1 rounded-full bg-blue-600 text-white font-mono font-black uppercase tracking-widest">
                      Artigos
                    </span>
                  </div>

                  <div className="space-y-4">
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                      Base de Conhecimento em Ciência de Dados
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Explore documentações técnicas, tutoriais de SQL, Python e Governança de Dados renderizados diretamente do GitHub ou localmente.
                    </p>
                  </div>
                </div>

                {/* INTEGRAÇÃO DAS DUAS MANEIRAS DE LEITURA */}
                <div className="mt-8 flex flex-col gap-3">
                  {/* Maneira 1: Dinâmico via GitHub */}
                  <a 
                    href={`/${lang}/artigos/README`} 
                    className="text-xs font-black underline decoration-2 underline-offset-4 uppercase tracking-widest text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Ler Artigo do GitHub (Dinâmico) →
                  </a>

                  {/* Maneira 2: Manual (MDX Local) */}
                  <a 
                    href={`/${lang}/artigos/meu-primeiro-artigo`} 
                    className="text-xs font-black opacity-60 hover:opacity-100 transition-all uppercase tracking-widest"
                  >
                    Ver Guia Local (MDX Manual)
                  </a>
                </div>
              </article>
            ) : (
              <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                <p className="text-slate-500 italic">Repositório de artigos não vinculado.</p>
              </div>
            )}
          </div>

          {/* Banner de Contato Final */}
          <div className="mt-20 p-12 rounded-[2.5rem] bg-slate-900 dark:bg-blue-700 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-black mb-2 tracking-tighter">Vamos Conversar?</h3>
              <p className="text-slate-400 dark:text-blue-100 italic">Busco oportunidades em projetos de governança e modernização.</p>
            </div>
            <a href="mailto:santossergiorealbjj@outlook.com" className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-tighter hover:scale-105 transition-all shadow-xl">
              ENVIAR EMAIL →
            </a>
          </div>
        </section>
      </main>
    </ProxyPage>
  );
}
