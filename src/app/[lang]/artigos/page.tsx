// src/app/[lang]/artigos/page.tsx

import Link from "next/link";
import MdxLayout from "@/components/mdx-layout";
import { getServerDictionary } from "@/lib/getServerDictionary";
import { getAllArticlesRecursively } from "@/lib/github-scanner";
import type { Locale } from "@/types/dictionary";

// Forçamos a página a ser dinâmica para refletir mudanças no GitHub sem novo deploy
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalida a cada 1 hora

/**
 * PÁGINA DE LISTAGEM DE ARTIGOS - DINÂMICA
 * -----------------------------------------------------------------------------
 * ✔ Consome o repositório Santosdevbjj/myArticles em tempo real
 * ✔ Agrupa artigos por categoria (pastas do GitHub)
 * ✔ Layout de Cards modernos com cores padrão (Blue/Slate)
 */

export default async function ArticlesListPage({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getServerDictionary(locale);

  // BUSCA DINÂMICA: Substituímos o array estático pelo scanner recursivo
  const allArticles = await getAllArticlesRecursively();

  // AGRUPAMENTO: Organiza os artigos por categoria para uma UX melhor
  const categories = allArticles.reduce((acc, art) => {
    const catName = art.category || "Geral";
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(art);
    return acc;
  }, {} as Record<string, typeof allArticles>);

  return (
    <MdxLayout lang={locale} dict={dict}>
      <div className="not-prose max-w-7xl mx-auto px-4">
        
        {/* HEADER DINÂMICO */}
        <header className="mb-16">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white leading-[0.85]">
            {dict.articles.title.split(' ')[0]}{" "}
            <span className="text-blue-600 dark:text-blue-500">
              {dict.articles.title.split(' ').slice(1).join(' ')}
            </span>
          </h1>
          <div className="h-2 w-24 bg-blue-600 mt-8 rounded-full" />
          <p className="mt-6 text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
            Explorando tecnologias, arquitetura de software e desenvolvimento pessoal através de artigos técnicos direto do meu repositório.
          </p>
        </header>

        {/* LISTAGEM POR CATEGORIAS */}
        <div className="space-y-20">
          {Object.entries(categories).map(([category, articles]) => (
            <section key={category} className="relative">
              {/* Título da Categoria (Pasta) */}
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-4 py-2 rounded-lg">
                  {category.replace(/-/g, ' ')}
                </h2>
                <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800" />
              </div>

              {/* GRID DE CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((art) => {
                  const fullSlug = art.slug.join("/");
                  
                  // CORREÇÃO DO ERRO DE DEPLOY:
                  // Garantimos que o título existe antes de aplicar o .replace()
                  const lastSegment = art.slug[art.slug.length - 1] || "artigo";
                  const displayTitle = lastSegment.replace(/-/g, ' ');

                  return (
                    <Link 
                      key={fullSlug} 
                      href={`/${lang}/artigos/${fullSlug}`}
                      className="group relative flex flex-col p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
                    >
                      {/* Ícone sutil no Card */}
                      <div className="mb-6 w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-500">
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>

                      <h3 className="text-xl font-bold capitalize leading-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {displayTitle}
                      </h3>
                      
                      <div className="mt-auto pt-8 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                          {dict.articles.readMore || "Ler Artigo"}
                        </span>
                        
                        <div className="transform translate-x-0 group-hover:translate-x-2 transition-transform">
                          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* EMPTY STATE DINÂMICO */}
        {allArticles.length === 0 && (
          <div className="py-40 text-center rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-slate-500 uppercase font-black text-xs tracking-[0.2em]">
              {dict.states.empty || "Nenhum artigo encontrado no repositório."}
            </p>
          </div>
        )}
      </div>
    </MdxLayout>
  );
}
