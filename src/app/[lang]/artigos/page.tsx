/**
 * src/app/[lang]/artigos/page.tsx
 * Nível: Principal Engineer
 * Stack: Next.js 16.2.0, React 19, TS 6.0.2, Node 24, Tailwind 4.2
 */

import { getArticlesWithRetry } from "@/lib/github/service";
import { ArticleCard } from "@/components/ArticleCard";
import MdxLayout from "@/components/mdx-layout";
import { getServerDictionary } from "@/lib/getServerDictionary";

// Correção VerbatimModuleSyntax: Importações de tipo separadas
import type { Locale } from "@/types/dictionary";
import type { GitHubItem } from "@/lib/github/types";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function ArticlesListPage({ params }: PageProps) {
  // 1. RESOLUÇÃO DE PARAMS (Obrigatório no Next.js 16/React 19)
  const { lang } = await params;
  const locale = lang as Locale;
  
  // 2. BUSCA DE DADOS EM PARALELO (Performance Node 24)
  const [allArticles, dict] = await Promise.all([
    getArticlesWithRetry(),
    getServerDictionary(locale)
  ]);

  // 3. AGRUPAMENTO POR CATEGORIA COM TYPE SAFETY
  const categories = allArticles.reduce((acc, art) => {
    const catName = art.category || "geral";
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(art);
    return acc;
  }, {} as Record<string, GitHubItem[]>);

  return (
    <MdxLayout lang={locale} dict={dict}>
      <div className="not-prose max-w-7xl mx-auto px-4 py-12">
        
        {/* HEADER: Design de Alta Densidade com Tailwind 4.2 */}
        <header className="mb-20 animate-in fade-in slide-in-from-left-4 duration-1000">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic text-zinc-900 dark:text-white leading-[0.85]">
            {dict.articles.title.split(' ')[0]}{" "}
            <span className="text-blue-600 dark:text-blue-500">
              {dict.articles.title.split(' ').slice(1).join(' ')}
            </span>
          </h1>
          <div className="h-1.5 w-20 bg-blue-600 mt-8 rounded-full shadow-[0_0_25px_rgba(37,99,235,0.6)]" />
          <p className="mt-8 text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl text-lg leading-relaxed">
            Exploração técnica e engenharia de software. Artigos sincronizados via 
            <strong> GitHub API</strong> e otimizados para <strong>Next.js 16.2</strong>.
          </p>
        </header>

        {/* LISTAGEM POR CATEGORIAS */}
        <div className="space-y-32">
          {Object.entries(categories).map(([category, articles]) => (
            <section key={category} className="group/section scroll-mt-20">
              {/* Divider de Categoria Estilizado */}
              <div className="flex items-center gap-6 mb-12">
                <h2 className="text-xs font-bold uppercase tracking-[0.5em] text-blue-600 dark:text-blue-400 bg-blue-500/5 dark:bg-blue-500/10 px-6 py-3 rounded-2xl border border-blue-500/10 backdrop-blur-sm">
                  {category.replace(/-/g, ' ')}
                </h2>
                <div className="h-px flex-1 bg-linear-to-r from-zinc-200 to-transparent dark:from-zinc-800" />
              </div>

              {/* GRID DE CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {articles.map((article) => (
                  <ArticleCard 
                    key={article.path} 
                    article={article} 
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* EMPTY STATE: Fallback para falhas na API ou Repositório Vazio */}
        {allArticles.length === 0 && (
          <div className="py-32 text-center rounded-[4rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/10">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white dark:bg-zinc-800 shadow-2xl mb-8">
              <svg className="w-12 h-12 text-zinc-300 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-zinc-900 dark:text-zinc-100 font-black text-2xl mb-3 tracking-tight">Sincronizando Artigos...</h3>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-sm mx-auto">
              {dict.states?.empty || "Estamos conectando ao GitHub para trazer os conteúdos mais recentes."}
            </p>
          </div>
        )}

        {/* FOOTER DE CONQUISTAS (Integrando sua imagem de troféus) */}
        <footer className="mt-40 pt-20 border-t border-zinc-100 dark:border-zinc-900 flex flex-col items-center gap-6">
          <img 
            src="/images/trofeus-vencedor-dio.png" 
            alt="Troféus de Melhor Artigo DIO" 
            className="h-28 w-auto grayscale hover:grayscale-0 transition-all duration-700 opacity-50 hover:opacity-100"
          />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
            Official Technical Excellence Award 2025
          </span>
        </footer>
      </div>
    </MdxLayout>
  );
}
