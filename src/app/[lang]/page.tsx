// src/app/[lang]/page.tsx
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/types/dictionary";
import type { ProcessedProject } from "@/types/github";
import { getGitHubProjects } from "@/services/githubService";
import { getServerDictionary } from "@/lib/getServerDictionary";
import { SUPPORTED_LOCALES, isValidLocale } from "@/dictionaries/locales";
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
  const params = await props.params;
  const lang = params?.lang;
  if (!lang || !isValidLocale(lang)) return {};
  const dict = await getServerDictionary(lang as Locale);
  return {
    title: dict.seo.pages.home.title,
    description: dict.seo.pages.home.description,
  };
}

export default async function HomePage(props: PageProps) {
  const resolvedParams = await props.params;
  const rawLang = resolvedParams?.lang;

  if (!rawLang || !isValidLocale(rawLang)) notFound();

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
    console.error("Erro:", error);
    if (!dict) notFound();
  }

  // SEPARAÇÃO SIMPLES
  // 1. Projetos Normais (Tudo exceto o myArticles)
  const regularProjects = allProjects.filter(p => !p.name.toLowerCase().includes("articles"));
  
  // 2. O Artigo (Busca por qualquer menção a 'articles' no nome)
  const articleProject = allProjects.find(p => p.name.toLowerCase().includes("articles"));

  return (
    <ProxyPage lang={lang}>
      <main className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100">
        
        <HeroSection dictionary={dict} />
        <AboutSection dict={dict.about} />

        {/* SEÇÃO 1 A 16 */}
        <section className="container mx-auto px-4 md:px-8 lg:px-16 py-16 max-w-7xl" id="projects">
          <header className="mb-12">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase">
              {dict.projects.title}
            </h2>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {regularProjects.map((project) => (
              <ProjectCard key={project.id} project={project} dict={dict} />
            ))}
          </div>
        </section>

        {/* SEÇÃO 17 - REPOSITÓRIO DE ARTIGOS */}
        <section className="container mx-auto px-4 md:px-8 lg:px-16 py-16 max-w-7xl border-t border-slate-200 dark:border-slate-800" id="articles">
          <header className="mb-12">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase">
              17) Repositório de Artigos Técnicos
            </h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articleProject ? (
              <ProjectCard project={articleProject} dict={dict} isArticle />
            ) : (
              <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-slate-500 italic">Conectando ao repositório de artigos...</p>
              </div>
            )}
          </div>

          {/* BANNER DE CONTATO ÚNICO NO FINAL */}
          <div className="mt-20 p-12 rounded-[2rem] bg-blue-600 text-white shadow-2xl shadow-blue-500/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div>
                <h3 className="text-3xl font-black mb-2">Vamos Conversar?</h3>
                <p className="text-blue-100 text-lg">Busco oportunidades em projetos de governança e modernização.</p>
              </div>
              <a 
                href="mailto:santossergiorealbjj@outlook.com" 
                className="px-10 py-5 bg-white text-blue-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
              >
                ENVIAR EMAIL →
              </a>
            </div>
          </div>
        </section>
      </main>
    </ProxyPage>
  );
}

// Sub-componente para garantir que o padrão visual seja IDÊNTICO em ambas as seções
function ProjectCard({ project, dict, isArticle = false }: { project: ProcessedProject, dict: any, isArticle?: boolean }) {
  return (
    <article className="group flex flex-col justify-between p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 bg-slate-50/50 dark:bg-slate-900/50">
      <div>
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {project.name}
          </h3>
          <span className="text-[10px] px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 font-mono font-black uppercase tracking-widest">
            {isArticle ? "Artigos" : project.category}
          </span>
        </div>
        <div className="space-y-3">
          <p className="text-base font-bold text-blue-600 dark:text-blue-400">
            {project.problem}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">
            {project.solution}
          </p>
        </div>
      </div>
      <div className="mt-10">
        <a
          href={isArticle ? "/pt-BR/artigos/meu-primeiro-artigo" : project.url}
          className="text-xs font-black uppercase tracking-[0.2em] underline decoration-4 underline-offset-8 decoration-blue-500/30 hover:decoration-blue-500 transition-all"
        >
          {isArticle ? "LER ARTIGOS →" : dict.projects.viewProject}
        </a>
      </div>
    </article>
  );
}
