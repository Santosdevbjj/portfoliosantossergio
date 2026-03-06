import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

// Types
import type { Locale, Dictionary } from "@/types/dictionary";
import type { ProcessedProject } from "@/types/github";

// Services & Helpers
import { getServerDictionary } from "@/lib/getServerDictionary";
import { getGitHubProjects } from "@/services/githubService";
import { SUPPORTED_LOCALES, isValidLocale } from "@/dictionaries/locales";

// Components
import ProxyPage from "@/components/ProxyPage";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FeaturedProjectsSection from "@/components/featured/FeaturedProjectsSection";
import FeaturedArticleSection from "@/components/FeaturedArticleSection";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export const dynamic = "force-static";
export const revalidate = 60;

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { lang: rawLang } = await props.params;
  if (!rawLang || !isValidLocale(rawLang)) return {};

  try {
    const dict: Dictionary = await getServerDictionary(rawLang as Locale);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfoliosantossergio.vercel.app";

    return {
      title: dict?.seo?.pages?.home?.title ?? "Sérgio Santos",
      description: dict?.seo?.pages?.home?.description ?? "Portfolio",
      alternates: {
        canonical: `${siteUrl}/${rawLang}`,
        languages: {
          "pt-BR": `${siteUrl}/pt-BR`,
          "en-US": `${siteUrl}/en-US`,
          "es-ES": `${siteUrl}/es-ES`,
          "es-AR": `${siteUrl}/es-AR`,
          "es-MX": `${siteUrl}/es-MX`,
        },
      },
    };
  } catch {
    return { title: "Sérgio Santos" };
  }
}

export default async function HomePage(props: PageProps) {
  const { lang: rawLang } = await props.params;

  if (!rawLang || !isValidLocale(rawLang)) {
    notFound();
  }

  const lang = rawLang as Locale;
  
  // Executa as buscas em paralelo (GitHub + Dicionário)
  const [dictData, githubProjects] = await Promise.all([
    getServerDictionary(lang).catch(() => null),
    getGitHubProjects("Santosdevbjj").catch(() => [] as ProcessedProject[])
  ]);

  if (!dictData) {
    notFound();
  }

  // Filtra os projetos do GitHub (Lógica do arquivo antigo)
  const filteredGitHubProjects = githubProjects.filter(
    p => !p.name.toLowerCase().includes("articles") && !p.name.toLowerCase().includes("artigos")
  );

  // Unindo os dados: Injetamos os projetos do GitHub no dicionário 
  // para que o componente FeaturedProjectsSection possa lê-los sem erro de tipo
  const dict = {
    ...dictData,
    projects: {
      ...dictData.projects,
      // Se o JSON de tradução estiver vazio ou curto, usamos os dados do GitHub
      featuredProjects: filteredGitHubProjects.length > 0 ? filteredGitHubProjects : dictData.projects?.featuredProjects
    }
  };

  return (
    <ProxyPage lang={lang}>
      <main className="flex flex-col min-h-screen bg-white dark:bg-[#020617]">
        
        {/* HERO */}
        <HeroSection dictionary={dict} />

        {/* ABOUT */}
        <AboutSection dict={dict.about} />

        {/* PROJETOS - Agora o 'dict' já contém os projetos do GitHub injetados acima */}
        <FeaturedProjectsSection lang={lang} dict={dict as any} />

        {/* ARTIGO VENCEDOR */}
        <FeaturedArticleSection 
          articles={dict.articles} 
          common={dict.common} 
        />

        {/* SEÇÃO KNOWLEDGE BASE (Recuperada do Antigo) */}
        <section className="container mx-auto px-6 py-24 max-w-7xl border-t border-slate-100 dark:border-slate-900" id="knowledge-base">
          <header className="mb-12">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic dark:text-white">
               Journal & Artigos
            </h2>
            <p className="text-slate-500 mt-2 uppercase tracking-widest text-xs font-bold">
              Documentação técnica e Engenharia de Dados
            </p>
          </header>

          <div className="grid grid-cols-1 gap-8">
            <article className="group flex flex-col justify-between p-10 rounded-[2.5rem] border-2 border-blue-600 bg-blue-50/5 dark:bg-blue-900/5 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-3xl font-black italic tracking-tighter text-blue-600 dark:text-blue-400">
                    myArticles
                  </h3>
                  <span className="text-[10px] px-4 py-1.5 rounded-full bg-blue-600 text-white font-black uppercase tracking-widest">
                    Knowledge Base
                  </span>
                </div>
                <div className="space-y-4 max-w-2xl">
                  <p className="text-xl font-bold text-slate-800 dark:text-slate-200">
                    Central de Conhecimento: Ciência de Dados, Python e Modern Data Stack.
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    Artigos renderizados dinamicamente via MDX diretamente do GitHub. Explore a documentação completa dos meus estudos e arquiteturas.
                  </p>
                </div>
              </div> 

              <div className="mt-10 flex flex-col sm:flex-row gap-4 relative z-10">
                <a 
                   href={`/${lang}/artigos`} 
                   className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all active:scale-95"
                >
                    Explorar Biblioteca →
                </a>
                <a 
                  href={`/${lang}/artigos/README`} 
                  className="inline-flex items-center justify-center border-2 border-slate-200 dark:border-slate-800 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all dark:text-white"
                >
                  Documentação (README)
                </a>
              </div>
            </article>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-28 px-6 text-center bg-slate-950">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
              {dict.contact?.ctaTitle || "Vamos Conversar?"}
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              {dict.contact?.subtitle}
            </p>
            <a
              href={`mailto:${dict.common.email}`}
              className="inline-flex items-center justify-center bg-white text-slate-950 px-10 py-5 rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-100 transition-transform active:scale-95 shadow-xl"
            >
              {dict.contact?.buttonText || "Entrar em Contato"}
            </a>
          </div>
        </section>
      </main>
    </ProxyPage>
  );
}
